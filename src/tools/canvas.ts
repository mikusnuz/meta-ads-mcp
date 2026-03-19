import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerCanvasTools(server: McpServer, client: AdsClient): void {
  // ─── list_canvases ─────────────────────────────────────────
  server.tool(
    "list_canvases",
    "List Instant Experience (Canvas) creatives in the ad account.",
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
        const { data, rateLimit } = await client.get(`${client.accountPath}/canvas`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_canvas ────────────────────────────────────────────
  server.tool(
    "get_canvas",
    "Get details of a specific Instant Experience (Canvas) by ID.",
    {
      canvas_id: z.string().describe("Canvas ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ canvas_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${canvas_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_canvas ─────────────────────────────────────────
  server.tool(
    "create_canvas",
    "Create a new Instant Experience (Canvas) on a Facebook Page. Requires page_id and body_elements JSON array defining the canvas layout.",
    {
      page_id: z.string().describe("Facebook Page ID to create the canvas on"),
      body_elements: z.string().describe("JSON array of canvas body elements (buttons, carousels, photos, videos, text, etc.)"),
      name: z.string().optional().describe("Canvas name"),
    },
    async ({ page_id, body_elements, name }) => {
      try {
        const params: Record<string, unknown> = { body_elements };
        if (name) params.name = name;
        const { data, rateLimit } = await client.post(`/${page_id}/canvases`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_canvas ─────────────────────────────────────────
  server.tool(
    "delete_canvas",
    "Delete an Instant Experience (Canvas). This action is irreversible.",
    {
      canvas_id: z.string().describe("Canvas ID to delete"),
    },
    async ({ canvas_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${canvas_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
