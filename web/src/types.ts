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
