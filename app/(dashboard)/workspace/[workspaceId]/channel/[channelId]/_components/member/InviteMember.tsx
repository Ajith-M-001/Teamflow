"use client";
import {
  InviteMemberSchema,
  InviteMemberSchemaType,
} from "@/components/schemas/member";
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
import { orpc } from "@/lib/orpc";
import { zodResolver } from "@hookform/resolvers/zod";
import { isDefinedError } from "@orpc/client";
import { useMutation } from "@tanstack/react-query";
import { UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export function InviteMember() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<InviteMemberSchemaType>({
    resolver: zodResolver(InviteMemberSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const inviteMutation = useMutation(orpc.workspace.member.invite.mutationOptions({
    onSuccess: () => {
      form.reset();
      toast.success("Member invited successfully!");
      setIsOpen(false);
    },
    onError: (error) => {
      if (isDefinedError(error)) {
        toast.error(error.message);
        return;
      }
      console.error("Error inviting member:", error);
      toast.error("Error inviting member, please try again!");
    }
  }))

  const onSubmit = (data: InviteMemberSchemaType) => {
    inviteMutation.mutate(data);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <UserPlus />
          <span>Invite Member</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invite a New Member</DialogTitle>
          <DialogDescription>
            Send an invitation email to add a new member to your workspace.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form
              className="space-y-6"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button disabled={inviteMutation.isPending} className="w-full" type="submit">
                { inviteMutation.isPending ? "Inviting..." : "Invite"}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
