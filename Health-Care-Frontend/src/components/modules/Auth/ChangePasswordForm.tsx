"use client";

import { changePasswordAction } from "@/app/_actions/auth.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function ChangePasswordForm() {
  const router = useRouter();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visiblePasswords, setVisiblePasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (field: keyof typeof visiblePasswords) => {
    setVisiblePasswords((current) => ({ ...current, [field]: !current[field] }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });

      if (!result.success) {
        toast.error(result.message);
        return;
      }

      toast.success(result.message);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      <div className="space-y-2">
        <label htmlFor="current-password" className="text-sm font-medium text-[#344b41]">
          Current password
        </label>
        <div className="relative">
          <Input
            id="current-password"
            type={visiblePasswords.current ? "text" : "password"}
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => setCurrentPassword(event.target.value)}
            className="pr-11"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("current")}
            aria-label={visiblePasswords.current ? "Hide current password" : "Show current password"}
            className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-2 text-[#63776d] transition hover:bg-[#eaf4ee] hover:text-[#174b3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f5c4b]"
          >
            {visiblePasswords.current ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="new-password" className="text-sm font-medium text-[#344b41]">
          New password
        </label>
        <div className="relative">
          <Input
            id="new-password"
            type={visiblePasswords.new ? "text" : "password"}
            autoComplete="new-password"
            minLength={8}
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            className="pr-11"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("new")}
            aria-label={visiblePasswords.new ? "Hide new password" : "Show new password"}
            className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-2 text-[#63776d] transition hover:bg-[#eaf4ee] hover:text-[#174b3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f5c4b]"
          >
            {visiblePasswords.new ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        <p className="text-xs text-[#718078]">Use at least 8 characters.</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="confirm-password" className="text-sm font-medium text-[#344b41]">
          Confirm new password
        </label>
        <div className="relative">
          <Input
            id="confirm-password"
            type={visiblePasswords.confirm ? "text" : "password"}
            autoComplete="new-password"
            minLength={8}
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="pr-11"
            required
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("confirm")}
            aria-label={visiblePasswords.confirm ? "Hide confirmation password" : "Show confirmation password"}
            className="absolute right-1 top-1/2 -translate-y-1/2 cursor-pointer rounded-md p-2 text-[#63776d] transition hover:bg-[#eaf4ee] hover:text-[#174b3d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1f5c4b]"
          >
            {visiblePasswords.confirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || !currentPassword || !newPassword || !confirmPassword}
        className="cursor-pointer bg-[#1f5c4b] text-white hover:bg-[#184b3d]"
      >
        {isSubmitting ? "Updating password..." : "Update password"}
      </Button>
    </form>
  );
}