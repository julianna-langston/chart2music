import { array_maximum, array_minimum, interpolateBin, calcPan } from "./utils.js";
import { HERTZ } from "./constants.js";
import { SonifyTypes, AxesRange } from "./types";
import {ScreenReaderBridge} from "./ScreenReaderBridge.js";

let context = null;
let sr = null;

export const Sonify = (input: SonifyTypes) => {
    const targetElement = input.element;
    const {data} = input;

    // Establish SRB
    const srElem = input.cc ?? targetElement;
    ScreenReaderBridge.addAriaAttributes(srElem);
    sr = new ScreenReaderBridge(srElem);

    // Prep for Play All
    let playListInterval = null;
    let playRate = 250;

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
        sr.render("Sonifiable");
    });
    targetElement.addEventListener("keydown", (e) => {
        // Change index
        switch(e.key){
            case "ArrowRight": {
                if(e.shiftKey){
                    playListInterval = setInterval(() => {
                        focusIndex++;
                        if(focusIndex <= data.length - 1){
                            playData(data[focusIndex], {x_min, x_max, y_min, y_max});
                        }else{
                            clearInterval(playListInterval);
                            focusIndex = data.length -1;
                        }
                    }, playRate);
                }
                focusIndex++;
                break;
            }
            case "ArrowLeft": {
                if(e.shiftKey){
                    playListInterval = setInterval(() => {
                        focusIndex--;
                        if(focusIndex >= 0){
                            playData(data[focusIndex], {x_min, x_max, y_min, y_max});
                        }else{
                            clearInterval(playListInterval);
                            focusIndex = 0;
                        }
                    }, playRate);
                }
                focusIndex--;
                break;
            }
            case "Control": {
                clearInterval(playListInterval);
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
        sr.render(`${data[focusIndex].x}, ${data[focusIndex].y}`);
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
