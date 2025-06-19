import app from "ags/gtk4/app";
import { Launchpad } from "./launchpad";

app.start({
  main() {
    Launchpad();
  },
});
