"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  Workspace,
  WORKSPACE_NAME_LIMITS,
  workspaceSchema,
} from "@/components/schemas/workspace";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export function CreateWorkspace() {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<Workspace>({
    resolver: zodResolver(workspaceSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: Workspace) => {
    console.log("Workspace created:", data);
    form.reset();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button
              className="size-12 border-dashed border-muted-foreground/50 text-muted-foreground hover:border-muted-foreground hover:text-foreground hover:rounded-lg transition-all duration-300"
              variant="outline"
              size="icon"
            >
              <Plus className="size-5" />
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Create Workspace</p>
        </TooltipContent>
      </Tooltip>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Workspace</DialogTitle>
          <DialogDescription>
            Create a new workspace to get started.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input
                      maxLength={WORKSPACE_NAME_LIMITS.MAX}
                      placeholder="e.g. Marketing Team"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="submit">Create Workspace</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
