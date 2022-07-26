[chart2music - v0.4.1](../README.md) / [Exports](../modules.md) / [<internal\>](../modules/internal_.md) / AudioEngine

# Interface: AudioEngine

[<internal>](../modules/internal_.md).AudioEngine

An interface which all audio engines must implement.

## Table of contents

### Properties

- [masterGain](internal_.AudioEngine.md#mastergain)

### Methods

- [playDataPoint](internal_.AudioEngine.md#playdatapoint)

## Properties

### masterGain

• **masterGain**: `number`

The master gain for the audio engine.
Setting this to 0 will mute the engine, while setting it to 1 will enable full volume.

#### Defined in

[audio/AudioEngine.ts:9](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/audio/AudioEngine.ts#L9)

## Methods

### playDataPoint

▸ **playDataPoint**(`frequency`, `panning`, `duration`): `void`

Play a sound to represent a data point.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `frequency` | `number` | the fundimental frequency |
| `panning` | `number` | where to play the sound (-1 <= 0 <= 1, 0 == center) |
| `duration` | `number` | the duration of the note in seconds |

#### Returns

`void`

#### Defined in

[audio/AudioEngine.ts:18](https://github.com/julianna-langston/chart2music/blob/5c1c6b4/src/audio/AudioEngine.ts#L18)
