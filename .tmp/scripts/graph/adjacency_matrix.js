"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Adjacency_matrix = function () {
    function Adjacency_matrix(data) {
        _classCallCheck(this, Adjacency_matrix);

        this.nestedPaths = data.nestedPaths;
        this.sortedStartTypes = data.sortedStartTypes;
        this.sortedEndTypes = data.sortedEndTypes;
        this.maxCount = data.maxCount;
        this.table = d3.select("#adjacency_matrix_table");
    }

    _createClass(Adjacency_matrix, [{
        key: "draw",
        value: function draw() {
            var self = this;
            self.table.node().innerHTML = "";
            var colorScale = d3.scaleLinear().domain([0, self.maxCount]).range(["#e6ffff", "#00e6e6"]);
            var columnHeaderRow = document.createElement("tr");
            [""].concat(self.sortedEndTypes).forEach(function (d, i) {
                var th = document.createElement("th");
                th.innerHTML = d;
                columnHeaderRow.appendChild(th);
            });
            self.table.node().appendChild(columnHeaderRow);
            self.sortedStartTypes.forEach(function (d1, i1) {
                var tr = document.createElement("tr");
                var td = document.createElement("td");
                td.innerHTML = d1;
                d3.select(td).attr("style", "font-weight:bold;-webkit-min-logical-width:70px");
                tr.appendChild(td);
                self.sortedEndTypes.forEach(function (d2, i2) {
                    var td = document.createElement("td");
                    var svg = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "svg")).attr("width", 15).attr("height", 30);
                    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    d3.select(g).attr("style", "transform:translate(-7px,0px");
                    var rect = d3.select(document.createElementNS("http://www.w3.org/2000/svg", "rect")).attr("fill", colorScale(d2 in self.nestedPaths[d1] ? self.nestedPaths[d1][d2].count : 0)).attr("y", 10).attr("x", 10).attr("height", d2 in self.nestedPaths[d1] ? 10 : 0).attr("width", 10);
                    rect.append("title").text(d2 in self.nestedPaths[d1] ? self.nestedPaths[d1][d2].count : 0);
                    rect.datum(d2 in self.nestedPaths[d1] ? self.nestedPaths[d1][d2] : []);
                    rect.on("click", function (d) {
                        console.log(d.count);
                        var intermediateNodeData = getIntermediateNodeData(d);
                        if (Object.keys(intermediateNodeData).length != 0) {
                            var it = new Intermediate_table(intermediateNodeData);
                            it.draw();
                        }
                    });
                    g.appendChild(rect.node());
                    svg.node().appendChild(g);
                    td.append(svg.node());
                    tr.append(td);
                });
                self.table.node().appendChild(tr);
            });
        }
    }]);

    return Adjacency_matrix;
}();
//# sourceMappingURL=adjacency_matrix.js.map
