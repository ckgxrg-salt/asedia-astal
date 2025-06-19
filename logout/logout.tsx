import app from "ags/gtk4/app";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import Astal from "gi://Astal?version=4.0";

import { confirm, setConfirm, handleCmd, Cmd } from "./cmd";
import Buttons from "./buttons";

export const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;
export function Panel() {
  let win: Astal.Window;
  let contentbox: Gtk.Box;

  return (
    <window
      $={(self) => (win = self)}
      visible
      application={app}
      name="logout-panel"
      class="Panel"
      monitor={0}
      exclusivity={Astal.Exclusivity.EXCLUSIVE}
      namespace="astal-logout"
      layer={Astal.Layer.OVERLAY}
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      keymode={Astal.Keymode.EXCLUSIVE}
    >
      <Gtk.EventControllerKey
        $key-pressed={(_, keyval) => handleKeyboard(keyval)}
      />
      <Gtk.GestureClick $released={deselectOrQuit} />
      <box $={(self) => (contentbox = self)}>
        <Buttons />
      </box>
    </window>
  );
}

function deselectOrQuit() {
  if (confirm.get() == "") {
    app.quit();
  } else {
    setConfirm("");
  }
}

function handleKeyboard(keyval: number) {
  switch (keyval) {
    case Gdk.KEY_Escape: {
      deselectOrQuit();
      break;
    }
    case Gdk.KEY_s: {
      handleCmd(Cmd.SHUTDOWN);
      break;
    }
    case Gdk.KEY_r: {
      handleCmd(Cmd.REBOOT);
      break;
    }
    case Gdk.KEY_l: {
      handleCmd(Cmd.LOCK);
      break;
    }
    case Gdk.KEY_e: {
      handleCmd(Cmd.LOGOUT);
      break;
    }
    case Gdk.KEY_u: {
      handleCmd(Cmd.SLEEP);
      break;
    }
  }
}
