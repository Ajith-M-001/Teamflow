import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sparkles } from "lucide-react";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/client";
import { client } from "@/lib/orpc";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";

interface SummarizeThreadProps {
  messageId: string;
}

export function SummarizeThread({ messageId }: SummarizeThreadProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    clearError,
  } = useChat({
    id: `summarize-thread-${messageId}`,
    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.thread.summary.generate(
            { messageId },
            { signal: options.abortSignal }
          )
        );
      },
      reconnectToStream() {
        throw new Error("unsupported");
      },
    },
  });

  const lastAssistant = messages.findLast((m) => m.role === "assistant");
  const summaryText =
    lastAssistant?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n") ?? "";

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    if (nextOpen) {
      const hasAssistantMessage = messages.some((m) => m.role === "assistant");
      if (status !== "ready" || hasAssistantMessage) {
        return;
        }
      sendMessage({ text: "summarize thread" });
    } else {
        stop();
        clearError();
        setMessages([]);
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          className="
            inline-flex items-center gap-2
            rounded-md bg-gradient-to-r from-violet-600 to-fuchsia-600
            px-4 py-2 text-sm font-medium text-white
            transition-all duration-200
            hover:opacity-90 hover:shadow-md
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fuchsia-400
          "
          
        >
          <Sparkles className="h-4 w-4" />
          <span>Summarize Thread</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[25rem] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 gap-2">
              <Sparkles className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                AI Summary (preview)
              </span>
            </span>
          </div>
          {status === "streaming" && (
            <Button size="sm" variant="outline" onClick={stop}>
              Stop
            </Button>
          )}
        </div>

        <div className="px-4 py-3 max-h-80 overflow-y-auto text-sm">
          {error ? (
            <div>
              <p className="text-red-500 mb-2">{error.message}</p>
              <Button
                type="button"
                size="sm"
                onClick={() => {
                  clearError();
                  setMessages([]);
                  sendMessage({ text: "summarize thread" });
                }}
              >
                Retry
              </Button>
            </div>
          ) : summaryText ? (
            <p className="whitespace-pre-wrap">{summaryText}</p>
          ) : status === "submitted" || status === "streaming" ? (
            <div className="space-y-2">
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-5/6 h-6" />
            </div>
          ) : (
            <div className="text-muted-foreground">
              Click summarize to generate a summary.
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
