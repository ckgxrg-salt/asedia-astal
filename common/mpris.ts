import Mpris from "gi://AstalMpris";
import { Variable } from "astal";

export const mpris = Mpris.get_default();
export const activePlayer = Variable<Mpris.Player | undefined>(undefined);

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
      return original?.get_identity();
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
      activePlayer.set(addedPlayer);
    }
  });
  mpris.connect("player-closed", (_, closedPlayer) => {
    if (
      mpris.get_players().length === 1 &&
      closedPlayer.busName === mpris.get_players()[0]?.busName
    ) {
      return activePlayer.set(undefined);
    }

    if (closedPlayer.busName === activePlayer.get()?.busName) {
      const nextPlayer = mpris
        .get_players()
        .find((player) => player.busName !== closedPlayer.busName);
      activePlayer.set(nextPlayer);
    }
  });
  activePlayer.set(
    mpris.get_players().find((player) => player.get_can_play()) || undefined,
  );
}

// Switches between players
export function nextPlayer() {
  let list = mpris.get_players().filter((player) => player.get_can_play());
  let index = list.findIndex((player) => player === activePlayer.get());
  if (index === list.length - 1) {
    activePlayer.set(list[0]);
  } else {
    activePlayer.set(list[index + 1]);
  }
}
export function prevPlayer() {
  let list = mpris.get_players().filter((player) => player.get_can_play());
  let index = list.findIndex((player) => player === activePlayer.get());
  if (index === 0) {
    activePlayer.set(list[list.length - 1]);
  } else {
    activePlayer.set(list[index - 1]);
  }
}

export function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}
