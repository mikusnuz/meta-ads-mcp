import { z } from "zod";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerImageTools(server: McpServer, client: AdsClient): void {
  // ─── list_images ───────────────────────────────────────────
  server.tool(
    "list_images",
    "List ad images uploaded to the ad account.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
      account_id: z.string().optional().describe("Ad account ID to query (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ fields, limit, after, account_id }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`${client.accountPath(account_id)}/adimages`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── upload_image ──────────────────────────────────────────
  server.tool(
    "upload_image",
    "Upload an ad image from a public URL or a local file. Returns image hash for use in ad creatives. Note: fetching from a URL requires the app to have Meta's URL-fetch capability — if that fails with an OAuthException 'Application does not have the capability to make this API call', use file_path to upload the raw bytes instead, which does not require that capability.",
    {
      url: z.string().optional().describe("Public URL of the image to upload"),
      file_path: z.string().optional().describe("Local filesystem path of the image to upload. Sent as base64-encoded bytes, bypassing Meta's URL-fetch capability requirement."),
      name: z.string().optional().describe("Name to assign to the uploaded image. Defaults to the file_path basename when uploading a local file."),
      account_id: z.string().optional().describe("Ad account ID to upload into (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ url, file_path, name, account_id }) => {
      try {
        if (!url && !file_path) {
          throw new Error("Provide either url or file_path.");
        }
        const params: Record<string, unknown> = {};
        if (file_path) {
          const buffer = await readFile(file_path);
          params.bytes = buffer.toString("base64");
          params.name = name || basename(file_path);
        } else if (url) {
          params.url = url;
          if (name) params.name = name;
        }
        const { data, rateLimit } = await client.post(`${client.accountPath(account_id)}/adimages`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_image ─────────────────────────────────────────────
  server.tool(
    "get_image",
    "Get details of a specific ad image by ID.",
    {
      image_id: z.string().describe("Image ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ image_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${image_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_image ──────────────────────────────────────────
  server.tool(
    "delete_image",
    "Delete an ad image by hash. This action is irreversible.",
    {
      hash: z.string().describe("Image hash to delete"),
      account_id: z.string().optional().describe("Ad account ID the image belongs to (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ hash, account_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`${client.accountPath(account_id)}/adimages`, { hash });
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
