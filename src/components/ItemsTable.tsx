import type { ColumnDef } from '@tanstack/react-table'
import { Edit, Save, Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { DataTable } from '@/components/DataTable'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import type { LocalEntity } from '../db/indexedDb'
import { useItems } from '../hooks/useItems'
import { useMutateItem } from '../hooks/useMutateItem'

interface ItemsTableProps {
  itemId?: string
  onItemClick?: (id: string) => void
  onClose?: () => void
}

export default function ItemsTable({ itemId, onItemClick, onClose }: ItemsTableProps) {
  const { data: items = [] } = useItems()
  const { upsertItem, deleteItem } = useMutateItem()
  const [formData, setFormData] = useState<{ name: string; notes: string }>({
    name: '',
    notes: '',
  })

  // Find the selected item from URL
  const selectedItem = itemId ? items.find((item) => item.id === itemId) : null
  const isOpen = !!selectedItem

  // Update form data when selected item changes
  React.useEffect(() => {
    if (selectedItem) {
      setFormData({
        name: selectedItem.name,
        notes: selectedItem.notes || '',
      })
    }
  }, [selectedItem])

  const handleRowClick = (item: LocalEntity) => {
    if (onItemClick) {
      onItemClick(item.id)
    }
  }

  const handleDialogClose = () => {
    if (onClose) {
      onClose()
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedItem) {
      upsertItem.mutate({
        ...selectedItem,
        name: formData.name,
        notes: formData.notes,
        updatedAt: Date.now(),
      })
      handleDialogClose()
    }
  }

  const handleDelete = () => {
    if (selectedItem) {
      deleteItem.mutate(selectedItem.id)
      handleDialogClose()
    }
  }

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
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                handleRowClick(row.original)
              }}
            >
              <Edit size={16} className="mr-1" /> Edit
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={(e) => {
                e.stopPropagation()
                deleteItem.mutate(row.original.id)
              }}
            >
              <Trash2 size={16} className="mr-1" /> Delete
            </Button>
          </div>
        )
      },
    },
  ]

  return (
    <>
      <div className="container flex flex-col h-full py-8 mx-auto">
        <h1 className="mb-6 text-3xl font-bold">Poke Management</h1>
        <DataTable columns={columns} data={items}  />
      </div>

      {/* Item Detail Dialog */}
      <Dialog open={isOpen} onOpenChange={(open) => !open && handleDialogClose()}>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Edit Item</DialogTitle>
              <DialogDescription>
                Make changes to your item here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <div className="p-6 space-y-4">
              <div className="p-4 border-2 border-black rounded-md bg-primary/5">
                <p className="mb-1 text-sm font-bold uppercase text-muted-foreground">ID</p>
                <p className="text-lg">{selectedItem?.id}</p>
              </div>

              <div className="space-y-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter item name"
                />
              </div>

              <div className="space-y-3">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter notes"
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 border-2 border-black rounded-md">
                  <p className="mb-1 text-sm font-bold uppercase text-muted-foreground">
                    Updated At
                  </p>
                  <p className="text-sm">
                    {selectedItem && new Date(selectedItem.updatedAt).toLocaleString()}
                  </p>
                </div>
                <div className="p-4 border-2 border-black rounded-md">
                  <p className="mb-1 text-sm font-bold uppercase text-muted-foreground">Synced</p>
                  <p className="text-2xl">{selectedItem?.isSynced ? '✅' : '⏳'}</p>
                </div>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
              <Button type="button" variant="destructive" onClick={handleDelete}>
                <Trash2 size={16} className="mr-2" />
                Delete Item
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
