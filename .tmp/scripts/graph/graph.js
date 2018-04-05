'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Graph = function () {

  /**
   * Create the graph
   * data - marclab formatted json object.
   */
  function Graph(data) {
    _classCallCheck(this, Graph);

    var self = this;
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


  _createClass(Graph, [{
    key: 'createNodes',
    value: function createNodes(nodeData) {
      var self = this;
      for (var i = 0; i < nodeData.length; ++i) {
        var nodeIndex = self.nodes.length;
        var node = new Node(nodeData[i]);

        self.nodeIdToIndexes[node.id] = nodeIndex;
        self.nodes.push(node);
        self.nodeOutEdgeIndexes.push([]);
        self.nodeInEdgeIndexes.push([]);

        // Keep a map from label to indexes.
        var indexList = self.nodeLabelToIndexes[node.label];
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

  }, {
    key: 'createEdges',
    value: function createEdges(edgeData) {
      var self = this;

      for (var i = 0; i < edgeData.length; ++i) {
        var edgeIndex = self.edges.length;
        var edge = new Edge(edgeData[i]);

        self.edges.push(edge);

        var sourceId = edge.sourceId;
        var targetId = edge.targetId;

        var sourceIndex = self.nodeIdToIndexes[sourceId];
        var targetIndex = self.nodeIdToIndexes[targetId];

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

  }, {
    key: 'fillInPathsByRegex',
    value: function fillInPathsByRegex(paths, nodeConstraints, edgeConstraints) {
      var _this = this;

      var self = this;
      if (self.verbose) {
        console.log('fillInPathsByRegex', paths, nodeConstraints, edgeConstraints);
      }

      var maxNumHops = edgeConstraints.length;
      var finishedPaths = [];
      var counter = self.maxNumPaths;

      var _loop = function _loop() {
        var currentPath = paths.shift();
        var currentNode = currentPath.getLastNode();
        var currentHop = currentPath.getNumEdges();

        // Have we already finished this path?
        if (currentHop >= maxNumHops) {
          if (self.verbose) {
            console.log('finished path', currentPath);
          }
          if (currentPath.edges.length == currentPath.nodes.length) {
            currentPath.nodes.push(currentPath.graph.nodes.filter(function (d) {
              return d.id == currentPath.edges.slice(-1)[0].targetId;
            })[0]);
          }
          finishedPaths.push(currentPath);
          return 'continue';
        }

        if (self.verbose) {
          console.log('walking on path', currentPath, currentNode, currentHop);
        }

        var nextNodeConstraint = nodeConstraints[currentHop + 1];
        var nextEdgeConstraint = edgeConstraints[currentHop];

        var currentNodeIndex = self.nodeIdToIndexes[currentNode.id];
        var currentNodeOutEdges = self.nodeOutEdgeIndexes[currentNodeIndex];

        // Try all of the outgoing edges...
        for (var i = 0; i < currentNodeOutEdges.length; ++i) {
          var edgeIndex = currentNodeOutEdges[i];
          var currentEdge = self.edges[edgeIndex];

          if (self.verbose) {
            console.log('trying to walk on edge', currentEdge);
          }

          // Are we allowed to walk on the current edge?
          //either the constraint is a regex and the regex should match or it's an array of ids and the array should contain this id
          if (nextEdgeConstraint.length == null && currentEdge.type.match(nextEdgeConstraint) || nextEdgeConstraint.length != null && nextEdgeConstraint.includes(currentEdge.id)) {
            var nextNodeId = currentEdge.targetId;
            var nextNodeIndex = self.nodeIdToIndexes[nextNodeId];
            var nextNode = self.nodes[nextNodeIndex];

            if (self.verbose) {
              console.log('walked on edge, found node', nextNode);
            }
            if (nextNodeConstraint.length == null && nextNode.label.match(nextNodeConstraint) || nextNodeConstraint.length != null && nextNodeConstraint.includes(nextNode.id)) {
              //if (nextNode.label.match(nextNodeConstraint)) {
              var newPath = new Path(_this, currentPath.nodes, currentPath.edges);
              newPath.addNode(nextNode); // nodes must be added BEFORE edges.
              newPath.addEdge(currentEdge);
              paths.push(newPath);
              if (self.verbose) {
                console.log('found next node, creating new path', nextNode);
              }
            }
          }
        }

        counter--;
      };

      while (paths.length && counter > 0) {
        var _ret = _loop();

        if (_ret === 'continue') continue;
      }
      return finishedPaths;
    }

    /**
     * Find paths from nodes.
     * - nodeConstraints - list of label regular expressions.
     * - edgeConstraints - list of edge type regular expressions.
     */

  }, {
    key: 'findPathsByRegex',
    value: function findPathsByRegex(nodeConstraints, edgeConstraints) {
      var self = this;
      var paths = [];
      for (var i = 0; i < self.nodes.length; ++i) {
        var node = self.nodes[i];
        if (nodeConstraints[0].length == null && node.label.match(nodeConstraints[0]) || nodeConstraints[0].length != null && nodeConstraints[0].includes(node.id)) {
          // if (node.label.match(nodeConstraints[0])) {
          var path = new Path(this);
          path.addNode(node);
          paths.push(path);
          if (self.verbose) {
            console.log('created seed path', path);
          }
        }
      }

      return self.fillInPathsByRegex(paths, nodeConstraints, edgeConstraints);
    }
  }]);

  return Graph;
}();
//# sourceMappingURL=graph.js.map
