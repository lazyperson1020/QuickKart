import { useCallback, useRef } from 'react';

export function useSinglePress<T extends (...args: any[]) => void>(onPress: T, delay = 500): T {
  const isPressed = useRef(false);
  const isFirstPress = useRef(true);
  const onPressRef = useRef(onPress);
  onPressRef.current = onPress;

  return useCallback((...args: any[]) => {
    if (isPressed.current) return;
    onPressRef.current(...(args as Parameters<T>));
    if (isFirstPress.current) {
      isFirstPress.current = false;
      return;
    }
    isPressed.current = true;
    setTimeout(() => { isPressed.current = false; }, delay);
  }, [delay]) as T;
}
