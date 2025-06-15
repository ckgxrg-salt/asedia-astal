import { Gtk } from "ags/gtk4";
import { GLib, exec, interval } from "astal";
import { createState } from "ags";

export default function Calendar() {
  return (
    <box
      orientation={1}
      class="Calendar"
      widthRequest={640}
      heightRequest={320}
    >
      <Clock />
      <Today />
    </box>
  );
}

const [time, setTime] = createState(GLib.DateTime.new_now_local());
interval(1000, () => setTime(GLib.DateTime.new_now_local()));
function Clock() {
  return (
    <box class="Clock" halign={Gtk.Align.CENTER} widthRequest={230}>
      <label
        label={time((t) => t.format("%H")!)}
        css="font-size: 96px; margin-right: 25px;"
      />
      <box orientation={1} valign={Gtk.Align.CENTER}>
        <label label={time((t) => t.format("%a")!)} css="font-size: 32px;" />
        <label label={time((t) => t.format("%m/%d")!)} css="font-size: 24px;" />
      </box>
      <label
        label={time((t) => t.format("%M")!)}
        css="font-size: 96px; margin-left: 25px;"
      />
    </box>
  );
}

export const [event, setState] = createState(
  exec(["bash", "-c", "khal list today today | tail -n +2"]).then((str) => {
    if (str.length == 0) {
      return "No Events Today =)";
    }
    return str;
  }),
);
function Today() {
  return (
    <box class="Today" orientation={1} widthRequest={230} heightRequest={80}>
      <label label="Today" />
      <label label={event} />
    </box>
  );
}
