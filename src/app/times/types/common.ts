import { Id } from "../../../../convex/_generated/dataModel";

export type Option = { id: string; label: string };

export interface ReasonModalProp {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleBreakIn: (isBreak: boolean, reason: string, type: string) => void;
}

export const nonWork: Option[] = [
  { id: "meal_break", label: "Meal break" },
  { id: "out_of_office", label: "Out of Office" },
  { id: "toilet", label: "Toilet" },
];

export const work: Option[] = [
  { id: "meeting", label: "Meeting" },
  { id: "training", label: "Training" },
  { id: "called_by_hr", label: "Called by HR" },
  { id: "other", label: "Other" },
];
export type LogRow = {
  id:  Id<"userActivity">;
  type: "checkin" | "checkout" | "breakin" | "breakout";
  breakType?: string;
  timestamp?: number;
  start?: number;
  end?: number;
  reason?: string;
};
