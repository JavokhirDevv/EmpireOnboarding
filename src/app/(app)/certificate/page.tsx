import { redirect } from "next/navigation";
import { requireUser } from "@/lib/dal";
import { getTraineeProgress, departmentForRole, DEPARTMENT_LABELS } from "@/lib/progress";
import { Card, LinkButton, ProgressBar } from "@/components/ui";
import { EmpireLogo } from "@/components/logo";
import { PrintButton } from "./print-button";

export default async function CertificatePage() {
  const user = await requireUser();
  const department = departmentForRole(user.role);
  if (!department) redirect("/admin");
  const { modules, total, completed, percent, allComplete } =
    await getTraineeProgress(user.id, department);

  if (!allComplete) {
    return (
      <div className="max-w-xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold text-navy-900 mb-2">
          Certificate locked
        </h1>
        <p className="text-steel-500 mb-6">
          Finish every training module and pass its quiz to unlock your
          completion certificate.
        </p>
        <Card className="p-6 mb-6">
          <div className="text-sm text-steel-500 mb-2">
            {completed} of {total} modules complete
          </div>
          <ProgressBar percent={percent} />
        </Card>
        <LinkButton href="/dashboard" variant="primary">
          Continue training
        </LinkButton>
      </div>
    );
  }

  const completionDate = modules
    .map((m) => m.completedAt)
    .filter((d): d is Date => !!d)
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <div className="certificate-page max-w-3xl mx-auto px-6 py-12">
      <div className="print-hide flex justify-end mb-4">
        <PrintButton />
      </div>
      <div className="certificate-sheet bg-surface border-4 border-gold-500 rounded-2xl p-12 text-center relative overflow-hidden">
        <div className="absolute inset-0 border-[10px] border-gold-400/20 rounded-2xl pointer-events-none" />
        <div className="flex justify-center mb-8">
          <EmpireLogo />
        </div>
        <div className="text-xs font-semibold tracking-[0.25em] uppercase text-gold-600 mb-3">
          Certificate of Completion
        </div>
        <h1 className="text-3xl font-bold text-navy-900 mb-2">{user.name}</h1>
        <p className="text-steel-500 mb-8">
          has successfully completed the Empire National {DEPARTMENT_LABELS[department]}{" "}
          Onboarding Program.
        </p>
        <div className="grid grid-cols-2 gap-6 max-w-sm mx-auto text-sm">
          <div>
            <div className="text-steel-500">Modules completed</div>
            <div className="font-semibold text-navy-900">{total} / {total}</div>
          </div>
          <div>
            <div className="text-steel-500">Date</div>
            <div className="font-semibold text-navy-900">
              {completionDate
                ? new Intl.DateTimeFormat("en-US", {
                    dateStyle: "long",
                  }).format(completionDate)
                : "—"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
