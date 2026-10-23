export type Option = { value: string; label: string };

export type Wedding = {
    id: number;
    partner_one_name: string | null;
    partner_two_name: string | null;
    wedding_date: string | null;
    budget_ceiling: number | null;
    currency: string;
    advisor_summary: string | null;
    advisor_generated_at: string | null;
};

export type Category = { id: number; name: string };

export type Payment = {
    id: number;
    amount: number;
    paid_on: string;
    method: string | null;
    note: string | null;
};

export type BudgetItem = {
    id: number;
    category_id: number | null;
    vendor_id: number | null;
    vendor: { id: number; name: string } | null;
    title: string;
    estimated_amount: number;
    actual_amount: number | null;
    paid: number;
    status: string;
    due_date: string | null;
    notes: string | null;
    payments: Payment[];
};

export type BudgetSummary = {
    ceiling: number | null;
    plannedTotal: number;
    actualTotal: number;
    paidTotal: number;
    remainingTotal: number;
    consideringTotal: number;
    projectedTotal: number;
    variance: number | null;
    projectedVariance: number | null;
    committedCount: number;
    consideringCount: number;
    byCategory: Record<
        string,
        { planned: number; actual: number; paid: number; considering: number }
    >;
};

export type Vendor = {
    id: number;
    category_id: number | null;
    category: string | null;
    name: string;
    phone: string | null;
    email: string | null;
    website: string | null;
    instagram: string | null;
    quoted_price: number | null;
    status: string;
    rating: number | null;
    pros: string | null;
    cons: string | null;
    notes: string | null;
    budget_items_count: number;
};

export type Inspiration = {
    id: number;
    title: string;
    url: string;
    category: string | null;
    thumbnail_url: string | null;
    notes: string | null;
};

export type Guest = {
    id: number;
    name: string;
    side: string;
    group: string | null;
    phone: string | null;
    email: string | null;
    invited: boolean;
    rsvp_status: string;
    plus_one: boolean;
    plus_one_name: string | null;
    notes: string | null;
};

export type Task = {
    id: number;
    title: string;
    category: string | null;
    due_date: string | null;
    is_done: boolean;
    notes: string | null;
};

export type TimelineEvent = {
    id: number;
    start_time: string;
    title: string;
    location: string | null;
    responsible: string | null;
    vendor_id: number | null;
    vendor: string | null;
    notes: string | null;
};

export type SeatGuest = {
    id: number;
    name: string;
    plus_one: boolean;
    seats: number;
};

export type SeatingTable = {
    id: number;
    name: string;
    capacity: number;
    shape: string | null;
    notes: string | null;
    guests: SeatGuest[];
    seats_used: number;
};

export type DrinkPlan = {
    guest_count: number | null;
    duration_hours: number;
    event_type: string;
    mix: { beer: number; wine: number; spirits: number; non_alcoholic: number };
    include_toast: boolean;
    notes: string | null;
};
