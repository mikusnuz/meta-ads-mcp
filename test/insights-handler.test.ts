import test from "node:test";
import assert from "node:assert/strict";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { AdsClient } from "../src/services/ads-client.js";
import { registerInsightTools } from "../src/tools/insights.js";

type ToolHandler = (args: Record<string, unknown>) => Promise<{
  content: Array<{ type: string; text: string }>;
  isError?: boolean;
}>;

function captureHandlers(): {
  server: McpServer;
  handlers: Map<string, ToolHandler>;
} {
  const handlers = new Map<string, ToolHandler>();
  const server = {
    tool(
      name: string,
      _description: string,
      _schema: unknown,
      handler: ToolHandler
    ) {
      handlers.set(name, handler);
    },
  } as unknown as McpServer;
  return { server, handlers };
}

test("get_async_report marks failed jobs as MCP errors with status details", async () => {
  const { server, handlers } = captureHandlers();
  const calls: string[] = [];
  const client = {
    async get(path: string) {
      calls.push(path);
      return {
        data: {
          async_status: "Job Failed",
          async_percent_completion: 75,
          error_code: 1,
          error_message: "report failed",
        },
      };
    },
  } as unknown as AdsClient;
  registerInsightTools(server, client);

  const result = await handlers.get("get_async_report")!({
    report_run_id: "run-1",
    include_results: true,
    limit: 100,
  });
  const payload = JSON.parse(result.content[0].text);

  assert.equal(result.isError, true);
  assert.equal(payload.status.async_status, "Job Failed");
  assert.equal(payload.results_unavailable, true);
  assert.deepEqual(calls, ["/run-1"]);
});

test("get_async_report fetches the insights edge after completion", async () => {
  const { server, handlers } = captureHandlers();
  const calls: Array<{ path: string; params?: Record<string, unknown> }> = [];
  const client = {
    async get(path: string, params?: Record<string, unknown>) {
      calls.push({ path, params });
      if (path.endsWith("/insights")) {
        return { data: { data: [{ spend: "12.34" }] } };
      }
      return {
        data: {
          async_status: "Job Completed",
          async_percent_completion: 100,
        },
      };
    },
  } as unknown as AdsClient;
  registerInsightTools(server, client);

  const result = await handlers.get("get_async_report")!({
    report_run_id: "run-2",
    fields: "spend",
    include_results: true,
    limit: 50,
    after: "cursor",
  });
  const payload = JSON.parse(result.content[0].text);

  assert.equal(result.isError, undefined);
  assert.deepEqual(payload.results, { data: [{ spend: "12.34" }] });
  assert.deepEqual(calls[1], {
    path: "/run-2/insights",
    params: { limit: 50, fields: "spend", after: "cursor" },
  });
});
