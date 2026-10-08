"use client";

import React, { useState } from "react";
import { Clock, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface TimePickerProps {
  value?: string; // "HH:mm" (24-hour format e.g. "09:30" or "14:00")
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1); // 1 to 12
const MINUTES = [
  "00", "05", "10", "15", "20", "25",
  "30", "35", "40", "45", "50", "55"
];
const PERIODS = ["AM", "PM"] as const;

// Helper: parse "HH:mm" (24h) into { hour12: number, minute: string, period: "AM" | "PM" }
const parse24HourTime = (timeStr?: string) => {
  if (!timeStr || !timeStr.includes(":")) {
    return { hour12: 9, minute: "00", period: "AM" as const };
  }
  const [hStr, mStr] = timeStr.split(":");
  let h = parseInt(hStr, 10);
  if (isNaN(h)) h = 9;
  const m = mStr ? mStr.padStart(2, "0").slice(0, 2) : "00";

  const period: "AM" | "PM" = h >= 12 ? "PM" : "AM";
  let hour12 = h % 12;
  if (hour12 === 0) hour12 = 12;

  return { hour12, minute: m, period };
};

// Helper: format 12h + minute + period into "HH:mm" (24h)
const formatTo24HourTime = (hour12: number, minute: string, period: "AM" | "PM"): string => {
  let h = hour12;
  if (period === "AM") {
    if (h === 12) h = 0;
  } else {
    if (h !== 12) h += 12;
  }
  return `${String(h).padStart(2, "0")}:${minute.padStart(2, "0")}`;
};

// Helper: format 24h into display "hh:mm A" (e.g. "09:30 AM")
const formatDisplayTime = (timeStr?: string): string => {
  if (!timeStr) return "";
  const { hour12, minute, period } = parse24HourTime(timeStr);
  return `${String(hour12).padStart(2, "0")}:${minute} ${period}`;
};

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
  disabled = false,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);

  const { hour12, minute, period } = parse24HourTime(value);

  const handleHourClick = (h: number) => {
    const next24 = formatTo24HourTime(h, minute, period);
    onChange(next24);
  };

  const handleMinuteClick = (m: string) => {
    const next24 = formatTo24HourTime(hour12, m, period);
    onChange(next24);
  };

  const handlePeriodClick = (p: "AM" | "PM") => {
    const next24 = formatTo24HourTime(hour12, minute, p);
    onChange(next24);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const handleNow = () => {
    const now = new Date();
    const h24 = String(now.getHours()).padStart(2, "0");
    const m = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, "0");
    onChange(`${h24}:${m}`);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={cn(
            "w-full h-10 px-3 rounded-md border border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition flex items-center justify-between cursor-pointer outline-none",
            className
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <Clock className="h-4 w-4 text-[#1f5c4b] shrink-0" />
            <span className={value ? "text-[#1a2d29]" : "text-[#7a8c87]"}>
              {value ? formatDisplayTime(value) : placeholder}
            </span>
          </div>
          {value && (
            <span
              onClick={handleClear}
              className="p-1 text-[#8fa09b] hover:text-red-500 rounded-sm transition"
              title="Clear Time"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[260px] p-3 rounded-md bg-white border border-[#e5ebe7] shadow-xl space-y-2 z-50"
      >
        {/* Header summary */}
        <div className="flex items-center justify-between pb-2 border-b border-[#f0f4f2]">
          <span className="text-xs font-bold text-[#1f5c4b] uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {value ? formatDisplayTime(value) : "Choose Time"}
          </span>
          <button
            type="button"
            onClick={handleNow}
            className="text-[11px] font-semibold text-[#1f5c4b] hover:bg-[#edf4f0] px-2 py-0.5 rounded-md transition cursor-pointer"
          >
            Now
          </button>
        </div>

        {/* 3 Columns for Hour, Minute, AM/PM */}
        <div className="grid grid-cols-3 gap-1.5 text-center">
          {/* Hours Column */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase text-[#7a8c87] pb-0.5">Hour</p>
            <div className="max-h-44 overflow-y-auto space-y-1 pr-0.5">
              {HOURS_12.map((h) => {
                const isSelected = value ? hour12 === h : false;
                return (
                  <button
                    key={h}
                    type="button"
                    onClick={() => handleHourClick(h)}
                    className={cn(
                      "w-full py-1.5 text-xs rounded-md font-medium transition cursor-pointer flex items-center justify-center",
                      isSelected
                        ? "bg-[#1f5c4b] text-white font-bold shadow-xs"
                        : "text-[#1a2d29] hover:bg-[#edf4f0] hover:text-[#1f5c4b]"
                    )}
                  >
                    {String(h).padStart(2, "0")}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Minutes Column */}
          <div className="space-y-1 border-x border-[#f0f4f2] px-1">
            <p className="text-[10px] font-bold uppercase text-[#7a8c87] pb-0.5">Min</p>
            <div className="max-h-44 overflow-y-auto space-y-1 pr-0.5">
              {MINUTES.map((m) => {
                const isSelected = value ? minute === m : false;
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => handleMinuteClick(m)}
                    className={cn(
                      "w-full py-1.5 text-xs rounded-md font-medium transition cursor-pointer flex items-center justify-center",
                      isSelected
                        ? "bg-[#1f5c4b] text-white font-bold shadow-xs"
                        : "text-[#1a2d29] hover:bg-[#edf4f0] hover:text-[#1f5c4b]"
                    )}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Period (AM/PM) Column */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase text-[#7a8c87] pb-0.5">Period</p>
            <div className="space-y-1">
              {PERIODS.map((p) => {
                const isSelected = value ? period === p : false;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => handlePeriodClick(p)}
                    className={cn(
                      "w-full py-2 text-xs rounded-md font-bold transition cursor-pointer flex items-center justify-center",
                      isSelected
                        ? "bg-[#1f5c4b] text-white shadow-xs"
                        : "text-[#1a2d29] hover:bg-[#edf4f0] hover:text-[#1f5c4b] border border-[#e5ebe7]"
                    )}
                  >
                    {p}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0f4f2]">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="text-xs font-semibold text-red-500 hover:bg-red-50 px-2.5 py-1 rounded-md transition cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="text-xs font-semibold bg-[#1f5c4b] hover:bg-[#184b3d] text-white px-4 py-1 rounded-md transition cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
