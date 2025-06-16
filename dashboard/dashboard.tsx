import app from "ags/gtk4/app";
import Astal from "gi://Astal?version=4.0";

export default function Dashboard() {
  return (
    <window
      visible
      application={app}
      name="dashboard"
      class="Dashboard"
      monitor={0}
      exclusivity={Astal.Exclusivity.IGNORE}
      namespace="astal-dashboard"
      layer={Astal.Layer.BOTTOM}
    ></window>
  );
}
