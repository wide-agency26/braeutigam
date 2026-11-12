export interface Expert {
  id?: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  avatarUrl: string;
  memberId: string;
  /** When false, public UI hides email/phone (e.g. Francesco). */
  showContact?: boolean;
}

export const EXPERTS: readonly Expert[] = [
  {
    name: "Manuel Wezel",
    title: "Managing Director",
    email: "manuel@braeutigam-gmbh.eu",
    phone: "07141/2996-706",
    avatarUrl: "/images/experts/manuel-wezel.webp",
    memberId: "#706-MW",
  },
  {
    name: "Ralf Schuster",
    title: "Management / Project Management",
    email: "ralf@braeutigam-gmbh.eu",
    phone: "07141/2996-701",
    avatarUrl: "/images/experts/ralf-schuster.webp",
    memberId: "#701-RS",
  },
  {
    name: "Heiko Euteneuer",
    title: "Head of Design & Quality Management",
    email: "heiko@braeutigam-gmbh.eu",
    phone: "07141/2996-702",
    avatarUrl: "/images/experts/heiko-euteneuer.webp",
    memberId: "#702-HE",
  },
  {
    name: "Igor Stach",
    title: "Head of CNC Department",
    email: "igor@braeutigam-gmbh.eu",
    phone: "07141/2996-712",
    avatarUrl: "/images/experts/igor-stach.webp",
    memberId: "#712-IS",
  },
  {
    name: "Hans Braun",
    title: "Project Management / Production Planning",
    email: "hans@braeutigam-gmbh.eu",
    phone: "07141/2996-708",
    avatarUrl: "/images/experts/hans-braun.webp",
    memberId: "#708-HB",
  },
  {
    name: "Christian Grunert",
    title: "Head of Prepreg Department",
    email: "christian@braeutigam-gmbh.eu",
    phone: "07141/2996-711",
    avatarUrl: "/images/experts/christian-grunert.webp",
    memberId: "#711-CG",
  },
  {
    name: "Boris Sidji",
    title: "Work Preparation Assembly",
    email: "boris@braeutigam-gmbh.eu",
    phone: "07141/2996-715",
    avatarUrl: "/images/experts/boris-sidji.webp",
    memberId: "#715-BS",
  },
  {
    name: "Christian Zinth",
    title: "Quality Management",
    email: "christian.zinth@braeutigam-gmbh.eu",
    phone: "07141/2996-709",
    avatarUrl: "/images/experts/christian-zinth.webp",
    memberId: "#709-CZ",
  },
  {
    name: "Jonas Boxhorn",
    title: "Quality Management",
    email: "jonas@braeutigam-gmbh.eu",
    phone: "07141/2996-709",
    avatarUrl: "/images/experts/jonas-boxhorn.webp",
    memberId: "#709-JB",
  },
  {
    name: "Samuel Schmidt",
    title: "Quality Management",
    email: "samuel@braeutigam-gmbh.eu",
    phone: "07141/2996-709",
    avatarUrl: "/images/experts/samuel-schmidt.webp",
    memberId: "#709-SS",
  },
  {
    name: "Stephan Steiner",
    title: "Technical Purchasing",
    email: "stephan@braeutigam-gmbh.eu",
    phone: "07141/2996-701",
    avatarUrl: "/images/experts/stephan-steiner.webp",
    memberId: "#701-SS",
  },
  {
    name: "Francesco Di Costanzo",
    title: "Administration",
    email: "francesco@braeutigam-gmbh.eu",
    phone: "07141/2996-700",
    avatarUrl: "/images/experts/francesco-di-costanzo.webp",
    memberId: "#700-FD",
    showContact: false,
  },
  {
    name: "Kurt Lander",
    title: "Head of Warehouse & Logistics",
    email: "kurt@braeutigam-gmbh.eu",
    phone: "07141/2996-714",
    avatarUrl: "/images/experts/kurt-lander.webp",
    memberId: "#714-KL",
  },
];
