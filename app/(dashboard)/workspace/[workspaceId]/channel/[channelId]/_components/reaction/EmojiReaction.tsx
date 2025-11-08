import { Button } from "@/components/ui/button";
import {
  EmojiPicker,
  EmojiPickerContent,
  EmojiPickerFooter,
  EmojiPickerSearch,
} from "@/components/ui/emoji-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { useState } from "react";

interface EmojiReactionProps {
  onSelect: (emoji: string) => void;
}

export function EmojiReaction({ onSelect }: EmojiReactionProps) {
    const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleEmojiSelect = (emoji: string) => {
    onSelect(emoji);
    setIsOpen(false);
  };
  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button type="button" size="icon" className="size-6" variant="ghost">
          <Smile className="size-4 " />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit p-0" align="start">
        <EmojiPicker
          onEmojiSelect={(e) => handleEmojiSelect(e.emoji)}
          className="h-[342px]"
        >
          <EmojiPickerSearch />
          <EmojiPickerContent />
          <EmojiPickerFooter />
        </EmojiPicker>
      </PopoverContent>{" "}
    </Popover>
  );
}
