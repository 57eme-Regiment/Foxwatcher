import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateLocation, UpdateLocation } from '@57eme-regiment/krang-api-contract';
import { KrangApi } from '@/lib/api-client';

export const LOCATIONS_QUERY_KEY = ['locations'] as const;

export function useLocations() {
  return useQuery({
    queryKey: LOCATIONS_QUERY_KEY,
    queryFn: async () => {
      const res = await KrangApi.location.getAll();
      if (res.status !== 200) throw new Error('Failed to fetch locations');
      return res.body;
    },
  });
}

export function useCreateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateLocation) => {
      const res = await KrangApi.location.create({ body });
      if (res.status !== 201) throw new Error('Failed to create location');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY }),
  });
}

export function useUpdateLocation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & UpdateLocation) => {
      const res = await KrangApi.location.update({ params: { id }, body });
      if (res.status !== 200) throw new Error('Failed to update location');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: LOCATIONS_QUERY_KEY }),
  });
}
