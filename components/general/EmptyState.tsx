import Link from "next/link";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "../ui/empty";
import { Database, Plus } from "lucide-react";
import { cn } from "@/lib/utils"; // optional if you use a className utility

interface EmptyStateProps {
  icon?: React.ReactNode;
  className?: string;
  title: string;
  description: string;
  buttonText: string;
  href: string;
}

export function EmptyState({
  icon,
  className,
  title,
  description,
  buttonText,
  href,
}: EmptyStateProps) {
  const IconToRender = icon ?? (
    <Database className="w-8 h-8 text-muted-foreground" />
  );

  return (
    <Empty  className={cn(className, " border border-dashed")}>
      <EmptyHeader>
        <EmptyMedia variant="icon" className="bg-primary/10">
          {IconToRender}
        </EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link
          href={href}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          <span>{buttonText}</span>
        </Link>
      </EmptyContent>
    </Empty>
  );
}
