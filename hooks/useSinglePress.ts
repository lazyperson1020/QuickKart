import { useRef } from 'react';

export function useSinglePress<T extends (...args: any[]) => void>(handler: T, lockMs = 300): T {
  const locked = useRef(false);
  const handlerRef = useRef(handler);
  const lockMsRef = useRef(lockMs);
  handlerRef.current = handler;
  lockMsRef.current = lockMs;

  // Created once per component instance — stable reference across all re-renders
  const stable = useRef<T>(null as any);
  if (!stable.current) {
    stable.current = ((...args: Parameters<T>) => {
      if (locked.current) return;
      locked.current = true;
      handlerRef.current(...args);
      setTimeout(() => { locked.current = false; }, lockMsRef.current);
    }) as T;
  }

  return stable.current;
}
