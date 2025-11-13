import { Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useEffect, useRef, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { useChat } from "@ai-sdk/react";
import { eventIteratorToStream } from "@orpc/server";
import { client } from "@/lib/orpc";

interface ComposeAssistantProps {
  content: string;
  onAccept?: (markdown: string) => void;
}

export function ComposeAssistant({ content, onAccept }: ComposeAssistantProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const contentRef = useRef(content);

  useEffect(() => {
    contentRef.current = content;
  }, [content]);

  const {
    messages,
    status,
    error,
    sendMessage,
    setMessages,
    stop,
    clearError,
  } = useChat({
    id: `compose-assistant`,
    transport: {
      async sendMessages(options) {
        return eventIteratorToStream(
          await client.ai.compose.generate(
            { content: contentRef.current },
            { signal: options.abortSignal }
          )
        );
      },
      reconnectToStream() {
        throw new Error("unsupported");
      },
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setIsOpen(nextOpen);

    if (nextOpen) {
      const hasAssistantMessage = messages.some((m) => m.role === "assistant");
      if (status === "ready" && !hasAssistantMessage) {
        sendMessage({ text: "rewrite content" });
      }
    } else {
      stop();
      clearError();
      setMessages([]);
    }
  };

  const lastAssistant = messages.findLast((m) => m.role === "assistant");
  const ComposeText =
    lastAssistant?.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n") ?? "";

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
          <span>Compose</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[25rem] p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-5 py-2 gap-2">
              <Sparkles className="size-4 text-white" />
              <span className="text-sm font-medium text-white">
                compose assistant (preview)
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
          ) : ComposeText ? (
            <p className="whitespace-pre-wrap">{ComposeText}</p>
          ) : status === "submitted" || status === "streaming" ? (
            <div className="space-y-2">
              <Skeleton className="w-3/4 h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-5/6 h-6" />
            </div>
          ) : (
            <div className="text-muted-foreground">
              Click compose to generate.
            </div>
          )}
        </div>
        <div className="flex items-center justify-end gap-2 border-t px-3 py-2 bg-muted/30">
          <Button
            onClick={() => {
              stop();
              clearError();
              setMessages([]);
              setIsOpen(false);
            }}
            type="submit"
            variant="outline"
            size="sm"
          >
            Decline
          </Button>
          <Button
            onClick={() => {
              if (!ComposeText) return;
              onAccept?.(ComposeText);
              stop();
              clearError();
              setMessages([]);
              setIsOpen(false);
            }}
            disabled={!ComposeText}
            type="submit"
            size="sm"
          >
            Accept
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
