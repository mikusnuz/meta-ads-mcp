import { z } from "zod";
import { readFile } from "node:fs/promises";
import { basename } from "node:path";
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
      account_id: z.string().optional().describe("Ad account ID to query (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ fields, limit, after, account_id }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`${client.accountPath(account_id)}/advideos`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── upload_video ──────────────────────────────────────────
  server.tool(
    "upload_video",
    "Upload an ad video from a public URL or a local file. Returns video ID for use in ad creatives.",
    {
      file_url: z.string().optional().describe("Public URL of the video to upload"),
      file_path: z.string().optional().describe("Local filesystem path of the video to upload. Sent as multipart/form-data, bypassing the need for a publicly reachable URL."),
      title: z.string().optional().describe("Video title"),
      description: z.string().optional().describe("Video description"),
      account_id: z.string().optional().describe("Ad account ID to upload into (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ file_url, file_path, title, description, account_id }) => {
      try {
        if (!file_url && !file_path) {
          throw new Error("Provide either file_url or file_path.");
        }
        const fields: Record<string, unknown> = {};
        if (title) fields.title = title;
        if (description) fields.description = description;

        const path = `${client.accountPath(account_id)}/advideos`;
        const { data, rateLimit } = file_path
          ? await client.postMultipart(path, fields, {
              buffer: await readFile(file_path),
              fieldName: "source",
              filename: basename(file_path),
            })
          : await client.post(path, { ...fields, file_url });

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
