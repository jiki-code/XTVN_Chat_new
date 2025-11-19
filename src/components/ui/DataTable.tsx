"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  VisibilityState,
  ColumnFiltersState,
  useReactTable,
  Row,
} from "@tanstack/react-table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ExpandedState, getExpandedRowModel } from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pagination } from "./Pagination";
import { cn } from "@/lib/utils";

export type RenderSubRowProps<TData> = { row: Row<TData> };

export type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  /** pass a column id/accessorKey to bind the search input; if omitted, uses global filter */
  searchableColumn?: string;
  /** show selection checkbox column if your column defs include it */
  enableSelection?: boolean;
  /** optional toolbar content on the right side */
  rightToolbarSlot?: React.ReactNode;
  /** table aria-label */
  label?: string;
  /** enable row expansion */
  enableExpansion?: boolean;
  /** function to render subcomponent when row is expanded */
  renderSubComponent?: (props: RenderSubRowProps<TData>) => React.ReactNode;
  /** control which rows can expand (tanstack Row<T> has .original) */
  getRowCanExpand?: (row: Row<TData>) => boolean;
};

export function DataTable<TData, TValue>({
  columns,
  data,
  rightToolbarSlot,
  label,
  enableExpansion = false,
  renderSubComponent,
  getRowCanExpand,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");
  const [expanded, setExpanded] = React.useState<ExpandedState>({});

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      expanded,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    onExpandedChange: setExpanded,
    getRowCanExpand: getRowCanExpand, // if undefined, all rows not expandable by default
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-muted-foreground">
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <ListFilter className="mr-2 h-4 w-4 " /> Column
              </Button>
            </DropdownMenuTrigger>
          </DropdownMenu> */}
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">{rightToolbarSlot}</div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border">
        <Table aria-label={label}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {enableExpansion && (
                       <TableHead className="w-2 bg-emerald-500/90" />
                )}
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="whitespace-nowrap text-base text-white font-bold bg-emerald-500/90"
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={
                            "flex select-none items-center gap-2" +
                            (header.column.getCanSort() ? " cursor-pointer" : "")
                          }
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === "asc" && <span>▲</span>}
                          {header.column.getIsSorted() === "desc" && <span>▼</span>}
                        </div>
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow
                    data-state={row.getIsSelected() && "selected"}
                    className={cn(
                      "text-muted-foreground",
                      "cursor-pointer hover:bg-gray-100 ",
                    )}
                  >
                    {enableExpansion && (
                      <TableCell>
                        {row.getCanExpand() && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={row.getToggleExpandedHandler()}
                            className="h-4 w-4 p-0"
                          >
                            {row.getIsExpanded() ? (
                              <ChevronDown className="h-4 w-4 " />
                            ) : (
                              <ChevronRight className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    )}
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>

                 {row.getIsExpanded() && renderSubComponent && (
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={columns.length + (enableExpansion ? 1 : 0)}>
                        {renderSubComponent({ row })}
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length + (enableExpansion ? 1 : 0)}
                  className="h-24 text-center"
                >
                 Not data
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {data.length > 0 && <Pagination table={table} />}
    </div>
  );
}
