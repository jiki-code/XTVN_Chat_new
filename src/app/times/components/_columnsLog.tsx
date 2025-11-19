import { ColumnDef } from "@tanstack/react-table";
import { LogRow } from "../types/common"
import { formatDateTimeStamp } from "@/lib/utils";
export const columnsLog: ColumnDef<LogRow>[] = [
    {
        id: "id",
        header: "No.",
        cell: ({ row }) => <span>{row.index + 1}</span>,
    },
    {
        accessorKey: "timestamp",
        header: "Date",
        cell: ({ row }) => {
            const value = row.original.timestamp
            return formatDateTimeStamp(value, false);
        },
    },
    {
        accessorKey: "start",
        header: "Start",
        cell: ({ getValue }) => {
            const v = getValue<string>();
            return v ? new Date(v).toLocaleString('vi-VN') : '—';
        },
    },
    {
        accessorKey: "end",
        header: "End",
        cell: ({ getValue }) => {
            const v = getValue<string>();
            return v ? new Date(v).toLocaleString('vi-VN') : '—';
        },
    },
    { accessorKey: "type", header: "Type" },
    {
        accessorKey: "total",
        header: "Total",
        cell: ({ row }) => {
            const start = row.getValue<string>("start");
            const end = row.getValue<string>("end");
            if (!start || !end) return "—";
            const startDate = new Date(start);
            const endDate = new Date(end);

            const diffMs = endDate.getTime() - startDate.getTime();
            if (diffMs <= 0) return "—";

            const totalMinutes = Math.floor(diffMs / 1000 / 60);
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;

            // format HH:mm
            return `${hours.toString().padStart(2, "0")}:${minutes
                .toString()
                .padStart(2, "0")} minute` ;
        },
    },
    {
    accessorKey: "reason",
        header: "Note",
            cell: ({ getValue }) => getValue() || "—",
    },
];
