import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerVideoTools(server: McpServer, client: AdsClient): void {
  // ─── list_videos ───────────────────────────────────────────
  server.tool(
    "list_videos",
    "List ad videos uploaded to the ad account.",
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
        const { data, rateLimit } = await client.get(`${client.accountPath}/advideos`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── upload_video ──────────────────────────────────────────
  server.tool(
    "upload_video",
    "Upload an ad video from a public URL. Returns video ID for use in ad creatives.",
    {
      file_url: z.string().describe("Public URL of the video to upload"),
      title: z.string().optional().describe("Video title"),
      description: z.string().optional().describe("Video description"),
    },
    async ({ file_url, title, description }) => {
      try {
        const params: Record<string, unknown> = { file_url };
        if (title) params.title = title;
        if (description) params.description = description;
        const { data, rateLimit } = await client.post(`${client.accountPath}/advideos`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_video ─────────────────────────────────────────────
  server.tool(
    "get_video",
    "Get details of a specific ad video by ID.",
    {
      video_id: z.string().describe("Video ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ video_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${video_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_video ──────────────────────────────────────────
  server.tool(
    "delete_video",
    "Delete an ad video. This action is irreversible.",
    {
      video_id: z.string().describe("Video ID to delete"),
    },
    async ({ video_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${video_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
