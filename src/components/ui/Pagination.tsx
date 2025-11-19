"use client";

import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
interface PaginationProps<TData> {
  table: Table<TData>;
  children?: React.ReactNode;
}

export function Pagination<TData>({ table }: PaginationProps<TData>) {
  const { pageIndex } = table.getState().pagination;
  const [inputPage, setInputPage] = useState<number | string>(pageIndex + 1);
  const array = Array.from({ length: 5 }, (_, i) => pageIndex - 2 + i);

  return (
    <div className="flex items-center justify-center mx-auto py-3 gap-2 text-black">
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          table.setPageIndex(0);
          setInputPage(1);
        }}
        disabled={!table.getCanPreviousPage()}
      >
        <ChevronsLeft className="w-5 h-5" />
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          table.previousPage();
          setInputPage(Number(inputPage) - 1);
        }}
        disabled={!table.getCanPreviousPage()}
      >
        Previous
      </Button>
      <div>
        {array.length > 0 &&
          array.map((it: number) =>
            it >= 0 && it < table.getPageCount() ? (
              <Button
                key={it}
                variant={it === pageIndex ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  table.setPageIndex(it);
                  setInputPage(it + 1);
                }}
                className="mx-1 px-3"
              >
                {it + 1}
              </Button>
            ) : null,
          )}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          table.nextPage();
          setInputPage(Number(inputPage) + 1);
        }}
        disabled={!table.getCanNextPage()}
      >
        Next
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          table.setPageIndex(table.getPageCount() - 1);
          setInputPage(table.getPageCount());
        }}
        disabled={!table.getCanNextPage()}
      >
        <ChevronsRight className="w-5 h-5" />
      </Button>
      <div className="w-fit flex items-center">
        <span className="ml-4 text-sm">Page</span>
        <div className="flex items-center gap-2 mx-2">

          {inputPage}
        </div>
        <span>
          of {table.getPageCount()}
        </span>
      </div>
    </div>
  );
}
