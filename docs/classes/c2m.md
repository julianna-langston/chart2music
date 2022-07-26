[chart2music - v0.4.1](../README.md) / [Exports](../modules.md) / c2m

# Class: c2m

Represents a single chart that should be sonified.

## Table of contents

### Constructors

- [constructor](c2m.md#constructor)

### Properties

- [\_audioEngine](c2m.md#_audioengine)
- [\_ccElement](c2m.md#_ccelement)
- [\_chartElement](c2m.md#_chartelement)
- [\_data](c2m.md#_data)
- [\_flagNewGroup](c2m.md#_flagnewgroup)
- [\_flagNewStat](c2m.md#_flagnewstat)
- [\_groupIndex](c2m.md#_groupindex)
- [\_groups](c2m.md#_groups)
- [\_keyEventManager](c2m.md#_keyeventmanager)
- [\_metadataByGroup](c2m.md#_metadatabygroup)
- [\_options](c2m.md#_options)
- [\_pauseFlag](c2m.md#_pauseflag)
- [\_playListInterval](c2m.md#_playlistinterval)
- [\_pointIndex](c2m.md#_pointindex)
- [\_providedAudioEngine](c2m.md#_providedaudioengine)
- [\_speedRateIndex](c2m.md#_speedrateindex)
- [\_sr](c2m.md#_sr)
- [\_summary](c2m.md#_summary)
- [\_title](c2m.md#_title)
- [\_xAxis](c2m.md#_xaxis)
- [\_y2Axis](c2m.md#_y2axis)
- [\_yAxis](c2m.md#_yaxis)

### Methods

- [\_initializeData](c2m.md#_initializedata)
- [\_initializeKeyActionMap](c2m.md#_initializekeyactionmap)
- [\_moveLeft](c2m.md#_moveleft)
- [\_moveLeftTenths](c2m.md#_movelefttenths)
- [\_moveNextStat](c2m.md#_movenextstat)
- [\_movePrevStat](c2m.md#_moveprevstat)
- [\_moveRight](c2m.md#_moveright)
- [\_moveRightTenths](c2m.md#_moverighttenths)
- [\_moveToMaximum](c2m.md#_movetomaximum)
- [\_moveToMinimum](c2m.md#_movetominimum)
- [\_onFocus](c2m.md#_onfocus)
- [\_playAllLeft](c2m.md#_playallleft)
- [\_playAllRight](c2m.md#_playallright)
- [\_playAndSpeak](c2m.md#_playandspeak)
- [\_playCurrent](c2m.md#_playcurrent)
- [\_playLeft](c2m.md#_playleft)
- [\_playRight](c2m.md#_playright)
- [\_speakCurrent](c2m.md#_speakcurrent)
- [\_startListening](c2m.md#_startlistening)
- [getCurrent](c2m.md#getcurrent)
- [setOptions](c2m.md#setoptions)

## Constructors

### constructor

• **new c2m**(`input`)

Constructor

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [`SonifyTypes`](../modules/internal_.md#sonifytypes) | data/config provided by the invocation |

#### Defined in

[c2mChart.ts:99](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L99)

## Properties

### \_audioEngine

• `Private` **\_audioEngine**: [`AudioEngine`](../interfaces/internal_.AudioEngine.md) = `null`

#### Defined in

[c2mChart.ts:85](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L85)

___

### \_ccElement

• `Private` **\_ccElement**: [`HTMLElement`]( https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement )

#### Defined in

[c2mChart.ts:69](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L69)

___

### \_chartElement

• `Private` **\_chartElement**: [`HTMLElement`]( https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement )

#### Defined in

[c2mChart.ts:68](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L68)

___

### \_data

• `Private` **\_data**: [`SupportedDataPointType`](../modules/internal_.md#supporteddatapointtype)[][]

#### Defined in

[c2mChart.ts:72](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L72)

___

### \_flagNewGroup

• `Private` **\_flagNewGroup**: `boolean` = `false`

#### Defined in

[c2mChart.ts:82](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L82)

___

### \_flagNewStat

• `Private` **\_flagNewStat**: `boolean` = `false`

#### Defined in

[c2mChart.ts:83](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L83)

___

### \_groupIndex

• `Private` **\_groupIndex**: `number` = `0`

#### Defined in

[c2mChart.ts:73](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L73)

___

### \_groups

• `Private` **\_groups**: `string`[]

#### Defined in

[c2mChart.ts:71](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L71)

___

### \_keyEventManager

• `Private` **\_keyEventManager**: `KeyboardEventManager`

#### Defined in

[c2mChart.ts:84](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L84)

___

### \_metadataByGroup

• `Private` **\_metadataByGroup**: [`groupedMetadata`](../modules/internal_.md#groupedmetadata)[]

#### Defined in

[c2mChart.ts:86](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L86)

___

### \_options

• `Private` **\_options**: [`c2mOptions`](../modules/internal_.md#c2moptions)

#### Defined in

[c2mChart.ts:87](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L87)

___

### \_pauseFlag

• `Private` **\_pauseFlag**: `boolean` = `false`

#### Defined in

[c2mChart.ts:92](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L92)

___

### \_playListInterval

• `Private` **\_playListInterval**: `Timeout` = `null`

#### Defined in

[c2mChart.ts:80](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L80)

___

### \_pointIndex

• `Private` **\_pointIndex**: `number` = `0`

#### Defined in

[c2mChart.ts:74](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L74)

___

### \_providedAudioEngine

• `Private` `Optional` **\_providedAudioEngine**: [`AudioEngine`](../interfaces/internal_.AudioEngine.md)

#### Defined in

[c2mChart.ts:91](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L91)

___

### \_speedRateIndex

• `Private` **\_speedRateIndex**: `number` = `1`

#### Defined in

[c2mChart.ts:81](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L81)

___

### \_sr

• `Private` **\_sr**: `ScreenReaderBridge`

#### Defined in

[c2mChart.ts:75](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L75)

___

### \_summary

• `Private` **\_summary**: `string`

#### Defined in

[c2mChart.ts:70](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L70)

___

### \_title

• `Private` **\_title**: `string`

#### Defined in

[c2mChart.ts:79](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L79)

___

### \_xAxis

• `Private` **\_xAxis**: [`AxisData`](../modules/internal_.md#axisdata)

#### Defined in

[c2mChart.ts:76](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L76)

___

### \_y2Axis

• `Private` **\_y2Axis**: [`AxisData`](../modules/internal_.md#axisdata)

#### Defined in

[c2mChart.ts:78](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L78)

___

### \_yAxis

• `Private` **\_yAxis**: [`AxisData`](../modules/internal_.md#axisdata)

#### Defined in

[c2mChart.ts:77](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L77)

## Methods

### \_initializeData

▸ `Private` **_initializeData**(`userData`): `void`

Initialize internal data structure. The user can provide data is several different types of formats,
so those formats will need to be unified here.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `userData` | [`dataSet`](../modules/internal_.md#dataset) \| [`SupportedInputType`](../modules/internal_.md#supportedinputtype)[] | data provided by the invocation |

#### Returns

`void`

#### Defined in

[c2mChart.ts:398](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L398)

___

### \_initializeKeyActionMap

▸ `Private` **_initializeKeyActionMap**(): `void`

Initialize which keys map to which actions

#### Returns

`void`

#### Defined in

[c2mChart.ts:183](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L183)

___

### \_moveLeft

▸ `Private` **_moveLeft**(): `boolean`

Move focus to the next data point to the left, if there is one

#### Returns

`boolean`

#### Defined in

[c2mChart.ts:450](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L450)

___

### \_moveLeftTenths

▸ `Private` **_moveLeftTenths**(): `boolean`

Move by a tenth to the left

#### Returns

`boolean`

#### Defined in

[c2mChart.ts:490](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L490)

___

### \_moveNextStat

▸ `Private` **_moveNextStat**(): `boolean`

Move to the next stat

#### Returns

`boolean`

if possible

#### Defined in

[c2mChart.ts:534](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L534)

___

### \_movePrevStat

▸ `Private` **_movePrevStat**(): `boolean`

Move to the next stat

#### Returns

`boolean`

if possible

#### Defined in

[c2mChart.ts:520](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L520)

___

### \_moveRight

▸ `Private` **_moveRight**(): `boolean`

Move focus to the next data point to the right, if there is one

#### Returns

`boolean`

#### Defined in

[c2mChart.ts:437](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L437)

___

### \_moveRightTenths

▸ `Private` **_moveRightTenths**(): `boolean`

Move by a tenth to the right

#### Returns

`boolean`

#### Defined in

[c2mChart.ts:504](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L504)

___

### \_moveToMaximum

▸ `Private` **_moveToMaximum**(): `boolean`

Move focus to the lowest value data point

#### Returns

`boolean`

- if move was completed

#### Defined in

[c2mChart.ts:478](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L478)

___

### \_moveToMinimum

▸ `Private` **_moveToMinimum**(): `boolean`

Move focus to the lowest value data point

#### Returns

`boolean`

- if move was completed

#### Defined in

[c2mChart.ts:464](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L464)

___

### \_onFocus

▸ `Private` **_onFocus**(): `void`

Perform actions when a new data point receives focus

#### Returns

`void`

#### Defined in

[c2mChart.ts:731](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L731)

___

### \_playAllLeft

▸ `Private` **_playAllLeft**(): `void`

Play all categories to the left

#### Returns

`void`

#### Defined in

[c2mChart.ts:611](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L611)

___

### \_playAllRight

▸ `Private` **_playAllRight**(): `void`

Play all categories to the right

#### Returns

`void`

#### Defined in

[c2mChart.ts:581](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L581)

___

### \_playAndSpeak

▸ `Private` **_playAndSpeak**(): `void`

Play an individual data point, and then speak its details

#### Returns

`void`

#### Defined in

[c2mChart.ts:427](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L427)

___

### \_playCurrent

▸ `Private` **_playCurrent**(): `void`

Play the current data point

#### Returns

`void`

#### Defined in

[c2mChart.ts:638](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L638)

___

### \_playLeft

▸ `Private` **_playLeft**(): `void`

Play all data points to the left, if there are any

#### Returns

`void`

#### Defined in

[c2mChart.ts:547](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L547)

___

### \_playRight

▸ `Private` **_playRight**(): `void`

Play all data points to the right, if there are any

#### Returns

`void`

#### Defined in

[c2mChart.ts:564](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L564)

___

### \_speakCurrent

▸ `Private` **_speakCurrent**(): `void`

Update the screen reader on the current data point

#### Returns

`void`

#### Defined in

[c2mChart.ts:741](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L741)

___

### \_startListening

▸ `Private` **_startListening**(): `void`

Listen to various events, and drive interactions

#### Returns

`void`

#### Defined in

[c2mChart.ts:415](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L415)

___

### getCurrent

▸ **getCurrent**(): `Object`

Get the data point that the user is currently focused on

#### Returns

`Object`

- the current group name and data point

| Name | Type |
| :------ | :------ |
| `group` | `string` |
| `point` | [`SupportedDataPointType`](../modules/internal_.md#supporteddatapointtype) |
| `stat` | `string` |

#### Defined in

[c2mChart.ts:170](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L170)

___

### setOptions

▸ **setOptions**(`option`): `void`

Set options for the interaction model of the chart

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `option` | [`c2mOptions`](../modules/internal_.md#c2moptions) | key/value pairs for options and their possible values |

#### Returns

`void`

#### Defined in

[c2mChart.ts:158](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L158)
