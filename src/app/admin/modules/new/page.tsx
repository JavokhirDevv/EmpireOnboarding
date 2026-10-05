import { createModule } from "@/lib/actions/modules";
import { requireAdminScope } from "@/lib/dal";
import { Button, Card, FieldLabel, inputClass } from "@/components/ui";

export default async function NewModulePage({
  searchParams,
}: {
  searchParams: Promise<{ department?: string }>;
}) {
  const { scope } = await requireAdminScope();
  const { department } = await searchParams;
  const defaultDepartment =
    scope ??
    (["DISPATCH", "TRACKING", "HR"].includes(department ?? "") ? department! : "DISPATCH");

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-navy-900 mb-1">New training module</h1>
      <p className="text-steel-500 mb-8">
        Content supports Markdown — headings, bold, lists, and tables.
      </p>

      <Card className="p-7">
        <form action={createModule} className="space-y-5">
          <div>
            <FieldLabel htmlFor="title">Title</FieldLabel>
            <input
              id="title"
              name="title"
              required
              className={inputClass}
              placeholder="e.g. Understanding Trailer Types"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="department">Department</FieldLabel>
              <select
                id="department"
                name="department"
                defaultValue={defaultDepartment}
                className={inputClass}
              >
                <option value="DISPATCH">Dispatch</option>
                <option value="TRACKING">Tracking</option>
                <option value="HR">HR</option>
              </select>
            </div>
            <div>
              <FieldLabel htmlFor="category">Category</FieldLabel>
              <input
                id="category"
                name="category"
                required
                className={inputClass}
                placeholder="e.g. Equipment & Trailers"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="summary">Short summary</FieldLabel>
              <input
                id="summary"
                name="summary"
                required
                className={inputClass}
                placeholder="One sentence shown on the dashboard card"
              />
            </div>
            <div>
              <FieldLabel htmlFor="estMinutes">Est. minutes</FieldLabel>
              <input
                id="estMinutes"
                name="estMinutes"
                type="number"
                min={1}
                defaultValue={10}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="content">Content (Markdown)</FieldLabel>
            <textarea
              id="content"
              name="content"
              required
              rows={16}
              className={`${inputClass} font-mono text-[13px] leading-relaxed`}
              placeholder={"## Overview\n\nWrite the training content here..."}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 items-end">
            <div>
              <FieldLabel htmlFor="order">Display order</FieldLabel>
              <input
                id="order"
                name="order"
                type="number"
                defaultValue={0}
                className={inputClass}
              />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium text-navy-800 pb-2.5">
              <input type="checkbox" name="published" defaultChecked />
              Published (visible to trainees)
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="submit" variant="primary">
              Create module
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
