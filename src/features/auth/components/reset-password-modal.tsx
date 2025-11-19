import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";
import { Eye, EyeOff } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
type ResetStepProps = {
  email: string;
  signIn: ReturnType<typeof useAuthActions>["signIn"];
  loading: boolean;
  setLoading: (b: boolean) => void;
  onDone: () => void;
};

export function ResetStep({
  email,
  signIn,
  loading,
  setLoading,
  onDone,
}: ResetStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);

        const form = event.currentTarget;
        const formData = new FormData(form);

        const code = (formData.get("code") as string)?.trim();
        const password = (formData.get("password") as string) ?? "";

        // --- simple client-side validation ---
        if (!code || code.length < 6) {
          toast.error("Verification code must be at least 6 characters.");
          setLoading(false);
          return;
        }

        if (!password || password.length < 6) {
          toast.error("Password must be at least 6 characters.");
          setLoading(false);
          return;
        }

        formData.set("flow", "reset-verification");
        formData.set("email", email);
        formData.set("newPassword", password);

        try {
          await signIn("password", formData);
          toast.success("Password changed successfully");
          onDone();

        } catch (e:any) {
          toast.error(e ?? "Something went wrong, please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <DialogHeader className="space-y-2">
        <DialogTitle>Reset Password</DialogTitle>
        <DialogDescription>
          Enter the verification code sent to <strong>{email}</strong>
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-2">
        <Label>Verification Code</Label>
        <Input
          id="code"
          name="code"
          placeholder="Enter your code"
          required
          minLength={6}
        />
      </div>

      <div className="space-y-2">
        <Label>New Password</Label>

        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={6}
            className="pr-10"
          />

          <button
            type="button"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
          </button>
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? "Updating..." : "Reset Password"}
      </Button>
    </form>
  );
}
