import { ChangeEvent, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { ReasonModalProp, Option, nonWork, work } from '../types/common'

export const ReasonModal = ({
    open,
    setOpen,
    handleBreakIn,
}: ReasonModalProp) => {

    const [type, setType] = useState<string>('meal_break');
    const [reason, setReason] = useState<string>('');

    const onSave = () => {
        if ((!reason && type === 'meal_break') || (!reason && type === 'out_of_office')) {
            toast.error('Please input reason')
            return
        }
        const reasonValue = reason ? reason : 'toilet'
        handleBreakIn(true, reasonValue, type)
        setReason('')
    }
    const RadioItem = ({ name, option }: { name: string; option: Option }) => (
        <label className="flex cursor-pointer items-center gap-3 py-2 text-[15px] text-slate-800">
            <input
                type="radio"
                name={name}
                value={option.label}
                checked={type === option.label}
                onChange={() => setType(option.label)}
                className="h-4 w-4 appearance-none rounded-full border  border-slate-400 outline-none transition-all checked:bg-blue-700  focus:ring-2 focus:ring-indigo-500"
            />
            <span className="font-medium">{option.label}</span>
        </label>
    );

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Type of break</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 gap-12 md:grid-cols-2 min-h-[295px]">
                    <div className="py-2">
                        <hr className="mt-0 border-slate-300" />
                        <fieldset className="mt-2">
                            <div className="space-y-2">
                                {nonWork.map((o) => (
                                    <RadioItem key={o.id} name="break-type" option={o} />
                                ))}
                            </div>
                            {(type === 'Meal break' || type === 'Out of Office') &&
                                <Input placeholder="Note reason break in" value={reason} className='my-2' onChange={(event: ChangeEvent<HTMLInputElement>) => { setReason(event.target.value ?? '') }} />
                            }
                        </fieldset>
                    </div>
                    <div className="py-2">
                        <hr className="mt-0 border-slate-300" />
                        <fieldset className="mt-4">
                            <div className="space-y-2">
                                {work.map((o) => (
                                    <RadioItem key={o.id} name="break-type" option={o} />
                                ))}
                            </div>
                            {(type === 'Other' || type === 'Called by HR' || type === 'Meeting') &&
                                <Input placeholder="Note reason break in" value={reason} className='my-2' onChange={(event: ChangeEvent<HTMLInputElement>) => { setReason(event.target.value ?? '') }} />
                            }
                        </fieldset>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button onClick={onSave}>Save</Button>
                </DialogFooter>
            </DialogContent>


        </Dialog>
    );
};
