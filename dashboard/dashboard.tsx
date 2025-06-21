import app from "ags/gtk4/app";
import Gtk from "gi://Gtk?version=4.0";
import Astal from "gi://Astal?version=4.0";

import { Monitor } from "./monitor";
import { Calendar } from "./calendar";
import { Indicators } from "./indicators";
import { Quote } from "./quote";
import { Tray } from "./tray";
import { Media } from "./media";
import { Weather } from "./weather";

export function Dashboard() {
  return (
    <window
      layer={Astal.Layer.BOTTOM}
      visible
      application={app}
      name="dashboard"
      class="Dashboard"
      monitor={0}
      exclusivity={Astal.Exclusivity.IGNORE}
      namespace="astal-dashboard"
    >
      <box
        orientation={1}
        halign={Gtk.Align.CENTER}
        valign={Gtk.Align.CENTER}
        spacing={20}
      >
        <box spacing={20}>
          <Monitor />
          <Calendar />
          <Indicators />
        </box>
        <box spacing={20}>
          <Quote />
        </box>
        <box spacing={20}>
          <Media />
          <Weather />
          <Tray />
        </box>
      </box>
    </window>
  );
}
