class Path {

  /**
   * Create a new empty path or deep copy nodes and edges into a new path.
   */
  constructor(graph, nodes, edges) {
    let self = this;
    self.graph = graph;
    self.nodes = nodes ? [].concat(nodes) : [];
    self.edges = edges ? [].concat(edges) : [];
  }

  /**
   * Add a node with simple error checking.
   */
  addNode(node) {
    let self = this;
    let edge = self.getLastEdge();
    if (edge && edge.targetId != node.id) {
      throw 'Tried to create a garbage path with edge/node mistmatch';
    } 
    else {
      self.nodes.push(node);
    }
    /*if (!(edge && edge.targetId != node.id)) {
      self.nodes.push(node);
    } */
  }

  /**
   *
   */
  addEdge(edge) {
    let self = this;
    self.edges.push(edge);
  }

  /**
   *
   */
  getLastEdge() {
    let self = this;
    if (self.edges.length) {
      return self.edges[self.edges.length - 1];
    } else {
      return null;
    }
  }

  /**
   *
   */
  getLastNode() {
    let self = this;
    if (self.nodes.length) {
      return self.nodes[self.nodes.length - 1];
    } else {
      return null;
    }
  }

  /**
  *
  */
  getNumEdges() {
    let self = this;
    return self.edges.length;
  }
}
