import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerAdTools(server: McpServer, client: AdsClient): void {
  // ─── list_ads ──────────────────────────────────────────────
  server.tool(
    "list_ads",
    "List ads in the ad account. Optionally filter by campaign, ad set, or status.",
    {
      campaign_id: z.string().optional().describe("Filter by campaign ID"),
      adset_id: z.string().optional().describe("Filter by ad set ID"),
      status: z.string().optional().describe("Filter by status: ACTIVE, PAUSED, DELETED, ARCHIVED"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results (default 25)"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async ({ campaign_id, adset_id, status, fields, limit, after }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        if (limit) params.limit = limit;
        if (after) params.after = after;
        if (campaign_id) params.campaign_id = campaign_id;
        if (adset_id) params.adset_id = adset_id;
        if (status) params.effective_status = `["${status}"]`;
        const { data, rateLimit } = await client.get(`${client.accountPath}/ads`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_ad ────────────────────────────────────────────────
  server.tool(
    "get_ad",
    "Get details of a specific ad by ID.",
    {
      ad_id: z.string().describe("Ad ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ ad_id, fields }) => {
      try {
        const params: Record<string, unknown> = {};
        if (fields) params.fields = fields;
        const { data, rateLimit } = await client.get(`/${ad_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_ad ─────────────────────────────────────────────
  server.tool(
    "create_ad",
    "Create a new ad. Requires name, adset_id, and creative (JSON object_story_spec). Defaults to PAUSED status.",
    {
      name: z.string().describe("Ad name"),
      adset_id: z.string().describe("Parent ad set ID"),
      creative: z.string().describe("JSON string of creative spec (object_story_spec with page_id, link_data/photo_data/video_data)"),
      status: z.string().optional().default("PAUSED").describe("Ad status (default PAUSED)"),
      tracking_specs: z.string().optional().describe("JSON string of tracking specs array"),
    },
    async ({ name, adset_id, creative, status, tracking_specs }) => {
      try {
        const params: Record<string, unknown> = { name, adset_id, creative, status };
        if (tracking_specs) params.tracking_specs = tracking_specs;
        const { data, rateLimit } = await client.post(`${client.accountPath}/ads`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_ad ─────────────────────────────────────────────
  server.tool(
    "update_ad",
    "Update an existing ad. Only provided fields will be modified.",
    {
      ad_id: z.string().describe("Ad ID to update"),
      name: z.string().optional().describe("New ad name"),
      status: z.string().optional().describe("New status: ACTIVE, PAUSED, DELETED, ARCHIVED"),
      creative: z.string().optional().describe("New creative spec as JSON string"),
      tracking_specs: z.string().optional().describe("New tracking specs as JSON string"),
    },
    async ({ ad_id, name, status, creative, tracking_specs }) => {
      try {
        const params: Record<string, unknown> = {};
        if (name) params.name = name;
        if (status) params.status = status;
        if (creative) params.creative = creative;
        if (tracking_specs) params.tracking_specs = tracking_specs;
        const { data, rateLimit } = await client.post(`/${ad_id}`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── delete_ad ─────────────────────────────────────────────
  server.tool(
    "delete_ad",
    "Delete an ad. This action is irreversible.",
    {
      ad_id: z.string().describe("Ad ID to delete"),
    },
    async ({ ad_id }) => {
      try {
        const { data, rateLimit } = await client.delete(`/${ad_id}`);
        return { content: [{ type: "text" as const, text: JSON.stringify({ success: true, ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_ad_preview ────────────────────────────────────────
  server.tool(
    "get_ad_preview",
    "Get a preview of an ad in a specific format. Returns HTML iframe for rendering.",
    {
      ad_id: z.string().describe("Ad ID"),
      ad_format: z.string().describe("Ad format: DESKTOP_FEED_STANDARD, MOBILE_FEED_STANDARD, INSTAGRAM_STANDARD, INSTAGRAM_STORY, RIGHT_COLUMN_STANDARD, etc."),
    },
    async ({ ad_id, ad_format }) => {
      try {
        const { data, rateLimit } = await client.get(`/${ad_id}/previews`, { ad_format });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_delivery_estimate ─────────────────────────────────
  server.tool(
    "get_delivery_estimate",
    "Get delivery estimate for an ad including estimated daily reach and cost.",
    {
      ad_id: z.string().describe("Ad ID"),
      optimization_goal: z.string().optional().describe("Optimization goal to estimate for"),
    },
    async ({ ad_id, optimization_goal }) => {
      try {
        const params: Record<string, unknown> = {};
        if (optimization_goal) params.optimization_goal = optimization_goal;
        const { data, rateLimit } = await client.get(`/${ad_id}/delivery_estimate`, params);
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
