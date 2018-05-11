 class Graph {

     /**
      * Create the graph
      * data - marclab formatted json object.
      */
     constructor(data) {
         let self = this;
         self.data = data;
         self.nodes = [];
         self.edges = [];

         self.nodeIdToIndexes = {}; // key: node id, value: node index
         self.nodeLabelToIndexes = {}; // key: node label, value: node indexes

         self.nodeOutEdgeIndexes = []; // key: nodeIndex, value: list of edge indexes
         self.nodeInEdgeIndexes = [];

         // set to true/false to enable debug printing.
         self.verbose = false;
         self.maxNumPaths = 100000;
         self.createNodes(data.nodes);
         self.createEdges(data.edges);
     }

     /**
      * Create list of nodes stored in linear array.
      * - nodeData - marclab formatted list of nodes
      */
     createNodes(nodeData) {
         let self = this;
         for (let i = 0; i < nodeData.length; ++i) {
             let nodeIndex = self.nodes.length;
             let node = new Node(nodeData[i]);
             self.nodeIdToIndexes[node.id] = nodeIndex;
             self.nodes.push(node);
             self.nodeOutEdgeIndexes.push([]);
             self.nodeInEdgeIndexes.push([]);

             // Keep a map from label to indexes.
             let indexList = self.nodeLabelToIndexes[node.label];
             if (!indexList) {
                 self.nodeLabelToIndexes[node.label] = [nodeIndex];
             } else {
                 self.nodeLabelToIndexes[node.label].push(nodeIndex);
             }

         }
     }

     /**
      * Create list of edges stored in linear array.
      * If edges are bidirectional, create an edge with -id.
      * - edgeData - marclab formatted list of edges
      */
     createEdges(edgeData) {
         let self = this;

         for (let i = 0; i < edgeData.length; ++i) {

             let edgeIndex = self.edges.length;
             let edge = new Edge(edgeData[i]);

             self.edges.push(edge);

             let sourceId = edge.sourceId;
             let targetId = edge.targetId;

             let sourceIndex = self.nodeIdToIndexes[sourceId];
             let targetIndex = self.nodeIdToIndexes[targetId];

             self.nodeOutEdgeIndexes[sourceIndex].push(edgeIndex);
             self.nodeInEdgeIndexes[targetIndex].push(edgeIndex);

             if (!edge.directional) {
                 edge = new Edge(edgeData[i]); // create new to avoid reference.
                 edge.id = -edge.id;
                 edge.targetId = sourceId;
                 edge.sourceId = targetId;

                 edgeIndex = self.edges.length;
                 self.edges.push(edge);
                 self.nodeOutEdgeIndexes[targetIndex].push(edgeIndex);
                 self.nodeInEdgeIndexes[sourceIndex].push(edgeIndex);
             }
         }
     }

     /**
      * Walk on 'paths' following allowed edge and node constraints.
      * Return a list of paths that match the constraints.
      */
     fillInPathsByRegex(paths, nodeConstraints, edgeConstraints) {
         let self = this;
         if (self.verbose) {
             console.log('fillInPathsByRegex', paths, nodeConstraints, edgeConstraints);
         }

         let maxNumHops = edgeConstraints.length;
         let finishedPaths = [];
         let counter = self.maxNumPaths;

         while (paths.length && counter > 0) {
             let currentPath = paths.shift();
             let currentNode = currentPath.getLastNode();
             let currentHop = currentPath.getNumEdges();

             // Have we already finished this path?
             if (currentHop >= maxNumHops) {
                 if (self.verbose) {
                     console.log('finished path', currentPath);
                 }
                 /*if(currentPath.edges.length==currentPath.nodes.length){
                   debugger;
                   currentPath.nodes.push(currentPath.graph.nodes.filter(function (d) {
                     return d.id==currentPath.edges.slice(-1)[0].targetId ;
                 })[0]);
                 }*/
                 finishedPaths.push(currentPath);
                 continue;
             }

             if (self.verbose) {
                 console.log('walking on path', currentPath, currentNode, currentHop);
             }

             let nextNodeConstraint = nodeConstraints[currentHop + 1];
             let nextEdgeConstraint = edgeConstraints[currentHop];

             let currentNodeIndex = self.nodeIdToIndexes[currentNode.id];
             let currentNodeOutEdges = self.nodeOutEdgeIndexes[currentNodeIndex];

             // Try all of the outgoing edges...
             for (let i = 0; i < currentNodeOutEdges.length; ++i) {
                 let edgeIndex = currentNodeOutEdges[i];
                 let currentEdge = self.edges[edgeIndex];

                 if (self.verbose) {
                     console.log('trying to walk on edge', currentEdge);
                 }

                 // Are we allowed to walk on the current edge?
                 //either the constraint is a regex and the regex should match or it's an array of ids and the array should contain this id
                 if ((nextEdgeConstraint.length == null && currentEdge.type.match(nextEdgeConstraint)) || (nextEdgeConstraint.length != null && nextEdgeConstraint.includes(currentEdge.id))) {
                     let nextNodeId = currentEdge.targetId;
                     let nextNodeIndex = self.nodeIdToIndexes[nextNodeId];
                     let nextNode = self.nodes[nextNodeIndex];

                     if (self.verbose) {
                         console.log('walked on edge, found node', nextNode);
                     }
                     if ((nextNodeConstraint.length == null && nextNode.label.match(nextNodeConstraint)) || (nextNodeConstraint.length != null && nextNodeConstraint.includes(nextNode.id))) {
                         //if (nextNode.label.match(nextNodeConstraint)) {
                         let newPath = new Path(this, currentPath.nodes, currentPath.edges);
                         newPath.addEdge(currentEdge);
                         newPath.addNode(nextNode); // nodes must be added BEFORE edges.
                         paths.push(newPath);
                         if (self.verbose) {
                             console.log('found next node, creating new path', nextNode);
                         }
                     }
                 }
             }

             counter--;
         }
         return finishedPaths;
     }

     /**
      * Find paths from nodes.
      * - nodeConstraints - list of label regular expressions.
      * - edgeConstraints - list of edge type regular expressions.
      */
     findPathsByRegex(nodeConstraints, edgeConstraints) {
         let self = this;
         let paths = [];
         for (let i = 0; i < self.nodes.length; ++i) {
             let node = self.nodes[i];
             if ((nodeConstraints[0].length == null && node.label.match(nodeConstraints[0])) || (nodeConstraints[0].length != null && nodeConstraints[0].includes(node.id))) {
                 // if (node.label.match(nodeConstraints[0])) {
                 let path = new Path(this);
                 path.addNode(node);
                 paths.push(path);
                 if (self.verbose) {
                     console.log('created seed path', path)
                 }
             }
         }

         return self.fillInPathsByRegex(paths, nodeConstraints, edgeConstraints);
     }
 }