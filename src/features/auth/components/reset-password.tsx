// PasswordResetModal.tsx
import React, { useState } from "react";
import { useAuthActions } from "@convex-dev/auth/react";

import {
  Dialog,
  DialogContent,
  DialogClose,
} from "@/components/ui/dialog";
import { ResetStep } from './reset-password-modal';
import { ForgotStep } from './forgot-step-modal';

type Step = "forgot" | { email: string };

interface PasswordResetModalProps {
  open: boolean;
  onClose: () => void;
}

export function PasswordResetModal({ open, onClose }: PasswordResetModalProps) {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<Step>("forgot");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setStep("forgot");
    setError(null);
    setLoading(false);
    onClose();
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) handleClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogClose asChild>

        </DialogClose>

        {step === "forgot" ? (
          <ForgotStep
            signIn={signIn}
            error={error}
            loading={loading}
            setLoading={setLoading}
            setStep={setStep}
          />
        ) : (
          <ResetStep
            email={step.email}
            signIn={signIn}
            loading={loading}
            setLoading={setLoading}
            onDone={handleClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

