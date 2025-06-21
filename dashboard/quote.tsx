import Gtk from "gi://Gtk?version=4.0";
import Pango from "gi://Pango";
import { createState } from "ags";
import { exec } from "ags/process";

export function Quote() {
  const [quote, setQuote] = createState(exec("fortune"));

  return (
    <box
      class="Quote"
      halign={Gtk.Align.CENTER}
      widthRequest={655}
      heightRequest={160}
    >
      <button
        class="QuoteButton"
        widthRequest={50}
        halign={Gtk.Align.END}
        tooltipText="Quotes from fortune"
        onClicked={() => setQuote(exec("fortune"))}
      >
        <image iconName="messenger-indicator" />
      </button>
      <Gtk.Separator />
      <label
        class="QuoteText"
        widthRequest={600}
        halign={Gtk.Align.CENTER}
        wrap
        wrapMode={Pango.WrapMode.CHAR}
        maxWidthChars={25}
        label={quote((content) => removeLeadingComma(getMaxContent(content)))}
        tooltipText={quote}
      />
    </box>
  );
}

function getMaxContent(str: string) {
  let lines = str.split("\n");
  if (lines.length > 3) {
    return (
      lines
        .slice(0, 2)
        .map((each) => each + "\n")
        .toString() +
      lines.at(3) +
      "..."
    );
  } else {
    return str;
  }
}

// Strange Pango behaviour
function removeLeadingComma(str: string) {
  return str.replaceAll("\n,", "\n");
}
