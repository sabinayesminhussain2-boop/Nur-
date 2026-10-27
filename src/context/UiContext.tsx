import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

interface UiContextValue {
  searchOpen: boolean;
  assistantOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  openAssistant: () => void;
  closeAssistant: () => void;
}

const UiContext = createContext<UiContextValue | null>(null);

export function UiProvider({ children }: { children: ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openAssistant = useCallback(() => setAssistantOpen(true), []);
  const closeAssistant = useCallback(() => setAssistantOpen(false), []);

  const value = useMemo(
    () => ({
      searchOpen,
      assistantOpen,
      openSearch,
      closeSearch,
      openAssistant,
      closeAssistant,
    }),
    [searchOpen, assistantOpen, openSearch, closeSearch, openAssistant, closeAssistant],
  );

  return <UiContext.Provider value={value}>{children}</UiContext.Provider>;
}

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used within UiProvider");
  return ctx;
}
