import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ArrowUpDown, Search, X } from 'lucide-react'
import React from 'react'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: TData) => void
  getRowId?: (row: TData) => string
  searchColumn?: string
  searchPlaceholder?: string
  additionalSearchColumns?: string[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  getRowId,
  searchColumn = 'name',
  searchPlaceholder = 'Search...',
  additionalSearchColumns = [],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [globalFilter, setGlobalFilter] = React.useState('')

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    getRowId: getRowId ? (row) => getRowId(row) : undefined,
    state: {
      sorting,
      columnFilters,
      globalFilter,
    },
    globalFilterFn: (row, _columnId, filterValue) => {
      const searchStr = String(filterValue).toLowerCase()
      const columnsToSearch = [searchColumn, ...additionalSearchColumns]

      return columnsToSearch.some((colId) => {
        const value = row.getValue(colId)
        return String(value).toLowerCase().includes(searchStr)
      })
    },
  })

  const handleSearchChange = (value: string) => {
    setGlobalFilter(value)
  }

  const handleClearSearch = () => {
    setGlobalFilter('')
  }

  return (
    <div className="flex flex-col w-full h-full space-y-2">
      <div className="flex items-center py-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute w-4 h-4 transform -translate-y-1/2 left-3 top-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={globalFilter ?? ''}
            onChange={(event) => handleSearchChange(event.target.value)}
            className="pl-10 pr-8"
          />
          {globalFilter && globalFilter.length > 0 && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute transition-colors transform -translate-y-1/2 right-2 top-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : header.column.getCanSort() ? (
                    <button
                      type="button"
                      className="flex items-center gap-2 transition-colors cursor-pointer select-none hover:text-foreground"
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : header.column.getIsSorted() === 'desc' ? (
                        <ArrowDown className="w-4 h-4" />
                      ) : (
                        <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </button>
                  ) : (
                    flexRender(header.column.columnDef.header, header.getContext())
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
                className={onRowClick ? 'cursor-pointer hover:bg-primary/5' : undefined}
                onClick={() => onRowClick?.(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault()
                table.previousPage()
              }}
              className={
                !table.getCanPreviousPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
            />
          </PaginationItem>

          {Array.from({ length: table.getPageCount() }, (_, i) => i).map((pageIndex) => {
            const currentPage = table.getState().pagination.pageIndex
            const totalPages = table.getPageCount()

            const showPage =
              pageIndex === 0 ||
              pageIndex === totalPages - 1 ||
              pageIndex === currentPage ||
              (pageIndex >= currentPage - 1 && pageIndex <= currentPage + 1)

            if (!showPage) {
              if (pageIndex === totalPages - 2 && currentPage < totalPages - 3) {
                return (
                  <PaginationItem key={pageIndex}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }

              if (pageIndex === 1 && currentPage > 2) {
                return (
                  <PaginationItem key={pageIndex}>
                    <PaginationEllipsis />
                  </PaginationItem>
                )
              }
              return null
            }

            return (
              <PaginationItem key={pageIndex}>
                <PaginationLink
                  href="#"
                  isActive={pageIndex === currentPage}
                  onClick={(e) => {
                    e.preventDefault()
                    table.setPageIndex(pageIndex)
                  }}
                  className="cursor-pointer"
                >
                  {pageIndex + 1}
                </PaginationLink>
              </PaginationItem>
            )
          })}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault()
                table.nextPage()
              }}
              className={
                !table.getCanNextPage() ? 'pointer-events-none opacity-50' : 'cursor-pointer'
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}
