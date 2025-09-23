import { challenges } from "@/lib/data";
import { notFound } from "next/navigation";
import { CodeIdeView } from "@/components/code-ide-view";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Backend Mentor - Code Editor",
    description: "The Backend Mentor code editor, a full-featured, web-based IDE for backend development challenges.",
};

export default function Page({ params }: { params: { slug: string } }) {
  const challenge = challenges.find((c) => c.slug === params.slug);

  if (!challenge) {
    notFound();
  }

  return <CodeIdeView challenge={challenge} />;
}

export async function generateStaticParams() {
    return challenges.map((challenge) => ({
      slug: challenge.slug,
    }));
}
