import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerAccountTools(server: McpServer, client: AdsClient): void {
  // ─── get_ad_account ───────────────────────────────────────────
  server.tool(
    "get_ad_account",
    "Get details of the configured ad account including status, balance, currency, timezone, and spend info.",
    {
      fields: z.string().optional().default("id,name,account_status,balance,currency,timezone_name,amount_spent,business_name,business_city,business_country_code,owner,min_campaign_group_spend_cap").describe("Comma-separated fields to return"),
    },
    async ({ fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`${client.accountPath}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_ad_accounts ─────────────────────────────────────────
  server.tool(
    "list_ad_accounts",
    "List all ad accounts accessible by the current user. Returns paginated results.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`/me/adaccounts`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_ad_account ────────────────────────────────────────
  server.tool(
    "update_ad_account",
    "Update the configured ad account settings. Only provided fields will be modified.",
    {
      name: z.string().optional().describe("New account name"),
      timezone_name: z.string().optional().describe("New timezone (e.g. 'America/New_York')"),
      spend_cap: z.string().optional().describe("Account spend cap in currency cents (e.g. '100000' = $1000.00)"),
    },
    async ({ name, timezone_name, spend_cap }) => {
      try {
        const params: Record<string, unknown> = {};
        if (name) params.name = name;
        if (timezone_name) params.timezone_name = timezone_name;
        if (spend_cap) params.spend_cap = spend_cap;
        const { data, rateLimit } = await client.post(`${client.accountPath}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_account_activities ───────────────────────────────────
  server.tool(
    "get_account_activities",
    "Get activity log for the ad account. Shows changes made to campaigns, ad sets, ads, etc.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`${client.accountPath}/activities`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── list_account_users ───────────────────────────────────────
  server.tool(
    "list_account_users",
    "List users who have access to the ad account with their roles and permissions.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`${client.accountPath}/users`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
