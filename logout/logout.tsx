import app from "ags/gtk4/app";
import { Astal, Gdk, Gtk } from "ags/gtk4";

import { confirm, setConfirm, handleCmd, Cmd } from "./cmd";
import Buttons from "./buttons";

export const { TOP, LEFT, RIGHT, BOTTOM } = Astal.WindowAnchor;
export function Panel() {
  return (
    <window
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
      $={(self) => self.add_controller(keys)}
    >
      <box>
        <Placeholder />
        <box orientation={1}>
          <Placeholder />
          <Buttons />
          <Placeholder />
        </box>
        <Placeholder />
      </box>
    </window>
  );
}

function Placeholder() {
  return (
    <box
      vexpand
      hexpand
      $={(self) => {
        let clickCtrl = Gtk.GestureClick.new();
        clickCtrl.connect("released", (self) => {
          self.set_state(Gtk.EventSequenceState.CLAIMED);
          deselectOrQuit();
        });
        self.add_controller(clickCtrl);
      }}
    />
  );
}

function deselectOrQuit() {
  if (confirm.get() == "") {
    app.quit();
  } else {
    setConfirm("");
  }
}

const keys = Gtk.EventControllerKey.new();
keys.connect("key-pressed", (_, keyval) => handleKeyboard(keyval));
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
