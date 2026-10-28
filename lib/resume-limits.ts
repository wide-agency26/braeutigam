export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

export const RESUME_ERRORS = {
  type: "Bitte laden Sie nur eine PDF- oder Word-Datei hoch.",
  size: "Die Datei darf höchstens 4 MB groß sein.",
  empty: "Die Datei ist leer.",
  count: "Bitte laden Sie nur eine Datei hoch.",
  save: "Die Bewerbung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
  rate: "Zu viele Bewerbungen. Bitte versuchen Sie es in einer Stunde erneut.",
} as const;
