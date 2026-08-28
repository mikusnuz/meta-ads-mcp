export type BudgetScheduleParentType = "campaign" | "adset";

export function buildBudgetSchedulePath(
  parentId: string,
  _parentType: BudgetScheduleParentType
): string {
  if (!parentId) throw new Error("A campaign or ad set ID is required.");
  return `/${parentId}/budget_schedules`;
}

export function buildFacebookTokenExchangeParams(
  token: string,
  appId: string,
  appSecret: string
): URLSearchParams {
  if (!appId || !appSecret) {
    throw new Error(
      "META_APP_ID and META_APP_SECRET are required for token exchange."
    );
  }
  return new URLSearchParams({
    grant_type: "fb_exchange_token",
    client_id: appId,
    client_secret: appSecret,
    fb_exchange_token: token,
  });
}

export function buildAsyncReportStatusPath(reportRunId: string): string {
  return `/${reportRunId}`;
}

export function buildAsyncReportResultsPath(reportRunId: string): string {
  return `/${reportRunId}/insights`;
}
