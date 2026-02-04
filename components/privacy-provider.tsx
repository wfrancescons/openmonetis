"use client";

import type React from "react";
import {
	createContext,
	useContext,
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
} from "react";

interface PrivacyContextType {
	privacyMode: boolean;
	toggle: () => void;
	set: (value: boolean) => void;
}

const PrivacyContext = createContext<PrivacyContextType | undefined>(undefined);

const STORAGE_KEY = "app:privacyMode";

// Read from localStorage safely (returns false on server)
function getStoredValue(): boolean {
	if (typeof window === "undefined") return false;
	return localStorage.getItem(STORAGE_KEY) === "true";
}

// Subscribe to storage changes
function subscribeToStorage(callback: () => void) {
	window.addEventListener("storage", callback);
	return () => window.removeEventListener("storage", callback);
}

export function PrivacyProvider({ children }: { children: React.ReactNode }) {
	// useSyncExternalStore handles hydration safely
	const storedValue = useSyncExternalStore(
		subscribeToStorage,
		getStoredValue,
		() => false, // Server snapshot
	);

	const [privacyMode, setPrivacyMode] = useState(storedValue);
	const isFirstRender = useRef(true);

	// Sync with stored value on mount
	useEffect(() => {
		if (isFirstRender.current) {
			setPrivacyMode(storedValue);
			isFirstRender.current = false;
		}
	}, [storedValue]);

	// Persist to localStorage when privacyMode changes
	useEffect(() => {
		localStorage.setItem(STORAGE_KEY, String(privacyMode));
	}, [privacyMode]);

	const toggle = () => {
		setPrivacyMode((prev) => !prev);
	};

	const set = (value: boolean) => {
		setPrivacyMode(value);
	};

	return (
		<PrivacyContext.Provider value={{ privacyMode, toggle, set }}>
			{children}
		</PrivacyContext.Provider>
	);
}

export function usePrivacyMode() {
	const context = useContext(PrivacyContext);
	if (context === undefined) {
		throw new Error("usePrivacyMode must be used within a PrivacyProvider");
	}
	return context;
}
