import { useEffect } from 'react';
import { NavigateFunction } from 'react-router-dom';

type Options = {
  navigate: NavigateFunction;
  toggleSidebar?: () => void;
  globalSearch?: (query: string) => void;
};

export default function useShortcuts({ navigate, toggleSidebar, globalSearch }: Options) {
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      const key = e.key.toLowerCase();
      const alt = e.altKey;
      const ctrl = e.ctrlKey || e.metaKey;

      // Alt + 1-6: navigate to main sections
      if (alt && ['1','2','3','4','5','6'].includes(key)) {
        e.preventDefault();
        switch (key) {
          case '1': navigate('/dashboard'); break;
          case '2': navigate('/parfums'); break;
          case '3': navigate('/references'); break;
          case '4': navigate('/fournisseurs'); break;
          case '5': navigate('/clients'); break;
          case '6': navigate('/stock'); break;
        }
        return;
      }

      // Ctrl/Cmd + k : quick search (focus global search or navigate to parfums)
      if (ctrl && key === 'k') {
        e.preventDefault();
        if (globalSearch) {
          // Focus global search input (we'll implement this)
          const searchInput = document.querySelector('input[placeholder*="Rechercher"]') as HTMLInputElement;
          if (searchInput) {
            searchInput.focus();
          } else {
            navigate('/parfums');
          }
        } else {
          navigate('/parfums');
        }
        return;
      }

      // Ctrl/Cmd + n : new item (navigate to parfums as example)
      if (ctrl && key === 'n') {
        e.preventDefault();
        navigate('/parfums');
        return;
      }

      // Alt + S : toggle sidebar (if provided)
      if (alt && key === 's') {
        e.preventDefault();
        toggleSidebar?.();
        return;
      }
    }

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, toggleSidebar, globalSearch]);
}
