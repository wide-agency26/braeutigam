export const MAX_RESUME_BYTES = 4 * 1024 * 1024;

export const RESUME_ERRORS = {
  type: "Bitte laden Sie nur eine PDF- oder Word-Datei hoch.",
  size: "Die Datei darf höchstens 4 MB groß sein.",
  empty: "Die Datei ist leer.",
  count: "Bitte laden Sie nur eine Datei hoch.",
  save: "Die Bewerbung konnte nicht gespeichert werden. Bitte versuchen Sie es erneut.",
  rate: "Zu viele Bewerbungen. Bitte versuchen Sie es in einer Stunde erneut.",
} as const;


const RESUME_ERRORS_EN = {
  type: "Please upload a PDF or Word file.",
  size: "The file must be no larger than 4 MB.",
  empty: "Please choose a file that is not empty.",
  count: "Please upload only one file.",
  save: "Your application could not be saved. Please try again.",
  rate: "Too many applications. Please try again in an hour.",
} as const;

export function resumeErrors(locale: "de" | "en") {
  return locale === "en" ? RESUME_ERRORS_EN : RESUME_ERRORS;
}
