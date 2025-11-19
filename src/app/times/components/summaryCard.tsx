export function SummaryCard({ label, value }: { label: string; value?: string | number | undefined }) {
    return (
        <div className="rounded-lg bg-fuchsia-900/90 p-4 text-fuchsia-100 shadow-sm">
            <div className="text-xs opacity-80">{label}</div>
            <div className="mt-1 text-lg font-semibold tabular-nums">{value}</div>
        </div>
    );
}