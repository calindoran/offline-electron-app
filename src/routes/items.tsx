import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { z } from 'zod'
import ItemsTable from '@/components/ItemsTable'

const itemsSearchSchema = z.object({
  itemId: z.string().optional(),
})

export const Route = createFileRoute('/items')({
  validateSearch: itemsSearchSchema,
  component: ItemsPage,
})

function ItemsPage() {
  const navigate = useNavigate({ from: '/items' })
  const { itemId } = Route.useSearch()

  const handleItemClick = (id: string) => {
    navigate({ search: { itemId: id } })
  }

  const handleCloseDialog = () => {
    navigate({ search: {} })
  }

  return <ItemsTable itemId={itemId} onItemClick={handleItemClick} onClose={handleCloseDialog} />
}
