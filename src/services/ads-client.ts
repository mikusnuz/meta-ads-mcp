import { AdsConfig } from "../config.js";
import { RateLimit, BusinessRateLimit } from "../types.js";

interface ClientResponse {
  data: unknown;
  rateLimit?: RateLimit;
  businessRateLimit?: BusinessRateLimit;
}

export class AdsClient {
  private config: AdsConfig;
  private baseUrl = "https://graph.facebook.com/v26.0";

  constructor(config: AdsConfig) {
    this.config = config;
  }

  private parseRateLimit(headers: Headers): {
    rateLimit?: RateLimit;
    businessRateLimit?: BusinessRateLimit;
  } {
    const result: {
      rateLimit?: RateLimit;
      businessRateLimit?: BusinessRateLimit;
    } = {};

    // Parse x-app-usage header
    const appUsage = headers.get("x-app-usage");
    if (appUsage) {
      try {
        result.rateLimit = JSON.parse(appUsage);
      } catch {
        // ignore parse errors
      }
    }

    // Parse x-business-use-case-usage header
    const bizUsage = headers.get("x-business-use-case-usage");
    if (bizUsage) {
      try {
        const parsed = JSON.parse(bizUsage);
        // Structure: { "<business_id>": [{ call_count, total_cputime, total_time, type, estimated_time_to_regain_access }] }
        const keys = Object.keys(parsed);
        if (keys.length > 0) {
          const entries = parsed[keys[0]];
          if (Array.isArray(entries) && entries.length > 0) {
            result.businessRateLimit = {
              callCount: entries[0].call_count,
              totalCpuTime: entries[0].total_cputime,
              totalTime: entries[0].total_time,
              type: entries[0].type,
              estimatedTimeToRegainAccess:
                entries[0].estimated_time_to_regain_access,
            };
          }
        }
      } catch {
        // ignore parse errors
      }
    }

    return result;
  }

  private formatError(errorBody: {
    error?: {
      message?: string;
      code?: number;
      error_subcode?: number;
      error_user_msg?: string;
      error_user_title?: string;
      type?: string;
      fbtrace_id?: string;
    };
  }): string {
    const err = errorBody.error;
    if (!err) return JSON.stringify(errorBody);

    let msg = err.message || "Unknown error";

    // Add user-friendly message if available
    if (err.error_user_msg) {
      msg = `${err.error_user_msg} (${msg})`;
    }

    // Add context-specific hints
    switch (err.code) {
      case 17:
        msg = `[Rate Limit] ${msg}. Wait before retrying — your app or ad account is being throttled.`;
        break;
      case 190:
        msg = `[Token Expired] ${msg}. Use exchange_token or refresh_token to obtain a new long-lived token.`;
        break;
      case 100:
        msg = `[Invalid Parameter] ${msg}. Check the request parameters and field names.`;
        break;
      case 10:
        msg = `[Permission Denied] ${msg}. Ensure the access token has the required permissions (ads_management, ads_read, etc).`;
        break;
      case 2635:
        msg = `[Ad Account Limit] ${msg}. This ad account has reached its spending or creation limit.`;
        break;
    }

    const parts = [`Meta Ads API error: ${msg}`];
    if (err.code !== undefined) parts.push(`code=${err.code}`);
    if (err.error_subcode !== undefined)
      parts.push(`subcode=${err.error_subcode}`);
    if (err.type) parts.push(`type=${err.type}`);
    if (err.fbtrace_id) parts.push(`trace=${err.fbtrace_id}`);

    return parts.join(" | ");
  }

  private async request(
    method: string,
    path: string,
    params?: Record<string, unknown>
  ): Promise<ClientResponse> {
    if (!this.config.accessToken) {
      throw new Error(
        "META_ADS_ACCESS_TOKEN is not configured. Set it as an environment variable."
      );
    }

    let url = `${this.baseUrl}${path}`;
    const init: RequestInit = { method, signal: AbortSignal.timeout(30_000) };

    if (method === "GET" || method === "DELETE") {
      const qs = new URLSearchParams();
      qs.set("access_token", this.config.accessToken);
      if (params) {
        for (const [k, v] of Object.entries(params)) {
          if (v !== undefined && v !== null && v !== "") {
            qs.set(k, String(v));
          }
        }
      }
      url += `?${qs.toString()}`;
    } else {
      const body: Record<string, unknown> = {
        access_token: this.config.accessToken,
        ...params,
      };
      init.headers = { "Content-Type": "application/json" };
      init.body = JSON.stringify(body);
    }

    const res = await fetch(url, init);
    return this.handleResponse(res, method, path);
  }

  private async handleResponse(
    res: Response,
    method: string,
    path: string
  ): Promise<ClientResponse> {
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      let errorMsg: string;
      try {
        const errorBody = JSON.parse(text);
        errorMsg = this.formatError(errorBody);
      } catch {
        errorMsg = `Meta Ads API ${method} ${path} (${res.status}): ${text}`;
      }
      throw new Error(errorMsg);
    }

