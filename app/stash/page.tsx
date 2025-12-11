import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import StashList from "@/components/StashList";

export default async function StashPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    redirect("/api/auth/signin?callbackUrl=/stash");
  }

  return (
    <div className="min-h-screen bg-purple-50 p-8 dark:bg-black font-sans">
      <div className="mx-auto max-w-6xl">
        <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
          <StashList />
        </Suspense>
      </div>
    </div>
  );
}
