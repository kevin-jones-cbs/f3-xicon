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
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Copy } from "lucide-react"

interface LexiconEntry {
  name: string
  definition: string
  slug: string
}

const columns: ColumnDef<LexiconEntry>[] = [
  {
    accessorKey: "name",
    cell: ({ row }) => {
      const entry = row.original
      const handleCopyLink = () => {
        const url = `${window.location.origin}/lexicon?term=${entry.slug}`
        navigator.clipboard.writeText(url)
      }

      return (
        <div className="flex items-start justify-between space-x-4">
          <div className="space-y-2">
            <div className="font-semibold text-lg">{entry.name}</div>
            <div className="text-sm text-muted-foreground whitespace-normal break-words">
              {entry.definition}
            </div>
          </div>
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
              <DropdownMenuItem onClick={handleCopyLink}>
                <Copy className="mr-2 h-4 w-4" />
                Copy Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]

interface DataTableProps {
  data: LexiconEntry[]
  initialSlug?: string | null
}

export function LexiconDataTable({ data, initialSlug }: DataTableProps) {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const router = useRouter()
  const [filteredData, setFilteredData] = useState<LexiconEntry[]>(data)
  const [isViewingSingleTerm, setIsViewingSingleTerm] = useState(false)

  useEffect(() => {
    if (initialSlug) {
      const filtered = data.filter(entry => entry.slug === initialSlug)
      setFilteredData(filtered)
      setIsViewingSingleTerm(true)
    } else {
      setFilteredData(data)
      setIsViewingSingleTerm(false)
    }
  }, [initialSlug, data])

  const table = useReactTable({
    data: filteredData,
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
        pageSize: 5,
      },
    },
  })

  const handleClearSlugFilter = () => {
    router.push('/lexicon')
  }

  return (
    <div>
      <div className="flex items-center justify-between py-4">
        <div className="relative max-w-sm">
          <Input
            placeholder="Search Lexicon..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="pr-8"
          />
          {(table.getColumn("name")?.getFilterValue() as string) && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-2 hover:bg-transparent"
              onClick={() => table.getColumn("name")?.setFilterValue("")}
            >
              ✕
            </Button>
          )}
        </div>
        <div className="flex items-center space-x-2">
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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
        <div className="text-sm text-muted-foreground">
          Showing {table.getFilteredRowModel().rows.length} of {data.length} entries
        </div>
        {isViewingSingleTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSlugFilter}
          >
            View Full Lexicon
          </Button>
        )}
      </div>
    </div>
  )
} 