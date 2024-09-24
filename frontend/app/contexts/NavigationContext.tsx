"use client";

import { createContext, useContext, useReducer, useEffect, Dispatch } from "react";

type NavigationState = {
  activeTopMenu: string;
  expandedMenu: string | null;
};

type NavigationAction =
  | { type: "SET_ACTIVE_TOP_MENU"; payload: string }
  | { type: "SET_EXPANDED_MENU"; payload: string | null };

const NavigationContext = createContext<{
  state: NavigationState;
  dispatch: Dispatch<NavigationAction>;
}>({
  state: { activeTopMenu: "dashboard", expandedMenu: null },
  dispatch: () => null,
});

const navigationReducer = (
  state: NavigationState,
  action: NavigationAction
): NavigationState => {
  switch (action.type) {
    case "SET_ACTIVE_TOP_MENU":
      return { ...state, activeTopMenu: action.payload };
    case "SET_EXPANDED_MENU":
      return { ...state, expandedMenu: action.payload };
    default:
      return state;
  }
};

// URL에서 메뉴 상태를 읽어오는 함수
const loadMenuStateFromURL = () => {
  if (typeof window === 'undefined') {
    return {
      activeTopMenu: 'dashboard',
      expandedMenu: null,
    };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    activeTopMenu: params.get("headerMenu") || "dashboard",
    expandedMenu: params.get("sideMenu") || null,
  };
};

// 메뉴 상태를 URL에 저장하는 함수
const saveMenuStateToURL = (
  activeTopMenu: string,
  expandedMenu: string | null
) => {
  if (typeof window === 'undefined') {
    return;
  }
  const params = new URLSearchParams(window.location.search);
  params.set("headerMenu", activeTopMenu);
  params.set("sideMenu", expandedMenu || "");
  window.history.replaceState({}, "", `${window.location.pathname}?${params}`);
};

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(navigationReducer, loadMenuStateFromURL());

  useEffect(() => {
    saveMenuStateToURL(state.activeTopMenu, state.expandedMenu);
  }, [state]);

  return (
    <NavigationContext.Provider value={{ state, dispatch }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigation = () => useContext(NavigationContext);
