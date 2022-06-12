import { array_maximum, array_minimum, interpolateBin, calcPan } from "./utils.js";

const HERTZ = [
    16.35,
    17.32,
    18.35,
    19.45,
    20.6,
    21.83,
    23.12,
    24.5,
    25.96,
    27.5,
    29.14,
    30.87,
    32.7,
    34.65,
    36.71,
    38.89,
    41.2,
    43.65,
    46.25,
    49,
    51.91,
    55,
    58.27,
    61.74,
    65.41,
    69.3,
    73.42,
    77.78,
    82.41,
    87.31,
    92.5,
    98,
    103.83,
    110,
    116.54,
    123.47,
    130.81,
    138.59,
    146.83,
    155.56,
    164.81,
    174.61,
    185,
    196,
    207.65,
    220,
    233.08,
    246.94,
    261.63,
    277.18,
    293.66,
    311.13,
    329.63,
    349.23,
    369.99,
    392,
    415.3,
    440,
    466.16,
    493.88,
    523.25,
    554.37,
    587.33,
    622.25,
    659.25,
    698.46,
    739.99,
    783.99,
    830.61,
    880,
    932.33,
    987.77,
    1046.5,
    1108.73,
    1174.66,
    1244.51,
    1318.51,
    1396.91,
    1479.98,
    1567.98,
    1661.22,
    1760,
    1864.66,
    1975.53,
    2093,
    2217.46,
    2349.32,
    2489.02,
    2637.02,
    2793.83,
    2959.96,
    3135.96,
    3322.44,
    3520,
    3729.31,
    3951.07,
    4186.01,
    4434.92,
    4698.63,
    4978.03,
    5274.04,
    5587.65,
    5919.91,
    6271.93,
    6644.88,
    7040,
    7458.62,
    7902.13,
];
let context = null;

enum supportedChartTypes {
    LINE
}

type dataPoint = {
    x: number;
    y: number;
    callback?: () => void;
}

type SonifyTypes = {
    data: dataPoint[];
    element: HTMLElement;
    axes?: any;
    title?: string;
    cc?: HTMLElement;
    type?: supportedChartTypes;
}
type AxesRange = {
    x_min: number;
    x_max: number;
    y_min: number;
    y_max: number;
}

export const Sonify = (input: SonifyTypes) => {
    const targetElement = input.element;
    const {data} = input;

    let focusIndex = 0;

    const x_min = array_minimum(data.map((obj) => obj.x));
    const y_min = array_minimum(data.map((obj) => obj.y));
    const x_max = array_maximum(data.map((obj) => obj.x));
    const y_max = array_maximum(data.map((obj) => obj.y));

    // Wire up interactions
    targetElement.addEventListener("focus", () => {
        if(context === null){
            context = new AudioContext();
        }
        playData(data[focusIndex], {x_min, x_max, y_min, y_max});
    });
    targetElement.addEventListener("keydown", (e) => {
        // Change index
        switch(e.key){
            case "ArrowRight": {
                focusIndex++;
                break;
            }
            case "ArrowLeft": {
                focusIndex--;
                break;
            }
            case "Home": {
                focusIndex = 0;
                break;
            }
            case "End": {
                focusIndex = data.length - 1;
                break;
            }
            case " ": {
                break;
            }
            default: {
                return;
            }
        }

        // Restrict for bounds
        if(focusIndex < 0) {
            focusIndex = 0;
        }else if(focusIndex >= data.length){
            focusIndex = data.length - 1;
        }

        playData(data[focusIndex], {x_min, x_max, y_min, y_max});
    });
};



const playData = ({x, y, callback = () => {}}, range: AxesRange) => {
    const noteToPlay = interpolateBin(y, range.y_min, range.y_max, HERTZ.length-1);
    const panning = calcPan((x-range.x_min)/(range.x_max-range.x_min));
    pianist(noteToPlay, panning);
    callback();
}

const pianist = (noteIndex: number, positionX: number) => {
    // Pan note
    const panner = new PannerNode(context, {positionX});
    panner.connect(context.destination);

    // Gain (so that you don't hear clipping)
    const gain = new GainNode(context);
    gain.gain.setValueAtTime(1, context.currentTime);
    gain.connect(panner);

    // Oscillator
    const osc = new OscillatorNode(context);
    osc.frequency.setValueAtTime(HERTZ[noteIndex], context.currentTime);
    osc.connect(gain);

    osc.start();
    gain.gain.setValueAtTime(0.01, context.currentTime + .250);
    osc.stop(context.currentTime + .260);
}
