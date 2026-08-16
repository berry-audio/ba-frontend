import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";

export interface ComboboxItem {
  label: string;
  value: string | number | boolean | null;
  description?: string | null;
}

export interface ComboboxBox {
  items: ComboboxItem[];
  placeholder?: string;
  value?: string | number | boolean | null;
  onChange: (value: any) => void;
  disabled?: boolean;
}

function SelectComboBox({ items, placeholder, value, onChange, disabled = false }: ComboboxBox) {
  const [open, setOpen] = useState(false);

  const selected = value !== undefined && value !== null ? items.find((item) => item.value === value) : undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12 border-0 bg-foreground hover:border-ring hover:ring-ring hover:ring-[3px]"
          disabled={disabled}
        >
          {selected ? selected.label : placeholder}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="p-0 w-(--radix-popover-trigger-width)" align="start">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            <CommandGroup>
              {items?.map((item) => (
                <CommandItem
                  key={String(item.value)}
                  value={item.label}
                  onSelect={() => {
                    setOpen(false);
                    onChange(item.value);
                  }}
                >
                  <div className="flex items-center">
                    <CheckIcon className={cn("mr-2 h-4 w-4", value === item.value ? "opacity-100" : "opacity-0")} />
                    <div>
                      <div>{item.label}</div>
                      {item.description && <div className="opacity-40 text-sm">{item.description}</div>}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default SelectComboBox;