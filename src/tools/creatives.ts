import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerCreativeTools(server: McpServer, client: AdsClient): void {
  // ─── list_creatives ────────────────────────────────────────
  server.tool(
    "list_creatives",
    "List ad creatives in the ad account.",
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
        const { data, rateLimit } = await client.get(`${client.accountPath}/adcreatives`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_creative ──────────────────────────────────────────
  server.tool(
    "get_creative",
    "Get details of a specific ad creative by ID.",
    {
      creative_id: z.string().describe("Creative ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ creative_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${creative_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_creative ───────────────────────────────────────
  server.tool(
    "create_creative",
    "Create a new ad creative with object_story_spec. The spec defines the ad content (link, photo, or video) and the associated Facebook Page.",
    {
      name: z.string().describe("Creative name"),
      object_story_spec: z.string().describe("JSON string of object_story_spec (page_id, link_data/photo_data/video_data)"),
      url_tags: z.string().optional().describe("URL tags to append to all links"),
      asset_feed_spec: z.string().optional().describe("JSON string of asset_feed_spec for dynamic creative"),
    },
    async ({ name, object_story_spec, url_tags, asset_feed_spec }) => {
      try {
        const params: Record<string, unknown> = { name, object_story_spec };
        if (url_tags) params.url_tags = url_tags;
        if (asset_feed_spec) params.asset_feed_spec = asset_feed_spec;
        const { data, rateLimit } = await client.post(`${client.accountPath}/adcreatives`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_creative ───────────────────────────────────────
  server.tool(
    "update_creative",
    "Update an existing ad creative. Only name and url_tags can be modified after creation.",
    {
      creative_id: z.string().describe("Creative ID to update"),
      name: z.string().optional().describe("New creative name"),
      url_tags: z.string().optional().describe("New URL tags"),
    },
    async ({ creative_id, name, url_tags }) => {
      try {
        const params: Record<string, unknown> = {};
        if (name) params.name = name;
        if (url_tags) params.url_tags = url_tags;
        const { data, rateLimit } = await client.post(`/${creative_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_dynamic_creative ───────────────────────────────
  server.tool(
    "create_dynamic_creative",
    "Create a dynamic creative with asset_feed_spec. Meta automatically combines different images, videos, titles, bodies, and CTAs to find the best performing combinations.",
    {
      name: z.string().describe("Creative name"),
      asset_feed_spec: z.string().describe("JSON string of asset_feed_spec with arrays: images (hash), videos (video_id), bodies (text), titles (text), descriptions (text), call_to_action_types"),
    },
    async ({ name, asset_feed_spec }) => {
      try {
        const params: Record<string, unknown> = { name, asset_feed_spec };
        const { data, rateLimit } = await client.post(`${client.accountPath}/adcreatives`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
