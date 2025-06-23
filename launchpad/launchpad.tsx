import { For, createState } from "ags";
import { Astal, Gtk, Gdk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { exec } from "ags/process";
import AstalApps from "gi://AstalApps";
import Graphene from "gi://Graphene";
import Pango from "gi://Pango";

import { newWorkspace } from "../common/hyprland";

const { TOP, BOTTOM, LEFT, RIGHT } = Astal.WindowAnchor;

function launch(target?: AstalApps.Application) {
  if (target) {
    exec("astal-shell hide-dock");
    newWorkspace();
    target.launch();
    app.quit();
  }
}

function AppButton({ app }: { app: AstalApps.Application | undefined }) {
  if (!app) {
    return <box />;
  }
  return (
    <button
      class="AppButton"
      widthRequest={415}
      heightRequest={250}
      onClicked={() => launch(app)}
    >
      <box spacing={15}>
        <image iconName={app.iconName} />
        <box valign={Gtk.Align.CENTER} orientation={1}>
          <label
            class="AppButtonName"
            label={app.name}
            ellipsize={Pango.EllipsizeMode.END}
          />
          <label
            class="AppButtonDesc"
            wrap
            maxWidthChars={20}
            label={app.description}
          />
        </box>
      </box>
    </button>
  );
}

export function Launchpad() {
  let contentbox: Gtk.Box;
  let searchentry: Gtk.Entry;
  let win: Astal.Window;

  const apps = new AstalApps.Apps();
  const [list, setList] = createState(generateList(""));

  function generateList(text: string) {
    let res = apps.fuzzy_query(text);
    let items = res
      .map((each, index) => {
        return index % 4 === 0
          ? [each, res[index + 1], res[index + 2], res[index + 3]]
          : null;
      })
      .flatMap((item) => (item ? [item] : []));
    return items;
  }

  function onKey(_e: Gtk.EventControllerKey, keyval: number, _: number) {
    if (keyval === Gdk.KEY_Escape) {
      app.quit();
    }
  }

  function onClick(_e: Gtk.GestureClick, _: number, x: number, y: number) {
    const [, rect] = contentbox.compute_bounds(win);
    const position = new Graphene.Point({ x, y });

    if (!rect.contains_point(position)) {
      app.quit();
    }
  }

  return (
    <window
      $={(self) => {
        win = self;
        searchentry.grab_focus();
      }}
      visible
      name="astal-launchpad"
      anchor={TOP | BOTTOM | LEFT | RIGHT}
      exclusivity={Astal.Exclusivity.IGNORE}
      keymode={Astal.Keymode.EXCLUSIVE}
    >
      <Gtk.EventControllerKey onKeyPressed={onKey} />
      <Gtk.GestureClick onReleased={onClick} />
      <box
        $={(ref) => (contentbox = ref)}
        valign={Gtk.Align.CENTER}
        halign={Gtk.Align.CENTER}
        orientation={1}
      >
        <entry
          $={(self) => (searchentry = self)}
          onNotifyText={({ text }) => setList(generateList(text))}
          placeholderText="Search..."
          onActivate={() => launch(list.get()[0][0])}
        />
        <Gtk.Separator />
        <scrolledwindow
          class="LaunchpadApps"
          heightRequest={1080}
          widthRequest={1720}
        >
          <box orientation={1} spacing={20}>
            <For each={list}>
              {(group) => (
                <box>
                  <AppButton app={group[0]} />
                  <AppButton app={group[1]} />
                  <AppButton app={group[2]} />
                  <AppButton app={group[3]} />
                </box>
              )}
            </For>
          </box>
        </scrolledwindow>
      </box>
    </window>
  );
}
