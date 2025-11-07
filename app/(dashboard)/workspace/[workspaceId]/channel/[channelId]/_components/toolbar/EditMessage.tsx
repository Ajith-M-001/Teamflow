"use client";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import {
  updateMessageSchema,
  UpdateMessageSchemaType,
} from "@/components/schemas/message";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { orpc } from "@/lib/orpc";
import { Message } from "@/prisma/generated/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface EditMessageProps {
  message: Message;
  onCancel: () => void;
  onSave: () => void;
}

export function EditMessage({ message, onCancel, onSave }: EditMessageProps) {
  const queryClient = useQueryClient();

  const form = useForm<UpdateMessageSchemaType>({
    resolver: zodResolver(updateMessageSchema),
    defaultValues: {
      messageId: message.id,
      content: message.content,
    },
  });

  const updateMutation = useMutation(
    orpc.message.update.mutationOptions({
      onSuccess: (updated) => {
        type MessagePages = { items: Message[]; nextCursor?: string };
        queryClient.setQueryData<InfiniteData<MessagePages>>(
          ["messages.list", message.channelId],
          (old) => {
            if (!old) return old;

            const updatedMessage = updated.message;
            const newPages = old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === updatedMessage.id
                  ? { ...item, ...updatedMessage }
                  : item
              ),
            }));

            return {
              ...old,
              pages: newPages,
            };
          }
        );

        toast.success("Message updated successfully!");
        onSave?.();
      },
      onError: (error) => {
        if (isDefinedError(error)) {
          toast.error(error.message);
          return;
        }
        console.error("Error inviting member:", error);
        toast.error("Error inviting member, please try again!");
      },
    })
  );

  const onSubmit = (values: UpdateMessageSchemaType) => {
    updateMutation.mutate(values);
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <RichTextEditor
                  field={field}
                  sendButton={
                    <div className="flex items-center gap-4">
                      <Button
                        onClick={onCancel}
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={updateMutation.isPending}
                      >
                        Cancel
                      </Button>
                      <Button
                        disabled={updateMutation.isPending}
                        type="submit"
                        size="sm"
                      >
                        {updateMutation.isPending ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
