import { NavLink } from "react-router";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import { useState, useEffect } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/matches", label: "Matches" },
    { to: "/profile", label: "Profile" },
    { to: "/ai", label: "AI Assist" },
  ] as const;

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [open]);

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 md:px-10 py-4">
          {/* LEFT */}
          <div className="flex items-center gap-3 text-2xl font-semibold text-gray-900 dark:text-white">
            <img src="/black-logo.png" className="h-9 dark:invert" />
            <span className="hidden md:block">EduMax</span>
          </div>

          {/* CENTER */}
          <nav className="hidden md:flex gap-6 text-[15px] font-medium text-gray-600 dark:text-gray-300">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 
                  ${
                    isActive
                      ? "text-black dark:text-white font-semibold bg-gray-100 dark:bg-gray-900"
                      : "hover:text-black dark:hover:text-white hover:shadow-lg transition"
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4 md:gap-5">
            <button className="md:hidden" onClick={() => setOpen(!open)}>
              <img
                src="/menu-black.png"
                className="h-6 w-6 block dark:hidden"
              />
              <img
                src="/menu-white.png"
                className="h-6 w-6 hidden dark:block"
              />
            </button>

            <div className="hidden md:block">
              <ModeToggle />
            </div>

            <UserMenu />
          </div>
        </div>
      </header>

      <div className="h-[72px]" />

      {/* MOBILE MENU */}
      <div
        className={`fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] z-40 transition-all duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        {/* BACKDROP */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        {/* MENU PANEL */}
        <div
          className={`absolute top-0 left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-6 transform transition-transform duration-300 ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {/* 🔥 FIRST ROW */}
          <div className="relative flex items-center mb-4">
            {/* CENTERED FIRST HEADING */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <NavLink
                to={links[0].to}
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-center"
              >
                {links[0].label}
              </NavLink>
            </div>

            {/* 🌙 TOGGLE RIGHT */}
            <div className="ml-auto">
              <ModeToggle />
            </div>
          </div>

          {/* 🔗 REMAINING LINKS */}
          <div className="flex flex-col items-center gap-3">
            {links.slice(1).map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-sm font-medium text-center hover:text-black dark:hover:text-white hover:shadow-lg transition"
              >
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
