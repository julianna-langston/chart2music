/**
 * An interface which all audio engines must implement.
 */
export interface AudioEngine {
    /**
     * The master gain for the audio engine.
     * Setting this to 0 will mute the engine, while setting it to 1 will enable full volume.
     */
    masterGain: number;

    /**
     * Play a sound to represent a data point.
     *
     * @param frequency - the fundimental frequency
     * @param panning - where to play the sound (-1 <= 0 <= 1, 0 == center)
     * @param duration - the duration of the note in seconds
     */
    playDataPoint(frequency: number, panning: number, duration: number): void;
}
