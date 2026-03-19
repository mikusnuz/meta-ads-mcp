import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

const insightParams = {
  fields: z.string().optional().default("impressions,clicks,spend,reach,frequency,cpc,cpm,ctr,actions,cost_per_action_type").describe("Comma-separated insight fields"),
  breakdowns: z.string().optional().describe("Breakdown dimensions: age,gender,country,region,placement,device_platform"),
  date_preset: z.string().optional().describe("Date preset: TODAY,YESTERDAY,LAST_7D,LAST_14D,LAST_30D,THIS_MONTH,LAST_MONTH,THIS_QUARTER,LAST_QUARTER,THIS_YEAR,LAST_YEAR"),
  time_range: z.string().optional().describe("JSON string {since,until} in YYYY-MM-DD format"),
  time_increment: z.string().optional().describe("Time granularity: all_days, 1, 7, monthly"),
  filtering: z.string().optional().describe("JSON string for filtering"),
  level: z.string().optional().describe("Aggregation level: campaign, adset, ad"),
};

export function registerInsightTools(server: McpServer, client: AdsClient): void {
  // ─── get_account_insights ──────────────────────────────────
  server.tool(
    "get_account_insights",
    "Get performance insights for the ad account. Returns metrics like impressions, clicks, spend, reach, etc.",
    { ...insightParams },
    async (params) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath}/insights`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_campaign_insights ─────────────────────────────────
  server.tool(
    "get_campaign_insights",
    "Get performance insights for a specific campaign.",
    {
      campaign_id: z.string().describe("Campaign ID"),
      ...insightParams,
    },
    async ({ campaign_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${campaign_id}/insights`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_adset_insights ────────────────────────────────────
  server.tool(
    "get_adset_insights",
    "Get performance insights for a specific ad set.",
    {
      adset_id: z.string().describe("Ad Set ID"),
      ...insightParams,
    },
    async ({ adset_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${adset_id}/insights`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_ad_insights ───────────────────────────────────────
  server.tool(
    "get_ad_insights",
    "Get performance insights for a specific ad.",
    {
      ad_id: z.string().describe("Ad ID"),
      ...insightParams,
    },
    async ({ ad_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${ad_id}/insights`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_async_report ───────────────────────────────────
  server.tool(
    "create_async_report",
    "Create an async insight report for large data queries. Returns a report_run_id to poll with get_async_report.",
    { ...insightParams },
    async (params) => {
      try {
        const { data, rateLimit } = await client.post(`${client.accountPath}/insights`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_async_report ──────────────────────────────────────
  server.tool(
    "get_async_report",
    "Check status and retrieve results of an async insight report.",
    {
      report_run_id: z.string().describe("Report run ID from create_async_report"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ report_run_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${report_run_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
