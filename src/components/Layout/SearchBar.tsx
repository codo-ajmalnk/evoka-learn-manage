import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useState, useCallback, useEffect, memo } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export const SearchBar = memo(({ onSearch }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    onSearch(debouncedQuery);
  }, [debouncedQuery, onSearch]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  return (
    <div className="relative flex-1 max-w-md hidden sm:block">
      <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        placeholder="Search students, tutors, assignments..."
        value={searchQuery}
        onChange={handleInputChange}
        className="pl-10 sm:pl-12 w-full bg-background/70 backdrop-blur-sm border-border/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all duration-200 rounded-xl text-sm h-9 sm:h-10 shadow-sm"
      />
    </div>
  );
});

SearchBar.displayName = "SearchBar"; 