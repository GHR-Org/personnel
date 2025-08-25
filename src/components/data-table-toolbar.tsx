"use client";

import * as React from "react";
import { Table } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DataTableFacetedFilter } from "@/components/data-table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/data-table/data-table-column-toggle";
import { DownloadIcon, FunnelIcon } from "lucide-react";
import { exportToCsv } from "@/lib/utils";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: {
    id: keyof TData;
    title: string;
    options: { label: string; value: string }[];
  }[];
  searchableColumn?: keyof TData;
  csvExportName?: string;
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumn,
  csvExportName = "export",
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const handleExport = () => {
    const rows = table.getFilteredRowModel().rows;
    const headers = table
      .getAllColumns()
      .filter((column) => column.getIsVisible())
      .map((column) => column.id);
    const data = rows.map((row) => {
      const rowData: Record<string, any> = {};
      headers.forEach((header) => {
        rowData[header] = row.getValue(header);
      });
      return rowData;
    });

    exportToCsv(data, csvExportName);
  };

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-4">
      <div className="flex flex-1 items-center space-x-2">
        {searchableColumn && (
          <Input
            placeholder="Rechercher..."
            value={
              (table.getColumn(searchableColumn as string)?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn(searchableColumn as string)?.setFilterValue(event.target.value)
            }
            className="h-9 w-[200px] lg:w-[250px]"
          />
        )}

        {filterableColumns.map((column) => (
          <DataTableFacetedFilter
            key={String(column.id)}
            column={table.getColumn(column.id as string)}
            title={column.title}
            options={column.options}
          />
        ))}

        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleExport}
        >
          <DownloadIcon className="mr-2 h-4 w-4" />
          Exporter CSV
        </Button>
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