    const { rateLimit, businessRateLimit } = this.parseRateLimit(res.headers);
    const contentType = res.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const data = await res.json();
      if (data.error) {
        throw new Error(this.formatError(data));
      }
      return { data, rateLimit, businessRateLimit };
    }

    const text = await res.text();
    return { data: text || { success: true }, rateLimit, businessRateLimit };
  }

  /**
   * POST a multipart/form-data request with a binary file attached.
   * Required for endpoints like /advideos that don't accept base64 bytes
   * in a JSON body.
   */
  async postMultipart(
    path: string,
    fields: Record<string, unknown>,
    file: { buffer: Buffer; fieldName: string; filename: string }
  ): Promise<ClientResponse> {
    if (!this.config.accessToken) {
      throw new Error(
        "META_ADS_ACCESS_TOKEN is not configured. Set it as an environment variable."
      );
    }

    const form = new FormData();
    form.set("access_token", this.config.accessToken);
    for (const [k, v] of Object.entries(fields)) {
      if (v !== undefined && v !== null && v !== "") {
        form.set(k, String(v));
      }
    }
    const blob = new Blob([new Uint8Array(file.buffer)]);
    form.set(file.fieldName, blob, file.filename);

    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      body: form,
      signal: AbortSignal.timeout(120_000),
    });
    return this.handleResponse(res, "POST", path);
  }

  // --- Convenience methods ---

  async get(
    path: string,
    params?: Record<string, unknown>
  ): Promise<ClientResponse> {
    return this.request("GET", path, params);
  }

  async post(
    path: string,
    params?: Record<string, unknown>
  ): Promise<ClientResponse> {
    return this.request("POST", path, params);
  }

  async delete(
    path: string,
    params?: Record<string, unknown>
  ): Promise<ClientResponse> {
    return this.request("DELETE", path, params);
  }

  // --- Upload (URL-based) ---

  async upload(
    path: string,
    fileUrl: string,
    params?: Record<string, unknown>
  ): Promise<ClientResponse> {
    return this.post(path, { ...params, url: fileUrl });
  }

  // --- Account helpers ---

  /**
   * Path for the ad account. Pass accountIdOverride to target an account
   * other than the one configured via META_AD_ACCOUNT_ID (accepts either
   * "123" or "act_123").
   */
  accountPath(accountIdOverride?: string): string {
    const id = accountIdOverride || this.accountId;
    const normalized = id.startsWith("act_") ? id.slice(4) : id;
    return `/act_${normalized}`;
  }

  get accountId(): string {
    if (!this.config.adAccountId) {
      throw new Error(
        "META_AD_ACCOUNT_ID is not configured. Set it as an environment variable."
      );
    }
    return this.config.adAccountId;
  }

  get pixelId(): string {
    if (!this.config.pixelId) {
      throw new Error(
        "META_PIXEL_ID is not configured. Set it as an environment variable."
      );
    }
    return this.config.pixelId;
  }

  get businessId(): string {
    if (!this.config.businessId) {
      throw new Error(
        "META_BUSINESS_ID is not configured. Set it as an environment variable."
      );
    }
    return this.config.businessId;
  }

  // --- Token management ---

  /** Exchange short-lived token for long-lived token */
  async exchangeToken(shortToken: string): Promise<ClientResponse> {
    if (!this.config.appId || !this.config.appSecret) {
      throw new Error(
        "META_APP_ID and META_APP_SECRET are required for token exchange."
      );
    }
    const qs = new URLSearchParams({
      grant_type: "fb_exchange_token",
      client_id: this.config.appId,
      client_secret: this.config.appSecret,
      fb_exchange_token: shortToken,
    });
    const url = `${this.baseUrl}/oauth/access_token?${qs.toString()}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Token exchange failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(this.formatError(data));
    }
    return { data };
  }

  /** Refresh a long-lived token */
  async refreshToken(longToken: string): Promise<ClientResponse> {
    const qs = new URLSearchParams({
      grant_type: "fb_exchange_token",
      access_token: longToken,
    });
    const url = `${this.baseUrl}/oauth/access_token?${qs.toString()}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Token refresh failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(this.formatError(data));
    }
    return { data };
  }

  /** Debug a token to inspect its properties */
  async debugToken(inputToken: string): Promise<ClientResponse> {
    if (!this.config.appId || !this.config.appSecret) {
      throw new Error(
        "META_APP_ID and META_APP_SECRET are required for token debug."
      );
    }
    const appToken = `${this.config.appId}|${this.config.appSecret}`;
    const qs = new URLSearchParams({
      input_token: inputToken,
      access_token: appToken,
    });
    const url = `${this.baseUrl}/debug_token?${qs.toString()}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(30_000) });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Token debug failed (${res.status}): ${text}`);
    }

    const data = await res.json();
    if (data.error) {
      throw new Error(this.formatError(data));
    }
    return { data };
  }
}
