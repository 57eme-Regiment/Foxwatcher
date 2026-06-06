import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@57eme-regiment/nabu-ui';
import { Button } from '@57eme-regiment/nabu-ui';
import { Field, FieldError, FieldLabel } from '@57eme-regiment/nabu-ui';
import { Input } from '@57eme-regiment/nabu-ui';
import { HttpError } from '@/lib/http-error';
import { WanApi } from '@/lib/api-client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  discordRoleId: z.string().min(1, 'Le Discord Role ID est requis'),
});

type FormData = z.infer<typeof schema>;

interface CreateDiscordMappingDialogProps {
  roleKey: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDiscordMappingDialog({
  roleKey,
  open,
  onOpenChange,
}: CreateDiscordMappingDialogProps) {
  const qc = useQueryClient();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const createMapping = useMutation({
    mutationFn: async (data: FormData) => {
      const res = await WanApi.adminDiscordMapping.createMapping({
        body: {
          discordRoleId: data.discordRoleId,
          roleKey,
          guildId: import.meta.env.VITE_DISCORD_SERVER_ID ?? '',
        },
      });
      if (res.status !== 201) throw new HttpError(res.status, 'Failed to create mapping');
      return res.body;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'discord-mappings'] });
      onOpenChange(false);
    },
  });

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(data => createMapping.mutate(data))}>
          <AlertDialogHeader>
            <AlertDialogTitle>Nouveau mapping Discord</AlertDialogTitle>
          </AlertDialogHeader>

          <div className="flex flex-col gap-4 py-4">
            <Field>
              <FieldLabel htmlFor="mapping-role">Discord Role ID</FieldLabel>
              <Input
                id="mapping-role"
                placeholder="ex: 987654321098765432"
                autoFocus
                disabled={createMapping.isPending}
                {...register('discordRoleId')}
              />
              <FieldError errors={[errors.discordRoleId]} />
            </Field>

            {createMapping.error && (
              <p className="text-sm text-destructive">{createMapping.error.message}</p>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => onOpenChange(false)}
              disabled={createMapping.isPending}
            >
              Annuler
            </AlertDialogCancel>
            <Button type="submit" disabled={createMapping.isPending}>
              {createMapping.isPending ? 'Création...' : 'Créer'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
