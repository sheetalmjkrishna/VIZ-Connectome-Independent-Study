"use strict";function main(e){var n=function(e){var n=(performance.now(),new Graph(e));performance.now();performance.now();n.findPathsByRegex([new RegExp("CBb.*"),new RegExp("YAC Ai")],[new RegExp(".*")]);performance.now()};d3.json(e,n)}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}function _classCallCheck(e,n){if(!(e instanceof n))throw new TypeError("Cannot call a class as a function")}main("assets/large-network.json");var _createClass=function(){function e(e,n){for(var a=0;a<n.length;a++){var t=n[a];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,a,t){return a&&e(n.prototype,a),t&&e(n,t),n}}(),Graph=function(){function e(n){_classCallCheck(this,e);var a=this;a.data=n,a.nodes=[],a.edges=[],a.nodeIdToIndexes={},a.nodeLabelToIndexes={},a.nodeOutEdgeIndexes=[],a.nodeInEdgeIndexes=[],a.verbose=!1,a.maxNumPaths=1e5,a.createNodes(n.nodes),a.createEdges(n.edges)}return _createClass(e,[{key:"createNodes",value:function(e){for(var n=this,a=0;a<e.length;++a){var t=n.nodes.length,s=new Node(e[a]);n.nodeIdToIndexes[s.id]=t,n.nodes.push(s),n.nodeOutEdgeIndexes.push([]),n.nodeInEdgeIndexes.push([]);n.nodeLabelToIndexes[s.label]?n.nodeLabelToIndexes[s.label].push(t):n.nodeLabelToIndexes[s.label]=[t]}}},{key:"createEdges",value:function(e){for(var n=this,a=0;a<e.length;++a){var t=n.edges.length,s=new Edge(e[a]);n.edges.push(s);var o=s.sourceId,r=s.targetId,d=n.nodeIdToIndexes[o],l=n.nodeIdToIndexes[r];n.nodeOutEdgeIndexes[d].push(t),n.nodeInEdgeIndexes[l].push(t),s.directional||(s=new Edge(e[a]),s.id=-s.id,s.targetId=o,s.sourceId=r,t=n.edges.length,n.edges.push(s),n.nodeOutEdgeIndexes[l].push(t),n.nodeInEdgeIndexes[d].push(t))}}},{key:"fillInPathsByRegex",value:function(e,n,a){var t=this;t.verbose;for(var s=a.length,o=[],r=t.maxNumPaths;e.length&&r>0;){var d=e.shift(),l=d.getLastNode(),i=d.getNumEdges();if(i>=s)t.verbose,o.push(d);else{t.verbose;for(var u=n[i+1],c=a[i],h=t.nodeIdToIndexes[l.id],g=t.nodeOutEdgeIndexes[h],f=0;f<g.length;++f){var v=g[f],I=t.edges[v];if(t.verbose,I.type.match(c)){var p=I.targetId,b=t.nodeIdToIndexes[p],x=t.nodes[b];if(t.verbose,x.label.match(u)){var w=new Path(this,d.nodes,d.edges);w.addNode(x),w.addEdge(I),e.push(w),t.verbose}}}r--}}return o}},{key:"findPathsByRegex",value:function(e,n){for(var a=this,t=[],s=0;s<a.nodes.length;++s){var o=a.nodes[s];if(o.label.match(e[0])){var r=new Path(this);r.addNode(o),t.push(r),a.verbose}}return a.fillInPathsByRegex(t,e,n)}}]),e}(),Node=function e(n){_classCallCheck(this,e);var a=this;a.id=n.StructureID,a.label=n.Label?n.Label.trim():"Unknown",a.tags=n.Tags},Edge=function e(n){_classCallCheck(this,e);var a=this;a.id=n.id,a.sourceId=n.SourceStructureID,a.targetId=n.TargetStructureID,a.type=n.Type,a.label=n.Label,a.links=n.Links,a.directional=n.Directional},_createClass=function(){function e(e,n){for(var a=0;a<n.length;a++){var t=n[a];t.enumerable=t.enumerable||!1,t.configurable=!0,"value"in t&&(t.writable=!0),Object.defineProperty(e,t.key,t)}}return function(n,a,t){return a&&e(n.prototype,a),t&&e(n,t),n}}(),Path=function(){function e(n,a,t){_classCallCheck(this,e);var s=this;s.graph=n,s.nodes=a?[].concat(a):[],s.edges=t?[].concat(t):[]}return _createClass(e,[{key:"addNode",value:function(e){var n=this,a=n.getLastEdge();if(a&&a.targetId!=e.Id)throw"Tried to create a garbage path with edge/node mistmatch";n.nodes.push(e)}},{key:"addEdge",value:function(e){this.edges.push(e)}},{key:"getLastEdge",value:function(){var e=this;return e.edges.length?e.edges[e.edges.length-1]:null}},{key:"getLastNode",value:function(){var e=this;return e.nodes.length?e.nodes[e.nodes.length-1]:null}},{key:"getNumEdges",value:function(){return this.edges.length}}]),e}();