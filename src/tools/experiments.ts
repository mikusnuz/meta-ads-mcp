import { z } from "zod";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../services/ads-client.js";

export function registerExperimentTools(server: McpServer, client: AdsClient): void {
  // ─── list_experiments ──────────────────────────────────────
  server.tool(
    "list_experiments",
    "List A/B test experiments (ad studies) for the ad account.",
    {
      fields: z.string().optional().describe("Comma-separated fields to return"),
      limit: z.number().optional().default(25).describe("Number of results to return"),
      after: z.string().optional().describe("Pagination cursor for next page"),
    },
    async (params) => {
      try {
        const { data, rateLimit } = await client.get(`${client.accountPath}/ad_studies`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── create_experiment ─────────────────────────────────────
  server.tool(
    "create_experiment",
    "Create a new A/B test experiment (ad study).",
    {
      name: z.string().describe("Experiment name"),
      description: z.string().optional().describe("Experiment description"),
      start_time: z.string().describe("Start time in ISO 8601 or Unix timestamp"),
      end_time: z.string().describe("End time in ISO 8601 or Unix timestamp"),
      type: z.string().optional().describe("Study type"),
      cells: z.string().describe("JSON array of test cells: [{name, campaign_id}]"),
    },
    async (params) => {
      try {
        const { data, rateLimit } = await client.post(`${client.accountPath}/ad_studies`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_experiment ────────────────────────────────────────
  server.tool(
    "get_experiment",
    "Get details of a specific experiment (ad study).",
    {
      experiment_id: z.string().describe("Experiment (ad study) ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ experiment_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${experiment_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── update_experiment ─────────────────────────────────────
  server.tool(
    "update_experiment",
    "Update an existing experiment (ad study).",
    {
      experiment_id: z.string().describe("Experiment (ad study) ID"),
      name: z.string().optional().describe("New experiment name"),
      description: z.string().optional().describe("New experiment description"),
    },
    async ({ experiment_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.post(`/${experiment_id}`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );

  // ─── get_experiment_results ────────────────────────────────
  server.tool(
    "get_experiment_results",
    "Get results/cells of an experiment (ad study).",
    {
      experiment_id: z.string().describe("Experiment (ad study) ID"),
      fields: z.string().optional().describe("Comma-separated fields to return"),
    },
    async ({ experiment_id, ...params }) => {
      try {
        const { data, rateLimit } = await client.get(`/${experiment_id}/cells`, { ...params });
        return { content: [{ type: "text" as const, text: JSON.stringify({ ...data as object, _rateLimit: rateLimit }, null, 2) }] };
      } catch (error) {
        return { content: [{ type: "text" as const, text: `Failed: ${error instanceof Error ? error.message : String(error)}` }], isError: true };
      }
    }
  );
}
