import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";
import {
  buildAsyncReportResultsPath,
  buildAsyncReportStatusPath,
} from "../services/api-contracts.js";

const insightParams = {
  fields: z.string().optional().default("impressions,clicks,spend,reach,frequency,cpc,cpm,ctr,actions,cost_per_action_type").describe("Comma-separated insight fields"),
  breakdowns: z.string().optional().describe("Breakdown dimensions: age,gender,country,region,placement,device_platform"),
  date_preset: z.string().optional().describe("Lowercase date preset, for example: today, yesterday, last_7d, last_14d, last_30d, this_month, last_month, this_quarter, last_quarter, this_year, last_year"),
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
    {
      ...insightParams,
      account_id: z.string().optional().describe("Ad account ID to query (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ account_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath(account_id)}/insights`, { ...params });
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
    {
      ...insightParams,
      account_id: z.string().optional().describe("Ad account ID to query (e.g. 'act_123' or '123'). Falls back to META_AD_ACCOUNT_ID env var if omitted."),
    },
    async ({ account_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(
          `${client.accountPath(account_id)}/insights`,
          params
        );
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
      fields: z.string().optional().describe("Comma-separated insight fields to return once the job completes"),
      include_results: z.boolean().default(true).describe("Fetch /{report_run_id}/insights when the job is complete"),
      limit: z.number().int().positive().default(100).describe("Maximum result rows per page"),
      after: z.string().optional().describe("Pagination cursor for the result page"),
    },
    async ({ report_run_id, fields, include_results, limit, after }) => {
      try {
        const statusResponse = await client.get(
          buildAsyncReportStatusPath(report_run_id),
          {
            fields:
              "async_status,async_percent_completion,error_code,error_message,error_subcode",
          }
        );
        const status = statusResponse.data as Record<string, unknown>;
        const isComplete = status.async_status === "Job Completed";
        const hasFailed =
          status.async_status === "Job Failed" ||
          status.async_status === "Job Skipped";

        let results: unknown;
        let resultsRateLimit: unknown;
        if (include_results && isComplete) {
          const resultParams: Record<string, unknown> = { limit };
          if (fields) resultParams.fields = fields;
          if (after) resultParams.after = after;

          const resultResponse = await client.get(
            buildAsyncReportResultsPath(report_run_id),
            resultParams
          );
          results = resultResponse.data;
          resultsRateLimit = resultResponse.rateLimit;
        }

        const response = {
          content: [{
            type: "text" as const,
            text: JSON.stringify({
              status,
              ...(results !== undefined ? { results } : {}),
              ...(include_results && !isComplete && !hasFailed
                ? { results_pending: true }
                : {}),
              ...(include_results && hasFailed
                ? { results_unavailable: true }
                : {}),
              _rateLimit: statusResponse.rateLimit,
              ...(resultsRateLimit !== undefined
                ? { _resultsRateLimit: resultsRateLimit }
                : {}),
            }, null, 2),
          }],
        };
        return hasFailed ? { ...response, isError: true } : response;
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
