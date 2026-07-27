import { prisma } from "@/lib/prisma";
import { Badge, Card } from "@/components/ui";
import { formatFileSize, fileKindLabel } from "@/lib/format";

export default async function ResourcesPage() {
  const resources = await prisma.resource.findMany({
    orderBy: [{ category: "asc" }, { createdAt: "desc" }],
  });

  const categories = Array.from(new Set(resources.map((r) => r.category)));

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-900">Resource library</h1>
        <p className="text-steel-500 mt-1">
          Reference documents and images shared by the onboarding team — policies,
          forms, equipment photos, and more.
        </p>
      </div>

      {resources.length === 0 && (
        <Card className="p-8 text-center text-steel-500">
          No resources have been uploaded yet.
        </Card>
      )}

      {categories.map((category) => (
        <div key={category} className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-steel-500 mb-3">
            {category}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {resources
              .filter((r) => r.category === category)
              .map((r) => (
                <a
                  key={r.id}
                  href={`/api/resources/${r.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Card className="p-5 h-full hover:border-accent-400 transition-colors">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="font-semibold text-navy-900">{r.title}</h3>
                      <Badge tone="accent">{fileKindLabel(r.mimeType)}</Badge>
                    </div>
                    {r.description && (
                      <p className="text-sm text-steel-500 leading-relaxed mb-2">
                        {r.description}
                      </p>
                    )}
                    <p className="text-xs text-steel-500">
                      {r.fileName} · {formatFileSize(r.sizeBytes)}
                    </p>
                  </Card>
                </a>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
