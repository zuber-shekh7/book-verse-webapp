"use client";

import { useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// Search-first text field. Suggestions come from `search(q)` -> [{ key, label, sub?, href? }].
// Picking one copies its label into the field; the last option keeps whatever the reader typed.
// The form only ever posts the text value. onPick(item | null) tells the parent what was picked.
export function SearchPicker({ name, search, defaultValue = "", onPick, placeholder }) {
  const [value, setValue] = useState(defaultValue);
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const timer = useRef(null);
  const latest = useRef(0);

  const typed = value.trim();
  const options = [...items.map((item) => ({ item })), ...(typed ? [{ use: true }] : [])];
  const listId = `${name}-listbox`;

  function onChange(e) {
    const next = e.target.value;
    setValue(next);
    setOpen(true);
    setActive(-1);
    onPick?.(null);
    clearTimeout(timer.current);
    const q = next.trim();
    const n = ++latest.current;
    if (q.length < 2) {
      setItems([]);
      return;
    }
    timer.current = setTimeout(async () => {
      const found = await search(q);
      if (n === latest.current) setItems(found); // ignore out-of-order responses
    }, 300);
  }

  function choose(option) {
    if (!option) return;
    if (option.item) {
      setValue(option.item.label);
      onPick?.(option.item);
    }
    setOpen(false);
    setActive(-1);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") return setOpen(false);
    if (!open || options.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % options.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i <= 0 ? options.length - 1 : i - 1));
    } else if (e.key === "Enter" && active >= 0) {
      e.preventDefault();
      choose(options[active]);
    }
  }

  return (
    <div
      className="relative"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <Input
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        required
        role="combobox"
        aria-expanded={open && options.length > 0}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${name}-option-${active}` : undefined}
      />
      {open && options.length > 0 && (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-10 mt-1 max-h-64 w-full overflow-auto rounded-lg border bg-popover p-1 text-sm text-popover-foreground shadow-md"
        >
          {options.map((o, i) => (
            <li
              key={o.item ? o.item.key : "use"}
              id={`${name}-option-${i}`}
              role="option"
              aria-selected={i === active}
              onMouseDown={(e) => e.preventDefault()} // keep focus in the input
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(o)}
              className={cn("cursor-pointer rounded-md px-2 py-1.5", i === active && "bg-accent text-accent-foreground")}
            >
              {o.item ? (
                <>
                  {o.item.label}
                  {o.item.sub && <span className="ml-2 text-muted-foreground">{o.item.sub}</span>}
                </>
              ) : (
                <>
                  Use &ldquo;{typed}&rdquo;
                  <span className="ml-2 text-muted-foreground">(not in our catalog)</span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
