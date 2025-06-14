import app from "ags/gtk4/app";
import { Panel } from "./logout";

import css from "./style.scss";

app.start({
  css: css,
  main() {
    Panel();
  },
});
