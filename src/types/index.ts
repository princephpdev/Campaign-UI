export interface Schedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface Campaign {
  id?: number;
  type: string;
  startDate: string;
  endDate: string;
  schedules: Schedule[];
}
