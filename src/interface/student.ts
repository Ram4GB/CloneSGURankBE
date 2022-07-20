export interface IStudent {
  id: string;
  semester: string;
  accumulatedCreditsRaw: string;
  creditsRaw: string;
  aveAccumulatedType4Raw: string;
  aveAccumulatedType10Raw: string;
  aveSemesterType4Raw: string;
  aveSemesterType10Raw: string;
  isError: boolean;
  [key: string]: string | boolean;
}