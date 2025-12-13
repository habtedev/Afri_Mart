import Link from "next/link";
import CartButton from "./cart-button";

export default function Menu() {
  return (
    <div className="flex items-center justify-end gap-4">
      {/* User / Sign In */}
      <Link href="/signin" className="header-button flex items-center gap-2">
        Hello, Sign In
      </Link>

      {/* Cart */}
       <CartButton />
    </div>
  );
}
