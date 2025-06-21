{
  stdenvNoCC,
  lib,
  wrapGAppsHook,
  gobject-introspection,
  ags,
  glib,
  gjs,
  libgtop,
}:
stdenvNoCC.mkDerivation {
  pname = "asedia-astal";
  version = "0.1.0";

  src = ./.;

  nativeBuildInputs = [
    wrapGAppsHook
    gobject-introspection
    ags.packages."x86_64-linux".default
  ];

  buildInputs = with ags.packages."x86_64-linux"; [
    glib
    gjs
    libgtop

    io
    astal4
    hyprland
    mpris
    apps
    tray
    battery
  ];

  installPhase = ''
    mkdir -p $out/bin

    ags bundle app.ts $out/bin/astal-shell
    ags bundle logout/app.ts $out/bin/astal-logout
    ags bundle launchpad/app.ts $out/bin/astal-launchpad
  '';

  #preFixup = ''
  #  gappsWrapperArgs+=(
  #    --prefix PATH : ${
  #      lib.makeBinPath ([
  #      ])
  #    }
  #  )
  #'';
}
