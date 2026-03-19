# Meta Ads Management

This project uses **meta-ads-mcp** to manage Facebook & Instagram advertising via MCP tools.

## Available Tools (123)

Use `mcp__meta-ads__<tool>` for all Meta advertising operations.

### Campaign Lifecycle
- `create_campaign` — Create a new campaign (objective: CONVERSIONS, TRAFFIC, etc.)
- `create_adset` — Create an ad set (targeting, budget, schedule)
- `create_ad` — Create an ad (links a creative to an ad set)
- `create_creative` — Create an ad creative (image, video, carousel)
- `update_campaign` / `update_adset` / `update_ad` — Modify settings, pause/resume
- `delete_campaign` / `delete_adset` / `delete_ad` — Remove entities
- `list_campaigns` / `list_adsets` / `list_ads` — List with filtering and pagination

### Performance & Reporting
- `get_account_insights` — Account-level metrics
- `get_campaign_insights` — Campaign-level breakdown
- `get_adset_insights` — Ad set-level breakdown
- `get_ad_insights` — Ad-level breakdown
- `create_async_report` — Large async reports
- `get_async_report` — Poll and retrieve async report results

### Audiences & Targeting
- `create_custom_audience` — Create audience from customer data
- `create_lookalike_audience` — Create lookalike from existing audience
- `search_targeting` — Find interests, behaviors, demographics
- `get_reach_estimate` — Estimate audience size
- `add_users_to_audience` / `remove_users_from_audience` — Manage audience members

### Media Assets
- `upload_image` — Upload ad image from URL
- `upload_video` — Upload ad video from URL
- `list_images` / `list_videos` — Browse existing media

### Automation & Testing
- `create_rule` — Set up automated rules (pause if CPA > X)
- `create_experiment` — Create A/B tests
- `get_experiment_results` — Check A/B test outcomes

### Catalog & Commerce
- `create_catalog` — Create product catalog for dynamic ads
- `create_feed` / `upload_feed` — Manage product data feeds

### Ad Library
- `search_ad_library` — Search public ad data (competitor research)

### Auth & Token
- `exchange_token` — Convert short-lived token to long-lived
- `debug_token` — Inspect token metadata and permissions

## Common Workflows

### Create a full campaign
1. `create_campaign` with objective
2. `upload_image` or `upload_video` for media
3. `create_creative` with uploaded media
4. `create_adset` with targeting, budget, schedule
5. `create_ad` linking creative to ad set

### Check performance and optimize
1. `get_campaign_insights` with date range
2. Identify underperformers
3. `update_adset` to pause or adjust budgets
4. `create_rule` to automate future optimizations

### A/B test creatives
1. Create two ad sets with different creatives
2. `create_experiment` to run the test
3. `get_experiment_results` after sufficient data

### Build a lookalike audience
1. `create_custom_audience` from customer list
2. `add_users_to_audience` with hashed user data
3. `create_lookalike_audience` from the source audience

## Resources
- `ads://account` — Account overview (status, balance, currency)
- `ads://campaigns-overview` — Active campaigns with budgets
- `ads://spending-today` — Today's spend, impressions, clicks, reach

## Rules
- Ad account ID must be numeric without `act_` prefix
- Use `exchange_token` to convert short-lived tokens to long-lived
- Use `debug_token` to diagnose permission issues
- Async reports needed for large date ranges or many breakdowns
- All monetary values use the account's currency
