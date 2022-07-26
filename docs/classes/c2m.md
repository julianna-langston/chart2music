[chart2music - v0.4.1](../README.md) / [Exports](../modules.md) / c2m

# Class: c2m

Represents a single chart that should be sonified.

## Table of contents

### Constructors

- [constructor](c2m.md#constructor)

### Methods

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

[c2mChart.ts:99](https://github.com/julianna-langston/chart2music/blob/389a994/src/c2mChart.ts#L99)

## Methods

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

[c2mChart.ts:170](https://github.com/julianna-langston/chart2music/blob/389a994/src/c2mChart.ts#L170)

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

[c2mChart.ts:158](https://github.com/julianna-langston/chart2music/blob/389a994/src/c2mChart.ts#L158)
