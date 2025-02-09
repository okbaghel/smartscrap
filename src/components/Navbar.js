"use client";

import Link from "next/link";
import { useUser, SignInButton, UserButton } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function Navbar() {
  const { isSignedIn } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="bg-white dark:bg-gray-900 border-b shadow-sm">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        {/* Brand Name */}
        <Link href="/" className="text-2xl font-bold text-green-700 dark:text-green-400">
          SmartScrap
        </Link>

        {/* Dark Mode Toggle & User Auth Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 text-yellow-500" />
            ) : (
              <Moon className="h-5 w-5 text-gray-800 dark:text-gray-200" />
            )}
          </button>

          {isSignedIn ? (
            <UserButton afterSignOutUrl="/" />
          ) : (
            <SignInButton mode="modal">
              <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">
                Login
              </button>
            </SignInButton>
          )}
        </div>
      </div>
    </nav>
  );
}
