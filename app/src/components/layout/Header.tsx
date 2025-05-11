import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-xl">Todo App</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/todos"
              className="transition-colors hover:text-foreground/80"
            >
              Tasks
            </Link>
            <Link
              href="/categories"
              className="transition-colors hover:text-foreground/80"
            >
              Categories
            </Link>
            <Link
              href="/test"
              className="transition-colors hover:text-foreground/80 text-green-600 dark:text-green-400"
            >
              Test
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <nav className="flex items-center">
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  );
}
