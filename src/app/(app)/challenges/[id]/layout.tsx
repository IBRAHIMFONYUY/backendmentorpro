
"use client";
import { usePathname } from 'next/navigation';

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  
  if (pathname.startsWith('/challenges/')) {
    return <div className="h-screen w-screen bg-dark-bg">{children}</div>;
  }

  return <>{children}</>;
}
