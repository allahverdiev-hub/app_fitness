export type AddSetSheetDefaults = {
  reps: number;
  weightKg: number;
  weightGrams: number;
};

export type AddSetFormValues = {
  reps: number;
  weightKg: number;
  weightGrams: number;
  note: string;
};

export type LoggedSet = AddSetFormValues & {
  setNumber: number;
};
