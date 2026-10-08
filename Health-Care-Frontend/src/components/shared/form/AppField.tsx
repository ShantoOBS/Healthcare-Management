import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import { cn } from "@/lib/utils";
import type { AnyFieldApi } from "@tanstack/react-form";
import React from "react";

const getErrorMessage = (error: unknown): string => {
  if (typeof error === "string") return error;

  if (error && typeof error === "object") {
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return String(error);
};

type AppFieldProps = {
  field: AnyFieldApi;
  label: string;
  type?: "text" | "email" | "password" | "number" | "date" | "time";
  placeholder?: string;
  append?: React.ReactNode;
  prepend?: React.ReactNode;
  className?: string;
  disabled?: boolean;
};

const AppField = ({
  field,
  label,
  type = "text",
  placeholder,
  append,
  prepend,
  className,
  disabled = false,
}: AppFieldProps) => {
  const firstError =
    field.state.meta.isTouched && field.state.meta.errors.length > 0
      ? getErrorMessage(field.state.meta.errors[0])
      : null;

  const hasError = firstError !== null;

  return (
    <div className={cn("space-y-1.5", className)}>
      <Label
        htmlFor={field.name}
        className={cn("text-xs font-semibold text-[#1a2d29]", hasError && "text-destructive")}
      >
        {label}
      </Label>

      <div className="relative">
        {prepend && (
          <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-3 pointer-events-none">
            <div className="pointer-events-none">{prepend}</div>
          </div>
        )}

        {type === "date" ? (
          <DatePicker
            value={field.state.value}
            onChange={(val) => {
              field.handleChange(val);
              field.handleBlur();
            }}
            placeholder={placeholder || `Select ${label.toLowerCase()}`}
            disabled={disabled}
            className={cn(hasError && "border-destructive focus:border-destructive focus:ring-destructive/20")}
          />
        ) : type === "time" ? (
          <TimePicker
            value={field.state.value}
            onChange={(val) => {
              field.handleChange(val);
              field.handleBlur();
            }}
            placeholder={placeholder || `Select ${label.toLowerCase()}`}
            disabled={disabled}
            className={cn(hasError && "border-destructive focus:border-destructive focus:ring-destructive/20")}
          />
        ) : (
          <Input
            id={field.name}
            name={field.name}
            type={type}
            value={field.state.value}
            placeholder={placeholder}
            onBlur={field.handleBlur}
            onChange={(e) => field.handleChange(e.target.value)}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.name}-error` : undefined}
            className={cn(
              "h-10 rounded-md border-[#e5ebe7] bg-white text-xs sm:text-sm font-medium text-[#1a2d29] hover:border-[#1f5c4b] hover:bg-[#edf4f0]/20 focus:border-[#1f5c4b] focus:ring-1 focus:ring-[#1f5c4b] transition",
              prepend && "pl-10",
              append && "pr-10",
              hasError && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
        )}

        {append && (
          <div className="absolute inset-y-0 right-0 z-10 flex items-center pr-3">
            <div className="pointer-events-auto">{append}</div>
          </div>
        )}

        {hasError && (
          <p
            id={`${field.name}-error`}
            role="alert"
            className="text-xs text-destructive mt-1"
          >
            {firstError}
          </p>
        )}
      </div>
    </div>
  );
};

export default AppField;