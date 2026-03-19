#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createRequire } from "node:module";
import { loadConfig } from "./config.js";
import { AdsClient } from "./services/ads-client.js";

// --- Tool imports ---
import { registerCampaignTools } from "./tools/campaigns.js";
import { registerAdsetTools } from "./tools/adsets.js";
import { registerAdTools } from "./tools/ads.js";
import { registerCreativeTools } from "./tools/creatives.js";
import { registerImageTools } from "./tools/images.js";
import { registerVideoTools } from "./tools/videos.js";
import { registerCanvasTools } from "./tools/canvas.js";
import { registerAudienceTools } from "./tools/audiences.js";
import { registerTargetingTools } from "./tools/targeting.js";
import { registerInsightTools } from "./tools/insights.js";
import { registerLeadTools } from "./tools/leads.js";
import { registerCatalogTools } from "./tools/catalogs.js";
import { registerFeedTools } from "./tools/feeds.js";
import { registerRuleTools } from "./tools/rules.js";
import { registerExperimentTools } from "./tools/experiments.js";
import { registerConversionTools } from "./tools/conversions.js";
import { registerBudgetTools } from "./tools/budget.js";
import { registerReachFrequencyTools } from "./tools/reach_frequency.js";
import { registerBrandSafetyTools } from "./tools/brand_safety.js";
import { registerAccountTools } from "./tools/account.js";
import { registerBusinessTools } from "./tools/business.js";
import { registerAuthTools } from "./tools/auth.js";
import { registerAdLibraryTools } from "./tools/ad_library.js";

// --- Resources & Prompts ---
import { registerResources } from "./resources/account.js";
import { registerPrompts } from "./prompts/index.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const server = new McpServer({
  name: "meta-ads-mcp",
  version,
});

const config = loadConfig();
const client = new AdsClient(config);

// --- Campaign Management ---
registerCampaignTools(server, client);
registerAdsetTools(server, client);
registerAdTools(server, client);
registerCreativeTools(server, client);

// --- Assets ---
registerImageTools(server, client);
registerVideoTools(server, client);
registerCanvasTools(server, client);

// --- Audience & Targeting ---
registerAudienceTools(server, client);
registerTargetingTools(server, client);

// --- Insights & Reporting ---
registerInsightTools(server, client);

// --- Leads ---
registerLeadTools(server, client);

// --- Catalog & Commerce ---
registerCatalogTools(server, client);
registerFeedTools(server, client);

// --- Automation ---
registerRuleTools(server, client);
registerExperimentTools(server, client);

// --- Pixel & Conversions ---
registerConversionTools(server, client);

// --- Budget & Planning ---
registerBudgetTools(server, client);
registerReachFrequencyTools(server, client);

// --- Brand Safety ---
registerBrandSafetyTools(server, client);

// --- Account & Business ---
registerAccountTools(server, client);
registerBusinessTools(server, client);

// --- Auth & Token ---
registerAuthTools(server, client);

// --- Ad Library ---
registerAdLibraryTools(server, client);

// --- Resources & Prompts ---
registerResources(server, client);
registerPrompts(server);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
