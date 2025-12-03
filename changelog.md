# Changelog

## 1.20.0
* Account for filtering on the "All" section of stacked bar charts. (Thanks to [cmcnulty](https://github.com/cmcnulty) for contributing [#709](https://github.com/julianna-langston/chart2music/pull/709))
* Added Hmong translation. (Thanks to [cmcnulty](https://github.com/cmcnulty) for contributing [#710](https://github.com/julianna-langston/chart2music/pull/710))

## 1.19.0
* Replace uses of `.innerHTML` with safer methods. (Thanks to [rbruckheimer](https://github.com/rbruckheimer) for contributing [#665](https://github.com/julianna-langston/chart2music/pull/665))

## 1.18.1
* Fixed formatting for X-values for OHLC charts

## 1.18.0
* Added a callback function to modify the contents of the Help dialog.

## 1.17.0
* Support a `translations` option, which allows for developers to replace Chart2Music's verbiage with their own.
* Now fires the onFocusCallback when a user first focuses on a chart, and when users switch groups within a chart. This allows for a focus indicator to be present at all times. Note that sound is still not played at those times.
* Generated CC elements are now always *children* of the provided `element`, rather than the element itself. CC elements are only generated if no `cc` is provided.
* Fixed a bug where typescript would throw an error if an `SVGElement` type was provided to the `element` parameter.
* Fixed a bug where typescript would throw an error on any string provided to the `type` parameter.
* Provide a cleaner description for untitled charts

## 1.16.3
* Internal development changes

## 1.16.2
* Use the `.at()` method when working with provided arrays. This is an early step to provide support for spoofed arrays.

## 1.16.1
* When the .cleanUp method is called, the help dialog should be removed from the DOM.

## 1.16.0
* Add a .cleanUp() method, which removes event listeners and attributes from the provided chart element
* Add classnames to dialogs. All dialogs will have the classname `chart2music-dialog`. Each dialog also has its own specific classname: `chart2music-help-dialog`, `chart2music-info-dialog`, and `chart2music-option-dialog`.

## 1.15.0
* Added French, German, and Italian translations (thank you [glow](https://github.com/Neo-Oli) and their team at the [Swiss Red Cross](https://github.com/swissredcross))

## 1.14.0
* Added internationalization support
* Added Spanish translation (thank you [ploperav](https://github.com/ploperav))

## 1.13.0
* Added support for CommonJS (thank you [ayjayt](https://github.com/ayjayt))

## 1.12.1
* Remove experimental mobile support, since it is causing problems in normal usage.

## 1.12.0
* Update the end-user interaction model for navigating between multiple groups in a chart. Users are now given information about the chart type and X-/Y-axis information for each group, rather than for the chart as a whole. This helps users focus on what is relevant to their interests.
* Allow for an "unsupported" chart type.

## 1.11.0
* Add support for chart type 'treemap', as well as supporting hierarchical structures for existing chart types.
* Support sonifying groups with a single data point (pans to the center)

## 1.10.2
* Fix bug where the chart winds up in a bad state when the user focuses on the last group and the visibility of a different group is set to false.

## 1.10.1
* Fix bug where annotations were placed in the wrong spot in a chart.

## 1.10.0
* New feature: Add support for annotations
* New feature: Add an "Info" dialog, which you can open by pressing 'i' on charts with notes.
* Fix bug where 'All' stack is added to the back, rather than the front.

## 1.9.0

* New feature: Add support for scatter plots
* New feature: Add "continuous mode", which provides a UX optimized for irregularly-spaced data.
* New feature: Support labels for data points, and provide users the options to control where a label is placed in a data point description.
* Include a data point's metadata in `onFocusCallback`, `onSelectCallback`, and `getCurrent`.
* Support a `custom` payload for data points
* Include in a chart summary if an axis is logarithmic.
* Change chart description to say 'groups' instead of 'categories', such as in the example text "Sonified line chart 'Income', contains 3 groups..."
* Fix bug in options dialog where users could not press Enter to save data when they were focused on a checkbox.
* Fix bug where a logarithmic x-axis calculates audible panning as if the axis were linear.
* Fix bug where generated dialogs didn't have labels.
* Fix bug where screen readers would read a data point twice when users move rapidly between points.

## 1.8.1

* Export type `C2MChartConfig` for typescript users
* Provide new axes config option `valueLabels` 

## 1.8.0

* Formally support boxplots. (Previously, boxplots were a purely experimental feature.) This includes support for outliers.

## 1.7.1

* Include point `index` in the `getCurrent()` results

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

* New experimental feature: Add support for mobile interactions

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
