import test from "node:test";
import assert from "node:assert/strict";
import {
  buildAsyncReportResultsPath,
  buildAsyncReportStatusPath,
  buildBudgetSchedulePath,
  buildFacebookTokenExchangeParams,
} from "../src/services/api-contracts.js";

test("budget schedules use the owning campaign or ad set edge", () => {
  assert.equal(
    buildBudgetSchedulePath("campaign-123", "campaign"),
    "/campaign-123/budget_schedules"
  );
  assert.equal(
    buildBudgetSchedulePath("adset-456", "adset"),
    "/adset-456/budget_schedules"
  );
  assert.throws(() => buildBudgetSchedulePath("", "campaign"), /ID is required/);
});

test("token extension sends the complete fb_exchange_token request", () => {
  const params = buildFacebookTokenExchangeParams("long-token", "app", "secret");
  assert.deepEqual(Object.fromEntries(params), {
    grant_type: "fb_exchange_token",
    client_id: "app",
    client_secret: "secret",
    fb_exchange_token: "long-token",
  });
  assert.throws(
    () => buildFacebookTokenExchangeParams("token", "", ""),
    /META_APP_ID and META_APP_SECRET/
  );
});

test("async insights distinguish status and result resources", () => {
  assert.equal(buildAsyncReportStatusPath("run-1"), "/run-1");
  assert.equal(buildAsyncReportResultsPath("run-1"), "/run-1/insights");
});
