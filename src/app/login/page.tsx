import { EmpireLogo } from "@/components/logo";
import { LoginForm } from "./login-form";
import { ThemeToggle } from "@/components/theme-toggle";

export default function LoginPage() {
  return (
    <div className="relative flex-1 flex items-center justify-center bg-surface-muted px-4 py-10">
      <ThemeToggle className="absolute top-4 right-4" />
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <EmpireLogo />
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl shadow-sm p-7">
          <h1 className="text-xl font-bold text-content mb-1">Sign in</h1>
          <p className="text-sm text-content-muted mb-6">
            Use the credentials provided by your onboarding administrator.
          </p>
          <LoginForm />
        </div>
        <p className="text-center text-xs text-content-muted mt-6">
          Trouble signing in? Contact your dispatch supervisor.
        </p>
      </div>
    </div>
  );
}
