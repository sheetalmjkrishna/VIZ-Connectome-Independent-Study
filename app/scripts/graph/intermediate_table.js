class Intermediate_table {
    constructor(data) {
        this.data = data;
        this.table = d3.select("#intermediate_node_table");
    };
    draw() {
        let self = this;
        self.table.node().innerHTML = "";
        let hop_count = +$("#hop-count").val();
        let columnHeaderRow = document.createElement("tr");
        for (let i = 1; i <= hop_count; i++) {
            let th = document.createElement("th");
            th.innerHTML = i != 1 ? i + " node " : "";
            columnHeaderRow.appendChild(th);
        }
        self.table.node().appendChild(columnHeaderRow);
        for (let node in self.data) {
            let tr = document.createElement("tr");
            for (let j = 1; j <= hop_count; ++j) {
                if (j == 1) {
                    let td = document.createElement("td");
                    td.innerHTML = node;
                    d3.select(td).attr("style", "font-weight:bold;-webkit-min-logical-width:70px")
                    tr.appendChild(td);
                } else {
                    let td2 = document.createElement("td");
                    let content = (j - 1 in self.data[node]) ? self.data[node][j - 1] : "";
                    td2.innerHTML = content;
                    tr.appendChild(td2);
                }
            }
            self.table.node().appendChild(tr);
        }
    }
}