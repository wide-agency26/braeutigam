export type ChromeDictionary = {
  skipLink: string;
  menuToggle: string;
  home: string;
  theme: string;
};

export type ApplyDictionary = {
  received: string;
  successTitle: string;
  successBody: (jobTitle: string) => string;
  eyebrow: string;
  title: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  coverLetter: string;
  recommended: string;
  recommender: string;
  resume: string;
  submit: string;
  submitting: string;
};

export type JobDetailDictionary = {
  role: string;
  requirements: string;
  allOpenings: string;
  location: string;
};

export type Dictionary = {
  chrome: ChromeDictionary;
  apply: ApplyDictionary;
  jobDetail: JobDetailDictionary;
};
