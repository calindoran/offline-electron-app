import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, RotateCcw, Save } from 'lucide-react'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { LocalEntity } from '../../db/indexedDb'
import { useMutateItem } from '../hooks/useMutateItem'

const itemFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required'),
  notes: z.string().optional().nullable(),
})

type ItemFormValues = z.infer<typeof itemFormSchema>

interface ItemFormProps {
  defaultValues?: ItemFormValues
  onClose?: () => void
}

export default function ItemForm({ defaultValues, onClose }: ItemFormProps) {
  const { upsertItem } = useMutateItem()
  const nameId = useId()
  const notesId = useId()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ItemFormValues>({
    resolver: zodResolver(itemFormSchema),
    defaultValues,
  })

  const onSubmit = (data: ItemFormValues) => {
    const item: LocalEntity = {
      id: data.id || crypto.randomUUID(),
      name: data.name,
      notes: data.notes || '', // Ensure notes is always a string
      updatedAt: Date.now(),
      isSynced: false,
    }

    upsertItem.mutate(item, {
      onSuccess: () => {
        reset()
        if (onClose) {
          onClose()
        }
        // Could add a success toast/notification here
      },
      onError: (error) => {
        console.error('Failed to save item:', error)
        // Could add error notification here
      },
    })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>{defaultValues?.id ? 'Edit Item' : 'Add New Item'}</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={nameId} className="font-medium">
              Name
            </Label>
            <Input
              id={nameId}
              {...register('name')}
              placeholder="Enter item name"
              aria-invalid={errors.name ? 'true' : 'false'}
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor={notesId} className="font-medium">
              Notes
            </Label>
            <Textarea
              id={notesId}
              {...register('notes')}
              placeholder="Optional notes"
              className="min-h-[120px]"
            />
            {errors.notes && (
              <p className="text-destructive text-sm mt-1">{errors.notes.message}</p>
            )}
          </div>

          {upsertItem.isError && (
            <div className="bg-destructive/15 p-3 rounded-md flex items-center text-destructive">
              <AlertCircle size={16} className="mr-2" />
              Error saving item. Please try again.
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between gap-4">
          <div className="flex gap-2">
            <Button type="submit" disabled={upsertItem.isPending}>
              <Save size={16} className="mr-2" />
              {upsertItem.isPending ? 'Saving...' : 'Save Item'}
            </Button>
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
            )}
          </div>
          <Button type="button" variant="neutral" onClick={() => reset()}>
            <RotateCcw size={16} className="mr-2" />
            Reset
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
