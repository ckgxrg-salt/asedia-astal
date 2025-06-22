import app from "ags/gtk4/app";
import { Panel } from "./logout";

import css from "./style.scss";

app.start({
  instanceName: "astal-logout",
  css: css,
  main() {
    Panel();
  },
});
