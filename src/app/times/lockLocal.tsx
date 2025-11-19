import React from "react";

type Props = {
  /** Override locale (defaults to the browser’s locale) */
  locale?: string;
  /** Override timezone (defaults to the browser’s local timezone) */
  timeZone?: string;
};

type Parts = {
  dateLabel: string;
  weekdayShort: string;
  hour: string;
  minute: string;
  second: string;
  ampm: string;
};

export function LockLocal({ locale, timeZone }: Props) {
  const effectiveLocale =
    locale || (typeof navigator !== "undefined" ? navigator.language : "en-US");

  const effectiveTZ =
    timeZone ||
    (typeof Intl !== "undefined"
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : "UTC");

  const computeParts = React.useCallback(
    (d: Date): Parts => {
      // Time pieces (with weekday + dayPeriod via formatToParts)
      const timeFormatter = new Intl.DateTimeFormat(effectiveLocale, {
        weekday: "short",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
        timeZone: effectiveTZ,
      });

      const partsMap = new Map<string, string>();
      for (const p of timeFormatter.formatToParts(d)) {
        if (p.type !== "literal") partsMap.set(p.type, p.value);
      }

      // Date label (e.g., Nov 5, 2025 — localized)
      const dateLabel = new Intl.DateTimeFormat(effectiveLocale, {
        dateStyle: "medium",
        timeZone: effectiveTZ,
      }).format(d);

      return {
        dateLabel,
        weekdayShort: partsMap.get("weekday") || "",
        hour: partsMap.get("hour") || "",
        minute: partsMap.get("minute") || "",
        second: partsMap.get("second") || "",
        ampm: partsMap.get("dayPeriod") || "",
      };
    },
    [effectiveLocale, effectiveTZ]
  );

  const [parts, setParts] = React.useState<Parts>(() => computeParts(new Date()));

  React.useEffect(() => {
    const tick = () => {
      const d = new Date();
      setParts(computeParts(d));
    };
    tick(); // initial sync
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [computeParts]);

  const zone =
    effectiveTZ?.toString?.() ?? "UTC"; // e.g., "Asia/Phnom_Penh"
  const displayZone = zone.replace("_", "/").replace("/", " / ");

  return (
    <div>
      <div className="w-full max-w-9xl rounded-2xl p-0 shadow-sm">
        <div className="mx-auto flex justify-center items-center w-64 rounded-b-lg bg-[#910A67] px-4 py-2 mt-[-16px] text-xl font-semibold shadow text-white">
          {parts.dateLabel}
        </div>

        <div className="mt-6 grid grid-cols-12 items-end gap-4 text-center font-semibold tracking-wide w-full">
          <div className="col-span-2 text-6xl">
            <span className="tabular-nums">{parts.weekdayShort}</span>
          </div>
          <div className="col-span-3 text-7xl md:text-7xl">
            <span className="tabular-nums">{parts.hour} :</span>
          </div>
          <div className="col-span-3 text-7xl md:text-7xl">
            <span className="tabular-nums">{parts.minute} :</span>
          </div>
          <div className="col-span-2 text-7xl md:text-7xl">
            <span className="tabular-nums">{parts.second}</span>
          </div>
        </div>
      </div>
      <div className="mt-6 flex  w-full items-center justify-between text-xs opacity-90">
        <span className="text-base">Timezone: {displayZone}</span>
        <span className="text-base">{parts.ampm}</span>
      </div>
    </div>
  );
}
