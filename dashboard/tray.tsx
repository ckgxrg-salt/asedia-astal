import { createBinding, With } from "ags";
import AstalTray from "gi://AstalTray";
import Gtk from "gi://Gtk?version=4.0";

import { bottom, setBottom } from "../common/states";

export function Tray() {
  const tray = AstalTray.get_default();
  const items = createBinding(tray, "items");

  return (
    <box>
      <button
        class="TrayButton"
        visible={bottom((v) => v != 2)}
        widthRequest={260}
        heightRequest={260}
        onClicked={() => setBottom(2)}
      >
        <image iconName="view-more" />
      </button>
      <With value={items}>{groupIntoRows}</With>
    </box>
  );
}

const init = (btn: Gtk.MenuButton, item: AstalTray.TrayItem) => {
  btn.menuModel = item.menuModel;
  btn.insert_action_group("dbusmenu", item.actionGroup);
  item.connect("notify::action-group", () => {
    btn.insert_action_group("dbusmenu", item.actionGroup);
  });
};
function groupIntoRows(items: AstalTray.TrayItem[]) {
  let buttons = items.map((item) => (
    <menubutton $={(self) => init(self, item)} widthRequest={125}>
      <image gicon={createBinding(item, "gicon")} />
    </menubutton>
  ));
  if (buttons.length > 5) {
    let upper = buttons.slice(0, 5);
    let lower = buttons.slice(5);
    return (
      <box
        class="Tray"
        orientation={1}
        visible={bottom((v) => v == 2)}
        widthRequest={760}
        heightRequest={260}
      >
        <box heightRequest={110} spacing={20}>
          {upper}
        </box>
        <Gtk.Separator />
        <box heightRequest={110} spacing={20}>
          {lower}
        </box>
      </box>
    );
  } else {
    return (
      <box
        class="Tray"
        orientation={1}
        visible={bottom((v) => v == 2)}
        widthRequest={760}
        heightRequest={260}
      >
        <box heightRequest={110} spacing={20}>
          {buttons}
        </box>
        <box heightRequest={110}></box>
      </box>
    );
  }
}
