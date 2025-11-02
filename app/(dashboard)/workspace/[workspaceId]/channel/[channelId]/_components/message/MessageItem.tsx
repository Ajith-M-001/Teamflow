import Image from "next/image";

interface MessageItemProps {
  id: number;
  message: string;
  date: Date;
  avatar: string;
  name: string;
}
export function MessageItem({
  avatar,
  date,
  id,
  message,
  name,
}: MessageItemProps) {
  return (
    <div className="flex space-x-3 relative p-3 rounded-lg group hover:bg-muted/50">
      <Image
        className="size-8 rounded-lg"
        src={avatar}
        alt={`${name}'s avatar`}
        width={32}
        height={32}
      />
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center gap-x-2 ">
          <p className="font-medium leading-none">{name}</p>
          <p className="text-xs text-muted-foreground leading-none">
            {new Intl.DateTimeFormat("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric",
            }).format(date)}{" "}
            {new Intl.DateTimeFormat("en-GB", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            }).format(date)}
          </p>
        </div>

        <p className="text-sm wrap-break-word max-w-none">{message}</p>
      </div>
    </div>
  );
}
