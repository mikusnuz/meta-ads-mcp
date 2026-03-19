#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRequire } from "node:module";
import { loadConfig } from "./config.js";
import { AdsClient } from "./services/ads-client.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const server = new McpServer({
  name: "meta-ads-mcp",
  version,
});

const config = loadConfig();
const client = new AdsClient(config);

// Tool imports and registrations will be added as modules are implemented
// --- Campaign Management ---
// registerCampaignTools(server, client)
// registerAdSetTools(server, client)
// registerAdTools(server, client)
// registerAdCreativeTools(server, client)

// --- Insights & Reporting ---
// registerInsightTools(server, client)
// registerReportTools(server, client)

// --- Audience & Targeting ---
// registerCustomAudienceTools(server, client)
// registerLookalikeAudienceTools(server, client)
// registerTargetingSearchTools(server, client)
// registerReachEstimateTools(server, client)

// --- Assets ---
// registerImageTools(server, client)
// registerVideoTools(server, client)

// --- Pixel & Conversions ---
// registerPixelTools(server, client)
// registerConversionTools(server, client)

// --- Business & Account ---
// registerAccountTools(server, client)
// registerBusinessTools(server, client)

// --- Auth & Token ---
// registerAuthTools(server, client)

// --- Batch & Utility ---
// registerBatchTools(server, client)
// registerUtilityTools(server, client)

// --- Resources & Prompts ---
// registerResources(server, client)
// registerPrompts(server)

// Suppress unused variable warnings during scaffolding phase
void client;

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
