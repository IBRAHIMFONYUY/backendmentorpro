
import { challenges } from "@/lib/data";
import { notFound } from "next/navigation";
import { CodeIdeView } from "@/components/code-ide-view";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug
  const challenge = challenges.find((c) => c.slug === slug);

  if (!challenge) {
    return {
      title: "Challenge Not Found",
    }
  }
 
  return {
    title: `Challenge: ${challenge.title} - BackendMentorAI`,
    description: `Solve the ${challenge.title} challenge in our interactive IDE. ${challenge.description}`,
  }
}

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
