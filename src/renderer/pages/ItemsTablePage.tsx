import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { Edit, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import type { LocalEntity } from '../../db/indexedDb'
import ItemForm from '../components/ItemForm'
import { useItems } from '../hooks/useItems'
import { useMutateItem } from '../hooks/useMutateItem'

const columns: ColumnDef<LocalEntity>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
  },
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'updatedAt',
    header: 'Updated At',
    cell: (info) => new Date(info.getValue<number>()).toLocaleString(),
  },
  {
    accessorKey: 'notes',
    header: 'Notes',
  },
  {
    accessorKey: 'isSynced',
    header: 'Synced',
    cell: (info) => (info.getValue<boolean>() ? '✅' : '⏳'),
  },
]

export default function ItemsTablePage() {
  const { data: items = [] } = useItems()
  const { deleteItem } = useMutateItem()
  const [editingItem, setEditingItem] = useState<LocalEntity | null>(null)
  const [isFormVisible, setIsFormVisible] = useState(false)

  const handleEditClick = (item: LocalEntity) => {
    setEditingItem(item)
    setIsFormVisible(true)
  }

  const handleFormClose = () => {
    setEditingItem(null)
    setIsFormVisible(false)
  }

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Item Management</h1>

      {isFormVisible && (
        <div className="mb-8">
          <ItemForm
            defaultValues={editingItem ? {
              id: editingItem.id,
              name: editingItem.name,
              notes: editingItem.notes
            } : undefined}
            onClose={handleFormClose}
          />
        </div>
      )}

      <Card className="mb-6">
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl">Items Table</CardTitle>
          <Button onClick={() => setIsFormVisible(true)}>
            <Plus size={16} className="mr-2" /> Add New
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : typeof header.column.columnDef.header === 'function'
                          ? header.column.columnDef.header(header.getContext())
                          : header.column.columnDef.header}
                    </TableHead>
                  ))}
                  <TableHead>Actions</TableHead>
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{cell.getValue()?.toString() ?? ''}</TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="noShadow"
                        onClick={() => handleEditClick(row.original)}
                      >
                        <Edit size={16} className="mr-1" /> Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteItem.mutate(row.original.id)}
                      >
                        <Trash2 size={16} className="mr-1" /> Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
