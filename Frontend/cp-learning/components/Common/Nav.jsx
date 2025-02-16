"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Problems", href: "/problems" },
  { name: "Contests", href: "/contests" },
  { name: "Profile", href: "/profile" },
];

const Nav = ({ profile_id }) => {
  const pathname = usePathname(); // Get current route

  return (
    <nav className="w-full h-15 py-3 flex px-6 items-center justify-between bg-gray-900 text-white">
      <div className="text-xl font-semibold">Welcome {profile_id}</div>

      {/* Navigation Links */}
      <div className="flex space-x-6">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-md transition-all ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>

      <UserButton />
    </nav>
  );
};

export default Nav;
