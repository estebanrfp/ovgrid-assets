# OVGrid assets

The public assets of [OVGrid](https://world.ovgrid.com), an open virtual world on a WebGPU
planet, at `https://estebanrfp.github.io/ovgrid-assets/`: its texture bank, 2,812 materials for what
people build, and its avatar library.

Served by GitHub Pages, with CORS open to every origin. The bank is split by resolution so that
each repository stays under GitHub's 1 GB:

| Repository | What | Size |
|---|---|---|
| [ovgrid-assets](https://github.com/estebanrfp/ovgrid-assets) | every material at 256 px — colour, relief (normal) and ORM — its preview, and the bank's `manifest.json` and `index.json` | ~340 MB |
| [ovgrid-textures-512](https://github.com/estebanrfp/ovgrid-textures-512) | colour and relief at 512 px, for the few materials within 10 m of the camera | ~780 MB |
| [ovgrid-textures-1024](https://github.com/estebanrfp/ovgrid-textures-1024) | colour at 1024 px, within 4 m | ~570 MB |

A material's maps are `<category>/<subcategory>/<name>/<map>-<size>.ktx2`, under `textures/` in
ovgrid-assets and at the root of the two others: colour in
ETC1S, relief and ORM in UASTC with zstd, each with its full mip chain. Peers also share them by
their hash, so this origin stays light.

`textures/manifest.json` describes every material (name, category, tags, uses, size in metres,
colour, licence, authors, source); `textures/index.json` is the light index the world loads first.

## The avatar library

`avatar/v1/` is OVGrid's avatar library, as `https://assets.ovgrid.com/avatar/v1/` serves it:
Decentraland's two base bodies with their skeleton and skins, 505 wearables in 28 collections (each
with a mesh for every body it fits, its maps in KTX2 and a WebP thumbnail) and 89 face features.
`index.json` is the light index the world loads first; `manifest.json` lists every item's files,
bytes and source. The meshes are fitted to the bodies' skeleton and quantised in OVGrid's own
format. Pieces that bear a brand or a mark, or art licensed to a collection rather than to
Decentraland, are left out, and the manifest lists them.

## Licence

The materials are dedicated to the public domain under [CC0 1.0](LICENSE), as their sources
publish them: 1,894 from [ambientCG](https://ambientcg.com), 867 from [Poly
Haven](https://polyhaven.com), 27 from [TextureCan](https://www.texturecan.com), 13 from
[3DTextures.me](https://3dtextures.me) — the last two through OVGrid's quality gate
(tools/texture-gate.js) — and 11 made by OVGrid itself (water, end grain, glass).
Attribution is not required, but every material's authors and source page are in
`textures/manifest.json` — thank you to all of them.

`sounds/` is not part of the bank: it keeps sounds that earlier worlds still load from this
repository, and the CC0 dedication does not cover them.

`avatar/` is not under CC0 either: its bodies, wearables, face features and thumbnails come from
[decentraland/avatar-assets](https://github.com/decentraland/avatar-assets) under the
[Apache License 2.0](avatar/v1/LICENSE), © 2019 Metaverse Holdings Ltd., with its
[NOTICE](avatar/v1/NOTICE). The licence grants no trademark rights.

## Author

Esteban Fuster Pozzi (@estebanrfp) - Full Stack JavaScript Developer
