export type PropertyType = "house" | "apartment";
export type MaterialStatus =
  | "buyer_provides"
  | "handyman_provides"
  | "negotiable";
export type Urgency = "emergency" | "few_days" | "flexible" | "custom";
export type CompletionTime =
  | "1-2_hours"
  | "3-4_hours"
  | "5-8_hours"
  | "1-2_days"
  | "3+_days"
  | "custom";
export type Currency = "MKD" | "EUR";
export type TradeType =
  | "plumbing"
  | "electrical"
  | "painting"
  | "drywall"
  | "tiling"
  | "flooring"
  | "carpentry"
  | "hvac"
  | "construction"
  | "other";

export type Job = {
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
  urgency_custom: string | null;
  completion_time: CompletionTime;
  completion_time_custom: string | null;
  active_days: number;
  currency: Currency;
  budget_min: number;
  budget_max: number;
  trade_type: TradeType;
  image_urls: string[];
  owner_id: string | null;
  created_at: string;
};

export type Bid = {
  id: string;
  job_id: string;
  bidder_id: string | null;
  handyman_phone: string;
  price_labor_only: number;
  price_with_materials: number | null;
  price_labor_only_eur: number | null;
  price_with_materials_eur: number | null;
  availability_date: string;
  notes: string | null;
  created_at: string;
};

export type VerifiedHandyman = {
  phone: string;
  created_at: string;
};

export type Rating = {
  id: string;
  bid_id: string;
  job_id: string;
  reviewer_id: string;
  handyman_phone: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      jobs: {
        Row: Job;
        Insert: Omit<Job, "id" | "created_at">;
        Update: Partial<Omit<Job, "id" | "created_at">>;
        Relationships: [];
      };
      bids: {
        Row: Bid;
        Insert: Omit<Bid, "id" | "created_at" | "bidder_id"> & {
          bidder_id?: string | null;
        };
        Update: Partial<Omit<Bid, "id" | "created_at">>;
        Relationships: [];
      };
      ratings: {
        Row: Rating;
        Insert: Omit<Rating, "id" | "created_at">;
        Update: Partial<Omit<Rating, "id" | "created_at">>;
        Relationships: [];
      };
      verified_handymen: {
        Row: VerifiedHandyman;
        Insert: Omit<VerifiedHandyman, "created_at">;
        Update: Partial<Omit<VerifiedHandyman, "created_at">>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: {
      property_enum: PropertyType;
      material_enum: MaterialStatus;
      urgency_enum: Urgency;
      completion_time_enum: CompletionTime;
      currency_enum: Currency;
    };
    CompositeTypes: Record<string, never>;
  };
};
