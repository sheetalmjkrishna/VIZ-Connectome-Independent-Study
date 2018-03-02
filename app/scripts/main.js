function main(filename) {

  let createGraph = function (data) {
    let t0 = performance.now();
    let graph = new Graph(data);
    let t1 = performance.now();
    console.log('Created the graph in ' + (t1 - t0) + ' milliseconds.', graph);


    t0 = performance.now();
    let paths = graph.findPathsByRegex([new RegExp('CBb.*'), new RegExp('YAC Ai')], [new RegExp('.*')]);
    t1 = performance.now();
    console.log('Found  ' + paths.length + ' paths in ' + (t1 - t0) + ' milliseconds.', paths)
  };

  d3.json(filename, createGraph);

}

//main('assets/tiny-network.json');
main('assets/large-network.json');
