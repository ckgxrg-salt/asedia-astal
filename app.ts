import app from "ags/gtk4/app";

import { setShowDock, showDock } from "./common/states";
import { setEvent, loadEvent } from "./common/today";
import { setWeather, loadWeather } from "./common/weather";

import { Dashboard } from "./dashboard/dashboard";
import { Dock } from "./dashboard/dock";
import dashboardStyle from "./dashboard/style.scss";

app.start({
  instanceName: "astal-shell",
  css: dashboardStyle,
  main() {
    Dashboard();
    Dock();
  },
  requestHandler(req: string, res: (response: any) => void) {
    switch (req) {
      case "show-dock":
        setShowDock(true);
        return res("Ok");
      case "hide-dock":
        setShowDock(false);
        return res("Ok");
      case "toggle-dock":
        setShowDock(!showDock.get());
        return res("Ok");
      case "reload":
        setWeather(loadWeather());
        setEvent(loadEvent());
        return res("Ok");
      default:
        return res(
          "Available commands: show-dock hide-dock toggle-dock reload",
        );
    }
  },
  client(message: (msg: string) => string, ...args: Array<string>) {
    const res = message(args.toString());
    print(res);
  },
});
