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

interface SummarizeThreadProps {
    messageId: string;
}

export function SummarizeThread({ messageId }: SummarizeThreadProps) {
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
                        {
                            messageId: messageId,
                        },
                        {
                            signal: options.abortSignal,
                        }
                    )
                );
            },
            reconnectToStream() {
                throw new Error("unsupported");
            },
        },
    });
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    className="
        inline-flex items-center gap-2
        rounded-md bg-linear-to-r from-violet-600 to-fuchsia-600
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
            <PopoverContent className="w-25rem p-0" align="end">
                <div className="flex items-center justify-between px-4 py-3 border-b">
                    <div className="flex items-center gap-2">
                        <span className="relative inline-flex items-center justify-center rounded-full bg-linear-to-r from-violet-600 to-fuchsia-600 px-5 py-2 gap-2">
                            <Sparkles className="size-4" />
                            <span className="text-sm font-medium">Ai summary(preview)</span>
                        </span>
                    </div>
                    {
                        status === 'streaming' && (
                            <Button >
                                Stop
                            </Button>
                        )
                    }
                </div>
            </PopoverContent>
        </Popover>
    );
}
