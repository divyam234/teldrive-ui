import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "@/hooks/useAuth";

export default function Auth({ children }) {
  const router = useRouter();

  const [session, loading] = useSession();

  const isUser = !!session?.username;

  if (loading) null;

  useEffect(() => {
    if (!isUser && !loading) router.replace("/login");
  }, [isUser, loading, router]);

  if (isUser) {
    return children;
  }
  return null;
}