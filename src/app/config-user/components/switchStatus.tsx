import React from "react";

type StatusSwitchProps = {
  userId: string;                         // thêm userId
  value: boolean;                         // true = active
  onChange: (userId: string, next: boolean) => void;
  disabled?: boolean;
};

export const StatusSwitch: React.FC<StatusSwitchProps> = ({
  userId,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <button
      type="button"
      aria-pressed={value}
      disabled={disabled}
      onClick={() => onChange(userId, !value)}    // gửi userId và trạng thái mới
      className={[
        "relative inline-flex h-8 w-20 items-center justify-center overflow-hidden rounded-2xl",
        "border text-sm font-semibold transition-all",
        disabled ? "opacity-50 cursor-not-allowed" : "",
        value
          ? "border-green-200 bg-green-500/10 text-green-700 dark:border-green-900 dark:text-green-300"
          : "border-gray-200 bg-gray-100 text-gray-700 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-1 top-1 h-8 w-1/2 rounded-xl transition-transform",
          value
            ? "translate-x-12 bg-green-500/20 dark:bg-green-400/20"
            : "translate-x-[-16px] bg-white dark:bg-gray-700",
        ].join(" ")}
        aria-hidden="true"
      />
      <span className="relative z-10">{value ? "Active" : "Inactive"}</span>
    </button>
  );
};
