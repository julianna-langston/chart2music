# Changelog

## 1.7.0

* New feature: Add API to show/hide individual categories in a chart
* Prevent users from submitting javascript Date values for their X-values.
* Fix bug where end users couldn't launch the help dialog when they had caps lock on

## 1.6.2

* New feature: End-users can play between categories (`Shift+PageUp` / `Shift+PageDown`)
* New feature: End-users can jump to the minimum/maximum value of the entire chart (`Ctrl+[` / `Ctrl+]`)
* Support using the up/down arrow keys to move between rows on a "matrix" (aka heatmap) plot
* Fix issue where the stat in focus is lost when data is reset
* Fix issue where undefined or null data values resulted in incorrect minimum/maximum value calculations.

## 1.6.1

* Update references in the README

## 1.6.0

* New feature: Add new chart type "matrix" (for heatmaps and correlation matrices)
* New feature: Add keystroke for moving to the first/last category (`Alt+PageUp` / `Alt+PageDown`)

*Version 1.5.0 was erroneously skipped.*

## 1.4.0

* New feature: Add new chart type "histogram"
* New feature: Add new chart type "box" (for box-and-whisker plots) (experimental)
* New feature: Include "Speed" options in the Options dialog for end users
* Let developers provide a custom range of Hertz values

## 1.3.2

* Use `role="application"` on chart elements that don't already have `role` attributes. This improves the user experience for screen reader users.

## 1.3.1

* Support SVG elements as valid chart elements

## 1.3.0

* New feature: Add support for logarithmic axes
* New feature: Support passing custom hotkeys
* New feature: Support assigning focus to a specific data point in a chart when resetting the data/contents of that chart

## 1.2.0

* New feature: Add support for mobile interactions

## 1.1.0

* New feature: the Options dialog. This allows end-users to control the hertz range of their sonification.
* Added a warning message when a user presses "M" on a non-live chart. If a user presses "M" on a **live** chart, that begins "Monitor" mode, where newly-added data is automatically played. However, if the user press "M" on a chart that **isn't** live, they will be told as much, so that the end-user doesn't get confused when no data is being updated.

## 1.0.6

* Remove all notes below 55 Hertz, as many speakers have difficulty playing those notes.

## 1.0.5

* Force a `role` attribute on chart elements if they don't already have one. This fixes a bug where firefox wouldn't read the `aria-label` attribute on chart elements.

## 1.0.4

* Updated references on documentation site

## 1.0.3

* Fix bug where multiple instances of Chart2Music on the same page sharing the same CC element could cause the screen reader to stop reading text.

## 1.0.2

* Refined support for multiple charts on a page using the same CC element. While this behavior previously worked for screen reader users, the content of the CC element wasn't clearing properly when switching between charts. This resulted in excess text in the CC element, which made debugging confusing.

## 1.0.1

* Add support for missing y-values. In the cases of missing values (any data that is NaN), no sound plays, and the screen reader will say that the value is missing.
* Add support for out-of-bounds values. Out-of-bounds values occur when the report author explicitly sets a minimum or maximum for an axis, but also provides data that goes beyond those limits. In thhese cases, no sound plays, and the screen reader will say that the value is too low or too high.
