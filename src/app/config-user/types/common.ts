export type Option = { id: string; label: string };

export interface ReasonModalProp {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleBreakIn: (isBreak: boolean) => void;
}

export const nonWork: Option[] = [
  { id: "meal", label: "Meal break" },
  { id: "ooo", label: "Out of Office" },
  { id: "toilet", label: "Toilet" },
];

export const work: Option[] = [
  { id: "meeting", label: "Meeting" },
  { id: "training", label: "Training" },
  { id: "hr", label: "Called by HR" },
  { id: "other", label: "Other" },
];

export type LogRow = {
 date: string;
  start: string;
  end: string;
  total: string;
  type: string;
  note?: string;
};

