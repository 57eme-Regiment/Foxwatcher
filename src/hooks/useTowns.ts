import { KrangApi } from '@/lib/api-client';
import type {
  CreateTown,
  UpdateTown,
} from '@57eme-regiment/krang-api-contract';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const TOWNS_QUERY_KEY = ['towns'] as const;

export function useTowns() {
  return useQuery({
    queryKey: TOWNS_QUERY_KEY,
    queryFn: async () => {
      const res = await KrangApi.town.getAll();
      if (res.status !== 200) throw new Error('Failed to fetch towns');
      return res.body;
    },
  });
}

export function useCreateTown() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateTown) => {
      const res = await KrangApi.town.create({ body });
      if (res.status !== 201) throw new Error('Failed to create town');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TOWNS_QUERY_KEY }),
  });
}

export function useUpdateTown() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & UpdateTown) => {
      const res = await KrangApi.town.update({ params: { id }, body });
      if (res.status !== 200) throw new Error('Failed to update town');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: TOWNS_QUERY_KEY }),
  });
}
