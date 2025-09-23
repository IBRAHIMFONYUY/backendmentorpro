import { challenges } from "@/lib/data";
import { notFound } from "next/navigation";
import { CodeIdeView } from "@/components/code-ide-view";

export default function Page({ params }: { params: { slug: string } }) {
  const challenge = challenges.find((c) => c.slug === params.slug);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="fixed inset-0 bg-background">
     <CodeIdeView challenge={challenge} />
    </div>
  );
}

export async function generateStaticParams() {
    return challenges.map((challenge) => ({
      slug: challenge.slug,
    }));
}
