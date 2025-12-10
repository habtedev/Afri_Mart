// Search: category select, query input and submit button
import * as React from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search as SearchIcon } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

const categories = ["women", "men", "kids", "electronics", "jewelery"];

export function Search() {
  return (
  <form action="/search" method="GET" className="flex items-stretch h-9 w-full">
      {/* Category Select */}
      <Select name="category">
        <SelectTrigger className="w-auto h-full bg-gray-200 text-black border border-gray-300 rounded-l-md rounded-r-none px-3 py-0 text-sm box-border flex items-center justify-center data-[size=default]:h-9">
          <SelectValue placeholder="All" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Search Input */}
      <Input
        type="text"
        name="q"
        placeholder={`Search products on ${APP_NAME}`}
        className="flex-1 h-full rounded-none border border-gray-300 bg-gray-100 text-black text-base px-3"
        aria-label={`Search products on ${APP_NAME}`}
      />

      {/* Search Button */}
      <button
        type="submit"
        className="h-full px-3 bg-yellow-400 hover:bg-yellow-500 text-black rounded-r-md flex items-center justify-center"
        aria-label="Submit search"
      >
  <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  );
}
