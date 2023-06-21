# Features

As developers add new features to this library, it's possible for the new features to wind up not playing nicely with older features, especially ones that aren't used as frequently.

The purpose of this page is to serve as a checklist of sorts. Whenever a new feature is added, we can go through this checklist to make sure the new feature plays nicely with all of the other existing features.

## Chart types

* band plot
* bar chart
* box plot
* candlestick
* histogram
* line chart
* matrix (equivalent to heatmaps)
* pie chart
* scatter plot
* arrays of the above (eg, `["bar", "line"]` or `["line", "band"]`)

## Data point types
* number
* x, y, [y2], [label], [custom]
* x, high, low, [label], [custom]
* x, open, high, low, close, [label], [custom]
* x, low, q1, median, q3, high, [outlier], [label], [custom]

## Axes features
* label
* minimum
* maximum
* format callback
* valueLabels
* linear versus logarithmic
* continuous mode

## Keyboard interactions for end users
* replay/re-announce current point
* move left/right (previous/next point in group)
* move to first/last point in group
* play left/right
* move forward/backward between groups
* move to first/last group
* play forward/backward through groups
* move between statistics
* move forward/backward within a group by 1/10th of its points
* move to the minimum/maximum point in a group
* move to the minimum/maximum point in a chart
* move between outliers
* open help dialog
* open options dialog
* change speed settings
* toggle monitor mode

## Dialogs
* Help dialog
* Options dialog
    * Adjust hertz levels
    * Adjust speed options
    * Set continuous mode
    * Data point label: read first or read last
    * Remember settings on the page

## Other UX
* Monitor mode
* Touch gestures

## Other DevX
* `onFocusCallback`
* `onSelectCallback`
* `.getCurrent()`
* `.setData()`
* `.appendData()`
* `.setCategoryVisibility()`
* custom audio engine
* custom hertz range
