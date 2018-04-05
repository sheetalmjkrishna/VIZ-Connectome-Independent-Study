"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Path = function () {

  /**
   * Create a new empty path or deep copy nodes and edges into a new path.
   */
  function Path(graph, nodes, edges) {
    _classCallCheck(this, Path);

    var self = this;
    self.graph = graph;
    self.nodes = nodes ? [].concat(nodes) : [];
    self.edges = edges ? [].concat(edges) : [];
  }

  /**
   * Add a node with simple error checking.
   */


  _createClass(Path, [{
    key: "addNode",
    value: function addNode(node) {
      var self = this;
      var edge = self.getLastEdge();
      if (edge && edge.targetId != node.id) {
        //throw 'Tried to create a garbage path with edge/node mistmatch';
      } else {
        self.nodes.push(node);
      }
      /*if (!(edge && edge.targetId != node.id)) {
        self.nodes.push(node);
      } */
    }

    /**
     *
     */

  }, {
    key: "addEdge",
    value: function addEdge(edge) {
      var self = this;
      self.edges.push(edge);
    }

    /**
     *
     */

  }, {
    key: "getLastEdge",
    value: function getLastEdge() {
      var self = this;
      if (self.edges.length) {
        return self.edges[self.edges.length - 1];
      } else {
        return null;
      }
    }

    /**
     *
     */

  }, {
    key: "getLastNode",
    value: function getLastNode() {
      var self = this;
      if (self.nodes.length) {
        return self.nodes[self.nodes.length - 1];
      } else {
        return null;
      }
    }

    /**
    *
    */

  }, {
    key: "getNumEdges",
    value: function getNumEdges() {
      var self = this;
      return self.edges.length;
    }
  }]);

  return Path;
}();
//# sourceMappingURL=path.js.map
