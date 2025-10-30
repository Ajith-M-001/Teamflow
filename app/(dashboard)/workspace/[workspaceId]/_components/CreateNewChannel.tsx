"use client";
import { Button } from "@/components/ui/button";
import {
  DialogTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ChannelNameSchema,
  ChannelNameSchemaType,
  transformChannelName,
} from "@/components/schemas/channel";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

export function CreateNewChannel() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<ChannelNameSchemaType>({
    resolver: zodResolver(ChannelNameSchema),
    defaultValues: {
      name: "",
    },
  });

  const watchedName = form.watch("name");
  const transformedName = watchedName ? transformChannelName(watchedName) : "";
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="size-4" />
          <span>Add Channel</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Channel</DialogTitle>
          <DialogDescription>
            Create New Channel to get started!
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(() => {})} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Channel Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="My Channel" />
                  </FormControl>
                  {transformedName && (
                    <p className="text-sm text-muted-foreground">
                      will be created as:{" "}
                      <code className="bg-muted px-1 py-0.5 rounded text-xs">
                        {transformedName}
                      </code>
                    </p>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
