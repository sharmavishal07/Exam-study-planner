import { Moon, Sun, Cloud } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-lg">
        <Sun className="h-5 w-5 text-muted-foreground" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        if (theme === 'light') setTheme('comfort-blue');
        else if (theme === 'comfort-blue') setTheme('dark');
        else setTheme('light');
      }}
      className="h-9 w-9 rounded-lg transition-colors border-none hover:bg-accent"
      title="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon className="h-5 w-5 text-primary" />
      ) : theme === "comfort-blue" ? (
        <Cloud className="h-5 w-5 text-primary" />
      ) : (
        <Sun className="h-5 w-5 text-yellow-500" />
      )}
    </Button>
  );
}
