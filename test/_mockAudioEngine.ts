import type { AudioEngine } from "../src/audio";

/**
 * Info for play history
 */
type playHistoryType = {
    frequency: number;
    panning: number;
    duration: number;
};

/**
 * Mock audio engine. Built for testing purposes.
 */
export class MockAudioEngine implements AudioEngine {
    masterGain: number;
    private _lastDuration = -10;
    private _lastFrequency = -10;
    private _lastPanning = -10;
    private _playHistory: playHistoryType[] = [];
    private _playCount = 0;

    /**
     * The instructions to play a data point. The details are being recorded for the test system.
     *
     * @param frequency - hertz to play
     * @param panning - panning (-1 to 1) to play at
     * @param duration - how long to play
     */
    playDataPoint(frequency: number, panning: number, duration: number) {
        this._lastFrequency = frequency;
        this._lastDuration = duration;
        this._lastPanning = panning;
        this._playHistory.push({ frequency, panning, duration });
        this._playCount++;
    }

    /**
     * Reset history and last* values
     */
    reset() {
        this._playHistory = [];
        this._lastDuration = -10;
        this._lastFrequency = -10;
        this._lastPanning = -10;
        this._playCount = 0;
    }

    /**
     * The duration value of the last note played
     */
    get lastDuration() {
        return this._lastDuration;
    }

    /**
     * The frequency value of the last note played
     */
    get lastFrequency() {
        return this._lastFrequency;
    }

    /**
     * The frequency value of the last note played
     */
    get lastPanning() {
        return this._lastPanning;
    }

    /**
     * The frequency value of the last note played
     */
    get playHistory() {
        return this._playHistory;
    }

    /**
     * The frequency value of the last note played
     */
    get playCount() {
        return this._playCount;
    }
}
