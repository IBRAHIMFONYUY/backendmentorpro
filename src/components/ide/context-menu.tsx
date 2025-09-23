
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    disabled?: boolean;
    separator?: boolean;
    isDestructive?: boolean;
}

interface ContextMenuProps {
    x: number;
    y: number;
    items: MenuItem[];
    onClose: () => void;
}

export function ContextMenu({ x, y, items, onClose }: ContextMenuProps) {
    return (
        <div 
            className="fixed z-50 glass-effect rounded-md shadow-lg p-1 w-48 text-sm"
            style={{ top: y, left: x }}
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
        >
            <ul className="space-y-1">
                {items.map((item, index) => (
                    <React.Fragment key={index}>
                        <li
                            onClick={() => {
                                if (!item.disabled) {
                                    item.action();
                                    onClose();
                                }
                            }}
                            className={cn(
                                "flex items-center gap-2 p-2 rounded-sm cursor-pointer",
                                item.disabled 
                                    ? "text-muted-foreground opacity-50 cursor-not-allowed"
                                    : item.isDestructive
                                    ? "text-red-500 hover:bg-red-500/10"
                                    : "hover:bg-primary/20 hover:text-primary-foreground"
                            )}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </li>
                        {item.separator && <hr className="border-border my-1" />}
                    </React.Fragment>
                ))}
            </ul>
        </div>
    );
}

    