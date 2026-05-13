import api from "../lib/axios";

export interface DashboardSummary {
  total: number;
  active: number;
  cvPassRate: number;
  offerRate: number;
  acceptRate: number;
}

export interface StatusCount {
  status: string;
  count: number;
}

export interface SourceCount {
  source: string;
  count: number;
}

export interface WeeklySeriesItem {
  week: string;
  count: number;
}

export interface UpcomingDeadline {
  id: string;
  companyName: string;
  position: string;
  deadlineAt: string;
  status: string;
}

export interface DashboardData {
  summary: DashboardSummary;
  byStatus: StatusCount[];
  bySource: SourceCount[];
  weeklySeries: WeeklySeriesItem[];
  upcomingDeadlines: UpcomingDeadline[];
}

interface DashboardApiResponse {
  success: boolean;
  data: DashboardData;
}

export const dashboardService = {
  getStats: async (range: string = "all"): Promise<DashboardData> => {
    const response = await api.get<DashboardApiResponse>("/dashboard/stats", {
      params: { range },
    });
    return response.data.data;
  },
};
