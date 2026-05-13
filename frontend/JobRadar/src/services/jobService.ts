import api from "../lib/axios";

export interface JobApplication {
  id: string;
  userId: string;
  companyName: string;
  position: string;
  status: string;
  source: string;
  jobUrl: string | null;
  salaryNote: string | null;
  notes: string | null;
  appliedAt: string;
  deadlineAt: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { interviewNotes: number };
  interviewNotes?: any[];
}

interface JobListResponse {
  success: boolean;
  data: JobApplication[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const jobService = {
  list: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
    source?: string;
    search?: string;
    range?: string;
    sortBy?: string;
    order?: string;
  }): Promise<JobListResponse> => {
    const response = await api.get<JobListResponse>("/jobs", { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/jobs/${id}`);
    return response.data;
  },

  create: async (data: {
    companyName: string;
    position: string;
    appliedAt: string;
    source?: string;
    jobUrl?: string;
    salaryNote?: string;
    notes?: string;
    deadlineAt?: string;
  }) => {
    const response = await api.post("/jobs", data);
    return response.data;
  },

  update: async (id: string, data: Partial<{
    companyName: string;
    position: string;
    jobUrl: string;
    salaryNote: string;
    notes: string;
    deadlineAt: string;
  }>) => {
    const response = await api.patch(`/jobs/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: string) => {
    const response = await api.patch(`/jobs/${id}/status`, { status });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/jobs/${id}`);
    return response.data;
  },
};
