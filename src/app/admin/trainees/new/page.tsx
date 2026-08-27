import { NewTraineeForm } from "./new-trainee-form";
import { Card } from "@/components/ui";

const ROLE_FOR_DEPARTMENT: Record<string, string> = {
  DISPATCH: "DISPATCHER",
  TRACKING: "TRACKING",
  HR: "HR",
};

export default async function NewTraineePage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>;
}) {
  const { department } = await searchParams;
  const defaultDepartment = ROLE_FOR_DEPARTMENT[department ?? ""] ?? "DISPATCHER";

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-navy-900 mb-1">New trainee account</h1>
      <p className="text-steel-500 mb-8">
        Share the email and temporary password with the new hire directly —
        there is no public sign-up.
      </p>
      <Card className="p-7">
        <NewTraineeForm defaultDepartment={defaultDepartment} />
      </Card>
    </div>
  );
}
