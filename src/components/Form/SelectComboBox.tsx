import { useRef, useState } from "react";
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
  name?: string;
}

const setNativeValue = (input: HTMLInputElement, value: string) => {
  Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")!.set!.call(input, value);
  input.dispatchEvent(new Event("change", { bubbles: true }));
};

function SelectComboBox({ items, placeholder, value, onChange, disabled = false, name }: ComboboxBox) {
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = items.find((item) => item.value === value);

  const handleSelect = (item: ComboboxItem) => {
    setOpen(false);
    onChange(item.value);
    if (inputRef.current) setNativeValue(inputRef.current, String(item.value ?? ""));
  };

  return (
    <>
      <input ref={inputRef} type="text" name={name} defaultValue={String(value ?? "")} hidden readOnly />

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-12 border-0 bg-input hover:border-ring hover:ring-ring hover:ring-[3px]"
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
                  <CommandItem key={String(item.value)} value={item.label} onSelect={() => handleSelect(item)}>
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
    </>
  );
}

export default SelectComboBox;
