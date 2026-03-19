import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerBrandSafetyTools(server: McpServer, client: AdsClient): void {
  // ─── list_block_lists ─────────────────────────────────────────
  server.tool(
    "list_block_lists",
    "List publisher block lists for the ad account. Returns paginated results.",
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
        const { data, rateLimit } = await client.get(`${client.accountPath}/publisher_block_lists`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_block_list ────────────────────────────────────────
  server.tool(
    "create_block_list",
    "Create a new publisher block list for the ad account.",
    {
      name: z.string().describe("Name for the block list"),
    },
    async ({ name }) => {
      try {
        const params: Record<string, unknown> = { name };
        const { data, rateLimit } = await client.post(`${client.accountPath}/publisher_block_lists`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── add_to_block_list ────────────────────────────────────────
  server.tool(
    "add_to_block_list",
    "Add publisher URLs to an existing block list.",
    {
      list_id: z.string().describe("Block list ID"),
      urls: z.string().describe("JSON array of URLs to block (e.g. '[\"example.com\",\"bad-site.com\"]')"),
    },
    async ({ list_id, urls }) => {
      try {
        const params: Record<string, unknown> = { urls };
        const { data, rateLimit } = await client.post(`/${list_id}/publisher_urls`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── remove_from_block_list ───────────────────────────────────
  server.tool(
    "remove_from_block_list",
    "Remove publisher URLs from an existing block list.",
    {
      list_id: z.string().describe("Block list ID"),
      urls: z.string().describe("JSON array of URLs to remove (e.g. '[\"example.com\"]')"),
    },
    async ({ list_id, urls }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${list_id}/publisher_urls`, { urls });
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_block_list ────────────────────────────────────────
  server.tool(
    "delete_block_list",
    "Delete a publisher block list. This action is irreversible.",
    {
      list_id: z.string().describe("Block list ID to delete"),
    },
    async ({ list_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${list_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
