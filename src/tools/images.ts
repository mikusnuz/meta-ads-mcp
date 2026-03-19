import { z } from "zod";
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
    },
    async ({ fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`${client.accountPath}/adimages`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── upload_image ──────────────────────────────────────────
  server.tool(
    "upload_image",
    "Upload an ad image from a public URL. Returns image hash for use in ad creatives.",
    {
      url: z.string().describe("Public URL of the image to upload"),
    },
    async ({ url }) => {
      try {
        const { data, rateLimit } = await client.post(`${client.accountPath}/adimages`, { url });
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
    },
    async ({ hash }) => {
      try {
        const { data, rateLimit } = await client.delete(`${client.accountPath}/adimages`, { hash });
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
