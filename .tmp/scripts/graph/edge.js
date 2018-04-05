'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Edge = function Edge(edgeData) {
  _classCallCheck(this, Edge);

  var self = this;
  self.id = edgeData.ID;
  self.sourceId = edgeData.SourceStructureID;
  self.targetId = edgeData.TargetStructureID;
  self.type = edgeData.Type ? edgeData.Type.trim() : 'Unknown';
  self.label = edgeData.Label ? edgeData.Label.trim() : 'Unknown';
  self.links = edgeData.Links;
  self.directional = edgeData.Directional;
};
//# sourceMappingURL=edge.js.map
