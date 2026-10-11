export type MemberId = string;

/** How much one member owes for one expense, in paise. */
export interface ShareAmount {
  memberId: MemberId;
  amount: number;
}

export interface ExpenseInput {
  paidById: MemberId;
  amount: number;
  shares: ShareAmount[];
}

export interface SettlementInput {
  fromMemberId: MemberId;
  toMemberId: MemberId;
  amount: number;
}

export interface Payment {
  from: MemberId;
  to: MemberId;
  amount: number;
}