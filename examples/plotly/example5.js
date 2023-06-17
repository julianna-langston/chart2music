import { c2mHierarchy } from "../../dist/index.mjs";

export const example5 = (canvas, cc) => {
    const hierarchy = [
        {
            label: "North America",
            value: 95.53+12.5+2.3+0.925,
            children: [
                {
                    label: "San Francisco",
                    value: 95.53,
                    children: [
                        {
                            label: "DataBricks",
                            value: 38
                        },
                        {
                            label: "OpenAI",
                            value: 29
                        },
                        {
                            label: "Pony.ai",
                            value: 8.5
                        },
                        {
                            label: "Scale AI",
                            value: 7.3,
                        },
                        {
                            label: "Dialpad",
                            value: 2.2,
                        },
                        {
                            label: "Moveworks",
                            value: 2.1,
                        },
                        {
                            label: "Cresta",
                            value: 1.6,
                        },
                        {
                            label: "Salt Security",
                            value: 1.4,
                        },
                        {
                            label: "Vectra Ai",
                            value: 1.2,
                        },
                        {
                            label: "Viz.ai",
                            value: 1.2,
                        },
                        {
                            label: "People.ai",
                            value: 1.1,
                        },
                        {
                            label: "Standard AI",
                            value: 1,
                        },
                        {
                            label: "LabelBox",
                            value: 0.9,
                        },
                        {
                            label: "Tempo",
                            value: 0.75,
                        },
                        {
                            label: "SoundHound",
                            value: 0.605,
                        },
                        {
                            label: "Nerualink",
                            value: 0.5,
                        },
                        {
                            label: "AEye",
                            value: 0.487,
                        },
                    ]
                },
                {
                    label: "New York City",
                    value: 12.5,
                    children: [
                        {
                            label: "UiPath",
                            value: 6
                        },
                        {
                            label: "S0cure",
                            value: 4.5,
                        },
                        {
                            label: "SiSense",
                            value: 1,
                        },
                        {
                            label: "Vise",
                            value: 1,
                        },
                    ]
                },
                {
                    label: "San Diego",
                    value: 2.3,
                    children: [
                        {
                            label: "Shield AI",
                            value: 2.3,
                        },
                    ]
                },
                {
                    label: "Toronto",
                    value: 1.9,
                    children: [
                        
                        {
                            label: "Ada",
                            value: 1.2,
                        },
                        {
                            label: "Deep Genomics",
                            value: 0.72,
                        },
                    ]
                },
                {
                    label: "Atlanta",
                    value: 0.925,
                    children: [
                        {
                            label: "Pindrop Security",
                            value: 0.925,
                        },
                    ]
                }

            ]
        },
        {
            label: "Europe",
            value: 3.225,
            children: [
                {
                    label: "Bristol",
                    value: 2.7,
                    children: [
                        {
                            label: "Graphcore",
                            value: 2.7,
                        },
                    ]
                },
                {
                    label: "Tallinn",
                    value: 1.5,
                    children: [
                        {
                            label: "Veriff",
                            value: 1.5,
                        }
                    ]
                },
                {
                    label: "London",
                    value: 1.5,
                    children: [
                        {
                            label: "Synthesia",
                            value: 1,
                        },
                        {
                            label: "Tessian",
                            value: 0.5,
                        },
                    ]
                },
                {
                    label: "Paris",
                    value: 1,
                    children: [
                        {
                            label: "Shift Technology",
                            value: 1,
                        },
                    ]
                },
                {
                    label: "Cologne",
                    value: 0.925,
                    children: [
                        {
                            label: "DeepL",
                            value: 0.925,
                        }
                    ]
                },
            ]
        },
    ];

    // let labels = [];
    // let parents = [];
    // let values = [];

    // const extractHierarchies = (levelData, levelNumber = 1, parentLabel = "") => {
    //     labels = labels.concat(levelData.map(({label}) => label));
    //     parents = parents.concat(levelData.map(() => parentLabel));
    //     values = values.concat(levelData.map(({value}) => value))

    //     levelData.forEach((h) => {
    //         if("children" in h){
    //             extractHierarchies(h.children, levelNumber+1, h.label);
    //         }
    //     })
    // // }

    // extractHierarchies(hierarchy);

    // const extractHierarchies = (levelData, levelNumber = 1, parentLabel = "") => {
    //     const l = [levelData.map(({label}) => label)];
    //     const p = [Array(levelData.length).fill(parentLabel)];
    //     const v = [levelData.map(({value}) => value)];

    //     levelData.forEach((h) => {
    //         if(!("children" in h)){
        //         const e = extractHierarchies(h.children, levelNumber+1, h.label);
        //         l.push(e.labels);
        //         p.push(e.parents);
        //         v.push(e.values);
    //         }
    //     });

    //     return {
    //         labels: l.flat(),
    //         parents: p.flat(),
    //         values: v.flat()
    //     }
    // };

    // const {labels, parents, values} = extractHierarchies(hierarchy);

    const extractHierarchies = (levelData, levelNumber = 1, parentLabel = "") => {
        const starter = {
            labels: [],
            parents: [],
            values: []
        };

        return levelData.reduce((balance, {label, value, children}) => {
            let next = Object.assign({}, starter);
            if(children){
                next = extractHierarchies(children, levelNumber+1, label);
            }

            return {
                labels: balance.labels.concat([label, next.labels]).flat(),
                parents: balance.parents.concat([parentLabel, next.parents]).flat(),
                values: balance.values.concat([value, next.values]).flat()
            }
        }, starter);
    };

    const {
        labels,
        parents,
        values
    } = extractHierarchies(hierarchy);

    const data = [
        { 
            type: "treemap",
            labels,
            parents,
            values
        }
    ];

    Plotly.newPlot(canvas, data);

    const { err } = c2mHierarchy({
        type: "hierarchy",
        title: "AI Startups: Top 30 Valuations by Location",
        element: canvas,
        cc,
        axes: {
            x: {
                label: ["Continent", "City", "Company"],
            },
            y: {
                label: "Valuations",
                format: (y) => `$${y}b`
            }
        },
        hierarchy
    });
    if (err) {
        console.error(err);
    }
};