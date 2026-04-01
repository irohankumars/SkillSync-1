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

  // 🔥 LOCK SCROLL WHEN MENU OPEN
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";
  }, [open]);

  return (
    <>
      {/* 🔥 FIXED NAVBAR */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center justify-between px-6 md:px-10 py-4">
          {/* LEFT */}
          <div className="flex items-center gap-3 text-2xl font-semibold text-gray-900 dark:text-white">
            <img src="/black-logo.png" className="h-9 dark:invert" />
            <span className="hidden md:block">SkillSync</span>
          </div>

          {/* CENTER */}
          <nav className="hidden md:flex gap-10 text-[15px] font-medium text-gray-600 dark:text-gray-300">
            {links.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  isActive
                    ? "text-black dark:text-white font-semibold"
                    : "hover:text-black dark:hover:text-white"
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* RIGHT */}
          <div className="flex items-center gap-4 md:gap-5">
            {/* HAMBURGER */}
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

            {/* DESKTOP ONLY */}
            <button className="hidden md:block text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white">
              Login
            </button>

            {/* 🔥 HIDE ON MOBILE */}
            <div className="hidden md:block">
              <ModeToggle />
            </div>

            <UserMenu />
          </div>
        </div>
      </header>

      {/* SPACER */}
      <div className="h-[72px]" />

      {/* 🔥 OVERLAY MENU */}
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
          className={`absolute top-0 left-0 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 px-6 py-6 flex flex-col gap-5 transform transition-transform duration-300 ${
            open ? "translate-y-0" : "-translate-y-full"
          }`}
        >
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="text-lg font-medium hover:text-black dark:hover:text-white"
            >
              {label}
            </NavLink>
          ))}

          {/* 🔥 ADDED HERE (mobile) */}
          <ModeToggle />

          <button className="text-left font-medium hover:text-black dark:hover:text-white">
            Login
          </button>
        </div>
      </div>
    </>
  );
}
