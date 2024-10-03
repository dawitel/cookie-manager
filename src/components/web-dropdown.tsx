import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define a type for the component prop
interface DropdownProps {
  websites: string[];
  onSelect: (website: string) => void; // Optional: callback to handle the selected website
}

export function WebsiteDropdown({ websites, onSelect }: DropdownProps) {
  const [selectedWebsite, setSelectedWebsite] = useState<string | null>(null);

  const handleSelect = (website: string) => {
    setSelectedWebsite(website);
    if (onSelect) {
      onSelect(website); // Optional: trigger callback if provided
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          {selectedWebsite ? `Selected: ${selectedWebsite}` : "Choose a site"}
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      {/* Add max height and scrolling to the dropdown content */}
      <DropdownMenuContent className="w-56 max-h-40 overflow-y-auto">
        {websites.map((website, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => handleSelect(website)}
            className="cursor-pointer"
          >
            {website}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
