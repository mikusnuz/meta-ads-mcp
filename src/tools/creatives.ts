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
      account_id: z.string().optional().describe("Ad account ID to query (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ fields, limit, after, account_id }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        const { data, rateLimit } = await client.get(`${client.accountPath(account_id)}/adcreatives`, params);
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
    "Create a new ad creative with object_story_spec. The spec defines the ad content (link, photo, or video) and the associated Facebook Page. Notes for v26.0: poll_spec and the poll type under interactive_components_spec are no longer supported and will be rejected. If the advertiser has a shop, eligible creatives now default to destination_spec.destination_type=WEBSITE_AND_SHOP — set it to WEBSITE_AND_SHOP_OPT_OUT to opt out.",
    {
      name: z.string().describe("Creative name"),
      object_story_spec: z.string().describe("JSON string of object_story_spec (page_id, link_data/photo_data/video_data). As of v26.0, it can also include wamo_whatsapp_identity_spec to deliver ads in WhatsApp Status (Offsite-conversion optimization is supported for Sales, Leads, Engagement, and Landing Page Views)."),
      url_tags: z.string().optional().describe("URL tags to append to all links"),
      asset_feed_spec: z.string().optional().describe("JSON string of asset_feed_spec for dynamic creative"),
      account_id: z.string().optional().describe("Ad account ID to create the creative in (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ name, object_story_spec, url_tags, asset_feed_spec, account_id }) => {
      try {
        const params: Record<string, unknown> = { name, object_story_spec };
        if (url_tags) params.url_tags = url_tags;
        if (asset_feed_spec) params.asset_feed_spec = asset_feed_spec;
        const { data, rateLimit } = await client.post(`${client.accountPath(account_id)}/adcreatives`, params);
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
      account_id: z.string().optional().describe("Ad account ID to create the creative in (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ name, asset_feed_spec, account_id }) => {
      try {
        const params: Record<string, unknown> = { name, asset_feed_spec };
        const { data, rateLimit } = await client.post(`${client.accountPath(account_id)}/adcreatives`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── generate_preview ──────────────────────────────────────
  server.tool(
    "generate_preview",
    "Generate an ad preview without needing an existing ad. Provide creative spec directly to see how it would look.",
    {
      ad_format: z.string().describe("Ad format: DESKTOP_FEED_STANDARD, MOBILE_FEED_STANDARD, INSTAGRAM_STANDARD, INSTAGRAM_STORY, RIGHT_COLUMN_STANDARD, etc."),
      creative: z.string().describe("JSON string of creative spec: {object_story_spec: {...}} or {object_story_id: '...'}"),
      account_id: z.string().optional().describe("Ad account ID to generate the preview in (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ ad_format, creative, account_id }) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath(account_id)}/generatepreviews`, { ad_format, creative });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
