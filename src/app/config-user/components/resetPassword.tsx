// "use client";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { CheckCircle2, Loader2, RefreshCw } from "lucide-react";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
// import { useChangePassword } from "@/features/auth/api/useResetPassword";
// import { toast } from "sonner";
// import { Id } from "../../../../convex/_generated/dataModel";
// import { useUserList } from "@/features/auth/api/useCurrentUser";

// type FormValues = {
//   "password": string;
// }

// type ResetPasswordProp = {
//   user_id: Id<"users">;
// };

// export function ResetPassword({ user_id }: ResetPasswordProp ) {
//   const [success, setSuccess] = useState(false);
//   const changePassword = useChangePassword();
//   const [open, setOpen] = useState(false);
//   const form = useForm<FormValues>({
//     defaultValues: {
//       password: "",

//     },
//   });
//   const { handleSubmit, setValue } = form;
//   const generateRandomPassword = (length: number = 12) => {
//     const chars =
//       "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+";

//     let password = "";
//     for (let i = 0; i < length; i++) {
//       const randomIndex = Math.floor(Math.random() * chars.length);
//       password += chars[randomIndex];
//     }
//     return password;
//   };

//   async function onSubmit(values: FormValues) {
//     changePassword
//       .mutateAsync({ userId:  user_id, newPassword: values.password })
//       .then(() => {
//         toast.success("Password updated");
//         useUserList()
//         setOpen(false)
//       })
//       .catch((error) => {
//         console.error(error);
//         toast.error("Failed to update Password");
//       });
//     setSuccess(true)
//     setSuccess(false)

//   }

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogTrigger asChild>
//         <Button className="cursor-pointer" size='sm' variant="default">
//           Reset Password
//         </Button>
//       </DialogTrigger>
//       <DialogContent className="sm:max-w-[330px]">
//         <DialogHeader>
//           <DialogTitle className="text-center">Reset Password</DialogTitle>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-2">
//             <FormField
//               control={form.control}
//               name="password"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Password</FormLabel>
//                   <FormControl>
//                     <div className="relative">
//                       <Input
//                         type="text"
//                         placeholder="Enter password"
//                         {...field}
//                       />
//                       <button
//                         type="button"
//                         className="absolute cursor-pointer inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
//                         onClick={() => {
//                           setValue("password", generateRandomPassword(10));
//                         }}
//                       >
//                         <RefreshCw className="h-5 w-5" />
//                       </button>
//                     </div>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <DialogFooter>
//               <DialogClose asChild>
//                 <Button
//                   className="cursor-pointer"
//                   variant="outline"
//                   type="button"
//                 >
//                   Cancel
//                 </Button>
//               </DialogClose>
//               <Button
//                 type="submit"
//                 className="cursor-pointer"
//                 disabled={success}
//               >
//                 {success ? (
//                   <span className="flex items-center gap-2">
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Saving ...
//                   </span>
//                 ) : (
//                   "Save"
//                 )}
//               </Button>
//             </DialogFooter>
//             {success && (
//               <div className="flex items-center gap-2 text-green-600 text-sm mt-2">
//                 <CheckCircle2 className="h-4 w-4" />
//                 Resset successfully!
//               </div>
//             )}
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
