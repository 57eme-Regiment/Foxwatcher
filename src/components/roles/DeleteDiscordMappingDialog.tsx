import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { HttpError } from '@/lib/http-error';
import { WanApi } from '@/lib/api-client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { AdminDiscordMapping } from './roles.schema';

interface DeleteDiscordMappingDialogProps {
  mapping: AdminDiscordMapping | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteDiscordMappingDialog({
  mapping,
  open,
  onOpenChange,
}: DeleteDiscordMappingDialogProps) {
  const qc = useQueryClient();

  const deleteMapping = useMutation({
    mutationFn: async (id: string) => {
      const res = await WanApi.adminDiscordMapping.deleteMapping({ params: { id } });
      if (res.status !== 204) throw new HttpError(res.status, 'Failed to delete mapping');
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'discord-mappings'] });
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Supprimer le mapping</AlertDialogTitle>
          <AlertDialogDescription>
            Supprimer le mapping Discord{' '}
            <span className="font-mono text-foreground">{mapping?.discordRoleId}</span>{' '}
            → rôle{' '}
            <span className="font-semibold text-foreground">{mapping?.role.name}</span> ?
            Cette action est irréversible.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteMapping.isPending}>
            Annuler
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={deleteMapping.isPending || !mapping}
            onClick={() => mapping && deleteMapping.mutate(mapping.id)}
          >
            {deleteMapping.isPending ? 'Suppression...' : 'Supprimer'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
