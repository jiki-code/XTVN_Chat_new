import { LogRow } from "../types/common";
import {DataTable} from "@/components/ui/DataTable";
import { columnsLog } from "./_columnsLog"
import clsx from "clsx";
type TableLogProps = {
    mockLogs: LogRow[];
    className?: string;
};

export function TableLog({ mockLogs, className = "" }: TableLogProps) {
      
    return (
        <div className={clsx(`overflow-hidden rounded-lg border bg-slate-50 border-white/20 p-3`, className)}>
         
         <DataTable<LogRow, unknown>
                columns={columnsLog}
                data={mockLogs}
                searchableColumn="type"    
                label="Time Logs"
            //     getRowCanExpand={(row) => row.original.breaks && row.original.breaks.length > 0}
            //     enableExpansion={true}
            //   renderSubComponent={({ row }) => <BreaksDetail row={row} />}
            />
          
        </div>
    )
}