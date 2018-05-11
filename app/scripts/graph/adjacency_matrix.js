class Adjacency_matrix {
    constructor(data, totalPaths) {
        this.margin = {
            top: 50,
            right: 0,
            bottom: 10,
            left: 60
        };


        this.width = 500;
        this.height = 550;
        this.data = data.data;
        this.totalPaths = totalPaths;
        this.node_index = data.node_index;
        this.x = d3.scaleBand().rangeRound([0, this.width])
        this.z = d3.scaleLinear().domain([0, 4]).clamp(true);
        this.c = d3.scaleLinear().range(['#b3ffff', '#006699']); //(["#99ffcc", "#99ffe6", "#99ffff", "#99e6ff", "#99ccff", "#99b3ff", "#9999ff", "#b399ff", "#cc99ff", "#e699ff", "#ff99ff", "#ff99e6", "#ff99cc", "#ff99b3", "#ff9999","#ff9999", "#ffb399", "#ffcc99", "#ffe699", "#ffff99", "#e6ff99", "#ccff99", "#b3ff99", "#99ff99", "#99ffb3"]);//(["#b3ffff", "#17becf", "#b3ffe6", "#66ffcc", "#ffccdd", "#ff3377", "#f7b6d2", "#e377c2", "#ecb3ff", "#9900cc", "#c5b0d5", "#9467bd", "#ff9896", "#d62728", "#98df8a", "#2ca02c", "#ffbb78", "#ff7f0e", "#aec7e8", "#1f77b4"]);//["#b3ffff","#ccff99","#b3ffd9","#ffff99","#ffccff","#e6ccff","#ffcce6","#ffccb3","#ff9999"," #ffff00","#99ff33","#66ff99","#66ffcc","#00ffff","#0052cc","#ff33ff","#c44dff","#ff4d88","#ff6600","#ff0000"]); 

        d3.select('#adjacency_matrix').node().innerHTML = '';
        this.svg = d3.select('#adjacency_matrix')
            .attr('width', this.width + this.margin.left + this.margin.right)
            .attr('height', this.height + this.margin.top + this.margin.bottom)
            .append('g')
            .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');
        this.legend=d3.select('#adjacency_matrix')
                      .append('g')
                      .attr('transform', 'translate(' + (((this.margin.left+this.width+this.margin.right)/3)-30) + ',' + (this.height+5) + ')')
                      .attr('class', 'legendLinear');
        this.svg.style({
            'margin-left': (-this.margin.left + 'px'),
            'margin-top': (-this.margin.top + 'px')
        });
        this.intermediateTable = d3.select('#intermediate_node_table');
        this.intermediateTable.node().innerHTML = '';
        d3.select('#allPaths').node().innerHTML = '';
        d3.select('#adj_totPaths').node().innerHTML = '';
        d3.select('#int_totPaths').node().innerHTML = '';
        $('#nodeDataTable')[0].innerHTML = '';
        $('#nodeDataValidation')[0].innerHTML = '';
        this.tip = d3.tip().attr('class', 'd3-tip')
            .direction('se')
            .offset(function() {
                return [0, 0];
            })
            .html((d) => {
                // populate data in the following format
                let tooltip_data = d.z;
                //pass this as an argument to the tooltip_render function then,
                //return the HTML content returned from that method.
                let html = '<strong>Number of Paths: ' + tooltip_data + '</strong>';
                return html;
            });

        this.svg.call(this.tip);
    };


    draw() {
        let self = this;
        let matrix = [],
            nodes = self.data.nodes,
            n = nodes.length;

        // Compute index per node.
        nodes.forEach(function(node, i) {
            matrix[i] = d3.range(n).map(function(j) {
                return {
                    x: j,
                    y: i,
                    z: 0
                };
            });
        });

        // Convert links to matrix; count character occurrences.
        let maxVal = 0;
        self.data.links.forEach(function(link) {
            matrix[link.source][link.target].z += link.value;
            if (matrix[link.source][link.target].z > maxVal)
                maxVal = matrix[link.source][link.target].z;
        });
        self.c.domain([0, maxVal]);

        // The default sort order.
        self.x.domain(d3.range(n).sort(function(a, b) {
            return d3.ascending(nodes[a].name, nodes[b].name);
        }));

        self.svg.append('rect')
            .attr('class', 'background')
            .attr('width', self.width)
            .attr('height', self.height);

        let row = self.svg.selectAll('.row')
            .data(matrix)
            .enter().append('g')
            .attr('class', 'row')
            .attr('transform', function(d, i) {
                return 'translate(0,' + self.x(i) + ')';
            })
            .each(f_row);

        row.append('line')
            .attr('x2', self.width);

        row.append('text')
            .attr('x', -6)
            .attr('y', self.x.bandwidth() / 2)
            .attr('dy', '.32em')
            .attr('text-anchor', 'end')
            .text(function(d, i) {
                return nodes[i].name;
            });

        let column = self.svg.selectAll('.column')
            .data(matrix)
            .enter().append('g')
            .attr('class', 'column')
            .attr('transform', function(d, i) {
                return 'translate(' + self.x(i) + ')rotate(-90)';
            });

        column.append('line')
            .attr('x1', -self.width);

        column.append('text')
            .attr('x', 6)
            .attr('y', self.x.bandwidth() / 2)
            .attr('dy', '.32em')
            .attr('text-anchor', 'start')
            .text(function(d, i) {
                return nodes[i].name;
            });

        function f_row(row) {
            //only draw rects whose z value isn't 0, so filter out non-zero cells
            let cell = d3.select(this).selectAll('.cell')
                .data(row.filter(function(d) {
                    return d.z;
                }))
                .enter().append('rect')
                .attr('class', 'cell')
                .attr('x', function(d) {
                    return self.x(d.x);
                })
                .attr('value', function(d) {
                    return self.c(d.z)
                })
                .attr('rx','6px')
                .attr('ry','6px')
                .attr('width', self.x.bandwidth())
                .attr('height', self.x.bandwidth())
                .style('fill', function(d) {
                    return self.c(d.z)
                })
                .on('mouseover', function(d) {
                    mouseover(d, self)
                })
                .on('mouseout', function(d) {
                    mouseout(d, self)
                });
            /*cell.append('title')
                .text(function(d) {
                    return d.z
                });*/
            cell.on('click', function(d) {
                //console.log(d.z);
                let start = Object.keys(self.node_index).find(key => self.node_index[key] === d.y);
                let end = Object.keys(self.node_index).find(key => self.node_index[key] === d.x);
                let intermediateNodeData = getIntermediateNodeData(self.data.nestedPaths[start][end])
                if (Object.keys(intermediateNodeData).length != 0) {
                    let it = new Intermediate_table(intermediateNodeData, self.data.nestedPaths[start][end]);
                    it.draw();
                }
            });
        }

        function mouseover(p, self) {
            self.tip.show(p);
            d3.selectAll('.row text').classed('active', function(d, i) {
                return i == p.y;
            });
            d3.selectAll('.column text').classed('active', function(d, i) {
                return i == p.x;
            });
        }

        function mouseout(p, self) {
            self.tip.hide(p);
            d3.selectAll('text').classed('active', false);
        }
        d3.select('#adj_totPaths').text('The total number of paths = ' + self.totalPaths);

        var legendLinear = d3.legendColor()
          .shapeWidth(30)
          .cells(10)
          .orient('horizontal')
          .scale(self.c);

        this.legend
            .call(legendLinear);
    }
}