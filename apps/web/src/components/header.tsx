import { NavLink } from "react-router";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";

export default function Header() {
  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/matches", label: "Matches" },
    { to: "/profile", label: "Profile" },
    { to: "/ai", label: "AI Assist" },
  ] as const;

  return (
    <header className="bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="flex items-center justify-between px-10 py-4">
        {/* LEFT: Logo */}
        <div className="flex items-center gap-3 text-2xl font-semibold text-gray-900 dark:text-white">
          <div className="w-9 h-9 rounded-full border-2 border-gray-400 dark:border-white flex items-center justify-center">
            <div className="w-2.5 h-2.5 bg-black dark:bg-white rounded-full"></div>
          </div>
          SkillSync
        </div>

        {/* CENTER: NAV (NO ARROWS) */}
        <nav className="flex items-center gap-10 text-[15px] font-medium text-gray-600 dark:text-gray-300">
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `transition-colors duration-200 ${
                  isActive
                    ? "text-gray-900 dark:text-white font-semibold"
                    : "hover:text-gray-900 dark:hover:text-white"
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          <button className="text-gray-600 dark:text-gray-300 font-medium hover:text-black dark:hover:text-white transition">
            Login
          </button>

          <ModeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
