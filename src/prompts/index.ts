import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

export function registerPrompts(server: McpServer) {
  server.prompt(
    "campaign_wizard",
    "Step-by-step guide to create a full ad campaign from scratch",
    {},
    () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              "Help me create a complete Meta ad campaign from scratch.",
              "",
              "Follow these steps in order:",
              "1. Ask me about the campaign objective (OUTCOME_AWARENESS, OUTCOME_ENGAGEMENT, OUTCOME_LEADS, OUTCOME_SALES, OUTCOME_TRAFFIC, OUTCOME_APP_PROMOTION)",
              "2. Ask about target audience (location, age range, interests)",
              "3. Ask about budget (daily vs lifetime) and schedule",
              "4. Ask about the ad creative (image/video URL, primary text, headline, CTA)",
              "",
              "Then execute:",
              "1. Use create_campaign to create the campaign",
              "2. Use search_targeting to find targeting spec IDs for the interests",
              "3. Use get_reach_estimate to preview estimated reach",
              "4. Use create_adset to create the ad set with targeting and budget",
              "5. Use create_ad_creative to build the creative",
              "6. Use create_ad to link everything together",
              "",
              "After each step, confirm success before moving to the next.",
              "If anything fails, explain the error and suggest fixes.",
            ].join("\n"),
          },
        },
      ],
    })
  );

  server.prompt(
    "performance_report",
    "Analyze ad performance with detailed breakdowns and recommendations",
    {},
    () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              "Generate a comprehensive ad performance report for my account.",
              "",
              "Use these tools to gather data:",
              "1. get_account_insights — Overall account spend, impressions, clicks, conversions for the last 7 days",
              "2. get_campaign_insights — Per-campaign performance with breakdowns by age, gender, and placement",
              "3. get_adset_insights — Ad set level metrics to identify best targeting",
              "4. get_ad_insights — Individual ad performance to find top creatives",
              "",
              "Compile a report covering:",
              "- Total spend vs. results (ROAS, CPA, CTR, CPM)",
              "- Top 3 performing campaigns by ROAS",
              "- Top 3 performing audiences by CPA",
              "- Top 3 performing ad creatives by CTR",
              "- Age/gender breakdown of conversions",
              "- Placement performance comparison (Feed, Stories, Reels, etc.)",
              "- Budget allocation recommendations",
              "- Specific actions to improve underperforming campaigns",
              "",
              "Use date_preset: last_7d for all insights queries.",
              "Request breakdowns: age,gender for demographic analysis.",
              "Request breakdowns: publisher_platform,platform_position for placement analysis.",
            ].join("\n"),
          },
        },
      ],
    })
  );

  server.prompt(
    "audience_builder",
    "Build and refine target audiences using Meta's targeting tools",
    {},
    () => ({
      messages: [
        {
          role: "user" as const,
          content: {
            type: "text" as const,
            text: [
              "Help me build effective target audiences for my Meta ad campaigns.",
              "",
              "Follow this workflow:",
              "1. Ask me about my product/service and ideal customer profile",
              "2. Ask about any existing customer data (email lists, website visitors, app users)",
              "",
              "Then execute:",
              "1. Use search_targeting to find relevant interest, behavior, and demographic targeting options",
              "2. Use get_targeting_suggestions to discover related targeting options I might have missed",
              "3. Use get_reach_estimate to check the audience size for the combined targeting",
              "4. If I have customer data, use create_custom_audience to create a Custom Audience",
              "5. Use create_lookalike_audience to create Lookalike Audiences from the Custom Audience (1%, 3%, 5% sizes)",
              "6. Use get_reach_estimate again to validate the Lookalike Audience sizes",
              "",
              "Guidelines:",
              "- Aim for audience sizes between 1M–10M for prospecting campaigns",
              "- Keep Lookalike Audiences at 1%–2% for highest quality",
              "- Suggest audience exclusions to avoid overlap",
              "- Recommend A/B testing different audience segments",
              "- Explain the tradeoff between audience size and specificity",
            ].join("\n"),
          },
        },
      ],
    })
  );
}
