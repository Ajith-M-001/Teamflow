import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const members = [
  {
    id: 1,
    name: "John Doe",
    imageUrl: "https://avatars.githubusercontent.com/u/76267404?v=4",
    email: "FtRbD@example.com",
  },
  {
    id: 2,
    name: "John Doe",
    imageUrl: "https://avatars.githubusercontent.com/u/76267404?v=4",
    email: "FtRbD@example.com",
  },
];

export function WorkspaceMembersList() {
  return (
    <div className="space-y-0.5 py-1 ">
      {members.map((member) => (
        <div key={member.id} className="flex items-center  px-3 py-2 hover:bg-accent cursor-pointer transition-colors space-x-3">
          <div className="relative">
            <Avatar className="size-8 relative">
              <AvatarImage
                src={member.imageUrl}
                alt={`${member.name} image`}
                className="object-cover"
              />
              <AvatarFallback>
                {member.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{member.name}</p>
            <p className="text-xs text-muted-foreground truncate">{member.email}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
