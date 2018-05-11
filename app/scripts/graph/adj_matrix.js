class Adj_matrix {
    constructor(data) {
        this.nestedPaths = data.nestedPaths;
        this.sortedStartTypes = data.sortedStartTypes;
        this.sortedEndTypes = data.sortedEndTypes;
        this.maxCount = data.maxCount;
        this.table = d3.select('#adjacency_matrix_table');
        this.intermediateTable = d3.select('#intermediate_node_table');

    };
    draw() {
        let self = this;
        self.table.node().innerHTML = '';
        self.intermediateTable.node().innerHTML = '';
        let colorScale = d3.scaleLinear()
            .domain([0, self.maxCount])
            .range(['#e6ffff', '#00e6e6']);
        let columnHeaderRow = document.createElement('tr');
        [''].concat(self.sortedEndTypes).forEach(function(d, i) {
            let th = document.createElement('th');
            th.innerHTML = d;
            columnHeaderRow.appendChild(th);
        });
        self.table.node().appendChild(columnHeaderRow);
        self.sortedStartTypes.forEach(function(d1, i1) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            td.innerHTML = d1;
            d3.select(td).attr('style', 'font-weight:bold;-webkit-min-logical-width:70px');
            tr.appendChild(td);
            self.sortedEndTypes.forEach(function(d2, i2) {
                let td = document.createElement('td');
                let svg = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
                    .attr('width', 15)
                    .attr('height', 30);
                let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                d3.select(g)
                    .attr('style', 'transform:translate(-7px,0px');
                let rect = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'rect'))
                    .attr('fill', colorScale((d2 in self.nestedPaths[d1]) ? self.nestedPaths[d1][d2].count : 0))
                    .attr('y', 10)
                    .attr('x', 10)
                    .attr('height', (d2 in self.nestedPaths[d1]) ? 10 : 0)
                    .attr('width', 10);
                rect.append('title')
                    .text((d2 in self.nestedPaths[d1]) ? self.nestedPaths[d1][d2].count : 0);
                rect.datum(d2 in self.nestedPaths[d1] ? self.nestedPaths[d1][d2] : []);
                rect.on('click', function(d) {
                    console.log(d.count);
                    let intermediateNodeData = getIntermediateNodeDataOld(d)
                    if (Object.keys(intermediateNodeData).length != 0) {
                        let it = new Intermediate_table(intermediateNodeData);
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
}