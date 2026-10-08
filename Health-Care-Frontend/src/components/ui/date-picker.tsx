"use client";

import React, { useState } from "react";
import { format, isValid, parseISO } from "date-fns";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DatePickerProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_OF_WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function DatePicker({
  value,
  onChange,
  placeholder = "Select date",
  className,
  disabled,
}: DatePickerProps) {
  const [open, setOpen] = useState(false);

  const selectedDate = value ? parseISO(value) : null;
  const isDateValid = selectedDate && isValid(selectedDate);

  const currentYear = new Date().getFullYear();
  const [viewYear, setViewYear] = useState(
    isDateValid ? selectedDate.getFullYear() : currentYear
  );
  const [viewMonth, setViewMonth] = useState(
    isDateValid ? selectedDate.getMonth() : new Date().getMonth()
  );

  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen && value) {
      const parsed = parseISO(value);
      if (isValid(parsed)) {
        setViewYear(parsed.getFullYear());
        setViewMonth(parsed.getMonth());
      }
    }
    setOpen(isOpen);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    const isoString = format(d, "yyyy-MM-dd");
    onChange(isoString);
    setOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
  };

  const handleToday = () => {
    const today = new Date();
    onChange(format(today, "yyyy-MM-dd"));
    setViewYear(today.getFullYear());
    setViewMonth(today.getMonth());
    setOpen(false);
  };

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();
  const prevMonthDays = new Date(viewYear, viewMonth, 0).getDate();

  const years = Array.from(
    { length: currentYear - 1920 + 1 },
    (_, i) => currentYear - i
  );

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild disabled={disabled}>
        <button
          type="button"
          className={`w-full h-10 px-3 rounded-md border border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition flex items-center justify-between cursor-pointer outline-none ${className || ""}`}
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="h-4 w-4 text-[#1f5c4b] shrink-0" />
            <span className={isDateValid ? "text-[#1a2d29]" : "text-[#7a8c87]"}>
              {isDateValid ? format(selectedDate, "dd/MM/yyyy") : placeholder}
            </span>
          </div>
          {isDateValid && (
            <span
              onClick={handleClear}
              className="p-1 text-[#8fa09b] hover:text-red-500 rounded-sm transition"
              title="Clear Date"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[290px] p-3 rounded-md bg-white border border-[#e5ebe7] shadow-xl space-y-3 z-50"
      >
        {/* Month & Year Controls */}
        <div className="flex items-center justify-between gap-1 pb-2 border-b border-[#f0f4f2]">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="p-1.5 rounded-md hover:bg-[#edf4f0] text-[#5e716c] hover:text-[#1f5c4b] transition cursor-pointer"
            title="Previous Month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <div className="flex items-center gap-1.5">
            {/* Month selector */}
            <Select
              value={String(viewMonth)}
              onValueChange={(val) => setViewMonth(Number(val))}
            >
              <SelectTrigger className="h-7 px-2 py-0.5 rounded-md border-[#e5ebe7] text-xs font-semibold text-[#1a2d29] bg-white hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 outline-none cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-52 bg-white border-[#e5ebe7] rounded-md shadow-lg">
                {MONTH_NAMES.map((m, idx) => (
                  <SelectItem
                    key={m}
                    value={String(idx)}
                    className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm"
                  >
                    {m}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Year selector */}
            <Select
              value={String(viewYear)}
              onValueChange={(val) => setViewYear(Number(val))}
            >
              <SelectTrigger className="h-7 px-2 py-0.5 rounded-md border-[#e5ebe7] text-xs font-semibold text-[#1a2d29] bg-white hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 outline-none cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-52 bg-white border-[#e5ebe7] rounded-md shadow-lg">
                {years.map((y) => (
                  <SelectItem
                    key={y}
                    value={String(y)}
                    className="text-xs font-medium focus:bg-[#edf4f0] focus:text-[#1f5c4b] data-[state=checked]:bg-[#edf4f0] data-[state=checked]:text-[#1f5c4b] cursor-pointer rounded-sm"
                  >
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <button
            type="button"
            onClick={handleNextMonth}
            className="p-1.5 rounded-md hover:bg-[#edf4f0] text-[#5e716c] hover:text-[#1f5c4b] transition cursor-pointer"
            title="Next Month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        {/* Weekday Labels */}
        <div className="grid grid-cols-7 text-center">
          {DAYS_OF_WEEK.map((d) => (
            <span key={d} className="text-[11px] font-bold text-[#7a8c87] py-1">
              {d}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {/* Previous month filler days */}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => {
            const prevDay = prevMonthDays - firstDayOfWeek + i + 1;
            return (
              <span
                key={`prev-${i}`}
                className="h-7 w-7 mx-auto flex items-center justify-center text-[11px] text-[#cbd5d0] select-none"
              >
                {prevDay}
              </span>
            );
          })}

          {/* Current month days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const dayNumber = i + 1;
            const isSelected =
              isDateValid &&
              selectedDate.getDate() === dayNumber &&
              selectedDate.getMonth() === viewMonth &&
              selectedDate.getFullYear() === viewYear;

            const isToday =
              new Date().getDate() === dayNumber &&
              new Date().getMonth() === viewMonth &&
              new Date().getFullYear() === viewYear;

            return (
              <button
                key={`day-${dayNumber}`}
                type="button"
                onClick={() => handleSelectDay(dayNumber)}
                className={`h-7 w-7 mx-auto rounded-md flex items-center justify-center text-xs font-medium transition cursor-pointer ${
                  isSelected
                    ? "bg-[#1f5c4b] text-white font-bold shadow-xs"
                    : isToday
                    ? "border border-[#1f5c4b] text-[#1f5c4b] font-bold hover:bg-[#edf4f0]"
                    : "text-[#1a2d29] hover:bg-[#edf4f0] hover:text-[#1f5c4b]"
                }`}
              >
                {dayNumber}
              </button>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#f0f4f2]">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className="text-xs font-semibold text-red-500 hover:bg-red-50 px-2 py-1 rounded-md transition cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleToday}
            className="text-xs font-semibold text-[#1f5c4b] hover:bg-[#edf4f0] px-2 py-1 rounded-md transition cursor-pointer"
          >
            Today
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
