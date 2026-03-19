import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerFeedTools(server: McpServer, client: AdsClient): void {
  // ─── list_feeds ────────────────────────────────────────────
  server.tool(
    "list_feeds",
    "List product feeds for a catalog.",
    {
      catalog_id: z.string().describe("Product catalog ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ catalog_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${catalog_id}/product_feeds`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_feed ───────────────────────────────────────────
  server.tool(
    "create_feed",
    "Create a new product feed for a catalog.",
    {
      catalog_id: z.string().describe("Product catalog ID"),
      name: z.string().describe("Feed name"),
      schedule: z.string().optional().describe("JSON string for feed schedule configuration"),
      file_url: z.string().optional().describe("URL of the feed file"),
    },
    async ({ catalog_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`/${catalog_id}/product_feeds`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── upload_feed ───────────────────────────────────────────
  server.tool(
    "upload_feed",
    "Upload/trigger a feed file upload for a product feed.",
    {
      feed_id: z.string().describe("Product feed ID"),
      url: z.string().describe("URL of the feed file to upload"),
    },
    async ({ feed_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`/${feed_id}/uploads`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_feed_uploads ──────────────────────────────────────
  server.tool(
    "get_feed_uploads",
    "Get upload history for a product feed.",
    {
      feed_id: z.string().describe("Product feed ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ feed_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${feed_id}/uploads`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
