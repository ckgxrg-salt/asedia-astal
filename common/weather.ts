import { createState } from "ags";
import { readFile, writeFile } from "ags/file";
import { exec } from "ags/process";

export const [location, setLocation] = createState("");
export const [weather, setWeather] = createState("");
export const xdg_data_home = exec(["bash", "-c", "echo $XDG_DATA_HOME"]);

export const loadWeather = () => {
  try {
    return exec(["wego", "-f", "emoji", location.get().replaceAll(" ", "%20")]);
  } catch (err) {
    return "Weather Unavailable =(";
  }
};
export function weatherInit() {
  let loc = readFile(xdg_data_home + "/astal/location");
  if (loc.length == 0) {
    loc = "Vatican";
  }
  setLocation(loc);
  setWeather(loadWeather());
}

export function updateLocation(loc: string) {
  setLocation(loc);
  writeFile(xdg_data_home + "/astal/location", loc);
  setWeather(loadWeather());
}
