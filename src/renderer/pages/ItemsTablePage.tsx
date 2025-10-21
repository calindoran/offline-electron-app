import { type ColumnDef, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import type { LocalEntity } from '../../db/indexedDb'
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
  const { deleteItem, upsertItem } = useMutateItem()

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <div>
      <h2>Items Table</h2>
      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {header.isPlaceholder
                    ? null
                    : typeof header.column.columnDef.header === 'function'
                      ? header.column.columnDef.header(header.getContext())
                      : header.column.columnDef.header}
                </th>
              ))}
              <th>Actions</th>
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={{ border: '1px solid #ccc', padding: '8px' }}>
                  {cell.getValue()?.toString() ?? ''}
                </td>
              ))}
              <td>
                <button
                  type="button"
                  onClick={() => upsertItem.mutate(row.original)}
                  style={{ color: 'green' }}
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => deleteItem.mutate(row.original.id)}
                  style={{ color: 'red' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
