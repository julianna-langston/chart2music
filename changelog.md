# Changelog

## 1.0.2

* Refined support for multiple charts on a page using the same CC element. While this behavior previously worked for screen reader users, the content of the CC element wasn't clearing properly when switching between charts. This resulted in excess text in the CC element, which made debugging confusing.

## 1.0.1

* Add support for missing y-values. In the cases of missing values (any data that is NaN), no sound plays, and the screen reader will say that the value is missing.
* Add support for out-of-bounds values. Out-of-bounds values occur when the report author explicitly sets a minimum or maximum for an axis, but also provides data that goes beyond those limits. In thhese cases, no sound plays, and the screen reader will say that the value is too low or too high.