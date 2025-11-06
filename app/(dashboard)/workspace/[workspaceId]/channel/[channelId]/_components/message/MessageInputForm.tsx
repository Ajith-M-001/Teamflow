"use client";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import {
  createMessageSchema,
  CreateMessageSchemaType,
} from "@/components/schemas/message";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { MessageComposer } from "./messageComposer";
import { useForm } from "react-hook-form";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { Message } from "@/prisma/generated/prisma";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getAvatar } from "@/lib/get-avatar";

interface MessageInputFormProps {
  channelId: string;
  user: KindeUser<Record<string, unknown>>;
}

type messagePage = {
  items: Message[];
  nextCursor?: string;
};
type infiniteMessages = InfiniteData<messagePage>;

export function MessageInputForm({ channelId, user }: MessageInputFormProps) {
  const queryClient = useQueryClient();
  const [editorKey, setEditorKey] = useState(0);
  const upload = useAttachmentUpload();

  const form = useForm<CreateMessageSchemaType>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      channelId: channelId,
      content: "",
    },
  });

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onMutate: async (data) => {
        await queryClient.cancelQueries({
          queryKey: ["messages.list", channelId],
        });

        const previousData = queryClient.getQueryData<infiniteMessages>([
          "messages.list",
          channelId,
        ]);

        const tempId = `optimistic-${crypto.randomUUID()}`;
        const optimisticMessage: Message = {
          id: tempId,
          content: data.content,
          imageUrl: data.imageUrl ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: user.id,
          authorEmail: user.email!,
          authorName: user.given_name ?? "John Doe",
          authorAvatar: getAvatar(user.picture, user.email!),
          channelId: data.channelId,
        };

        queryClient.setQueryData<infiniteMessages>(
          ["messages.list", channelId],
          (old) => {
            if (!old) {
              return {
                pages: [
                  {
                    items: [optimisticMessage],
                    nextCursor: undefined,
                  },
                ],
                pageParams: [undefined],
              };
            }

            const firstPage = old.pages[0] ?? {
              items: [],
              nextCursor: undefined,
            };

            const updatedFirstPage: messagePage = {
              ...firstPage,
              items: [optimisticMessage, ...firstPage.items],
            };

            return {
              ...old,
              pages: [updatedFirstPage, ...old.pages.slice(1)],
            };
          }
        );

        return { previousData, tempId };
      },
      onSuccess: (data, _variables, context) => {
        queryClient.setQueryData<infiniteMessages>(
          ["messages.list", channelId],
          (old) => {
            if (!old) return old;

            const updatedPages = old.pages.map((page) => ({
              ...page,
              items: page.items.map((item) =>
                item.id === context?.tempId ? { ...data } : item
              ),
            }));

            return {
              ...old,
              pages: updatedPages,
            };
          }
        );
        form.reset({ content: "", channelId });
        upload.clearImage();
        setEditorKey((prev) => prev + 1);
        return toast.success("Message created successfully!");
      },
      onError: (_err, _variables, context) => {
        if (context?.previousData) {
          queryClient.setQueryData(
            ["messages.list", channelId],
            context.previousData
          );
        }

        return toast.error(_err.message || "Failed to create message.");
      },
    })
  );

  function onSubmit(data: CreateMessageSchemaType) {
    createMessageMutation.mutate({
      ...data,
      imageUrl: upload.stagedUrl.trim() ? upload.stagedUrl : undefined,
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          name="content"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <MessageComposer
                  upload={upload}
                  key={editorKey}
                  value={field.value}
                  onChange={field.onChange}
                  onSubmit={() => onSubmit(form.getValues())}
                  isSubmitting={createMessageMutation.isPending}
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
