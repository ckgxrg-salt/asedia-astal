import { createBinding, For, With } from "ags";
import app from "ags/gtk4/app";
import AstalHyprland from "gi://AstalHyprland";
import AstalApps from "gi://AstalApps";
import Astal from "gi://Astal?version=4.0";
import Gtk from "gi://Gtk?version=4.0";
import Gdk from "gi://Gdk?version=4.0";
import Graphene from "gi://Graphene";

import { newWorkspace } from "../common/hyprland";
import { showDock, setShowDock } from "../common/states";

const hypr = AstalHyprland.get_default();
const apps = new AstalApps.Apps();
const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

export function Dock() {
  let win: Astal.Window;
  let contentbox: Gtk.Box;

  function onKey(_e: Gtk.EventControllerKey, keyval: number, _: number) {
    if (keyval === Gdk.KEY_Escape) {
      setShowDock(false);
    }
  }

  function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
    const [, rect] = contentbox.compute_bounds(win);
    const position = new Graphene.Point({ x, y });

    if (!rect.contains_point(position)) {
      setShowDock(false);
    }
  }

  return (
    <window
      layer={Astal.Layer.TOP}
      $={(self) => (win = self)}
      visible={showDock}
      application={app}
      // GTK4 issue
      defaultWidth={-1}
      defaultHeight={-1}
      name="dock"
      class="DockWindow"
      monitor={0}
      exclusivity={Astal.Exclusivity.NORMAL}
      namespace="astal-dock"
      anchor={TOP | LEFT | RIGHT | BOTTOM}
      keymode={Astal.Keymode.EXCLUSIVE}
    >
      <Gtk.EventControllerKey onKeyPressed={onKey} />
      <Gtk.GestureClick onReleased={onClick} />
      <box
        $={(self) => (contentbox = self)}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.END}
      >
        <box spacing={30} class="Dock">
          <Workspaces />
          <NewWorkspace />
          <LaunchpadButton />
        </box>
      </box>
    </window>
  );
}

function Workspaces() {
  const workspaces = createBinding(hypr, "workspaces").as((v) =>
    v.filter((w) => w.id >= 0).sort((a, b) => a.id - b.id),
  );
  const focused = createBinding(hypr, "focusedWorkspace");

  return (
    <box class="Workspaces" heightRequest={150} spacing={10}>
      <For each={workspaces}>
        {(w) => {
          const lastClient = createBinding(w, "lastClient").as((client) => {
            if (!!client) {
              const title = client?.get_initial_title();
              const [application] = apps.exact_query(title);
              if (!!application.iconName) {
                return (
                  <box
                    orientation={1}
                    valign={Gtk.Align.CENTER}
                    halign={Gtk.Align.CENTER}
                  >
                    <image iconName={application?.iconName} pixelSize={48} />
                    <label label={application?.get_name()} maxWidthChars={10} />
                  </box>
                );
              }
              return <label label={title} />;
            }
            return <label label={w.id.toString()} />;
          });

          return (
            <button
              class={w === focused.get() ? "focused" : ""}
              widthRequest={200}
              onClicked={() => w.focus()}
            >
              <With value={lastClient}>{(v) => v}</With>
            </button>
          );
        }}
      </For>
    </box>
  );
}

function NewWorkspace() {
  return (
    <button
      class="NewWorkspace"
      widthRequest={150}
      heightRequest={150}
      onClicked={newWorkspace}
    >
      <image iconName="list-add-symbolic" />
    </button>
  );
}

function LaunchpadButton() {
  return (
    <button
      class="LaunchpadButton"
      widthRequest={150}
      heightRequest={150}
      onClicked={() => hypr.dispatch("exec", "astal-launchpad")}
    >
      <image iconName="activities-symbolic" />
    </button>
  );
}
