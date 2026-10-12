export interface Member {
  id: string;
  tripId: string;
  name: string;
  createdAt: string;
}

export interface Trip {
  id: string;
  name: string;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
  members: Member[];
}

export interface TripListItem {
  id: string;
  name: string;
  currency: string;
  startDate: string | null;
  endDate: string | null;
  createdAt: string;
  _count: { members: number; expenses: number };
}

export type Category = "FOOD" | "STAY" | "TRAVEL" | "FUN" | "OTHER";
export type SplitType = "EQUAL" | "EXACT" | "SHARES";

export interface ExpenseShare {
  memberId: string;
  amount: number;
  shares: number | null;
}

export interface Expense {
  id: string;
  tripId: string;
  description: string;
  amount: number;
  category: Category;
  splitType: SplitType;
  paidById: string;
  spentAt: string;
  createdAt: string;
  updatedAt: string;
  paidBy: { id: string; name: string };
  shares: ExpenseShare[];
}

export interface Settlement {
  id: string;
  tripId: string;
  fromMemberId: string;
  toMemberId: string;
  amount: number;
  settledAt: string;
}

export interface MemberSummary {
  id: string;
  name: string;
  paid: number;
  share: number;
  balance: number;
}

export interface SuggestedPayment {
  fromMemberId: string;
  toMemberId: string;
  amount: number;
}

export interface TripSummary {
  tripId: string;
  currency: string;
  totalSpent: number;
  members: MemberSummary[];
  suggestedPayments: SuggestedPayment[];
  settlements: Settlement[];
}
