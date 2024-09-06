export interface Activity {
  id: number;
  userId: number;
  activityType: string;
  duration: number;
  intensity: string;
  result: number;
  logDate: Date;
}
