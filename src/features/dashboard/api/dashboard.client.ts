import { fetcher } from "@/shared/lib/http";
import {
  DashboardStatsResponseSchema,
  DashboardStatsSchema,
  type DashboardStats,
} from "../contracts/dashboard.contract";

/**
 * DEMO DATA FLAG — single source of truth.
 *
 * node-postg-backend-template does not expose a dashboard stats endpoint yet
 * (see its src/routes/index.ts), so the dashboard renders mock data and every
 * dashboard widget shows a visible "Demo data" badge (<DemoDataBadge />).
 *
 * Once the backend implements `GET /api/v1/dashboard/stats`, set this to
 * `false` (or delete it together with MOCK_DASHBOARD_STATS and DemoDataBadge).
 */
export const DASHBOARD_USES_MOCK_DATA = true;

const DASHBOARD_STATS_ENDPOINT = "/api/v1/dashboard/stats";

/** Mock payload — still validated through Zod to catch schema drift early. */
const MOCK_DASHBOARD_STATS = {
  stats: [
    {
      id: "revenue",
      label: "Total Revenue",
      value: "$48,295",
      change: 12.5,
      trend: "up",
    },
    {
      id: "users",
      label: "Active Users",
      value: 3_842,
      change: 8.2,
      trend: "up",
    },
    {
      id: "orders",
      label: "New Orders",
      value: 1_204,
      change: -2.1,
      trend: "down",
    },
    {
      id: "conversion",
      label: "Conversion Rate",
      value: "3.6%",
      change: 0.4,
      trend: "up",
    },
  ],
  revenueChart: [
    { month: "Jan", revenue: 32000, expenses: 18000 },
    { month: "Feb", revenue: 38000, expenses: 19500 },
    { month: "Mar", revenue: 35000, expenses: 21000 },
    { month: "Apr", revenue: 41000, expenses: 20000 },
    { month: "May", revenue: 46000, expenses: 22000 },
    { month: "Jun", revenue: 48295, expenses: 21500 },
  ],
  lastUpdated: new Date().toISOString(),
};

export const getDashboardStats = async (): Promise<DashboardStats> => {
  if (DASHBOARD_USES_MOCK_DATA) {
    return DashboardStatsSchema.parse(MOCK_DASHBOARD_STATS);
  }

  const raw = await fetcher<unknown>(DASHBOARD_STATS_ENDPOINT);
  return DashboardStatsResponseSchema.parse(raw).data;
};
