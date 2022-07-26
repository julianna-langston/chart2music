[chart2music - v0.4.1](../README.md) / [Exports](../modules.md) / <internal\>

# Namespace: <internal\>

## Table of contents

### Enumerations

- [SUPPORTED\_CHART\_TYPES](../enums/internal_.SUPPORTED_CHART_TYPES.md)

### Interfaces

- [AlternateAxisDataPoint](../interfaces/internal_.AlternateAxisDataPoint.md)
- [AudioEngine](../interfaces/internal_.AudioEngine.md)
- [DataPoint](../interfaces/internal_.DataPoint.md)
- [HighLowDataPoint](../interfaces/internal_.HighLowDataPoint.md)
- [OHLCDataPoint](../interfaces/internal_.OHLCDataPoint.md)
- [SimpleDataPoint](../interfaces/internal_.SimpleDataPoint.md)
- [elementInfo](../interfaces/internal_.elementInfo.md)

### Type Aliases

- [AxisData](internal_.md#axisdata)
- [KeyDetails](internal_.md#keydetails)
- [KeyRegistration](internal_.md#keyregistration)
- [SonifyTypes](internal_.md#sonifytypes)
- [StatBundle](internal_.md#statbundle)
- [SupportedDataPointType](internal_.md#supporteddatapointtype)
- [SupportedInputType](internal_.md#supportedinputtype)
- [c2mCallbackType](internal_.md#c2mcallbacktype)
- [c2mGolangReturn](internal_.md#c2mgolangreturn)
- [c2mOptions](internal_.md#c2moptions)
- [dataSet](internal_.md#dataset)
- [groupedMetadata](internal_.md#groupedmetadata)

## Type Aliases

### AxisData

Ƭ **AxisData**: `Object`

Metadata for an axis

#### Type declaration

| Name | Type |
| :------ | :------ |
| `format?` | (`value`: `number`) => `string` |
| `label?` | `string` |
| `maximum?` | `number` |
| `minimum?` | `number` |

#### Defined in

[types.ts:62](https://github.com/julianna-langston/chart2music/blob/389a994/src/types.ts#L62)

___

### KeyDetails

Ƭ **KeyDetails**: `Object`

Details for a given hotkey

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `callback` | () => `void` | The callback for when this hotkey is invoked |
| `description?` | `string` | Additional description for what this hotkey does (displayed in hotkey dialog) |
| `force?` | `boolean` | If the hotkey already exists, force this command to override it |
| `title?` | `string` | Title for what this hotkey does (displayed in hotkey dialog) |

#### Defined in

[keyboardManager.ts:11](https://github.com/julianna-langston/chart2music/blob/389a994/src/keyboardManager.ts#L11)

___

### KeyRegistration

Ƭ **KeyRegistration**: { `key`: `string`  } & [`KeyDetails`](internal_.md#keydetails)

#### Defined in

[keyboardManager.ts:25](https://github.com/julianna-langston/chart2music/blob/389a994/src/keyboardManager.ts#L25)

___

### SonifyTypes

Ƭ **SonifyTypes**: `Object`

Contains the data to describe a chart that should be sonified.
Most of the keys of this interface are optional, with the exception of "data" and "element".

#### Type declaration

| Name | Type | Description |
| :------ | :------ | :------ |
| `audioEngine?` | [`AudioEngine`](../interfaces/internal_.AudioEngine.md) | Optional audio engine to replace the default audio engine. |
| `axes?` | { `x?`: [`AxisData`](internal_.md#axisdata) ; `y?`: [`AxisData`](internal_.md#axisdata) ; `y2?`: [`AxisData`](internal_.md#axisdata)  } | Optional metadata for the chart. If you do not provide this metadata, it will be calculated automatically from the chart data. |
| `axes.x?` | [`AxisData`](internal_.md#axisdata) | Optional metadata for the x-axis. |
| `axes.y?` | [`AxisData`](internal_.md#axisdata) | Optional metadata for the y-axis. |
| `axes.y2?` | [`AxisData`](internal_.md#axisdata) | Optional metadata for the y2-axis. |
| `cc?` | [`HTMLElement`]( https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement ) | An optional HTML element that will be used to output messages to a running screen reader. If you do not provide this key, a suitable HTML will be created for you. |
| `data` | [`dataSet`](internal_.md#dataset) \| [`SupportedInputType`](internal_.md#supportedinputtype)[] | The data that should be presented in this chart. This key is required for all charts. |
| `element` | [`HTMLElement`]( https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement ) | The HTML element in the DOM that represents this chart. This will be used to handle keyboard events to enable the user to interact with the chart. This key is required for all charts. |
| `options?` | [`c2mOptions`](internal_.md#c2moptions) | - |
| `title?` | `string` | Optional title for the chart. |
| `type` | [`SUPPORTED_CHART_TYPES`](../enums/internal_.SUPPORTED_CHART_TYPES.md) \| [`SUPPORTED_CHART_TYPES`](../enums/internal_.SUPPORTED_CHART_TYPES.md)[] | Required type for the chart. |

#### Defined in

[types.ts:14](https://github.com/julianna-langston/chart2music/blob/389a994/src/types.ts#L14)

___

### StatBundle

Ƭ **StatBundle**: `Object`

Bundle of possible statistics

#### Type declaration

| Name | Type |
| :------ | :------ |
| `close?` | `number` |
| `high?` | `number` |
| `low?` | `number` |
| `open?` | `number` |

#### Defined in

[types.ts:84](https://github.com/julianna-langston/chart2music/blob/389a994/src/types.ts#L84)

___

### SupportedDataPointType

Ƭ **SupportedDataPointType**: [`SimpleDataPoint`](../interfaces/internal_.SimpleDataPoint.md) \| [`AlternateAxisDataPoint`](../interfaces/internal_.AlternateAxisDataPoint.md) \| [`HighLowDataPoint`](../interfaces/internal_.HighLowDataPoint.md) \| [`OHLCDataPoint`](../interfaces/internal_.OHLCDataPoint.md)

A type that includes all of the supported data point types.

#### Defined in

[dataPoint.ts:101](https://github.com/julianna-langston/chart2music/blob/389a994/src/dataPoint.ts#L101)

___

### SupportedInputType

Ƭ **SupportedInputType**: [`SupportedDataPointType`](internal_.md#supporteddatapointtype) \| `number`

#### Defined in

[types.ts:8](https://github.com/julianna-langston/chart2music/blob/389a994/src/types.ts#L8)

___

### c2mCallbackType

Ƭ **c2mCallbackType**: `Object`

Data provided for the on focus callback

#### Type declaration

| Name | Type |
| :------ | :------ |
| `index` | `number` |
| `slice` | `string` |

#### Defined in

[types.ts:110](https://github.com/julianna-langston/chart2music/blob/389a994/src/types.ts#L110)

___

### c2mGolangReturn

Ƭ **c2mGolangReturn**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `data?` | [`c2m`](../classes/c2m.md) |
| `err` | ``null`` \| `string` |

#### Defined in

[types.ts:128](https://github.com/julianna-langston/chart2music/blob/389a994/src/types.ts#L128)

___

### c2mOptions

Ƭ **c2mOptions**: `Object`

Options available for C2M chart

#### Type declaration

| Name | Type |
| :------ | :------ |
| `enableSound?` | `boolean` |
| `enableSpeech?` | `boolean` |
| `onFocusCallback?` | (`point`: [`c2mCallbackType`](internal_.md#c2mcallbacktype)) => `void` |

#### Defined in

[types.ts:118](https://github.com/julianna-langston/chart2music/blob/389a994/src/types.ts#L118)

___

### dataSet

Ƭ **dataSet**: `Object`

A dictionary of data, where the key is the group name, and the value is the array of data points

#### Index signature

▪ [groupName: `string`]: [`SupportedInputType`](internal_.md#supportedinputtype)[]

#### Defined in

[types.ts:55](https://github.com/julianna-langston/chart2music/blob/389a994/src/types.ts#L55)

___

### groupedMetadata

Ƭ **groupedMetadata**: `Object`

Metadata for a group of chart data

#### Type declaration

| Name | Type |
| :------ | :------ |
| `availableStats` | keyof [`StatBundle`](internal_.md#statbundle)[] |
| `maximumPointIndex` | `number` |
| `minimumPointIndex` | `number` |
| `statIndex` | `number` |
| `tenths` | `number` |

#### Defined in

[types.ts:94](https://github.com/julianna-langston/chart2music/blob/389a994/src/types.ts#L94)
