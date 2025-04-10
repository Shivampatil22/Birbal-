"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Problems", href: "/problems" },
  { name: "Contest", href: "/contest" },
  { name: "Profile", href: "/profile/you" },
];

const Nav = ({ profile_id }) => {
  const pathname = usePathname();
  const { isSignedIn } = useUser(); // Get auth status

  return (
    <nav className="w-full h-15 py-3 flex px-6 items-center justify-between bg-[#222222] text-white">
      <div className="text-xl font-semibold">
        Welcome 
      </div>

      {/* Show links only if user is signed in */}
      {isSignedIn && (
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
      )}

      <UserButton />
    </nav>
  );
};

export default Nav;
