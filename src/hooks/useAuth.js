import http from "@/utils/http"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/router"

export async function fetchSession() {
  const session = (await http.get('/api/auth/session')).data
  if (Object.keys(session).length) {
    return session
  }
  return null
}

export function useSession({
  required = true,
  redirectTo = "/login",
  queryConfig = {
    staleTime: 60 * 1000 * 60 * 3,
    refetchInterval: 60 * 1000 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 0
  },
} = {}) {
  const router = useRouter()
  const query = useQuery(["session"], fetchSession, {
    ...queryConfig,
    onSettled(data, error) {
      if (queryConfig.onSettled) queryConfig.onSettled(data, error)
      if (data || !required) return
      router.push(redirectTo)
    },
  })
  return [query.data, query.status === "loading"]
}