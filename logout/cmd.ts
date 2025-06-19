import { createState } from "ags";
import app from "ags/gtk4/app";
import AstalHyprland from "gi://AstalHyprland";

const hypr = AstalHyprland.get_default();

export const [confirm, setConfirm] = createState("");

export enum Cmd {
  SHUTDOWN,
  REBOOT,
  LOCK,
  LOGOUT,
  SLEEP,
}
export function handleCmd(cmd: Cmd) {
  switch (cmd) {
    case Cmd.SHUTDOWN: {
      if (confirm.get() == "shutdown") {
        hypr.dispatch("exec", "systemctl poweroff");
        app.quit();
      }
      setConfirm("shutdown");
      break;
    }
    case Cmd.REBOOT: {
      if (confirm.get() == "reboot") {
        hypr.dispatch("exec", "systemctl reboot");
        app.quit();
      }
      setConfirm("reboot");
      break;
    }
    case Cmd.LOCK: {
      if (confirm.get() == "lock") {
        hypr.dispatch("exec", "hyprlock --immediate");
        app.quit();
      }
      setConfirm("lock");
      break;
    }
    case Cmd.LOGOUT: {
      if (confirm.get() == "logout") {
        hypr.dispatch("exit", "");
        app.quit();
      }
      setConfirm("logout");
      break;
    }
    case Cmd.SLEEP: {
      if (confirm.get() == "sleep") {
        hypr.dispatch("exec", "systemctl suspend-then-hibernate");
        app.quit();
      }
      setConfirm("sleep");
      break;
    }
  }
}
