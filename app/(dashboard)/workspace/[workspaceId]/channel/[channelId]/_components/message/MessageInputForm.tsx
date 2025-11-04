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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { orpc } from "@/lib/orpc";
import { toast } from "sonner";
import { useAttachmentUpload } from "@/hooks/use-attachment-upload";

interface MessageInputFormProps {
  channelId: string;
}

export function MessageInputForm({ channelId }: MessageInputFormProps) {
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
      onSuccess: (newMessage) => {
        form.reset({ channelId, content: "" });
        setEditorKey((prevKey) => prevKey + 1);
        form.clearErrors();
        upload.clearImage();
        toast.success("Message created successfully!");
        queryClient.invalidateQueries({
          queryKey: orpc.message.list.key(),
        });
      },
      onError: (error) => {
        console.error("Error creating message:", error);
      },
    })
  );

  function onSubmit(data: CreateMessageSchemaType) {
    createMessageMutation.mutate({
      ...data,
      imageUrl: upload.stagedUrl ?? undefined,
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
