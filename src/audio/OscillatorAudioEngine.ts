import type { AudioEngine } from "./AudioEngine";

/**
 * An audio engine which uses oscillators to create sound.
 */
export class OscillatorAudioEngine implements AudioEngine {
    private readonly _audioContext: AudioContext;
    private readonly _masterCompressor: DynamicsCompressorNode;
    private readonly _masterGain: GainNode;

    /**
     * Create a new OscillatorAudioEngine.
     *
     * @param context - the audio context
     */
    constructor(context: AudioContext) {
        this._audioContext = context;
        // Create the master compressor which stops things from clipping.
        this._masterCompressor = context.createDynamicsCompressor();
        this._masterCompressor.connect(this._audioContext.destination);
        this._masterCompressor.threshold.value = -50;
        this._masterCompressor.knee.value = 40;
        this._masterCompressor.ratio.value = 12;
        this._masterCompressor.attack.value = 0;
        this._masterCompressor.release.value = 0.25;
        // Create the master audio gain.
        this._masterGain = this._audioContext.createGain();
        this._masterGain.gain.value = 0.5;
        this._masterCompressor.connect(this._masterGain);
        this._masterGain.connect(this._audioContext.destination);
    }

    get masterGain(): number {
        return this._masterGain.gain.value;
    }

    /**
     *The overall loudness of the audio engine.
     */
    set masterGain(value: number) {
        this._masterGain.gain.value = value;
    }

    /**
     * Play a sound to represent a data point.
     *
     * @param frequency - the fundimental frequency
     * @param panning - where to play the sound (-1 <= 0 <= 1, 0 == center)
     * @param duration - the duration of the note in seconds, defaults to 0.2
     */
    playDataPoint(frequency: number, panning: number, duration = 0.2) {
        const t = this._audioContext.currentTime;
        // Create the main note.
        const mainFreq = this._audioContext.createOscillator();
        mainFreq.frequency.value = frequency;
        mainFreq.start();
        // Create the background note.
        const {
            carrier: c1,
            amp: a1,
            modulator: m1,
            filter: f1,
            adsr: adsr1
        } = createOperator(
            this._audioContext,
            frequency * 0.5,
            frequency * 3,
            frequency * 2
        );
        c1.type = "triangle";
        adsr1.gain.setValueCurveAtTime([0.2, 0.1], t, duration * 0.75);
        f1.frequency.value = frequency;
        f1.type = "lowpass";
        // ADSR
        const adsr = this._audioContext.createGain();
        adsr.gain.setValueCurveAtTime(
            [0.5, 1, 0.5, 0.5, 0.5, 0.1, 0.0001],
            t,
            duration
        );
        // Create panner node.
        const panner = this._audioContext.createStereoPanner();
        panner.pan.value = panning;
        // connect things up.
        mainFreq.connect(adsr);
        adsr1.connect(adsr);
        adsr.connect(panner);
        panner.connect(this._masterCompressor);
        setTimeout(() => {
            panner.disconnect();
            adsr.disconnect();
            adsr1.disconnect();
            mainFreq.stop();
            mainFreq.disconnect();
            m1.stop();
            m1.disconnect();
            c1.stop();
            c1.disconnect();
            a1.disconnect();
            f1.disconnect();
        }, duration * 1000 * 2);
    }

    /**
     * Placeholder
     */
    playNotification() {
        console.log("notify");
    }
}

/**
 * Create a FM synth operator.
 *
 * @param context - the audio context
 * @param carrierFrequency - the main frequency
 * @param modulatorFrequency - the frequency of the modulator
 * @param modulatorDepth - the depth of the modulator
 * @returns an object with all of the nodes for this operator
 */
function createOperator(
    context: AudioContext,
    carrierFrequency: number,
    modulatorFrequency: number,
    modulatorDepth: number
): {
    carrier: OscillatorNode;
    amp: GainNode;
    modulator: OscillatorNode;
    filter: BiquadFilterNode;
    adsr: GainNode;
} {
    const c = context.createOscillator(); // Carrier
    const a = context.createGain(); // amp
    const m = context.createOscillator(); // modulator
    const f = context.createBiquadFilter(); // filter
    const adsr = context.createGain(); // ADSR for this operator
    c.frequency.value = carrierFrequency;
    m.frequency.value = modulatorFrequency;
    a.gain.value = modulatorDepth;
    m.connect(a);
    a.connect(c.frequency);
    c.connect(f);
    f.connect(adsr);
    c.start();
    m.start();
    return { carrier: c, amp: a, modulator: m, filter: f, adsr: adsr };
}
