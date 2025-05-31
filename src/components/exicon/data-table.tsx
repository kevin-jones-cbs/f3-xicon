"use client"

import {
  ColumnDef,
} from "@tanstack/react-table"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { GenericDataTable } from "@/components/ui/generic-data-table"
import { ExiconEntry } from "@/types/exicon"

const columns: ColumnDef<ExiconEntry>[] = [
  {
    accessorKey: "name",
    sortingFn: (rowA, rowB) => {
      const searchTerm = (rowA.getValue("name") as string)?.toLowerCase() || "";
      const nameA = rowA.original.name.toLowerCase();
      const nameB = rowB.original.name.toLowerCase();
      const defA = rowA.original.definition.toLowerCase();
      const defB = rowB.original.definition.toLowerCase();
      
      const nameMatchA = nameA.includes(searchTerm);
      const nameMatchB = nameB.includes(searchTerm);
      const defMatchA = defA.includes(searchTerm);
      const defMatchB = defB.includes(searchTerm);

      // If both match in name, sort alphabetically
      if (nameMatchA && nameMatchB) {
        return nameA.localeCompare(nameB);
      }
      // If only A matches in name, A comes first
      if (nameMatchA) return -1;
      // If only B matches in name, B comes first
      if (nameMatchB) return 1;
      
      // If both match in definition, sort alphabetically by name
      if (defMatchA && defMatchB) {
        return nameA.localeCompare(nameB);
      }
      // If only A matches in definition, A comes first
      if (defMatchA) return -1;
      // If only B matches in definition, B comes first
      if (defMatchB) return 1;
      
      // If neither matches, sort alphabetically by name
      return nameA.localeCompare(nameB);
    },
    cell: ({ row }) => {
      const entry = row.original
      return (
        <div className="space-y-2">
          <div className="font-semibold text-lg">{entry.name}</div>
          <div className="text-sm text-muted-foreground whitespace-normal break-words">
            {entry.definition}
          </div>
        </div>
      )
    },
  },
]

interface DataTableProps {
  data: ExiconEntry[]
  initialSlug?: string | null
}

export function ExiconDataTable({ data, initialSlug }: DataTableProps) {
  const router = useRouter()
  const [filteredData, setFilteredData] = useState<ExiconEntry[]>(data)
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

  const handleClearSlugFilter = () => {
    router.push('/exicon')
  }

  const handleCopyLink = (entry: ExiconEntry) => {
    const url = `${window.location.origin}/exicon?term=${entry.slug}`
    navigator.clipboard.writeText(url)
  }

  return (
    <GenericDataTable
      data={filteredData}
      columns={columns}
      searchPlaceholder="Search Exicon..."
      searchColumnId="name"
      viewMode={isViewingSingleTerm ? {
        isActive: true,
        onViewAll: handleClearSlugFilter,
        viewAllText: "View Full Exicon"
      } : undefined}
      onCopyLink={handleCopyLink}
    />
  )
} 