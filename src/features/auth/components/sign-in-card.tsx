import { useAuthActions } from "@convex-dev/auth/react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LogoIcon } from "@/components/iconLog";
import { EyeIcon, EyeOffIcon, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { SignInFlow } from "../types";
import { PasswordResetModal } from "./reset-password";
import { Separator } from "@radix-ui/react-dropdown-menu";

interface SignInCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignInCard = ({ setState }: SignInCardProps) => {
  const [signingIn, setSigningIn] = useState(false);
  const [openReset, setOpenReset] = useState(false);
  const [error, setError] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { signIn } = useAuthActions();

  const handlePasswordSignIn = form.handleSubmit(({ email, password }) => {
    setSigningIn(true);
    signIn("password", { email, password, flow: "signIn" })
      .catch(() => {
        setError("Invalid email or password");
      })
      .finally(() => {
        setSigningIn(false);
      });
  });


  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0 flex flex-col items-center justify-center">
        <LogoIcon
          className="size-16 fill-secondary stroke-black hover:fill-black transition-colors duration-200 ease-in delay-100"
          strokeWidth={180}
        />
        <CardTitle className="text-center">Login to continue</CardTitle>
      </CardHeader>
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handlePasswordSignIn}>
          <Input
            {...form.register("email", {
              required: "Email is required",
            })}
            disabled={signingIn}
            placeholder="Email"
            type="email"
          />
          {form.formState.errors.email && (
            <div className="text-destructive text-xs mb-1 flex items-center gap-1">
              <TriangleAlert className="size-3" />
              <span>{form.formState.errors.email.message?.toString()}</span>
            </div>
          )}
          <div className="relative">

            <Input
              {...form.register("password", {
                required: "Password is required",
              })}
              disabled={signingIn}
              placeholder="Password"
              type={isPasswordVisible ? "text" : "password"}
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
              className="absolute top-1/2 right-1 -translate-y-1/2"
            >
              {isPasswordVisible ? <EyeIcon className="size-5" /> : <EyeOffIcon className="size-5" />}
            </button>
            {form.formState.errors.password && (
              <div className="text-destructive text-xs flex mt-1 items-center gap-1">
                <TriangleAlert className="size-3" />
                <span>{form.formState.errors.password.message?.toString()}</span>
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={signingIn}
          >
            Continue
          </Button>
        </form>
        <Separator />
        <div className="flex flex-col gap-y-2.5">
          <Button
            variant="outline"
            size="lg"
            className="w-full relative"
            onClick={() => { setOpenReset(true) }}
          >
            Forgot password
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          Don&apos;t have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signUp")}
          >
            Sign up
          </span>
        </p>
      </CardContent>
      <PasswordResetModal
        open={openReset}
        onClose={() => setOpenReset(false)}
      />
    </Card>
  );
};
