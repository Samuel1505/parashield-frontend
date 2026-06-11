'use client';

import { useEffect } from 'react';

type Key = string;
type Modifiers = { ctrl?: boolean; shift?: boolean; alt?: boolean; meta?: boolean };

export function useKeyboardShortcut(
  key: Key,
  handler: () => void,
  modifiers: Modifiers = {},
) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      if (modifiers.ctrl  && !e.ctrlKey)  return;
      if (modifiers.shift && !e.shiftKey) return;
      if (modifiers.alt   && !e.altKey)   return;
      if (modifiers.meta  && !e.metaKey)  return;
      e.preventDefault();
      handler();
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [key, handler, modifiers]);
}
