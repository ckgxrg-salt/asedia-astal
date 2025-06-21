import { createState } from "ags";
import { exec } from "ags/process";

// Stores the event calendar widget displays
export function loadEvent() {
  let str = exec(["bash", "-c", "khal list today today | tail -n +2"]);
  if (str.length == 0) {
    return "No Events Today =)";
  }
  return str;
}
export const [event, setEvent] = createState(loadEvent());
