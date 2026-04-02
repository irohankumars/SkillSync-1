import { Link, useNavigate } from "react-router";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";

import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function UserMenu() {
  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) {
    return <Skeleton className="h-9 w-24 rounded-md" />;
  }

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline">Sign In</Button>
      </Link>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="outline" className="px-3" />}
      >
        {session.user.name}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-56 bg-background border rounded-xl shadow-lg p-2"
      >
        <DropdownMenuGroup>
          {/* 👤 USER INFO */}
          <div className="flex items-center gap-3 px-2 py-2">
            <img
              src={`https://ui-avatars.com/api/?name=${session.user.name}`}
              className="w-8 h-8 rounded-full"
            />
            <div>
              <p className="text-sm font-medium">{session.user.name}</p>
              <p className="text-xs text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </div>

          <DropdownMenuSeparator />

          {/* 👤 PROFILE */}
          <DropdownMenuItem
            onClick={() => navigate("/profile")}
            className="cursor-pointer rounded-md"
          >
            Profile
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {/* 🚪 SIGN OUT */}
          <DropdownMenuItem
            onClick={() => {
              authClient.signOut({
                fetchOptions: {
                  onSuccess: () => {
                    navigate("/");
                  },
                },
              });
            }}
            className="text-red-500 focus:text-red-500 cursor-pointer rounded-md"
          >
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
