import type { ApplyDictionary, ChromeDictionary, JobDetailDictionary } from "./types";

export const chromeEn: ChromeDictionary = {
  skipLink: "Skip to main content",
  menuToggle: "Toggle navigation menu",
  home: "Home",
  theme: "Toggle color mode",
};

export const applyEn: ApplyDictionary = {
  received: "Received",
  successTitle: "Application is on the desk",
  successBody: (jobTitle) =>
    `We logged your file for ${jobTitle}. The team reads every application that lands here.`,
  eyebrow: "Apply",
  title: "Send your file",
  firstName: "First name",
  lastName: "Last name",
  email: "Email",
  phone: "Phone",
  coverLetter: "Cover letter",
  recommended: "I was recommended",
  recommender: "Name of the person who recommended me",
  resume: "Resume (PDF or Word, max 4 MB)",
  submit: "Submit application",
  submitting: "Sending",
};

export const jobDetailEn: JobDetailDictionary = {
  role: "Role",
  requirements: "Requirements",
  allOpenings: "← All openings",
  location: "LOCATION",
};
