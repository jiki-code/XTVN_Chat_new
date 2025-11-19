// import { formatDateTime } from "@/lib/utils";
// import React from "react";
// import { LogRow } from "../types/common";
// import { Row } from "@tanstack/react-table";

// type Break = {
//     start: string | Date;
//     end?: string | Date | null;
// };

// const toTime = (v: string | Date | null | undefined) =>
//     v ? new Date(v).getTime() : NaN;

// const calcBreakDuration = (b: Break): number => {
//     const start = toTime(b.start);
//     const end = toTime(b.end ?? null);
//     if (Number.isNaN(start) || Number.isNaN(end)) return 0;
//     return Math.max(0, end - start);
// };

// export const BreaksDetail: React.FC<{ row: Row<LogRow> }> = ({ row }) => {
//     const breaks = row.original.breaks ?? [];
//     const formatDuration = (ms: number) => {
//         if (!Number.isFinite(ms) || ms <= 0) return "0s";
//         const hours = Math.floor(ms / 3_600_000);
//         const minutes = Math.floor((ms % 3_600_000) / 60_000);
//         const seconds = Math.floor((ms % 60_000) / 1_000);
//         return `${hours}h ${minutes}m ${seconds}s`;
//     };
//     const totalBreakTime = breaks.reduce(
//         (acc, b) => acc + calcBreakDuration(b),
//         0
//     );

//     return (
//         <div className="space-y-3">
//             <h4 className="font-semibold text-base text-gray-700">Detail Breaks</h4>

//             {breaks.length > 0 ? (
//                 <div className="space-y-2">
//                     {breaks.map((b, index) => {
//                         const dur = calcBreakDuration(b);
//                         const startDate =
//                             typeof b.start === "string" ? new Date(b.start) : (b.start as Date);
//                         const endDate =
//                             b.end != null
//                                 ? typeof b.end === "string"
//                                     ? new Date(b.end)
//                                     : (b.end as Date)
//                                 : null;

//                         return (
//                             <div
//                                 key={index}
//                                 className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
//                             >
//                                 <div className="flex items-center space-x-4">
//                                     <div className="text-sm">
//                                         <span className="font-medium text-gray-600">
//                                             Break {index + 1}:
//                                         </span>
//                                     </div>
//                                     <div className="text-sm text-gray-500">
//                                         <span>{formatDateTime(startDate)}</span>
//                                         <span className="mx-2">→</span>
//                                         <span>{endDate ? formatDateTime(endDate) : "-"}</span>
//                                     </div>
//                                 </div>
//                                 <div className="text-sm font-medium text-blue-600">
//                                     {formatDuration(dur)}
//                                 </div>
//                             </div>
//                         );
//                     })}

//                     <div className="flex justify-between items-center pt-2 border-t border-gray-200">
//                         <span className="text-base font-medium text-gray-700">
//                             Total break time:
//                         </span>
//                         <span className="text-sm font-bold text-red-600">
//                             {formatDuration(totalBreakTime)}
//                         </span>
//                     </div>
//                 </div>
//             ) : (
//                 <div className="text-sm text-gray-500 italic">No data</div>
//             )}
//         </div>
//     );
// };