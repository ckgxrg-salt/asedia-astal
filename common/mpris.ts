import Mpris from "gi://AstalMpris";
import { createState } from "ags";

export const mpris = Mpris.get_default();
export const [activePlayer, setActivePlayer] = createState<
  Mpris.Player | undefined
>(undefined);

// Map some player names
export function mapPlayers(original: Mpris.Player | undefined) {
  switch (original?.get_identity()) {
    case "MPD on localhost:6600":
      return "Music Player Daemon";
    case "Mozilla floorp":
      return "Floorp";
    case "bilibili":
      return "Bilibili";
    case undefined:
      return "MPRIS";
    default:
      return original!.get_identity();
  }
}
export function mapPlayersIcon(original: Mpris.Player | undefined) {
  switch (original?.get_identity()) {
    case "MPD on localhost:6600":
      return "mpd";
    case "Mozilla floorp":
      return "floorp";
    case "bilibili":
      return "io.github.msojocs.bilibili";
    case "FreeTube":
      return "freetube";
    case "Celluloid":
      return "celluloid";
    default:
      return "multimedia-player";
  }
}

export function mprisInit() {
  mpris.connect("player-added", (_, addedPlayer) => {
    if (activePlayer.get() === undefined) {
      setActivePlayer(addedPlayer);
    }
  });
  mpris.connect("player-closed", (_, closedPlayer) => {
    if (
      mpris.get_players().length === 1 &&
      closedPlayer.busName === mpris.get_players()[0]?.busName
    ) {
      setActivePlayer(undefined);
      return;
    }

    if (closedPlayer.busName === activePlayer.get()?.busName) {
      const nextPlayer = mpris
        .get_players()
        .find((player) => player.busName !== closedPlayer.busName);
      setActivePlayer(nextPlayer);
    }
  });
  setActivePlayer(
    mpris.get_players().find((player) => player.get_can_play()) || undefined,
  );
}

// Switches between players
export function nextPlayer() {
  let list = mpris.get_players().filter((player) => player.get_can_play());
  let index = list.findIndex((player) => player === activePlayer.get());
  if (index === list.length - 1) {
    setActivePlayer(list[0]);
  } else {
    setActivePlayer(list[index + 1]);
  }
}
export function prevPlayer() {
  let list = mpris.get_players().filter((player) => player.get_can_play());
  let index = list.findIndex((player) => player === activePlayer.get());
  if (index === 0) {
    setActivePlayer(list[list.length - 1]);
  } else {
    setActivePlayer(list[index - 1]);
  }
}

export function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}
