[chart2music - v0.4.1](README.md) / Exports

# chart2music - v0.4.1

## Table of contents

### Namespaces

- [&lt;internal\&gt;](modules/internal_.md)

### Classes

- [c2m](classes/c2m.md)

### Functions

- [c2mChart](modules.md#c2mchart)

## Functions

### c2mChart

▸ **c2mChart**(`input`): [`c2mGolangReturn`](modules/internal_.md#c2mgolangreturn)

Validates and initializes a single chart that should be sonified

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | [`SonifyTypes`](modules/internal_.md#sonifytypes) | data, config, and options for the chart |

#### Returns

[`c2mGolangReturn`](modules/internal_.md#c2mgolangreturn)

c2mGolangReturn - A value of "err" (null if no error, or string if error) and "data" (the chart, if there was no error)

#### Defined in

[c2mChart.ts:52](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/c2mChart.ts#L52)
