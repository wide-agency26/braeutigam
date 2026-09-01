import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="desk-login">
      <p className="desk-meta">Bräutigam</p>
      <h1>Job desk</h1>
      <p className="desk-lede">
        Sign in to post jobs and read applications. This area is not part of the
        public website.
      </p>
      <LoginForm />
      <p className="desk-meta">
        Public careers page: <Link href="/karriere">/karriere</Link>
      </p>
    </div>
  );
}
