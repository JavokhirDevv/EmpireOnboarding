import Link from "next/link";
import { requireAdmin } from "@/lib/dal";
import { EmpireLogo } from "@/components/logo";
import { logout } from "@/lib/actions/auth";
import { Badge, Button } from "@/components/ui";
import { InlineClock } from "@/components/live-clock";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="flex flex-col flex-1">
      <header className="bg-navy-900 border-b border-navy-800">
        <div className="max-w-6xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link href="/admin">
            <EmpireLogo dark />
          </Link>
          <nav className="flex items-center gap-5">
            <Link
              href="/admin"
              className="text-sm font-medium text-steel-300 hover:text-white"
            >
              Overview
            </Link>
            <Link
              href="/admin/modules"
              className="text-sm font-medium text-steel-300 hover:text-white"
            >
              Modules
            </Link>
            <Link
              href="/admin/trainees"
              className="text-sm font-medium text-steel-300 hover:text-white"
            >
              Dispatchers
            </Link>
            <Link
              href="/admin/resources"
              className="text-sm font-medium text-steel-300 hover:text-white"
            >
              Resources
            </Link>
            <Link
              href="/admin/glossary"
              className="text-sm font-medium text-steel-300 hover:text-white"
            >
              Glossary
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-navy-700">
              <Badge tone="accent">Admin</Badge>
              <span className="text-sm text-steel-300 hidden sm:inline">
                {user.name}
              </span>
              <form action={logout}>
                <Button
                  type="submit"
                  variant="outline"
                  className="text-xs px-3 py-1.5 bg-transparent border-navy-700 text-steel-300 hover:bg-navy-800"
                >
                  Sign out
                </Button>
              </form>
            </div>
            <div className="pl-1">
              <InlineClock />
            </div>
          </nav>
        </div>
      </header>
      <main className="flex-1 bg-surface-muted">{children}</main>
    </div>
  );
}
