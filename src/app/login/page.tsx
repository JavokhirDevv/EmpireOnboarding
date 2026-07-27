import { EmpireLogo } from "@/components/logo";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex-1 flex items-center justify-center bg-surface-muted px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <EmpireLogo />
        </div>
        <div className="bg-surface border border-border-subtle rounded-xl shadow-sm p-7">
          <h1 className="text-xl font-bold text-navy-900 mb-1">Sign in</h1>
          <p className="text-sm text-steel-500 mb-6">
            Use the credentials provided by your onboarding administrator.
          </p>
          <LoginForm />
        </div>
        <p className="text-center text-xs text-steel-500 mt-6">
          Trouble signing in? Contact your dispatch supervisor.
        </p>
      </div>
    </div>
  );
}
