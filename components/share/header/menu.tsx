"use client"
import Link from "next/link";
import CartButton from "./cart-button";
import UserButton from "./user-button";

export default function Menu() {
  return (
    <div className="flex items-center justify-end gap-4">
      {/* User / Sign In */}
      <UserButton />

      {/* Cart */}
       <CartButton />
    </div>
  );
}
