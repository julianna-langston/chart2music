---
sidebar_position: 2
sidebar_label: Integration
---

# Using on your site

Chart2Music can be integrated into a vanilla HTML website, or be used in a more complex development stack. Here are different examples.

## Script tag

If you're referencing a CDN...

```html
<script src="https://cdn.jsdelivr.net/npm/chart2music@latest/dist/index.min.js"></script>
<script>
    c2mChart({...});
</script>
```

or a local version
```html
<script src="/path/to/chart2music.js"></script>
<script>
    c2mChart({...});
</script>
```

## With rollup, webpack, or other bundlers

```js
import c2mChart from "chart2music";

c2mChart({...});
```

## Using a local version as a module

```js
import c2mChart from "/path/to/chart2music.mjs";

c2mChart({...});
```