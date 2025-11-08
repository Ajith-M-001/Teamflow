"use client";
import {
  createMessageSchema,
  CreateMessageSchemaType,
} from "@/components/schemas/message";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { MessageComposer } from "../message/messageComposer";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";
import { useEffect, useState } from "react";
import { orpc } from "@/lib/orpc";
import { InfiniteData, useMutation, useQueryClient } from "@tanstack/react-query";
import { isDefinedError } from "@orpc/client";
import { toast } from "sonner";
import { Message } from "@/prisma/generated/prisma";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs";
import { getAvatar } from "@/lib/get-avatar";
import { MessageListItem } from "@/lib/types";

interface ThreadReplyProps {
  threadId: string;
  user: KindeUser<Record<string, unknown>>;
}

export function ThreadReplyForm({ threadId, user }: ThreadReplyProps) {
  const { channelId } = useParams<{ channelId: string }>();
  const [editorKey, setEditorKey] = useState(0);

  const upload = useAttachmentUpload();
  const queryclient = useQueryClient();

  const createMessageMutation = useMutation(
    orpc.message.create.mutationOptions({
      onMutate: async (data) => {
        const listOptions = orpc.message.thread.list.queryOptions({
          input: {
            messageId: threadId,
          },
        });

        type messagePage = {
          items: MessageListItem[]
          nextCursor?: string;
        }

        type infiniteMessages = InfiniteData<messagePage>


        await queryclient.cancelQueries({ queryKey: listOptions.queryKey });

        const previous = queryclient.getQueryData(listOptions.queryKey);

        const optimistic: Message = {
          id: `optimistic-${crypto.randomUUID()}`,
          content: data.content,
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: user.id,
          authorEmail: user.email!,
          authorName: user.given_name ?? "John Doe",
          authorAvatar: getAvatar(user.picture, user.email!),
          channelId: data.channelId,
          threadId: data.threadId!,
          imageUrl: data.imageUrl ?? null,
        };

        queryclient.setQueryData(listOptions.queryKey, (old) => {
          if (!old) return old;
          return {
            ...old,
            messages: [...old.messages, optimistic],
          };
        });

        //optimistacally bump reliesCount in message list for the parent message
        queryclient.setQueryData<infiniteMessages>(["messages.list", data.channelId], (old) => {
          if (!old) return old;
           const pages = old.pages.map((page) => ({
             ...page,
             items: page.items.map((item) => {
               if (item.id === threadId) {
                 return {
                   ...item,
                   repliesCount: item.repliesCount + 1,
                 };
               }
               return item;
             }),
           }))
          
          return {
            ...old,
            pages,
          };
        });
        return {
          listOptions,
          previous,
        };
      },
      onSuccess: (_data, _vars, ctx) => {
        queryclient.invalidateQueries({ queryKey: ctx?.listOptions.queryKey });
        form.reset({ content: "", threadId });
        upload.clearImage();
        setEditorKey((prev) => prev + 1);
        toast.success("Message sent successfully!");
      },
      onError: (_err, _variables, ctx) => {
        if (!ctx) return;
        const { listOptions, previous } = ctx;
        if (previous) {
          queryclient.setQueryData(listOptions.queryKey, previous);
        }
      },
    })
  );

  const form = useForm<CreateMessageSchemaType>({
    resolver: zodResolver(createMessageSchema),
    defaultValues: {
      content: "",
      channelId,
      threadId,
    },
  });

  useEffect(() => {
    form.setValue("threadId", threadId);
  }, [threadId, form]);

  function onSubmit(data: CreateMessageSchemaType) {
    createMessageMutation.mutate({
      ...data,
      imageUrl: upload.stagedUrl.trim() ? upload.stagedUrl : undefined,
    });
    form.reset();
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <MessageComposer
                    value={field.value}
                    onChange={field.onChange}
                    upload={upload}
                    key={editorKey}
                    onSubmit={() => onSubmit(form.getValues())}
                    isSubmitting={createMessageMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
