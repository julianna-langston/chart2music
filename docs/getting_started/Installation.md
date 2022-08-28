---
sidebar_position: 1
---

# Installation

## Package manager: npm

[![npm](https://img.shields.io/npm/v/chart2music.svg?style=flat-square&maxAge=600)](https://npmjs.com/package/chart2music)

```sh
npm add chart2music
```

## CDN: jsDelivr

[![jsdelivr](https://img.shields.io/npm/v/chart2music.svg?label=jsdelivr&style=flat-square&maxAge=600)](https://cdn.jsdelivr.net/npm/chart2music)

You can choose to download a version from jsDelivr, or include a script tag pointing to the CDN.

```html
<script src="https://cdn.jsdelivr.net/npm/chart2music"></script>
```

That URL will download the latest version of chart2music. If you have special concerns round updating to major versions, and want to limit your updates to only the latest minor version, you could use this:

```html
<script src="https://cdn.jsdelivr.net/npm/chart2music@1"></script>
```

This is the equivalent of `^1.0.0`.

:::note
jsDelivr sometimes takes up to 24 hours to refresh its cache after a new version of Chart2Music is published. If you are waiting on a particular version number, you can always update your script to that reference the specific version after the `@`.
:::

For more details about what kind of script sources to use, see [the jsDelivr documentation for npm CDN](https://www.jsdelivr.com/features#npm).