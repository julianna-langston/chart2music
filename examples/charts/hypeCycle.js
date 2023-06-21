import { c2mChart } from "../../dist/index.mjs";

const data_0 = [{ x: 68, y: 34, label: "Computer Vision" }];
const data_2 = [
    { x: 14, y: 19, label: "Physics-Informed AI" },
    { x: 17, y: 29, label: "Data-Centric AI" },
    { label: "Decision Intelligence", x: 20, y: 41 },
    { label: "Composite AI", x: 20, y: 45 },
    { label: "AI TRiSM", x: 21, y: 49 },
    { label: "Generative AI", x: 26, y: 65 },
    { label: "Synthetic Data", x: 32, y: 71 },
    { label: "Edge AI", x: 36, y: 71 },
    { label: "Digital Ethics", x: 41, y: 45 },
    { label: "AI Maker and Teaching Kits", x: 42, y: 37 },
    { label: "AI Cloud Services", x: 43, y: 29 },
    { label: "Deep Learning", x: 47, y: 19 },
    { label: "Intelligent Applications", x: 57, y: 21 },
    { label: "Data Labeling and Annotation", x: 61, y: 24 }
];
const data_5 = [
    { label: "Causal AI", x: 16, y: 25 },
    { label: "AI Engineering", x: 19, y: 36 },
    { label: "Operational AI Systems", x: 23, y: 57 },
    { label: "Computing ModelOps", x: 24, y: 60 },
    { label: "Neuromorphic", x: 25, y: 63 },
    { label: "Responsible AI", x: 27, y: 66 },
    { label: "Foundation Models", x: 29, y: 69 },
    { label: "Smart Robots", x: 30, y: 70 },
    { label: "Knowledge Graphs", x: 37, y: 68 },
    { label: "Natural Language Procesing", x: 40, y: 49 }
];
const data_10 = [
    { x: 13, y: 15, label: "Aritificial General Intelligence" },
    { x: 54, y: 19, label: "Autonomous Vehicles" }
];

const groups = [
    "Less than 2 years",
    "2 to 5 years",
    "5 to 10 years",
    "More than 10 years"
];

export const hypeCycle = (canvas, cc) => {
    const config = {
        type: "scatter",
        data: {
            datasets: [
                {
                    label: groups[0],
                    backgroundColor: "white",
                    data: data_0
                },
                {
                    label: groups[1],
                    backgroundColor: "rgb(0, 183, 233)",
                    data: data_2
                },
                {
                    label: groups[2],
                    backgroundColor: "rgb(21, 45, 86)",
                    data: data_5
                },
                {
                    label: groups[3],
                    pointStyle: "triangle",
                    backgroundColor: "orange",
                    data: data_10
                }
            ]
        },
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Hype Cycle for Artificial Intelligence, 2022"
                }
            },
            scales: {
                x: {
                    title: {
                        text: "Time",
                        display: true
                    },
                    type: "linear",
                    min: 0,
                    max: 100
                },
                y: {
                    title: {
                        text: "Expectations",
                        display: true
                    },
                    min: 0,
                    max: 100
                }
            }
        }
    };

    const myChart = new Chart(canvas, config);

    const { err } = c2mChart({
        type: "scatter",
        title: "Hype Cycle for Artificial Intelligence, 2022",
        element: canvas,
        cc,
        axes: {
            x: {
                label: "Time",
                minimum: 0,
                maximum: 100,
                format: (x) => `${x}%`
            },
            y: {
                label: "Expectations",
                minimum: 0,
                maximum: 100,
                format: (x) => `${x}%`
            }
        },
        data: {
            "Less than 2 years": data_0.map((obj, x) => {
                return {
                    ...obj,
                    custom: {
                        datasetIndex: 0,
                        index: x
                    }
                };
            }),
            "2 to 5 years": data_2.map((obj, x) => {
                return {
                    ...obj,
                    custom: {
                        datasetIndex: 1,
                        index: x
                    }
                };
            }),
            "5 to 10 years": data_5.map((obj, x) => {
                return {
                    ...obj,
                    custom: {
                        datasetIndex: 2,
                        index: x
                    }
                };
            }),
            "More than 10 years": data_10.map((obj, x) => {
                return {
                    ...obj,
                    custom: {
                        datasetIndex: 3,
                        index: x
                    }
                };
            })
        },
        options: {
            onFocusCallback: ({ point }) => {
                let toHighlight = [point.custom];
                myChart.setActiveElements(toHighlight);
                myChart.tooltip.setActiveElements(toHighlight);
                myChart.update();
            },
            stack: true
        },
        info: {
            notes: [
                "Groups represent estimated time to productivity plateau",
                "As of July 2022",
                "Source: Gartner",
                "Copyright 2022 Gartner, Inc. and/or its affiliates. All rights reserved. Gartner and Hype Cycle are registered trademarks of Gartner, Inc. and its affiliates in the U.S. 1957302",
                "Source:",
                "https://www.gartner.com/en/articles/what-s-new-in-artificial-intelligence-from-the-2022-gartner-hype-cycle"
            ],
            annotations: [
                {
                    x: 14,
                    label: "Innovation Trigger"
                },
                {
                    x: 26,
                    label: "Peak of Inflated Expectations"
                },
                {
                    x: 39,
                    label: "Trough of Disillusionment"
                },
                {
                    x: 57,
                    label: "Slope of Enlightenment"
                },
                {
                    x: 79,
                    label: "Plateau of Productivity"
                }
            ]
        }
    });
    if (err) {
        console.error(err);
    }
};
