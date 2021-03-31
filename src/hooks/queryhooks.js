import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import http from "../utils/http";
import { realPath } from "@/utils/common";

export const useFetchItems = (queryParams) => {
  const { key, path, type, enabled } = queryParams
  const sort_order = JSON.parse(localStorage.getItem('sortOrder')) || 'asc'
  const queryKey = [key, path, type, sort_order]
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isError,
  } = useInfiniteQuery(
    queryKey,
    fetchData(path, type, sort_order),
    {
      getNextPageParam: (lastPage, allPages) =>
        allPages.length + 1 <= lastPage?.meta?.[0]?.total_pages
          ? allPages.length + 1
          : undefined,
      staleTime: 5 * 60 * 1000,
      enabled,
    }
  );

  return {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    refetch,
    isError,
  };
};

const fetchData =
  (path, type, order) =>
    async ({ pageParam = 1 }) => {
      let url = '/api/files'
      const limit = 100;
      const params = {
        page: pageParam,
        per_page: limit,
        order
      }

      if (type === "my-drive") {
        params.path = realPath(path)
        params.sort = 'name'
      }

      if (type === "search") {
        params.sort = 'name'
        params.search = path?.[1] ?? ''
      }
      if (type === 'search' && !params.search) return []

      if (type === 'recent' || type == 'starred') return []

      let res = await http.get(url, { params });
      return res.data;
    };

export const useCreateFile = () => {
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async data => {
      return (await http.post(`/api/files`, data.payload)).data
    },
    onSuccess: (data, variables, context) => {
      if (data.file_id) queryClient.invalidateQueries('files')
    }
  })
  return { mutation }
}

export const useUpdateFile = (queryParams) => {
  const { key, path, type } = queryParams
  const sort_order = JSON.parse(localStorage.getItem('sortOrder')) || 'asc'
  const queryKey = [key, path, type, sort_order]
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async data => {
      return (await http.patch(`/api/files/${data.id}`, data.payload)).data
    },
    mutationKey: queryKey,
    onMutate: async () => {
      await queryClient.cancelQueries('files')
      const previousFiles = queryClient.getQueryData(queryKey)
      return { previousFiles }
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(queryKey, context.previousFiles)
    },
    onSuccess: (data, variables, context) => {
      if (data.status) {
        queryClient.setQueryData(queryKey, prev => {
          return {
            ...prev,
            pages: prev.pages.map(page => ({
              ...page,
              results: page.results.map(val =>
                val.file_id === variables.id ? { ...val, ...variables.payload } : val)
            }))
          }
        })
      }
    }
  })
  return { mutation }
}

export const useDeleteFile = (queryParams) => {
  const { key, path, type } = queryParams
  const sort_order = JSON.parse(localStorage.getItem('sortOrder')) || 'asc'
  const queryKey = [key, path, type, sort_order]
  const queryClient = useQueryClient()
  const mutation = useMutation({
    mutationFn: async data => {
      return (await http.delete(`/api/files/${data.id}`)).data
    },
    mutationKey: queryKey,
    onMutate: async () => {
      await queryClient.cancelQueries('files')
      const previousFiles = queryClient.getQueryData(queryKey)
      return { previousFiles }
    },
    onError: (err, file_id, context) => {
      queryClient.setQueryData(queryKey, context.previousFiles)
    },
    onSuccess: (data, file_id, context) => {
      if (data.status) {
        queryClient.setQueryData(queryKey, prev => {
          return {
            ...prev,
            pages: prev.pages.map(page => ({
              ...page,
              results: page.results.filter(val => val.file_id !== file_id)
            }))
          }
        })
      }
    }
  })
  return { mutation }
}