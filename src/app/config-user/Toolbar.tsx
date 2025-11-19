"use client";

import { Info } from "lucide-react";

import { Button } from "@/components/ui/button";

export const Toolbar = () => {
  return (
    <div className="bg-[#3C0753] flex items-center justify-between h-10 p-1.5">
   
      <div className="ml-auto flex-1 flex items-center justify-end">
          <Button variant="transparent" size="iconSm" disabled>
            <Info className="size-5 text-white" />
          </Button>
      </div>
    </div>
  );
};
