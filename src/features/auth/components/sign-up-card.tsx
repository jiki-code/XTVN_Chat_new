import { useAuthActions } from "@convex-dev/auth/react";
import { TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SignInFlow } from "../types";
import { LogoIcon } from "@/components/iconLog";
interface SignUpCardProps {
  setState: (state: SignInFlow) => void;
}

export const SignUpCard = ({ setState }: SignUpCardProps) => {
  const [signingUp, setSigningUp] = useState(false);
  const [error, setError] = useState("");
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { signIn } = useAuthActions();

  const handlePasswordSignUp = form.handleSubmit(
    ({ name, email, password, confirmPassword }) => {
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
      setSigningUp(true);
      signIn("password", { name, email, password, flow: "signUp" })
        .catch(() => {
          setError("Something went wrong!");
        })
        .finally(() => {
          setSigningUp(false);
        });
    }
  );


  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0 flex flex-col items-center justify-center">
        <LogoIcon
          className="size-16 fill-secondary stroke-black hover:fill-black transition-colors duration-200 ease-in delay-100"
          strokeWidth={180}
        />
        <CardTitle>Sign up to continue</CardTitle>

      </CardHeader>
      {error && (
        <div className="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{error}</p>
        </div>
      )}
      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={handlePasswordSignUp}>
          <Input
            {...form.register("name", {
              required: "Full Name is required",
            })}
            disabled={signingUp}
            placeholder="Full name"
          />
          {form.formState.errors.name && (
            <div className="text-destructive text-xs flex mt-1 items-center gap-1">
              <TriangleAlert className="size-3" />
              <span>{form.formState.errors.name.message?.toString()}</span>
            </div>
          )}
          <Input
            {...form.register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Email is not valid",
              },
            })}
            disabled={signingUp}
            placeholder="Email"
            type="email"
          />
          {form.formState.errors.email && (
            <div className="text-destructive text-xs flex mt-1 items-center gap-1">
              <TriangleAlert className="size-3" />
              <span>{form.formState.errors.email.message?.toString()}</span>
            </div>
          )}
          <div className="relative">
            <Input
              {...form.register("password", {
                required: "Password is required",
              })}
              disabled={signingUp}
              placeholder="Password"
              type="text"
              className="pr-10"
            />
     
            {form.formState.errors.password && (
              <div className="text-destructive text-xs flex mt-2 items-center gap-1">
                <TriangleAlert className="size-3" />
                <span>{form.formState.errors.password.message?.toString()}</span>
              </div>
            )}

          </div>
          <div className="relative">
            <Input
              {...form.register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === form.getValues("password") || "Passwords do not match",
              })}
              disabled={signingUp}
              placeholder="Confirm password"
              type="text" 
              className="pr-10"

            />
            {form.formState.errors.confirmPassword && (
              <div className="text-destructive text-xs flex mt-2 items-center gap-1">
                <TriangleAlert className="size-3" />
                <span>{form.formState.errors.confirmPassword.message?.toString()}</span>
              </div>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={signingUp}
          >
            Continue
          </Button>
        </form>
        <p className="text-xs text-muted-foreground">
          Already have an account?{" "}
          <span
            className="text-sky-700 hover:underline cursor-pointer"
            onClick={() => setState("signIn")}
          >
            Sign in
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
