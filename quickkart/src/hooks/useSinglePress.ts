import { useCallback, useRef } from 'react';

export function useSinglePress<T extends (...args: any[]) => void>(onPress: T, delay = 500): T {
  const isPressed = useRef(false);
  return useCallback((...args: any[]) => {
    if (isPressed.current) return;
    isPressed.current = true;
    (onPress as any)(...args);
    setTimeout(() => { isPressed.current = false; }, delay);
  }, [onPress, delay]) as T;
}
