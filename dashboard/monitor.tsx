import { createComputed, createState, createBinding } from "ags";
import { interval } from "ags/time";
import Battery from "gi://AstalBattery";
import Gtk from "gi://Gtk?version=4.0";
import GTop from "gi://GTop";

export function Monitor() {
  return (
    <box orientation={1} class="Monitor" widthRequest={320} heightRequest={320}>
      <Bat />
      <Cpu />
      <Mem />
    </box>
  );
}

function mapBatState(warn: Battery.WarningLevel, state: Battery.State) {
  if (warn == Battery.WarningLevel.LOW) return "BatteryLow";
  if (warn == Battery.WarningLevel.CRITICIAL) return "BatteryCrit";
  if (state == Battery.State.CHARGING) return "BatteryCharging";
  if (state == Battery.State.FULLY_CHARGED) return "BatteryCharging";
  return "Battery";
}
function Bat() {
  const bat = Battery.get_default();
  const batState = createComputed(
    [createBinding(bat, "warningLevel"), createBinding(bat, "state")],
    mapBatState,
  );

  return (
    <box>
      <image
        class="BatteryIcon"
        valign={Gtk.Align.START}
        iconName={createBinding(bat, "batteryIconName")}
      />
      <slider
        class={batState}
        halign={Gtk.Align.CENTER}
        value={createBinding(bat, "percentage")}
      />
    </box>
  );
}

function Cpu() {
  const [cpu, setCPU] = createState({ cpu: new GTop.glibtop_cpu(), load: 0 });
  interval(5000, () => {
    const newCPU = new GTop.glibtop_cpu();
    GTop.glibtop_get_cpu(newCPU);

    const used =
      newCPU.user + newCPU.sys + newCPU.nice + newCPU.irq + newCPU.softirq;
    const total = used + newCPU.idle + newCPU.iowait;

    const lastCPU = cpu.get().cpu;

    const lastUsed =
      lastCPU.user + lastCPU.sys + lastCPU.nice + lastCPU.irq + lastCPU.softirq;
    const lastTotal = lastUsed + lastCPU.idle + lastCPU.iowait;

    const diffUsed = used - lastUsed;
    const diffTotal = total - lastTotal;

    setCPU({ cpu: newCPU, load: diffTotal > 0 ? diffUsed / diffTotal : 0 });
  });

  return (
    <box>
      <image class="CpuIcon" valign={Gtk.Align.START} iconName="cpu" />
      <slider
        class="CpuSlider"
        halign={Gtk.Align.CENTER}
        value={cpu((v) => v.load)}
      />
    </box>
  );
}

function Mem() {
  const [mem, setMem] = createState(new GTop.glibtop_mem());
  interval(5000, () => {
    const realmem = new GTop.glibtop_mem();
    GTop.glibtop_get_mem(realmem);
    setMem(realmem);
  });

  return (
    <box>
      <image
        class="MemoryIcon"
        valign={Gtk.Align.START}
        iconName="drive-virtual"
      />
      <slider
        class="MemorySlider"
        halign={Gtk.Align.CENTER}
        value={mem((m) => m.user / m.total)}
      />
    </box>
  );
}
