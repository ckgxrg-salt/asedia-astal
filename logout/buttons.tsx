import Gtk from "gi://Gtk?version=4.0";

import { confirm, Cmd, handleCmd } from "./cmd";

export default function Buttons() {
  return (
    <box orientation={1} valign={Gtk.Align.CENTER} halign={Gtk.Align.CENTER}>
      <box class="MenuContainerUpper" halign={Gtk.Align.CENTER}>
        <Shutdown />
        <Reboot />
      </box>
      <Focused />
      <box halign={Gtk.Align.CENTER}>
        <Lock />
        <Logout />
        <Sleep />
      </box>
    </box>
  );
}

function Focused() {
  return (
    <label
      halign={Gtk.Align.CENTER}
      class="Label"
      label={confirm((str) => {
        switch (str) {
          case "shutdown":
            return "Power Off";
          case "reboot":
            return "Reboot";
          case "lock":
            return "Lock Screen";
          case "logout":
            return "Log Out";
          case "sleep":
            return "Suspend";
          default:
            return "Asedia";
        }
      })}
    />
  );
}

function mapClassName(orig: string, confirm: string) {
  if (orig.toLowerCase() == confirm) {
    return [orig, "Focused"];
  }
  return [orig];
}

function Shutdown() {
  return (
    <button
      cssClasses={confirm((c) => mapClassName("Shutdown", c))}
      tooltipText="Power Off"
      widthRequest={300}
      heightRequest={350}
      $clicked={() => handleCmd(Cmd.SHUTDOWN)}
    >
      <image iconName="system-shutdown" />
    </button>
  );
}
function Reboot() {
  return (
    <button
      cssClasses={confirm((c) => mapClassName("Reboot", c))}
      tooltipText="Reboot"
      widthRequest={300}
      heightRequest={350}
      $clicked={() => handleCmd(Cmd.REBOOT)}
    >
      <image iconName="system-reboot" />
    </button>
  );
}
function Lock() {
  return (
    <button
      cssClasses={confirm((c) => mapClassName("Lock", c))}
      tooltipText="Lock Screen"
      widthRequest={300}
      heightRequest={350}
      $clicked={() => handleCmd(Cmd.LOCK)}
    >
      <image iconName="system-lock-screen" />
    </button>
  );
}
function Logout() {
  return (
    <button
      cssClasses={confirm((c) => mapClassName("Logout", c))}
      tooltipText="Logout"
      widthRequest={300}
      heightRequest={350}
      $clicked={() => handleCmd(Cmd.LOGOUT)}
    >
      <image iconName="system-log-out" />
    </button>
  );
}
function Sleep() {
  return (
    <button
      cssClasses={confirm((c) => mapClassName("Sleep", c))}
      tooltipText="Sleep"
      widthRequest={300}
      heightRequest={350}
      $clicked={() => handleCmd(Cmd.SLEEP)}
    >
      <image iconName="system-suspend" />
    </button>
  );
}
