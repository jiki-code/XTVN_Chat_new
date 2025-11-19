"use client";
import { LockLocal } from "./lockLocal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ReasonModal } from "./components/reasonBreakOut";
import { useState, useEffect } from "react";
import { useConfirm } from "@/hooks/use-confirm"
import { TableLog } from "./components/tableLog";
import { SummaryCard } from "./components/summaryCard";
import { useCurrentUser } from "@/features/auth/components/api/use-current-user";
import { useGetUserActivity } from "@/features/auth/components/api/use-user-activity";
import { useGetDailySummary } from "@/features/auth/components/api/use-get-daily-sumary";
import { Loader } from "lucide-react";
import { useRecordActivity } from "@/features/auth/components/api/use-record-activity";
import { Id } from "../../../convex/_generated/dataModel";
import { useForm } from "react-hook-form";
type FormValues = {
    userId: Id<"users">;
    type: "checkin" | "checkout" | "breakin" | "breakout";
    reason?: string | undefined;
    breakType?: string | undefined;
    start?: number | undefined;
    end?: number | undefined;
};
export default function Page() {
    const [isOpen, setIsOpen] = useState(false);
    const [typeBreakIn, setTypeBreakIn] = useState("");
    const [note, setNote] = useState("");
    const [UserID, setUserID] = useState<string>("");
    const { data: user, isLoading: isUserLoading } = useCurrentUser();
    const form = useForm<FormValues>({
        defaultValues: {
            type: "checkin",
            userId: "" as unknown as Id<"users">,
            start: 0,
            end: 0,
            reason: "",
            breakType: ""
        }
    });
    const { users, isLoading: isActivityLoading } = useGetUserActivity({
        userId: user?._id,
    });
    const { summary, } = useGetDailySummary({
        userId: user?._id,
    });
    const isLoading = isUserLoading || isActivityLoading;
    const updateRecord = useRecordActivity();

    const [isBreak, setIsBreak] = useState<boolean | null>(null);
    const [formCheck, setFormCheck] = useState({
        isCheckIn: false,
        isCheckOut: false,
    })

    useEffect(() => {
        if (user?._id) {
            setUserID(user._id);
        }
    }, [user]);

    const onApplyAPI = (apiType: "checkin" | "checkout" | "breakin" | "breakout") => {
        const values = form.getValues();
        const data = {
            breakType: values.breakType || "",
            reason: values.reason || "",
            start: values.start ?? 0,
            end: values.end ?? 0,
            userId: UserID as Id<"users">,
            type: apiType,
        };
        updateRecord
            .mutateAsync(data)
            .then(() => {

            })
            .catch((error) => {
                console.error(error);
            });
    }

    const [ConfirmDialogCheckoutOut, confirmCO] = useConfirm(
        "Are you sure?",
        "You will check out right now ?"
    );

    const [ConfirmDialogBreakOut, confirmBO] = useConfirm(
        "Are you sure?",
        `You will break out ${typeBreakIn} right now ?`
    );

    const confirmCheckOut = async () => {
        const ok = await confirmCO();
        if (!ok) return;
        toast.success("Check out successfully!");
        setFormCheck({
            isCheckOut: false,
            isCheckIn: true,
        });
        form.setValue("start", 0);
        onApplyAPI('checkout');
        form.reset()
    };

    const confirmBreakOut = async () => {
        const ok = await confirmBO();
        if (!ok) return;
        setIsBreak(false);
        form.setValue("end", Date.now());
        form.setValue("breakType", typeBreakIn);
        form.setValue("reason", note);
        onApplyAPI('breakout')
        toast.success("Break out successfully!");
        setTypeBreakIn('');
        setNote('')
        form.reset()

    };
    const handleAction = (type: string) => {
        if (type === "CI") {
            toast.success("Check in successfully!");
            setFormCheck({
                isCheckOut: true,
                isCheckIn: false,
            });
            form.setValue("start", Date.now());
            onApplyAPI('checkin')

        } else if (type === "CO") {
            confirmCheckOut()
        } else if (type === "BI") {
            setIsOpen(true);
        } else {
            confirmBreakOut()
        }
    };
    function onBreakIn(isBreak: boolean, note: string, type: string) {
        if (isBreak) {
            setIsOpen(false);
            setIsBreak(true);
            setTypeBreakIn(type);
            setNote(note)
            form.setValue("reason", note);
            form.setValue("breakType", type);
            form.setValue("start", Date.now());
            onApplyAPI("breakin");
            toast.success("Break in successfully!");
        }
    }
    return (

        <main className="min-h-screen w-full bg-neutral-100 p-4 md:p-6">
            <ReasonModal handleBreakIn={onBreakIn} open={isOpen} setOpen={setIsOpen} />
            <ConfirmDialogCheckoutOut />
            <ConfirmDialogBreakOut />

            <div className="mx-auto w-full rounded-xl border border-neutral-200 bg-white p-4 shadow-sm md:p-4">
                {/* Clock Card */}
                <section className="rounded-xl bg-[#030637] border-[#910A67] border-4 p-4 text-white shadow-inner">
                    <div className="mx-auto w-11/12">
                        <LockLocal locale="vi-VN" timeZone="Asia/Phnom_Penh" />
                    </div>
                </section>
                {/* Actions */}
                <div className="mt-6 w-full flex flex-wrap justify-center gap-8">
                    <Button
                        disabled={formCheck.isCheckOut}
                        onClick={() => {
                            handleAction("CI");
                        }}
                        className="rounded-lg bg-fuchsia-600 px-7 py-2 text-sm font-semibold text-white transition hover:bg-fuchsia-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-300"
                    >
                        Check In
                    </Button>
                    {!isBreak ? <Button
                        onClick={() => {
                            handleAction("BI");
                        }}
                        className="rounded-lg bg-purple-600 px-7 py-2 text-sm font-semibold text-white transition hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                    >
                        Break In
                    </Button> :
                        <Button
                            onClick={() => {
                                handleAction("BO");
                            }}
                            className="rounded-lg bg-purple-600 px-7 py-2 text-sm font-semibold text-white transition hover:bg-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-300"
                        >
                            Break Out
                        </Button>

                    }

                    <Button
                        onClick={() => {
                            handleAction("CO");
                        }}
                        disabled={formCheck.isCheckIn}
                        className="rounded-lg bg-rose-600 px-7 py-2 text-sm font-semibold text-white transition hover:bg-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-300"
                    >
                        Check Out
                    </Button>
                </div>

                {/* Content Grid */}
                <section className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
                    {/* Table */}
                    <div className="md:col-span-2">
                        <div className="rounded-xl border border-fuchsia-800/30 bg-fuchsia-900/90 p-4 text-white">
                            <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/40 text-xs">
                                    ⌚
                                </span>
                                Today Logs
                            </div>
                            {isLoading ? <div className="h-full flex items-center justify-center">
                                <Loader className="size-6 animate-spin text-muted-foreground" />
                            </div> : <TableLog mockLogs={users ?? []} className="max-h-[420px] overflow-y-auto" />}
                        </div>
                    </div>

                    {/* Sidebar Summary */}
                    <aside className="space-y-3">
                        <SummaryCard label="Check In:" value={summary?.checkIn ?? ''} />
                        <SummaryCard label="Total Hours:" value={summary?.totalHours} />
                        <SummaryCard label="Total Break:" value={summary?.totalBreak} />
                        <SummaryCard label="Total Work:" value={summary?.totalWork} />
                    </aside>
                </section>
            </div>
        </main>
    );
}


