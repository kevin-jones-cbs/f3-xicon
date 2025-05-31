"use client"

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy } from "lucide-react"

interface GenericDataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  searchPlaceholder?: string
  searchColumnId: string
  pageSize?: number
  showEntryCount?: boolean
  totalEntries?: number
  additionalControls?: React.ReactNode
  viewMode?: {
    isActive: boolean
    onViewAll: () => void
    viewAllText?: string
  }
  onCopyLink?: (item: TData) => void
}

export function GenericDataTable<TData>({
  data,
  columns,
  searchPlaceholder = "Search...",
  searchColumnId,
  pageSize = 5,
  showEntryCount = true,
  totalEntries,
  additionalControls,
  viewMode,
  onCopyLink,
}: GenericDataTableProps<TData>) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
    },
    initialState: {
      pagination: {
        pageSize,
      },
      sorting: [
        {
          id: searchColumnId,
          desc: false,
        },
      ],
    },
  })

  const showControls = !viewMode?.isActive
  const showDropdown = !viewMode?.isActive && onCopyLink

  return (
    <div>
      {showControls && (
        <div className="flex items-center justify-between py-4">
          <div className="relative max-w-sm">
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchColumnId)?.getFilterValue() as string) ?? ""}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                const value = event.target.value;
                table.getColumn(searchColumnId)?.setFilterValue(value);
              }}
              className="pr-8"
            />
            {(table.getColumn(searchColumnId)?.getFilterValue() as string) && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
                onClick={() => {
                  table.getColumn(searchColumnId)?.setFilterValue("");
                }}
              >
                ✕
              </Button>
            )}
          </div>
          <div className="flex items-center space-x-2">
            {additionalControls}
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-4">
                      <div className="flex items-start justify-between space-x-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                        {showDropdown && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="24"
                                  height="24"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="19" cy="12" r="1" />
                                  <circle cx="5" cy="12" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onCopyLink(row.original)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Copy Link
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col items-center gap-2 mt-4">
        {showEntryCount && !viewMode?.isActive && (
          <div className="text-sm text-muted-foreground">
            Showing {table.getFilteredRowModel().rows.length} of {totalEntries || data.length} entries
          </div>
        )}
        {viewMode?.isActive && (
          <Button
            variant="ghost"
            size="sm"
            onClick={viewMode.onViewAll}
          >
            {viewMode.viewAllText || "View All"}
          </Button>
        )}
      </div>
    </div>
  )
} 