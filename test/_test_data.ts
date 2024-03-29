const fillWithNaN = (seed: number[], maxNum: number) => {
    const arr = seed.slice(0);
    while (arr.length < maxNum) {
        arr.push(NaN);
    }
    return arr;
};

const z = [
    [
        7.2, 7.0, 7.7, 7.8, 7.6, 6.7, 7.5, 7.0, 7.4, 8.0, 8.2, 8.1, 7.1, 8.8,
        7.4, 7.6, 7.2, 7.9, 7.9, 7.4, 7.1, 8.7, 8.0, 7.8, 8.3, 8.1, 5.7, 9.2,
        7.5
    ],
    [
        8.6,
        7.1,
        7.6,
        9.0,
        6.4,
        8.6,
        6.2,
        7.3,
        7.3,
        8.5,
        6.8,
        7.3,
        7.2,
        7.2,
        8.8,
        6.9,
        7.7,
        7.5,
        6.8,
        7.4,
        7.5,
        7.5,
        6.1,
        8.0,
        7.0,
        7.5,
        NaN,
        NaN,
        NaN
    ],
    [
        5.6,
        8.4,
        6.7,
        5.2,
        6.9,
        7.2,
        7.7,
        7.1,
        8.0,
        6.5,
        7.3,
        6.5,
        7.0,
        6.9,
        7.1,
        6.5,
        6.5,
        6.2,
        7.3,
        5.4,
        7.0,
        6.6,
        8.1,
        6.8,
        NaN,
        NaN,
        NaN,
        NaN,
        NaN
    ],
    [
        6.6, 8.0, 6.7, 6.4, 7.0, 6.7, 6.1, 5.9, 6.2, 6.3, 6.6, 6.9, 6.3, 7.0,
        6.7, 6.1
    ],
    [6.5, 6.0, 6.3, 6.8, 6.4, 7.0],
    [
        6.9, 6.5, 5.1, 6.3, 7.5, 6.3, 6.0, 6.8, 6.9, 6.2, 7.3, 7.6, 5.7, 7.5,
        6.1, 6.4, 6.8, 7.1, 7.2, 7.1, 6.9, 6.8, 6.5, 8.1, 7.4
    ],
    [
        5.8, 7.0, 8.1, 6.2, 6.5, 6.9, 6.5, 8.0, 9.1, 6.2, 7.6, 6.6, 7.5, 6.2,
        6.8, 8.9, 6.5, 6.2, 6.1, 7.5, 7.7, 3.3
    ],
    [
        6.5, 7.4, 7.6, 8.0, 6.7, 7.4, 7.8, 6.3, 6.5, 8.4, 7.5, 6.8, 8.5, 6.7,
        9.2, 8.5, 8.2, 7.4, 7.2, 7.2, 7.7, 7.6, 8.1, 6.5, 6.9, 9.3
    ],
    [
        9.2, 8.3, 7.7, 6.5, 7.8, 6.7, 8.3, 7.8, 6.8, 6.0, 8.1, 8.1, 7.2, 8.2,
        8.1, 7.0, 7.1, 6.7, 8.0, 7.2, 8.4, 7.3, 6.4, 7.7, 7.1, 8.4
    ],
    [
        8.4, 8.7, 7.8, 7.2, 7.9, 7.4, 8.2, 8.3, 7.2, 6.5, 6.6, 6.2, 6.7, 8.2,
        7.3, 7.2, 6.7, 8.9, 7.8, 6.1, 7.3, 6.0, 8.8, 8.3, 9.4, 8.4
    ],
    [
        8.2, 7.2, 5.7, 8.5, 7.5, 7.4, 7.2, 7.4, 7.4, 8.3, 8.8, 8.5, 6.0, 8.0,
        8.8, 7.5, 7.3, 7.9, 7.5, 8.0, 8.1, 7.0, 7.1, 7.5, 8.5, 8.1
    ],
    [
        7.7,
        6.6,
        6.2,
        7.8,
        7.5,
        6.4,
        7.5,
        6.3,
        7.5,
        8.8,
        8.5,
        7.0,
        4.8,
        8.7,
        7.8,
        5.8,
        6.6,
        7.0,
        6.3,
        6.7,
        6.5,
        6.5,
        7.9,
        9.0,
        NaN
    ],
    [
        7.5, 7.1, 6.8, 7.6, 6.7, 7.1, 6.3, 5.8, 7.0, 7.0, 6.6, 6.0, 6.8, 6.4,
        6.9, 7.0, 9.0, 7.7
    ],
    [
        7.6, 7.6, 7.8, 6.8, 7.5, 6.4, 7.4, 8.1, 6.2, 6.5, 6.5, 6.7, 7.4, 8.1,
        6.6, 7.3, 6.4, 7.2, 7.8, 7.8, 7.8, 8.2, 7.9, 7.0, 7.5, 8.4
    ],
    [
        8.3, 8.2, 8.0, 6.7, 7.9, 6.9, 7.9, 5.6, 7.9, 6.2, 7.8, 7.9, 6.6, 7.3,
        7.4, 6.7, 7.8, 6.4, 7.4, 8.5, 8.8, 7.2, 7.1, 6.9, 7.1, 8.2
    ],
    [
        9.0, 9.1, 7.6, 7.7, 7.0, 7.6, 8.4, 7.0, 7.9, 8.2, 8.3, 7.1, 7.7, 7.2,
        7.4, 7.1, 7.3, 8.2, 7.1, 5.6, 7.7, 8.0, 7.6, 7.4, 8.2
    ],
    [
        8.2, 7.9, 7.6, 7.5, 7.3, 9.3, 5.5, 7.4, 7.4, 7.1, 6.9, 7.8, 7.8, 8.7,
        8.8, 7.7, 6.6, 7.2, 7.1, 6.7, 7.6, 8.0, 7.5, 7.7, 7.7, 9.0
    ],
    [
        8.5, 8.5, 7.0, 7.8, 8.5, 9.0, 7.3, 5.7, 7.5, 8.1, 7.8, 7.6, 8.9, 7.6,
        7.3, 7.1, 6.7, 8.2, 9.4, 7.4, 7.0, 6.9, 5.8, 6.2, 7.4, 8.2
    ],
    [
        7.5, 7.9, 7.2, 7.4, 6.9, 8.2, 7.6, 8.6, 6.6, 8.2, 6.3, 6.3, 6.6, 7.2,
        7.6, 8.2, 7.4, 7.5, 7.8, 8.3, 8.1, 8.7, 7.6, 8.2, 8.9
    ],
    [7.4, 7.1, 7.1, 7.1, 6.4, 8.2, 6.6, 6.7, 7.3, 7.6, 6.7, 6.6, 7.2, 7.2, 7.0],
    [
        7.3, 6.5, 7.9, 5.9, 6.7, 6.9, 6.4, 6.8, 6.1, 7.0, 7.1, 7.0, 7.5, 7.2,
        5.2, 7.8, 7.5, 8.3, 7.5, 7.6, 8.2, 6.7, 7.1, 7.7, 7.2, 7.7
    ],
    [
        7.8, 7.7, 6.6, 7.1, 6.5, 6.9, 5.8, 8.2, 8.1, 6.6, 7.1, 7.1, 6.7, 6.7,
        7.0, 7.1, 7.8, 6.2, 6.7, 6.0, 7.6, 7.3, 8.5, 7.4, 8.0, 8.9
    ],
    [
        8.9, 7.9, 7.3, 6.8, 7.3, 7.5, 8.0, 8.7, 8.6, 6.7, 6.7, 6.8, 7.5, 8.7,
        7.6, 8.0, 6.6, 7.6, 7.5, 6.5, 7.4, 6.2, 8.7, 7.1, 8.1, 8.0
    ],
    [
        7.7, 8.6, 6.7, 7.8, 6.2, 8.7, 7.6, 7.1, 7.1, 7.9, 8.3, 7.3, 7.2, 7.7,
        8.5, 6.6, 7.5, 5.0, 7.6, 6.7, 8.1, 6.4, 5.8, 7.1, 8.3
    ],
    [
        8.2, 7.6, 6.1, 8.5, 6.3, 7.4, 7.6, 7.7, 7.4, 8.4, 6.1, 9.0, 7.1, 6.9,
        7.1, 7.3, 6.1, 6.9, 7.5, 7.1, 7.1, 6.7, 6.2, 8.1, 7.1, 7.9
    ],
    [
        7.9, 7.7, 7.0, 6.6, 7.7, 7.3, 7.9, 6.5, 7.6, 8.2, 7.0, 7.2, 7.2, 7.2,
        7.9, 7.6, 7.7, 7.2, 7.3, 7.9, 7.1, 7.1, 7.7, 7.4, 8.5
    ],
    [
        7.7, 7.0, 7.0, 7.2, 6.5, 8.0, 7.1, 7.1, 6.4, 7.6, 7.5, 8.0, 7.1, 7.7,
        7.3, 7.0, 6.5, 7.5, 7.0, 7.3, 6.7, 8.0, 6.9, 6.6, 8.4
    ],
    [
        8.2, 8.5, 7.4, 8.0, 6.6, 6.6, 6.8, 6.9, 7.4, 6.9, 6.5, 7.4, 7.3, 7.4,
        7.9, 8.1, 6.8, 6.9, 7.6, 6.5, 7.0, 7.7, 8.5, 7.5, 6.9, 8.3
    ],
    [
        7.8, 7.8, 6.0, 7.0, 7.4, 6.8, 7.5, 8.6, 6.9, 8.4, 7.4, 6.7, 8.4, 8.1,
        7.4, 7.4, 6.6, 8.5, 8.1, 7.9, 7.9, 8.4, 8.5, 8.5
    ],
    [
        7.3, 7.3, 7.8, 7.8, 7.8, 7.9, 8.3, 8.1, 8.4, 6.2, 7.8, 8.4, 8.5, 8.3,
        7.9, 8.0, 6.8, 8.3, 7.6, 8.2, 5.3
    ],
    [7.2, 7.4, 7.6, 7.1, 7.3, 7.3, 7.5, 6.8, 7.9, 7.8, 7.8, 8.1, 8.1, 7.4, 7.0],
    [7.4, 7.8, 6.8, 7.2, 6.6, 7.6, 7.2, 8.2, 7.9, 7.2, 7.2, 7.5, 7.3, 8.2],
    [7.2, 7.2, 7.2, 6.4, 7.3, 6.5, 6.4, 5.8, 6.4, 6.2, 6.7, 6.4],
    [5.8, 5.4, 5.4, 5.0, 5.9, 5.4, 5.7, 5.5, 5.7, 5.8, 5.3, 6.5, 5.7],
    [6.7, 7.8, 7.2, 7.6],
    [7.6, 7.0, 7.2, 6.5, 5.6, 6.9],
    [8.2, 7.3, 7.4, 7.2, 6.9, 7.8, 8.3, 7.8, 7.3, 7.6],
    [8.0, 8.0, 7.1, 6.4, 6.6, 6.2, 5.4, 6.2, 5.6, 6.9],
    [6.8, 7.0, 7.2, 7.3, 7.5, 7.2, 7.5, 7.6, 8.1, 8.7],
    [7.1, 7.6, 7.6, 7.4, 7.7, 7.4, 7.8, 8.4, 8.7, 8.7],
    [7.7, 7.8, 7.4, 7.7, 8.2, 8.7, 6.9, 8.1, 8.0, 8.7],
    [7.4, 7.5, 7.2, 7.4, 7.6, 8.4, 7.5, 8.2, 8.1, 8.4, 8.6],
    [8.2, 8.1, 7.8, 8.4, 8.1, 7.8, 7.3, 6.1, 8.3, 9.1],
    [7.4, 7.7, 7.7, 8.2, 7.8, 8.0, 8.2, 7.3, 7.8, 8.0, 7.9, 8.4],
    [7.1, 6.6, 8.1, 8.2, 7.3, 8.1, 7.5, 9.1, 9.1, 7.8, 8.8, 8.2, 8.2, 8.5],
    [7.5, 7.3, 7.9, 8.3, 7.9, 8.8, 8.5, 8.2, 9.2, 8.1]
];
const data = [
    {
        z,
        x: z[0].map((val, index) => `Ep ${index + 1}`),
        y: [
            "TOS 1",
            "TOS 2",
            "TOS 3",
            "TAS 1",
            "TAS 2",
            "TNG 1",
            "TNG 2",
            "TNG 3",
            "TNG 4",
            "TNG 5",
            "TNG 6",
            "TNG 7",
            "DS9 1",
            "DS9 2",
            "DS9 3",
            "DS9 4",
            "DS9 5",
            "DS9 6",
            "DS9 7",
            "Voyager 1",
            "Voyager 2",
            "Voyager 3",
            "Voyager 4",
            "Voyager 5",
            "Voyager 6",
            "Voyager 7",
            "Enterprise 1",
            "Enterprise 2",
            "Enterprise 3",
            "Enterprise 4",
            "Discovery 1",
            "Discovery 2",
            "Discovery 3",
            "Discovery 4",
            "Short Treks 1",
            "Short Treks 2",
            "Picard 1",
            "Picard 2",
            "Lower Decks 1",
            "Lower Decks 2",
            "Lower Decks 3",
            "Prodigy",
            "Strange New Worlds",
            "Orville 1",
            "Orville 2",
            "Orville 3"
        ],
        type: "heatmap",
        hoverongaps: false,
        hoverinfo: "x+y+z"
    }
];

export const StarTrekEpisodeRatings = Object.fromEntries(
    data[0].y.map((label, index) => [label, fillWithNaN(z[index], 29)])
);
export const StartTrekEpisodeRatingsX = data[0].x;
