import { NavLink } from "react-router";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/matches", label: "Matches" }, // ✅ added
    { to: "/profile", label: "Profile" }, // ✅ added
    { to: "/ai", label: "AI Chat" },
  ] as const;

  return (
    <div>
      <div className="flex flex-row items-center justify-between px-2 py-1">
        <nav className="flex gap-4 text-lg">
          {links.map(({ to, label }) => {
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  isActive ? "font-bold underline" : "text-muted-foreground"
                }
                end
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  );
}
