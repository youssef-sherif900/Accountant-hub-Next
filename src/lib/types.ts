export interface User {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  icon?: string | null;
}

export interface Job {
  id: number;
  title: string;
  slug: string;
  company_name: string;
  short_description: string;
  budget_min: number;
  budget_max: number;
  deadline: string;
  status: "open" | "closed";
  posted_at: string;
  bids_count: number;
  category: Category;
}

export interface JobDetail extends Job {
  company_description?: string;
  company_location?: string | null;
  company_jobs_count: number;
  full_description: string;
  required_skills: string[];
  expected_delivery_time?: string;
  deadline_human: string;
  bid_stats: {
    average: number | null;
    lowest: number | null;
    highest: number | null;
  };
  user_has_bid: boolean;
}

export interface Bid {
  id: number;
  proposed_price: number;
  estimated_delivery_time: string;
  cover_letter: string;
  relevant_experience: string;
  submitted_at: string;
  created_at: string;
  job?: {
    id: number;
    title: string;
    slug: string;
    company_name: string;
    status: "open" | "closed";
  };
}

export interface PaginatedMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedMeta;
  links?: Record<string, string | null>;
}
