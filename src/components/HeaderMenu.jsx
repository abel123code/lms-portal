"use client";

import { useState } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function HeaderMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  
  //console.log("session::::", session);

  // Toggle the drop-down menu
  const handleIconClick = () => setIsOpen((prev) => !prev);

  // Get user role (fallback to empty string to avoid errors)
  const userRole = session?.user?.role || "";

  // Define navigation items based on role
  const menuItems = {
    student: [
      { label: "Assignments", href: "/student" }
    ],
    teacher: [
      { label: "Teacher Dashboard", href: "/teacher" },
      { label: "Assign Lesson", href: "/teacher/assign-lesson" }
    ],
  };

  // Get menu items based on user role (default empty array if role is missing)
  const userMenuItems = menuItems[userRole] || [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left side: Logo/Brand */}
        <Link className="flex items-center space-x-2" href="/">
          <span className="text-lg font-bold">TuitionLMS</span>
        </Link>

        {/* Right side: Profile Pic or Hamburger Icon */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleIconClick}
            aria-label="Toggle menu"
            className="flex items-center justify-center"
          >
            {session && session.user ? (
              // If user is logged in, show profile picture
              <Image
                src={session.user.image ?? "/default-avatar.png"}
                alt="Profile"
                className="h-8 w-8 rounded-full object-cover"
                width={32}
                height={32}
              />
            ) : (
              // If not logged in, show hamburger icon
              <Menu className="h-6 w-6" />
            )}
          </Button>

          {/* Drop-down Menu */}
          {isOpen && (
            <nav className="absolute right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="py-1">
                {session && session.user ? (
                  <>
                    {/* Dynamically Render Tabs Based on Role */}
                    {userMenuItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    <div className="my-1 border-t border-gray-200" />
                    <button
                      onClick={() => {
                        signOut();
                        setIsOpen(false);
                      }}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  // Not logged in → Show Home & Login
                  <>
                    <Link
                      href="/"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Home
                    </Link>
                    <div className="my-1 border-t border-gray-200" />
                    <Link
                      href="/login"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsOpen(false)}
                    >
                      Login
                    </Link>
                  </>
                )}
              </div>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}
