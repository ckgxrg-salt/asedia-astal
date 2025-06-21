// Global states
import { createState } from "ags";

// Whether to inhibit screen locker
export const [inhibit, setInhibit] = createState(false);

// Whether to show the dock
export const [showDock, setShowDock] = createState(false);

// Which one to show in the bottom row
// - 0 for Media
// - 1 for Weather
// - 2 for Tray
export const [bottom, setBottom] = createState(2);
