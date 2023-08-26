import type { AudioEngine } from "./AudioEngine";
import { AudioNotificationType } from "./AudioEngine";

// A few constants that will be helpful later.
const C3 = 130.8128;
// const E3 = 164.8138;
const G3 = 195.9977;
const C4 = C3 * 2;
// const E4 = E3 * 2;
const G4 = G3 * 2;
const G5 = G4 * 2;

/**
 * An audio engine which uses oscillators to create sound.
 */
export class OscillatorAudioEngine implements AudioEngine {
    private readonly _audioContext: AudioContext;
    private readonly _masterCompressor: DynamicsCompressorNode;
    private readonly _masterGain: GainNode;

    /**
     * Create a new OscillatorAudioEngine.
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
     * @param frequency - the fundimental frequency
     * @param panning - where to play the sound (-1 <= 0 <= 1, 0 == center)
     * @param duration - the duration of the note in seconds, defaults to 0.2
     */
    playDataPoint(frequency: number, panning: number, duration = 0.2) {
        // The sound of the data point routes directly to the master compressor.
        this._playDataPoint(
            frequency,
            panning,
            duration,
            this._masterCompressor
        );
    }

    /**
     * Play an audio notification.
     * @param notificationType - the type of audio notification
     * @param [panning] - where to play the sound (-1 <= 0 <= 1, 0 == center). Default: 0
     * @param [duration] - the duration of the notification in seconds. Default: 0.15
     */
    playNotification?(
        notificationType: AudioNotificationType,
        panning = 0,
        duration = 0.15
    ) {
        if (notificationType === AudioNotificationType.Annotation) {
            this._playAnnotation(panning, duration);
        } else {
            // Do nothing.
        }
    }

    /**
     * Play a data point, sending the audio to the given destination node.
     * @param frequency - the fundimental frequency
     * @param panning - where to play the sound (-1 <= 0 <= 1, 0 == center)
     * @param duration - the duration of the note in seconds
     * @param destinationNode - the node to receive the audio
     */
    private _playDataPoint(
        frequency: number,
        panning: number,
        duration: number,
        destinationNode: AudioNode
    ) {
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
        panner.connect(destinationNode);
        setTimeout(
            () => {
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
            },
            duration * 1000 * 2
        );
    }

    /**
     * Play a sound that means that an annotation is present.
     * @param panning - where to play the sound (-1 <= 0 <= 1, 0 == center)
     * @param duration - the duration of the note in seconds
     */
    private _playAnnotation(panning: number, duration: number) {
        // Create panner node.
        const panner = this._audioContext.createStereoPanner();
        panner.pan.value = panning;
        // Create gain node
        const gain = this._audioContext.createGain();
        gain.gain.value = 0.5;
        // Connect things up
        gain.connect(panner);
        panner.connect(this._masterCompressor);
        // Play C3 and C4.
        this._playDataPoint(C3, 0, duration / 4, gain);
        this._playDataPoint(C4, 0, duration / 4, gain);
        // After the  C notes finish, play E3 and E4.
        setTimeout(
            () => {
                this._playDataPoint(G3, 0, duration / 4, gain);
                this._playDataPoint(G4, 0, duration / 4, gain);
                this._playDataPoint(G5, 0, duration / 4, gain);
            },
            duration * 1000 * 0.25
        );
        // After those notes finish, play e3 and e4.
        setTimeout(
            () => {
                this._playDataPoint(C3, 0, duration / 4, gain);
                this._playDataPoint(C4, 0, duration / 4, gain);
            },
            duration * 1000 * 0.5
        );
        // After those notes finish, play C6.
        setTimeout(
            () => {
                this._playDataPoint(G3, 0, duration / 4, gain);
                this._playDataPoint(G4, 0, duration / 4, gain);
                this._playDataPoint(G5, 0, duration / 4, gain);
            },
            duration * 1000 * 0.75
        );
        // After everything stops, clean up the nodes.
        setTimeout(
            () => {
                gain.disconnect();
            },
            duration * 1000 * 2
        );
    }
}

/**
 * Create a FM synth operator.
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
