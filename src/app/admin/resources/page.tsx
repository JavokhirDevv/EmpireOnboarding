import { prisma } from "@/lib/prisma";
import { deleteResource } from "@/lib/actions/resources";
import { Badge, Card } from "@/components/ui";
import { formatFileSize, fileKindLabel } from "@/lib/format";
import { UploadResourceForm } from "./upload-resource-form";

export default async function AdminResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: [{ category: "asc" }, { createdAt: "desc" }],
  });

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Resource library</h1>
        <p className="text-steel-500">
          Upload PDFs and images for dispatchers — policies, forms, equipment
          reference photos, and more. Visible to every dispatcher at{" "}
          <code className="text-xs">/resources</code>.
        </p>
      </div>

      <div className="grid md:grid-cols-[1fr_1.4fr] gap-6 items-start">
        <Card className="p-6">
          <h2 className="font-semibold text-navy-900 mb-4">Upload a file</h2>
          <UploadResourceForm />
        </Card>

        <Card className="overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-steel-500 bg-surface-muted border-b border-border-subtle">
                <th className="py-3 px-4 font-medium">Title</th>
                <th className="py-3 px-4 font-medium">Category</th>
                <th className="py-3 px-4 font-medium">Type</th>
                <th className="py-3 px-4 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => {
                const deleteResourceWithId = deleteResource.bind(null, r.id);
                return (
                  <tr
                    key={r.id}
                    className="border-b border-border-subtle last:border-0 hover:bg-surface-muted"
                  >
                    <td className="py-3 px-4">
                      <a
                        href={`/api/resources/${r.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-navy-900 hover:text-accent-600"
                      >
                        {r.title}
                      </a>
                      <div className="text-xs text-steel-500">
                        {r.fileName} · {formatFileSize(r.sizeBytes)}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-steel-500">{r.category}</td>
                    <td className="py-3 px-4">
                      <Badge tone="accent">{fileKindLabel(r.mimeType)}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <form action={deleteResourceWithId}>
                        <button
                          type="submit"
                          className="text-xs text-danger-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </td>
                  </tr>
                );
              })}
              {resources.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-8 text-center text-steel-500">
                    No files uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </div>
  );
}
