{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    astal = {
      url = "github:aylur/astal";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    ags = {
      url = "github:aylur/ags/v3";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.astal.follows = "astal";
    };
  };

  outputs =
    {
      nixpkgs,
      ags,
      ...
    }:
    let
      system = "x86_64-linux";
      pkgs = import nixpkgs {
        inherit system;
      };
    in
    {
      packages.${system}.default = pkgs.stdenv.mkDerivation {
        pname = "asedia-astal";
        version = "0.1.0";

        src = ./.;

        nativeBuildInputs = with pkgs; [
          wrapGAppsHook
          gobject-introspection
          ags.packages.${system}.default
        ];

        buildInputs = with pkgs; [
          glib
          gjs
          pkgs.astal.io
          pkgs.astal.astal4
          pkgs.astal.hyprland
        ];

        installPhase = ''
          ags bundle logout/app.ts $out/bin/asedia-astal
        '';

        preFixup = ''
          gappsWrapperArgs+=(
            --prefix PATH : ${
              pkgs.lib.makeBinPath ([
              ])
            }
          )
        '';
      };

      devShells.${system}.default = pkgs.mkShell {
        name = "astal-dev";

        buildInputs = [
          (ags.packages.${system}.agsFull.override (prev: {
            extraPackages = prev.extraPackages ++ [
              pkgs.libgtop
            ];
          }))
        ];

        nativeBuildInputs = with pkgs; [
          stylelint
          prettier
          eslint
          nixfmt-rfc-style
          deadnix
        ];
      };

      formatter.${system} = pkgs.nixfmt-rfc-style;
    };
}
