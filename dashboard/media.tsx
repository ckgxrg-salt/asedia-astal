import Gtk from "gi://Gtk?version=4.0";
import Mpris from "gi://AstalMpris";
import { createBinding, With } from "ags";

import { bottom, setBottom } from "../common/states";
import {
  activePlayer,
  nextPlayer,
  prevPlayer,
  mapPlayers,
  lengthStr,
} from "../common/mpris";

export default function Media() {
  return (
    <box>
      <button
        class="MediaButton"
        visible={bottom((v) => v != 0)}
        widthRequest={260}
        heightRequest={260}
        $clicked={() => setBottom(0)}
      >
        <image iconName="audio-radio" />
      </button>
      <box
        orientation={1}
        class="Media"
        visible={bottom((v) => v == 0)}
        widthRequest={760}
        heightRequest={260}
      >
        {Switchers()}
        <With value={activePlayer}>
          {(v) => {
            if (v === undefined) {
              return (
                <label class="NotFound" widthRequest={420} heightRequest={200}>
                  No Players Found
                </label>
              );
            } else {
              return <PlayerControl player={v} />;
            }
          }}
        </With>
      </box>
    </box>
  );
}

function Switchers() {
  return (
    <centerbox class="Switchers">
      <button tooltipText="Previous Player" $clicked={() => prevPlayer()}>
        <image iconName="media-skip-backward-symbolic" />
      </button>
      <label
        widthRequest={300}
        label={activePlayer((player) => mapPlayers(player))}
      />
      <button tooltipText="Next Player" $clicked={() => nextPlayer()}>
        <image iconName="media-skip-forward-symbolic" />
      </button>
    </centerbox>
  );
}

function PlayerControl({ player }: { player: Mpris.Player }) {
  const { START, CENTER, END } = Gtk.Align;
  const title = createBinding(player, "title");
  const artist = createBinding(player, "artist");
  const coverArt = createBinding(
    player,
    "coverArt",
  )((c) => `background-image: url('${c}')`);
  const position = createBinding(
    player,
    "position",
  )((p) => (player.length > 0 ? p / player.length : 0));
  const playIcon = createBinding(
    player,
    "playbackStatus",
  )((s) =>
    s === Mpris.PlaybackStatus.PLAYING
      ? "media-playback-pause-symbolic"
      : "media-playback-start-symbolic",
  );

  return (
    <box class="MediaPlayer">
      <box
        class="CoverArt"
        css={coverArt}
        widthRequest={120}
        heightRequest={120}
      />
      <box orientation={1}>
        <box orientation={1} valign={CENTER} class="Title">
          <label
            maxWidthChars={20}
            halign={START}
            label={title}
            tooltipText={title}
          />
          <label
            halign={START}
            valign={START}
            wrap
            label={artist}
            tooltipText={artist}
          />
        </box>
        <slider
          class="Progress"
          visible={createBinding(player, "length")((l) => l > 0)}
          $dragged={({ value }) => (player.position = value * player.length)}
          value={position}
        />
        <centerbox class="Actions" widthRequest={400} heightRequest={50}>
          <label
            class="Position"
            halign={START}
            visible={createBinding(player, "length")((l) => l > 0)}
            label={createBinding(player, "position")(lengthStr)}
          />
          <box>
            <button
              $clicked={() => player.previous()}
              visible={createBinding(player, "canGoPrevious")}
              widthRequest={40}
              heightRequest={30}
            >
              <image iconName="media-skip-backward-symbolic" />
            </button>
            <button
              $clicked={() => player.play_pause()}
              visible={createBinding(player, "canControl")}
              widthRequest={40}
              heightRequest={30}
            >
              <image iconName={playIcon} />
            </button>
            <button
              $clicked={() => player.next()}
              visible={createBinding(player, "canGoNext")}
              widthRequest={40}
              heightRequest={30}
            >
              <image iconName="media-skip-forward-symbolic" />
            </button>
          </box>
          <label
            class="Length"
            halign={END}
            visible={createBinding(player, "length")((l) => l > 0)}
            label={createBinding(
              player,
              "length",
            )((l) => (l > 0 ? lengthStr(l) : "0:00"))}
          />
        </centerbox>
      </box>
    </box>
  );
}
