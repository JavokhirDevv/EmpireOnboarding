import { NewDispatcherForm } from "./new-dispatcher-form";
import { Card } from "@/components/ui";

export default function NewDispatcherPage() {
  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-navy-900 mb-1">New dispatcher account</h1>
      <p className="text-steel-500 mb-8">
        Share the email and temporary password with the new hire directly —
        there is no public sign-up.
      </p>
      <Card className="p-7">
        <NewDispatcherForm />
      </Card>
    </div>
  );
}
