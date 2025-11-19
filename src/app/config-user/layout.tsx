"use client";

import { ReactNode } from "react";
import {
    ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Toolbar } from "./Toolbar";
import { SidebarTime } from "./Sidebar"

interface TimeIdLayoutProps {
    children: ReactNode;
}

const TimeLayout = ({ children }: TimeIdLayoutProps) => {
    return (
        <div className="h-full">
            <Toolbar />
            <div className="flex h-[calc(100vh-40px)]">
                <SidebarTime />
                <ResizablePanelGroup
                    direction="horizontal"
                >
                    {children}
                </ResizablePanelGroup>
            </div>
        </div>
    );
};

export default TimeLayout;
