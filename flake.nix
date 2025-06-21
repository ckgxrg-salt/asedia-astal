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
      packages.${system}.default = pkgs.callPackage ./package.nix { inherit ags; };

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
          prettier
          eslint
          nixfmt-rfc-style
          deadnix
        ];
      };

      formatter.${system} = pkgs.nixfmt-rfc-style;
    };
}
