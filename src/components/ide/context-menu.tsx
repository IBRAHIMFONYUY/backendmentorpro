
"use client";

import { cn } from "@/lib/utils";
import { Cut, Copy, Paste, Edit, Trash2, CopyPlus } from "lucide-react";

interface MenuItem {
    label: string;
    icon: React.ReactNode;
    action: () => void;
    disabled?: boolean;
    separator?: boolean;
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
        >
            <ul className="space-y-1">
                {items.map((item, index) => (
                    <div key={index}>
                        {item.separator && <hr className="border-border my-1" />}
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
                                    : "hover:bg-primary/20 hover:text-primary-foreground"
                            )}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </li>
                    </div>
                ))}
            </ul>
        </div>
    );
}
