import { useEffect, useRef, useState } from 'react';

export const OVERLAY_EXIT_MS = 180;

export const useOverlayPresence = (isOpen, exitMs = OVERLAY_EXIT_MS) => {
  const [mounted, setMounted] = useState(Boolean(isOpen));
  const [state, setState] = useState('closed');
  const frameRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = requestAnimationFrame(() => setState('open'));
      });

      return () => {
        if (frameRef.current) cancelAnimationFrame(frameRef.current);
      };
    }

    if (!mounted) return undefined;

    setState('closed');
    const timer = window.setTimeout(() => setMounted(false), exitMs);
    return () => window.clearTimeout(timer);
  }, [isOpen, mounted, exitMs]);

  return { mounted, state };
};
