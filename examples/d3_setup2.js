/* Code to generate candlesticks in D3 from: https://codepen.io/jazon3008/pen/zgGjqN?editors=0010 */

import { c2mChart } from "../dist/index.mjs";

// set the dimensions and margins of the graph
var margin = { top: 80, right: 25, bottom: 30, left: 40 },
    width = 450 - margin.left - margin.right,
    height = 450 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
    .select("#examples")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const data = [
    { group: "A", variable: "v1", value: "30" },
    { group: "A", variable: "v2", value: "95" },
    { group: "A", variable: "v3", value: "22" },
    { group: "A", variable: "v4", value: "14" },
    { group: "A", variable: "v5", value: "59" },
    { group: "A", variable: "v6", value: "52" },
    { group: "A", variable: "v7", value: "88" },
    { group: "A", variable: "v8", value: "20" },
    { group: "A", variable: "v9", value: "99" },
    { group: "A", variable: "v10", value: "66" },
    { group: "B", variable: "v1", value: "37" },
    { group: "B", variable: "v2", value: "50" },
    { group: "B", variable: "v3", value: "81" },
    { group: "B", variable: "v4", value: "79" },
    { group: "B", variable: "v5", value: "84" },
    { group: "B", variable: "v6", value: "91" },
    { group: "B", variable: "v7", value: "82" },
    { group: "B", variable: "v8", value: "89" },
    { group: "B", variable: "v9", value: "6" },
    { group: "B", variable: "v10", value: "67" },
    { group: "C", variable: "v1", value: "96" },
    { group: "C", variable: "v2", value: "13" },
    { group: "C", variable: "v3", value: "98" },
    { group: "C", variable: "v4", value: "10" },
    { group: "C", variable: "v5", value: "86" },
    { group: "C", variable: "v6", value: "23" },
    { group: "C", variable: "v7", value: "74" },
    { group: "C", variable: "v8", value: "47" },
    { group: "C", variable: "v9", value: "73" },
    { group: "C", variable: "v10", value: "40" },
    { group: "D", variable: "v1", value: "75" },
    { group: "D", variable: "v2", value: "18" },
    { group: "D", variable: "v3", value: "92" },
    { group: "D", variable: "v4", value: "43" },
    { group: "D", variable: "v5", value: "16" },
    { group: "D", variable: "v6", value: "27" },
    { group: "D", variable: "v7", value: "76" },
    { group: "D", variable: "v8", value: "24" },
    { group: "D", variable: "v9", value: "1" },
    { group: "D", variable: "v10", value: "87" },
    { group: "E", variable: "v1", value: "44" },
    { group: "E", variable: "v2", value: "29" },
    { group: "E", variable: "v3", value: "58" },
    { group: "E", variable: "v4", value: "55" },
    { group: "E", variable: "v5", value: "65" },
    { group: "E", variable: "v6", value: "56" },
    { group: "E", variable: "v7", value: "9" },
    { group: "E", variable: "v8", value: "78" },
    { group: "E", variable: "v9", value: "49" },
    { group: "E", variable: "v10", value: "36" },
    { group: "F", variable: "v1", value: "35" },
    { group: "F", variable: "v2", value: "80" },
    { group: "F", variable: "v3", value: "8" },
    { group: "F", variable: "v4", value: "46" },
    { group: "F", variable: "v5", value: "48" },
    { group: "F", variable: "v6", value: "100" },
    { group: "F", variable: "v7", value: "17" },
    { group: "F", variable: "v8", value: "41" },
    { group: "F", variable: "v9", value: "33" },
    { group: "F", variable: "v10", value: "11" },
    { group: "G", variable: "v1", value: "77" },
    { group: "G", variable: "v2", value: "62" },
    { group: "G", variable: "v3", value: "94" },
    { group: "G", variable: "v4", value: "15" },
    { group: "G", variable: "v5", value: "69" },
    { group: "G", variable: "v6", value: "63" },
    { group: "G", variable: "v7", value: "61" },
    { group: "G", variable: "v8", value: "54" },
    { group: "G", variable: "v9", value: "38" },
    { group: "G", variable: "v10", value: "93" },
    { group: "H", variable: "v1", value: "39" },
    { group: "H", variable: "v2", value: "26" },
    { group: "H", variable: "v3", value: "90" },
    { group: "H", variable: "v4", value: "83" },
    { group: "H", variable: "v5", value: "31" },
    { group: "H", variable: "v6", value: "2" },
    { group: "H", variable: "v7", value: "51" },
    { group: "H", variable: "v8", value: "28" },
    { group: "H", variable: "v9", value: "42" },
    { group: "H", variable: "v10", value: "7" },
    { group: "I", variable: "v1", value: "5" },
    { group: "I", variable: "v2", value: "60" },
    { group: "I", variable: "v3", value: "21" },
    { group: "I", variable: "v4", value: "25" },
    { group: "I", variable: "v5", value: "3" },
    { group: "I", variable: "v6", value: "70" },
    { group: "I", variable: "v7", value: "34" },
    { group: "I", variable: "v8", value: "68" },
    { group: "I", variable: "v9", value: "57" },
    { group: "I", variable: "v10", value: "32" },
    { group: "J", variable: "v1", value: "19" },
    { group: "J", variable: "v2", value: "85" },
    { group: "J", variable: "v3", value: "53" },
    { group: "J", variable: "v4", value: "45" },
    { group: "J", variable: "v5", value: "71" },
    { group: "J", variable: "v6", value: "64" },
    { group: "J", variable: "v7", value: "4" },
    { group: "J", variable: "v8", value: "12" },
    { group: "J", variable: "v9", value: "97" },
    { group: "J", variable: "v10", value: "72" }
];

