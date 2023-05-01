import { useRouter } from "next/router";
import { useSession } from "@/hooks/useAuth";

export default function withAuth(Component) {

  return function AuthCOmponent() {

    const router = useRouter()

    const { asPath, pathname } = router

    const { session } = useSession();

    if (session)
      return <Component />

    else if (!session || (asPath === pathname))
      return null
  }

}