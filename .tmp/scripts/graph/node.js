'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Node = function Node(nodeData) {
  _classCallCheck(this, Node);

  var self = this;
  self.id = nodeData.StructureID;
  self.label = nodeData.Label ? nodeData.Label.trim() : 'Unknown';
  self.tags = nodeData.Tags;
};
//# sourceMappingURL=node.js.map
