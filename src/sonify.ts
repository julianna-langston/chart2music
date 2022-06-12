import { interpolateBin, calcPan, generateSummary } from "./utils.js";
import { HERTZ, SPEEDS } from "./constants.js";
import { SonifyTypes, AxisData, dataPoint } from "./types";
import {ScreenReaderBridge} from "./ScreenReaderBridge.js";

let context = null;

const NOTE_LENGTH = .25;


// {label: [{}, {}]}

export class Sonify {
    private _chartElement: HTMLElement;
    private _ccElement: HTMLElement;
    private _summary: string;
    private _groups: string[];
    private _data: dataPoint[][];
    private _groupIndex = 0;
    private _pointIndex = 0;
    private _sr: ScreenReaderBridge;
    private _xAxis: AxisData;
    private _yAxis: AxisData;
    private _title: string;
    private _playListInterval: number | null = null;
    private _speedRateIndex = 1;
    private _flagNewGroup = false;

    constructor(input: SonifyTypes) {
        this._chartElement = input.element;
        this._ccElement = input.cc ?? this._chartElement;
        this._title = input.title ?? "";
        this._xAxis = input.axes.x;
        this._yAxis = input.axes.y;

        this._groups = Object.keys(input.data);
        this._data = Object.values(input.data);

        // Generate summary
        this._summary = generateSummary(this._title, this._xAxis, this._yAxis);

        // Initialize SRB
        ScreenReaderBridge.addAriaAttributes(this._ccElement);
        this._sr = new ScreenReaderBridge(this._ccElement);

        this._startListening();
    }

    private _startListening(){
        this._chartElement.addEventListener("focus", () => {
            if(context === null){
                context = new AudioContext();
            }
            this._flagNewGroup = true;
            this._playCurrent();
            this._sr.render(this._summary);
        });

        this._chartElement.addEventListener("keydown", (e) => {
            clearInterval(this._playListInterval);

            switch(e.key){
                case "ArrowRight": {
                    if(e.shiftKey){
                        this._playAllRight();
                        e.preventDefault();
                        return;
                    }else{
                        this._moveRight();
                    }
                    break;
                }
                case "ArrowLeft": {
                    if(e.shiftKey){
                        this._playAllLeft();
                        e.preventDefault();
                        return;
                    }else{
                        this._moveLeft();
                    }
                    break;
                }
                case "PageUp": {
                    if(this._groupIndex === 0){
                        e.preventDefault();
                        return;
                    }
                    this._groupIndex--;
                    this._flagNewGroup = true;
                    break;
                }
                case "PageDown": {
                    if(this._groupIndex === this._data.length - 1){
                        e.preventDefault();
                        return;
                    }
                    this._groupIndex++;
                    this._flagNewGroup = true;
                    break;
                }
                case "Home": {
                    this._pointIndex = 0;
                    break;
                }
                case "End": {
                    this._pointIndex = this._data[this._groupIndex].length - 1;
                    break;
                }
                case " ": {
                    break;
                }
                case "q": {
                    if(this._speedRateIndex > 0){
                        this._speedRateIndex--;
                    }
                    this._sr.render(`Speed, ${SPEEDS[this._speedRateIndex]}`);
                    return;
                }
                case "e": {
                    if(this._speedRateIndex < SPEEDS.length - 1){
                        this._speedRateIndex++;
                    }
                    this._sr.render(`Speed, ${SPEEDS[this._speedRateIndex]}`);
                    return;
                }
                default: {
                    return;
                }
            }
            e.preventDefault();


            this._playCurrent();
            setTimeout(() => {
                this._speakCurrent();
            }, (NOTE_LENGTH * 1000));
        });
    }

    private _moveRight() {
        const max = this._data[this._groupIndex].length - 1;
        if(this._pointIndex >= max){
            this._pointIndex = max;
            return;
        }
        this._pointIndex++;
    }

    private _moveLeft() {
        if(this._pointIndex <= 0){
            this._pointIndex = 0;
            return;
        }
        this._pointIndex--;
    }
    
    private _playAllLeft() {
        const min = 0;
        this._playListInterval= setInterval(() => {
            if(this._pointIndex <= min){
                this._pointIndex = min;
                clearInterval(this._playListInterval);
            }else{
                this._pointIndex--;
                this._playCurrent();
            }
        }, SPEEDS[this._speedRateIndex]);
        this._playCurrent();
    }
    
    private _playAllRight() {
        const max = this._data[this._groupIndex].length - 1;
        this._playListInterval= setInterval(() => {
            if(this._pointIndex >= max){
                this._pointIndex = max;
                clearInterval(this._playListInterval);
            }else{
                this._pointIndex++;
                this._playCurrent();
            }
        }, SPEEDS[this._speedRateIndex]);
        this._playCurrent();
    }

    private _playCurrent() {
        const current = this._data[this._groupIndex][this._pointIndex];

        const yBin = interpolateBin(current.y, this._yAxis.minimum, this._yAxis.maximum, HERTZ.length-1);
        const xPan = calcPan( (current.x - this._xAxis.minimum) / (this._xAxis.maximum - this._xAxis.minimum) );
        
        pianist(yBin, xPan);

        current.callback?.();
    }

    private _speakCurrent() {
        const current = this._data[this._groupIndex][this._pointIndex];
        const point = `${this._xAxis.format(current.x)}, ${this._yAxis.format(current.y)}`;
        const text = (this._flagNewGroup ? `${this._groups[this._groupIndex]}, ` : "") + point;

        this._sr.render(text);

        this._flagNewGroup = false;
    }

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
    gain.gain.setValueAtTime(0.01, context.currentTime + NOTE_LENGTH);
    osc.stop(context.currentTime + NOTE_LENGTH + .1);
}
