import React from "react";
import { useAuthActions } from "@convex-dev/auth/react";

import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
type Step = "forgot" | { email: string };

type ForgotStepProps = {
  signIn: ReturnType<typeof useAuthActions>["signIn"];
  error: string | null;
  loading: boolean;
  setLoading: (b: boolean) => void;
  setStep: (s: Step) => void;
};

export function ForgotStep({
  signIn,
  loading,
  setLoading,
  setStep,
}: ForgotStepProps) {
  return (
    <form
      className="space-y-4"
      onSubmit={async (event) => {
        event.preventDefault();
        setLoading(true);

        const form = event.currentTarget;
        const formData = new FormData(form);
        const email = formData.get("email") as string;

        formData.set("flow", "reset");

        try {
          await signIn("password", formData);
          setStep({ email });
           toast.success('Please check your email');
        } catch (error: any) {
          toast.error(error ?? "Something went wrong, please try again.");
        } finally {
          setLoading(false);
        }
      }}
    >
      <DialogHeader className="space-y-2">
        <DialogTitle className="text-center text-2xl">Forgot Password</DialogTitle>
        <DialogDescription>
          Enter your email and we will send you a verification code
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        <Label htmlFor="email" className="text-sm">
          Email
        </Label>
        <Input
          id="email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full mt-2">
        {loading ? "Sending..." : "Send Reset Code"}
      </Button>
    </form>
  );
}