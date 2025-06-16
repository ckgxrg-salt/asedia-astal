import Gtk from "gi://Gtk?version=4.0";
import { inhibit, setInhibit } from "../common/states";

export default function Avatar() {
  return (
    <overlay>
      <box class="Avatar">
        <box class="AvatarImage" />
      </box>
      <box orientation={1}>
        <box heightRequest={175} />
        <box heightRequest={175}>
          <box widthRequest={50} heightRequest={50} />
          <Coffee />
        </box>
      </box>
    </overlay>
  );
}

function Coffee() {
  return (
    <button
      class="Coffee"
      widthRequest={50}
      heightRequest={50}
      $={(self) => {
        if (inhibit.get()) {
          self.add_css_class("Activated");
          (self.get_child() as Gtk.Image).iconName =
            "caffeine-cup-full-symbolic";
          self.set_tooltip_text("Inhibited System Idle");
        } else {
          self.add_css_class("Deactivated");
          (self.get_child() as Gtk.Image).iconName =
            "caffeine-cup-full-symbolic";
          self.set_tooltip_text("This button says Zzz, pretending to sleep");
        }
        inhibit.subscribe(() => {
          if (inhibit.get()) {
            self.add_css_class("Activated");
            (self.get_child() as Gtk.Image).iconName =
              "caffeine-cup-full-symbolic";
            self.set_tooltip_text("Inhibited System Idle");
          } else {
            self.add_css_class("Deactivated");
            (self.get_child() as Gtk.Image).iconName =
              "caffeine-cup-full-symbolic";
            self.set_tooltip_text("This button says Zzz, pretending to sleep");
          }
        });
      }}
      $clicked={() => setInhibit(!inhibit.get())}
    >
      <image />
    </button>
  );
}
