export interface Trip {
  id: string;
  destination: string;
  budget: number;
  startDate: string;
  endDate: string;
  createdAt: string;
}

export interface CreateTripInput {
  destination: string;
  budget: number;
  startDate: string;
  endDate: string;
}