// Labels of row and columns -> unique identifier of the column called 'group' and 'variable'
var myGroups = d3
    .map(data, function (d) {
        return d.group;
    })
    .keys();
var myVars = d3
    .map(data, function (d) {
        return d.variable;
    })
    .keys();

// Build X scales and axis:
var x = d3.scaleBand().range([0, width]).domain(myGroups).padding(0.05);
svg.append("g")
    .style("font-size", 15)
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickSize(0))
    .select(".domain")
    .remove();

// Build Y scales and axis:
var y = d3.scaleBand().range([height, 0]).domain(myVars).padding(0.05);
svg.append("g")
    .style("font-size", 15)
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain")
    .remove();

// Build color scale
var myColor = d3
    .scaleSequential()
    .interpolator(d3.interpolateInferno)
    .domain([1, 100]);

// create a tooltip
var tooltip = d3
    .select("#my_dataviz")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px");

// Three function that change the tooltip when user hover / move / leave a cell
var mouseover = function (d) {
    tooltip.style("opacity", 1);
    d3.select(this).style("stroke", "black").style("opacity", 1);
};
var mousemove = function (d) {
    tooltip
        .html("The exact value of<br>this cell is: " + d.value)
        .style("left", d3.mouse(this)[0] + 70 + "px")
        .style("top", d3.mouse(this)[1] + "px");
};
var mouseleave = function (d) {
    tooltip.style("opacity", 0);
    d3.select(this).style("stroke", "none").style("opacity", 0.8);
};

// add the squares
svg.selectAll()
    .data(data, function (d) {
        return d.group + ":" + d.variable;
    })
    .enter()
    .append("rect")
    .attr("x", function (d) {
        return x(d.group);
    })
    .attr("y", function (d) {
        return y(d.variable);
    })
    .attr("rx", 4)
    .attr("ry", 4)
    .attr("data-x", (d) => d.group)
    .attr("data-y", (d) => d.variable)
    .attr("width", x.bandwidth())
    .attr("height", y.bandwidth())
    .style("fill", function (d) {
        return myColor(d.value);
    })
    .style("stroke-width", 4)
    .style("stroke", "none")
    .style("opacity", 0.8)
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

// Add title to graph
svg.append("text")
    .attr("x", 0)
    .attr("y", -50)
    .attr("text-anchor", "left")
    .style("font-size", "22px")
    .text("A d3.js heatmap");

// Add subtitle to graph
svg.append("text")
    .attr("x", 0)
    .attr("y", -20)
    .attr("text-anchor", "left")
    .style("font-size", "14px")
    .style("fill", "grey")
    .style("max-width", 400)
    .text("A short description of the take-away message of this chart.");

const onlyUnique = (value, index, self) => {
    return self.indexOf(value) === index;
};

let vars = data.map((cell) => cell.variable).filter(onlyUnique);
const { err, data: c2m } = c2mChart({
    type: "matrix",
    element: document.getElementById("examples"),
    cc: document.getElementById("cc"),
    axes: {
        x: {
            label: "Letter"
        },
        y: {
            label: "Version"
        }
    },
    data: Object.fromEntries(
        vars.map((myVar) => {
            const relevantCells = data.filter(
                (cell) => cell.variable === myVar
            );
            const result = relevantCells.map(({ value }, index) => {
                return {
                    x: index,
                    y: +value
                };
            });
            return [myVar, result];
        })
    ),
    options: {
        onFocusCallback: ({ index, slice }) => {
            console.log(index, slice);
            svg.selectAll("rect[data-x]").style("stroke", "none");
            svg.select("rect[data-x='F'][data-y='v2']").style(
                "stroke",
                "black"
            );
        }
    }
});
console.log(err, c2m);
