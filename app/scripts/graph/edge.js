class Edge {
  constructor(edgeData) {
    let self = this;
    self.id = edgeData.ID;
    self.sourceId = edgeData.SourceStructureID;
    self.targetId = edgeData.TargetStructureID;
    self.type = edgeData.Type ? edgeData.Type.trim() : 'Unknown';
    self.label = edgeData.Label ? edgeData.Label.trim() : 'Unknown';
    self.links = edgeData.Links;
    self.directional = edgeData.Directional;
  }
}
