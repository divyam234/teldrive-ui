import http from "@/utils/http"
import { useQuery } from "@tanstack/react-query"
import Router from "next/router";

export async function fetchSession() {
  try {
    return (await http.get('/api/auth/session')).data
  }
  catch {
    return null
  }
}

export function useSession({
  required = true,
  redirectTo = "/login",
  queryConfig = {
    staleTime: 60 * 1000 * 60 * 3,
    refetchInterval: 60 * 1000 * 5,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
} = {}) {
  const query = useQuery(["session"], fetchSession, {
    ...queryConfig,
    onSettled(data, error) {
      if (queryConfig.onSettled) queryConfig.onSettled(data, error)
      if (data || !required) return
      Router.replace(redirectTo)
    },
  })
  return { session: query.data, loading: query.status === "loading" }
}