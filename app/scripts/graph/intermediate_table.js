class Intermediate_table {
    constructor(data, paths) {
        this.data = data;
        this.paths = paths;
        this.totalPaths = paths.count;
        this.table = d3.select('#intermediate_node_table');
    };
    draw() {
        let self = this;
        self.table.node().innerHTML = '';
        d3.select('#allPaths').node().innerHTML = '';
        let hop_count = +$('#hop-count').val();
        let columnHeaderRow = document.createElement('tr');
        for (let i = 1; i <= hop_count; i++) {
            let th = document.createElement('th');
            if (i != 1) {
                let svg = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'svg'))
                    .attr('width', 15)
                    .attr('height', 70);
                let maxPos = (10 * (hop_count + 1));
                for (let j = 1; j <= hop_count + 1; j++) {
                    let g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                    d3.select(g).attr('style', 'transform:translate(7px,' + (maxPos - 10 * (j - 1)) + 'px)');
                    let circle = d3.select(document.createElementNS('http://www.w3.org/2000/svg', 'circle'))
                        .attr('fill', function() {
                            return j == i ? '#00ffff' : '#ccffff'
                        })
                        .attr('style', 'stroke:#012c72')
                        .attr('y', 0)
                        .attr('x', 0)
                        .attr('r', 5);
                    g.appendChild(circle.node());
                    svg.node().appendChild(g);
                    th.append(svg.node());
                }
                let p = $('<p/>').text('Node ' + i);
                th.append(p[0]);
            }
            columnHeaderRow.append(th);
        }
        self.table.node().appendChild(columnHeaderRow);
        for (let node in self.data) {
            let tr = document.createElement('tr');
            let td = document.createElement('td');
            for (let j = 1; j <= hop_count; ++j) {
                if (j == 1) {
                    let td = document.createElement('td');
                    td.innerHTML = node;
                    d3.select(td).attr('style', 'font-weight:bold; padding: 0px 5px;')
                    tr.appendChild(td);
                } else {
                    let td2 = document.createElement('td');
                    d3.select(td2).attr('style', 'padding: 0px 5px;')
                    let content = (j - 1 in self.data[node]) ? self.data[node][j - 1] : '';
                    let a = $('<a/>').text(content).attr('style', 'cursor: pointer; white-space: nowrap; width: 70px;overflow: hidden; text-overflow: ellipsis; display: block;');
                    //td2.innerHTML = content;                    
                    d3.select(a[0]).datum(self.data[node]['paths-' + (j - 1)]);
                    a.click(function(event) {
                        displayAllPaths(d3.select(event.target).datum());
                    });
                    td2.append(a[0]);
                    tr.appendChild(td2);
                }
            }
            self.table.node().appendChild(tr);
        }
        d3.select('#int_totPaths').text('Total paths = ' + self.totalPaths);
    }
}

function displayAllPaths(paths) {
    let table = d3.select('#allPaths');
    table.node().innerHTML = '';
    let tr = $('<tr/>');
    let th = $('<th/>').text('#');
    tr.append(th[0]);
    th = $('<th/>');
    th[0].innerHTML = 'Node &#x2192; (Edge) &#x2192; Node ...';
    tr.append(th[0]);
    table.node().append(tr[0]);
    for (let i = 0; i < paths.length; i++) {
        tr = $('<tr/>');
        let td = $('<td/>').text(i + 1);
        tr.append(td[0]);
        td = $('<td/>');
        let content = '';
        var j = 0;
        for (j = 0; j < paths[i].edges.length; j++) {
            content += (paths[i].nodes[j].id + '&#x2192;(');
            content += (Math.abs(paths[i].edges[j].id) + ')&#x2192;');
        }
        content += (paths[i].nodes[j].id);
        td[0].innerHTML = content;
        tr.append(td[0]);
        table.node().append(tr[0]);
    }
}