import { zodResolver } from '@hookform/resolvers/zod'
import { useId } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import type { LocalEntity } from '../../db/indexedDb'
import { useMutateItem } from '../hooks/useMutateItem'

// Use a consistent schema for the form
const itemFormSchema = z.object({
  id: z.string().optional(), // Local ID is always string (for forms)
  name: z.string().min(1, 'Name is required'),
  notes: z.string().optional().nullable(),
})

type ItemFormValues = z.infer<typeof itemFormSchema>

export default function ItemForm({ defaultValues }: { defaultValues?: ItemFormValues }) {
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
        // Could add a success toast/notification here
      },
      onError: (error) => {
        console.error('Failed to save item:', error)
        // Could add error notification here
      },
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ marginBottom: 16 }}>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor={nameId} style={{ display: 'block', marginBottom: '4px' }}>
          Name:
        </label>
        <input
          id={nameId}
          {...register('name')}
          style={{ width: '100%', padding: '8px' }}
          placeholder="Enter item name"
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <span style={{ color: 'red', fontSize: '14px', display: 'block', marginTop: '4px' }}>
            {errors.name.message}
          </span>
        )}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label htmlFor={notesId} style={{ display: 'block', marginBottom: '4px' }}>
          Notes:
        </label>
        <textarea
          id={notesId}
          {...register('notes')}
          style={{ width: '100%', padding: '8px', minHeight: '80px' }}
          placeholder="Optional notes"
        />
        {errors.notes && (
          <span style={{ color: 'red', fontSize: '14px', display: 'block', marginTop: '4px' }}>
            {errors.notes.message}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          style={{
            marginTop: 8,
            padding: '8px 16px',
            backgroundColor: '#4a90e2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: upsertItem.isPending ? 'not-allowed' : 'pointer',
            opacity: upsertItem.isPending ? 0.7 : 1,
          }}
          disabled={upsertItem.isPending}
        >
          {upsertItem.isPending ? 'Saving...' : 'Save Item'}
        </button>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            marginTop: 8,
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            border: '1px solid #ccc',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Reset
        </button>
      </div>
      {upsertItem.isError && (
        <div style={{ color: 'red', marginTop: '10px' }}>Error saving item. Please try again.</div>
      )}
    </form>
  )
}
