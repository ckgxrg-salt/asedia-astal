import app from "ags/gtk4/app";
import Gtk from "gi://Gtk?version=4.0";
import Astal from "gi://Astal?version=4.0";

import { weather, updateLocation } from "../common/weather";
import { bottom, setBottom } from "../common/states";

export function Weather() {
  return (
    <box>
      <button
        class="WeatherButton"
        visible={bottom((v) => v != 1)}
        widthRequest={260}
        heightRequest={260}
        onClicked={() => setBottom(1)}
      >
        <image iconName="weather-clear-symbolic" />
      </button>
      <box
        orientation={1}
        class="Weather"
        visible={bottom((v) => v == 1)}
        widthRequest={760}
        heightRequest={260}
      >
        <Location />
        <Gtk.Separator />
        <WeatherText />
      </box>
    </box>
  );
}

function Location() {
  return (
    <button
      class="LocationButton"
      widthRequest={230}
      heightRequest={80}
      onClicked={() => {
        LocationEntry();
      }}
    />
  );
}

function LocationEntry() {
  return (
    <window
      application={app}
      class="DashboardWeatherEntry"
      name="astal-dashboard-weatherentry"
      namespace="astal-dashboard-weatherentry"
      layer={Astal.Layer.TOP}
      exclusivity={Astal.Exclusivity.NORMAL}
      keymode={Astal.Keymode.ON_DEMAND}
      monitor={0}
    >
      <entry
        class="Location"
        widthRequest={230}
        heightRequest={80}
        placeholderText={"New Location..."}
        onActivate={(self) => {
          updateLocation(self.text);
        }}
      />
    </window>
  );
}

function WeatherText() {
  return (
    <box class="Weather" widthRequest={230} heightRequest={80}>
      <label label={weather} />
    </box>
  );
}
