class Edge {
  constructor(edgeData) {
    let self = this;
    self.id = edgeData.id;
    self.sourceId = edgeData.SourceStructureID;
    self.targetId = edgeData.TargetStructureID;
    self.type = edgeData.Type;
    self.label = edgeData.Label;
    self.links = edgeData.Links;
    self.directional = edgeData.Directional;
  }
}
