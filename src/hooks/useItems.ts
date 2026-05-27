import { KrangApi } from '@/lib/krangApi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { CreateItem, UpdateItem } from '@57em-regiment/krang-api-contract';

export const ITEMS_QUERY_KEY = ['items'] as const;

export function useItems() {
  return useQuery({
    queryKey: ITEMS_QUERY_KEY,
    queryFn: async () => {
      const res = await KrangApi.item.getAll();
      if (res.status !== 200) throw new Error('Failed to fetch items');
      return res.body;
    },
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateItem) => {
      const res = await KrangApi.item.create({ body });
      if (res.status !== 201) throw new Error('Failed to create item');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ITEMS_QUERY_KEY }),
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...body }: { id: string } & UpdateItem) => {
      const res = await KrangApi.item.update({ params: { id }, body });
      if (res.status !== 200) throw new Error('Failed to update item');
      return res.body;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ITEMS_QUERY_KEY }),
  });
}
