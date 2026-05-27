import type { Region } from '@57em-regiment/krang-api-contract';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { useCreateRegion, useUpdateRegion } from '@/hooks/useRegions';
import { useState } from 'react';
import { z } from 'zod';

const regionFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  gameRegionId: z.number().int().positive('Must be a positive integer').optional(),
});

type FormData = z.infer<typeof regionFormSchema>;
type FormErrors = Partial<Record<keyof FormData, string>>;

interface RegionFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  region?: Region;
}

export function RegionFormModal({ open, onOpenChange, region }: RegionFormModalProps) {
  const isEdit = !!region;
  const createMutation = useCreateRegion();
  const updateMutation = useUpdateRegion();
  const isPending = createMutation.isPending || updateMutation.isPending;

  async function handleSubmit(data: FormData) {
    if (isEdit) {
      await updateMutation.mutateAsync({ id: region.id, ...data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onOpenChange(false);
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <RegionForm
          key={open ? (region?.id ?? 'new') : 'closed'}
          region={region}
          isPending={isPending}
          onSubmit={handleSubmit}
          onClose={() => onOpenChange(false)}
        />
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface RegionFormProps {
  region?: Region;
  isPending: boolean;
  onSubmit: (data: FormData) => Promise<void>;
  onClose: () => void;
}

function RegionForm({ region, isPending, onSubmit, onClose }: RegionFormProps) {
  const [name, setName] = useState(region?.name ?? '');
  const [gameRegionIdRaw, setGameRegionIdRaw] = useState(
    region?.gameRegionId?.toString() ?? '',
  );
  const [errors, setErrors] = useState<FormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const isEdit = !!region;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    const parsed = regionFormSchema.safeParse({
      name,
      gameRegionId: gameRegionIdRaw === '' ? undefined : Number(gameRegionIdRaw),
    });

    if (!parsed.success) {
      const fieldErrors: FormErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FormErrors;
        if (!fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      await onSubmit(parsed.data);
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'An error occurred');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <AlertDialogHeader>
        <AlertDialogTitle>{isEdit ? 'Edit Region' : 'New Region'}</AlertDialogTitle>
      </AlertDialogHeader>

      <div className="flex flex-col gap-4 py-4">
        <Field>
          <FieldLabel htmlFor="region-name">Name</FieldLabel>
          <Input
            id="region-name"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Region name"
            autoFocus
            disabled={isPending}
          />
          <FieldError errors={[{ message: errors.name }]} />
        </Field>

        <Field>
          <FieldLabel htmlFor="region-gameRegionId">Game Region ID</FieldLabel>
          <Input
            id="region-gameRegionId"
            type="number"
            value={gameRegionIdRaw}
            onChange={e => setGameRegionIdRaw(e.target.value)}
            placeholder="Optional"
            min={1}
            disabled={isPending}
          />
          <FieldError errors={[{ message: errors.gameRegionId }]} />
        </Field>

        {serverError && <p className="text-sm text-destructive">{serverError}</p>}
      </div>

      <AlertDialogFooter>
        <AlertDialogCancel onClick={onClose} disabled={isPending}>
          Cancel
        </AlertDialogCancel>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Saving...' : 'Save'}
        </Button>
      </AlertDialogFooter>
    </form>
  );
}
