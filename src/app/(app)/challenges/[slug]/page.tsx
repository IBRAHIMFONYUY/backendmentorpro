import { challenges } from "@/lib/data";
import { notFound } from "next/navigation";
import { ChallengeView } from "@/components/challenge-view";

export default function Page({ params }: { params: { slug: string } }) {
  const challenge = challenges.find((c) => c.slug === params.slug);

  if (!challenge) {
    notFound();
  }

  return <ChallengeView challenge={challenge} />;
}

export async function generateStaticParams() {
    return challenges.map((challenge) => ({
      slug: challenge.slug,
    }));
}
