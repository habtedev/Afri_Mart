import Link from "next/link";
import { ShoppingCartIcon, UserIcon } from "lucide-react";

export default function Menu() {
  return (
    <div className="flex items-center justify-end gap-4">
      {/* User / Sign In */}
      <Link href="/signin" className="header-button flex items-center gap-2">
        Hello, Sign In
      </Link>

      {/* Cart */}
      <Link href="/cart" className="header-button flex items-center gap-2">
      <div className="flex items-end">
        <ShoppingCartIcon className="w-8 h-8" />
          Cart
         </div>
      </Link>
    </div>
  );
}
