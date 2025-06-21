import Gtk from "gi://Gtk?version=4.0";

import { inhibit, setInhibit } from "../common/states";

export function Indicators() {
  return (
    <box class="Indicators" orientation={1}>
      <box heightRequest={175} />
      <box heightRequest={175}>
        <box widthRequest={87.5} heightRequest={87.5} />
        <Coffee />
      </box>
    </box>
  );
}

function Coffee() {
  let icon: Gtk.Image;

  return (
    <button
      class="Coffee"
      widthRequest={87.5}
      heightRequest={87.5}
      $={(self) => {
        if (inhibit.get()) {
          self.add_css_class("Activated");
          icon.set_from_icon_name("caffeine-cup-full-symbolic");
          self.set_tooltip_text("Inhibited System Idle");
        } else {
          self.add_css_class("Deactivated");
          icon.set_from_icon_name("caffeine-cup-full-symbolic");
          self.set_tooltip_text("This button says Zzz, pretending to sleep");
        }
        inhibit.subscribe(() => {
          if (inhibit.get()) {
            self.remove_css_class("Deactivated");
            self.add_css_class("Activated");
            icon.set_from_icon_name("caffeine-cup-full-symbolic");
            self.set_tooltip_text("Inhibited System Idle");
          } else {
            self.remove_css_class("Activated");
            self.add_css_class("Deactivated");
            icon.set_from_icon_name("caffeine-cup-full-symbolic");
            self.set_tooltip_text("This button says Zzz, pretending to sleep");
          }
        });
      }}
      onClicked={() => setInhibit(!inhibit.get())}
    >
      <image $={(self) => (icon = self)} />
    </button>
  );
}
