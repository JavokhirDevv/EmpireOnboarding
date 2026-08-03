import { Card } from "@/components/ui";
import { NewAudioLessonForm } from "./new-audio-form";

export default function NewAudioLessonPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-navy-900 mb-1">New audio lesson</h1>
      <p className="text-steel-500 mb-8">
        Upload a recording, then add a knowledge-check quiz once it&apos;s saved.
      </p>

      <Card className="p-7">
        <NewAudioLessonForm />
      </Card>
    </div>
  );
}
