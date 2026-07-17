import { type HTMLAttributes, type ReactNode } from 'react';
import { cn } from "@/lib/utils";


interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Card = ({ children, className, ...props }: CardProps) => {
  return (
    <>
      <div {...props} className={cn(" bg-card border border-(--card-border) flex flex-col justify-between items-center w-full rounded-lg ", className)}>{children}</div>
    </>
  );
};

export default Card;
