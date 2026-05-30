import { KrangApi } from '@/lib/api-client';
import type { CreateRegion, UpdateRegion } from '@57eme-regiment/krang-api-contract';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const REGIONS_QUERY_KEY = ['regions'] as const;

export function useRegions() {
  return useQuery({
    queryKey: REGIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await KrangApi.region.getAll();
      if (res.status !== 200) throw new Error('Failed to fetch regions');
      return res.body;
    },
  });
}

export function useCreateRegion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateRegion) => {
      const res = await KrangApi.region.create({ body });
      if (res.status !== 201) throw new Error('Failed to create region');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: REGIONS_QUERY_KEY }),
  });
}

export function useUpdateRegion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & UpdateRegion) => {
      const res = await KrangApi.region.update({ params: { id }, body });
      if (res.status !== 200) throw new Error('Failed to update region');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: REGIONS_QUERY_KEY }),
  });
}
