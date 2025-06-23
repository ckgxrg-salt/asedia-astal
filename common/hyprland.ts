import { exec } from "ags/process";
import AstalHyprland from "gi://AstalHyprland";

const hypr = AstalHyprland.get_default();

// Switches to next empty workspace
export function newWorkspace() {
  if (hypr.get_focused_workspace().get_clients().length == 0) {
    return;
  }
  let list = hypr
    .get_workspaces()
    .filter((a) => a.id > 0)
    .sort((a, b) => a.id - b.id);
  for (let current = 1; current <= list.at(-1)!.id; current++) {
    if (!list.find((w) => w.id == current)) {
      hypr.dispatch("workspace", current.toString());
      return;
    }
  }
  hypr.dispatch("workspace", (list.at(-1)!.id + 1).toString());
}

// Closes the app in current workspace or activate kill mode
export function close() {
  let clients = hypr.get_focused_workspace().get_clients();
  if (clients.length == 0) {
    return;
  } else if (clients.length == 1) {
    clients[0].kill();
  } else {
    hypr.message("kill");
    exec([
      "notify-send",
      "-i",
      "laptop",
      "Astal",
      "Multiple apps in current window, click on the one you want to close.",
    ]);
  }
}
