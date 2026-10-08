import { StatusPill } from "@/shared/components/ui/StatusPill";
import { DASHBOARD_USES_MOCK_DATA } from "../api/dashboard.client";

/**
 * Visible marker shown while the dashboard is fed by mock data.
 * Renders nothing once DASHBOARD_USES_MOCK_DATA is flipped to false.
 */
export function DemoDataBadge() {
  if (!DASHBOARD_USES_MOCK_DATA) return null;

  return (
    <span title="GET /api/v1/dashboard/stats does not exist in the backend yet — values are mock data.">
      <StatusPill
        label="Demo data — backend endpoint not implemented"
        variant="warning"
      />
    </span>
  );
}
