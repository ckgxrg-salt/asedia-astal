import { weather, updateLocation } from "../common/weather";
import { bottom, setBottom } from "../common/states";

export default function Weather() {
  return (
    <box>
      <button
        class="WeatherButton"
        visible={bottom((v) => v != 1)}
        widthRequest={260}
        heightRequest={260}
        $clicked={() => setBottom(1)}
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
      $clicked={() => {
        LocationEntry();
      }}
    />
  );
}

function LocationEntry() {
  return (
    <window
      application={App}
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
          self.get_toplevel().destroy();
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
