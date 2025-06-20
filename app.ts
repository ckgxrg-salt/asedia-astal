import app from "ags/gtk4/app";

import Dashboard from "./dashboard/dashboard";
import dashboardStyle from "./dashboard/style.scss";

app.start({
  css: dashboardStyle,
  main() {
    Dashboard();
  },
});
