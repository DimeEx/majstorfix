export type PropertyType = "house" | "apartment";
export type MaterialStatus = "buyer_provides" | "handyman_provides" | "negotiable";
export type Urgency = "emergency" | "few_days" | "flexible";

export interface Job {
  id: string;
  description: string;
  city: string;
  neighborhood: string;
  property_type: PropertyType;
  floor: number | null;
  has_elevator: boolean;
  is_occupied: boolean;
  material_status: MaterialStatus;
  urgency: Urgency;
  active_days: number;
  budget_min: number;
  budget_max: number;
  image_urls: string[];
  owner_id: string | null;
  created_at: string;
}

export interface Bid {
  id: string;
  job_id: string;
  handyman_phone: string;
  price_labor_only: number;
  price_with_materials: number | null;
  availability_date: string;
  notes: string | null;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      jobs: {
        Row: Job;
        Insert: Omit<Job, "id" | "created_at">;
        Update: Partial<Omit<Job, "id" | "created_at">>;
      };
      bids: {
        Row: Bid;
        Insert: Omit<Bid, "id" | "created_at">;
        Update: Partial<Omit<Bid, "id" | "created_at">>;
      };
    };
  };
}
