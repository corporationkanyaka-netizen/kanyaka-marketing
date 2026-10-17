"use client";

import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import { productsData } from "@/data/products";
import { categoryTone, productCategories, tileSymbol } from "@/lib/chem";
import { Check, ChevronDown, Search } from "lucide-react";

interface ProductSelectProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  /** Value used for the trailing "Other chemical" option. */
  otherValue?: string;
  className?: string;
}

type Option = { value: string; label: string; symbol: string; maker: string; dot: string; group: string };

/**
 * Custom product picker that always opens *below* the field (a native <select>
 * lets the browser flip it upward over the page), with search and category groups.
 */
export default function ProductSelect({ id, value, onChange, otherValue = "Other chemical", className = "" }: ProductSelectProps) {
  const autoId = useId();
  const baseId = id ?? `product-select-${autoId.replace(/:/g, "")}`;
  const listId = `${baseId}-list`;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const allOptions = useMemo<Option[]>(() => {
    const opts: Option[] = [];
    for (const cat of productCategories) {
      for (const p of productsData.filter((x) => x.category === cat)) {
        opts.push({ value: p.name, label: p.name, symbol: tileSymbol(p), maker: p.brandTier, dot: categoryTone[cat].dot, group: cat });
      }
    }
    opts.push({ value: otherValue, label: "Other chemical", symbol: "···", maker: "Tell us in the requirements box", dot: "bg-slate-300", group: "Other" });
    return opts;
  }, [otherValue]);

  const options = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allOptions;
    return allOptions.filter((o) => `${o.label} ${o.symbol} ${o.maker} ${o.group}`.toLowerCase().includes(q));
  }, [allOptions, query]);

  const selected = allOptions.find((o) => o.value === value);

  const openList = () => {
    setQuery("");
    setActiveIdx(Math.max(0, allOptions.findIndex((o) => o.value === value)));
    setOpen(true);
  };

  const choose = (opt: Option) => {
    onChange(opt.value);
    setOpen(false);
  };

  // Focus search, keep the panel on screen, and close on outside click.
  useEffect(() => {
    if (!open) return;
    searchRef.current?.focus({ preventScroll: true });
    // If the list would run past the bottom of the screen, scroll the page just enough to show it.
    const panel = panelRef.current;
    if (panel) {
      const overflow = panel.getBoundingClientRect().bottom + 16 - window.innerHeight;
      if (overflow > 0) window.scrollBy({ top: overflow, behavior: "smooth" });
    }
    const onDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  // Keep the highlighted option visible while using the keyboard.
  useEffect(() => {
    if (!open) return;
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${activeIdx}"]`)?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, open]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key)) {
        e.preventDefault();
        openList();
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (options[activeIdx]) choose(options[activeIdx]);
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation(); // don't also close a surrounding modal
      setOpen(false);
    } else if (e.key === "Tab") {
      setOpen(false);
    }
  };

  return (
    <div ref={rootRef} className={`relative ${className}`} onKeyDown={onKeyDown}>
      <button
        type="button"
        id={baseId}
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openList())}
        className={`flex w-full cursor-pointer items-center gap-3 rounded-md bg-white px-4 py-3 text-left text-[15px] text-ink-900 outline-none ring-1 transition-shadow focus-visible:ring-2 focus-visible:ring-brand-500 ${
          open ? "ring-2 ring-brand-500" : "ring-line hover:ring-slate-300"
        }`}
      >
        {selected && (
          <span className="w-16 shrink-0 truncate font-display text-sm font-medium text-brand-700">{selected.symbol}</span>
        )}
        <span className="min-w-0 flex-1 truncate">{selected?.label ?? "Select a chemical"}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute left-0 top-full z-50 mt-2 w-full min-w-[min(26rem,calc(100vw-2rem))] overflow-hidden rounded-md bg-white shadow-[0_24px_60px_-20px_rgba(11,22,38,0.45)] ring-1 ring-line"
        >
          <div className="flex items-center gap-2 border-b border-line px-4">
            <Search className="h-4 w-4 shrink-0 text-slate-400" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIdx(0);
              }}
              placeholder="Search name, formula or maker…"
              aria-label="Search chemicals"
              aria-controls={listId}
              aria-activedescendant={options[activeIdx] ? `${baseId}-opt-${activeIdx}` : undefined}
              className="w-full bg-transparent py-3 text-sm text-ink-900 outline-none placeholder:text-slate-400"
            />
          </div>

          <ul ref={listRef} id={listId} role="listbox" aria-labelledby={baseId} className="scroll-thin max-h-72 overflow-y-auto overscroll-contain py-1.5">
            {options.length === 0 && <li className="px-4 py-6 text-center text-sm text-slate-500">No chemical matches &ldquo;{query}&rdquo;</li>}
            {options.map((opt, idx) => {
              const showGroup = idx === 0 || options[idx - 1].group !== opt.group;
              const isSelected = opt.value === value;
              const isActive = idx === activeIdx;
              return (
                <React.Fragment key={opt.value}>
                  {showGroup && (
                    <li role="presentation" className="flex items-center gap-2 px-4 pb-1 pt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-slate-400">
                      <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
                      {opt.group}
                    </li>
                  )}
                  <li
                    id={`${baseId}-opt-${idx}`}
                    data-idx={idx}
                    role="option"
                    aria-selected={isSelected}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => choose(opt)}
                    className={`mx-1.5 flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 ${isActive ? "bg-paper-2" : ""}`}
                  >
                    <span className={`w-16 shrink-0 truncate font-display text-sm font-medium ${isSelected ? "text-brand-700" : "text-slate-500"}`}>
                      {opt.symbol}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className={`block truncate text-sm ${isSelected ? "font-medium text-ink-900" : "text-ink-900"}`}>{opt.label}</span>
                      <span className="block truncate text-xs text-slate-500">{opt.maker}</span>
                    </span>
                    {isSelected && <Check className="h-4 w-4 shrink-0 text-brand-600" />}
                  </li>
                </React.Fragment>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
