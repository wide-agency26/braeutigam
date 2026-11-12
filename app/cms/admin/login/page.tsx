import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <div className="desk-login">
      <p className="desk-meta">Bräutigam</p>
      <h1>Website CMS</h1>
      <p className="desk-lede">
        Sign in to manage jobs, applications, team members, page videos, and
        Instagram reels.
      </p>
      <LoginForm />
      <p className="desk-meta">
        Public careers page: <Link href="/karriere">/karriere</Link>
      </p>
    </div>
  );
}
