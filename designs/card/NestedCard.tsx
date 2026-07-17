import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from "@/lib/utils";

interface NestedCardProps extends HTMLAttributes<HTMLDivElement> {
    children?: ReactNode;
}

export const NestedCard = ({ children, className, ...props }: NestedCardProps) => {
    return (
        <div
            {...props}
            className={cn(
                "bg-secondary/10 border border-border/50 flex flex-col justify-between items-center w-full rounded-lg",
                className
            )}
        >
            {children}
        </div>
    );
};

export default NestedCard;
