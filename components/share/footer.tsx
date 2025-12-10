"use client";
// Footer: site links and a client-side 'back to top' button

import { APP_NAME } from "@/lib/constants";
import { Button } from "../ui/button";
import { ChevronUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white">
      {/* Back to Top Button */}
      <div className="w-full">
        <Button
          variant="ghost"
          className="bg-gray-800 w-full rounded-none hover:bg-gray-700"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          <ChevronUp className="mr-2 h-4 w-4" />
          Back to top
        </Button>
      </div>

      {/* Footer Content */}
      <div className="p-4 text-center">
        <div className="flex justify-center flex-wrap gap-4 text-sm text-gray-300 mb-2">
          <Link href="/conditions-of-use" className="hover:underline">
            Conditions of Use
          </Link>
          <Link href="/privacy-policy" className="hover:underline">
            Privacy Policy
          </Link>
          <Link href="/help" className="hover:underline">
            Help
          </Link>
        </div>

        <div className="text-sm text-gray-400 mb-4">
          &copy; {new Date().getFullYear()} {APP_NAME}, Inc.
        </div>

        <div className="text-xs text-gray-500">
          Developed by <span className="font-semibold">Habtamu Amare</span> — Gondar, Ethiopia  
          <br />
          📞 +251 945 870 700 &nbsp;|&nbsp; 📧 habtamudev@gmail.com
        </div>
      </div>
    </footer>
  );
}
