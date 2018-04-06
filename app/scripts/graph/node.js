class Node {
  constructor(nodeData) {
    let self = this;
    self.id = nodeData.StructureID;
    self.label = nodeData.Label ? nodeData.Label.trim() : 'Unknown';
    self.tags = nodeData.Tags;
  }
}
