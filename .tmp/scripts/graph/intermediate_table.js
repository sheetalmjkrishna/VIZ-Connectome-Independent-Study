"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Intermediate_table = function () {
    function Intermediate_table(data) {
        _classCallCheck(this, Intermediate_table);

        this.data = data;
        this.table = d3.select("#intermediate_node_table");
    }

    _createClass(Intermediate_table, [{
        key: "draw",
        value: function draw() {
            var self = this;
            self.table.node().innerHTML = "";
            var hop_count = +$("#hop-count").val();
            var columnHeaderRow = document.createElement("tr");
            for (var i = 1; i <= hop_count; i++) {
                var th = document.createElement("th");
                th.innerHTML = i != 1 ? i + " node " : "";
                columnHeaderRow.appendChild(th);
            }
            self.table.node().appendChild(columnHeaderRow);
            for (var node in self.data) {
                var tr = document.createElement("tr");
                for (var j = 1; j <= hop_count; ++j) {
                    if (j == 1) {
                        var td = document.createElement("td");
                        td.innerHTML = node;
                        d3.select(td).attr("style", "font-weight:bold;-webkit-min-logical-width:70px");
                        tr.appendChild(td);
                    } else {
                        var td2 = document.createElement("td");
                        var content = j - 1 in self.data[node] ? self.data[node][j - 1] : "";
                        td2.innerHTML = content;
                        tr.appendChild(td2);
                    }
                }
                self.table.node().appendChild(tr);
            }
        }
    }]);

    return Intermediate_table;
}();
//# sourceMappingURL=intermediate_table.js.map
