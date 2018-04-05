'use strict';

var globalJSON = [];
var listOfFinalPaths = [];

function main() {
    var createGraph = function createGraph(data) {
        var t0 = performance.now();
        var graph = new Graph(data);
        var t1 = performance.now();
        console.log('Created the graph in ' + (t1 - t0) + ' milliseconds.', graph);
        t0 = performance.now();
        var nodeConstraints = [];
        var edgeConstraints = [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = $("input[id^='node']")[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var nodeType = _step.value;

                var type = $(nodeType).parent().find("input[name^='input-type']:checked").val();
                if (type == "regex") nodeConstraints.push(new RegExp($(nodeType).val() == "" ? ".*" : $(nodeType).val().replace(/ *, */g, '|')));else nodeConstraints.push($(nodeType).val().split(',').map(Number));
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
            for (var _iterator2 = $("input[id^='edge']")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var edgeType = _step2.value;

                var _type = $(edgeType).parent().find("input[name^='input-type']:checked").val();
                if (_type == "regex") edgeConstraints.push(new RegExp($(edgeType).val() == "" ? ".*" : $(edgeType).val().replace(/ *, */g, '|')));else edgeConstraints.push($(edgeType).val().split(',').map(Number));
            }
            //let paths = graph.findPathsByRegex([new RegExp('CBb.*'), new RegExp('YAC Ai')], [new RegExp('.*')]);
        } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                    _iterator2.return();
                }
            } finally {
                if (_didIteratorError2) {
                    throw _iteratorError2;
                }
            }
        }

        var paths = graph.findPathsByRegex(nodeConstraints, edgeConstraints);
        t1 = performance.now();
        console.log('Found  ' + paths.length + ' paths in ' + (t1 - t0) + ' milliseconds.', paths);
        listOfFinalPaths = paths;
        var mungedData = mungePathData(listOfFinalPaths);
        var am = new Adjacency_matrix(mungedData);
        am.draw();
    };
    createGraph(globalJSON);
}

function getIntermediateNodeData(data) {
    var temp = {};
    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = data.paths[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var path = _step3.value;

            for (var i = 1; i < path.nodes.length - 1; i++) {
                if (path.nodes[i].id in temp) {
                    if (i in temp[path.nodes[i].id]) {
                        temp[path.nodes[i].id][i] += 1;
                    } else {
                        temp[path.nodes[i].id][i] = 1;
                    }
                } else {
                    temp[path.nodes[i].id] = {};
                    temp[path.nodes[i].id][i] = 1;
                }
            }
        }
    } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                _iterator3.return();
            }
        } finally {
            if (_didIteratorError3) {
                throw _iteratorError3;
            }
        }
    }

    return temp;
}

function mungePathData(data) {
    var temp = {};
    var maxCount = 0;
    var tempLastNodesTypes = [];
    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = listOfFinalPaths[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var path = _step4.value;

            if (path.nodes[0].label in temp) {
                //source type exists
                if (path.nodes.slice(-1)[0].label in temp[path.nodes[0].label]) {
                    //dest type exists
                    temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].paths.push(path);
                    temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count = temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].paths.length;
                    maxCount = temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count > maxCount ? temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count : maxCount;
                } else {
                    //source type exists  but not dest type
                    if (!tempLastNodesTypes.includes(path.nodes.slice(-1)[0].label)) tempLastNodesTypes.push(path.nodes.slice(-1)[0].label);
                    temp[path.nodes[0].label][path.nodes.slice(-1)[0].label] = {};
                    temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].paths = [path];
                    temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count = 1;
                    maxCount = temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count > maxCount ? temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count : maxCount;
                }
            } else {
                //source type doesn't exist
                if (!tempLastNodesTypes.includes(path.nodes.slice(-1)[0].label)) tempLastNodesTypes.push(path.nodes.slice(-1)[0].label);
                temp[path.nodes[0].label] = {};
                temp[path.nodes[0].label][path.nodes.slice(-1)[0].label] = {};
                temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].paths = [path];
                temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count = 1;
                maxCount = temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count > maxCount ? temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count : maxCount;
            }
        }
    } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion4 && _iterator4.return) {
                _iterator4.return();
            }
        } finally {
            if (_didIteratorError4) {
                throw _iteratorError4;
            }
        }
    }

    return {
        "nestedPaths": temp,
        "sortedStartTypes": Object.keys(temp).sort(),
        "sortedEndTypes": tempLastNodesTypes.sort(),
        "maxCount": maxCount
    };
}
$(document).ready(function () {
    $("#hop-count").on("change", function () {
        $("#change-file").show();
        var hop_count = parseInt($("#hop-count").val());
        var filter_container = $("#filter-dropdowns");
        filter_container.html("");
        var i = 1;
        for (i = 1; i <= hop_count; i++) {
            var _div = $("<div/>");
            _div.append("<p/>").text("Node " + i + " Type: ");
            var _label = $("<label/>").text("Regex");
            var _radio = $("<input/>").attr({
                "name": "input-type-node" + i,
                "value": "regex",
                "type": "radio",
                "checked": "checked"
            });
            _label.append(_radio);
            _div.append(_label);

            _label = $("<label/>").text("Ids");
            _radio = $("<input/>").attr({
                "name": "input-type-node" + i,
                "value": "ids",
                "type": "radio"
            });
            _label.append(_radio);
            _div.append(_label);

            var _input = $("<input/>").attr({
                "id": "node-" + i,
                "type": "text",
                "class": "form-control"
            });
            _div.append(_input);
            filter_container.append(_div);
            _div = $("<div/>");
            _div.append("<p/>").text("Edge " + i + " Type: ");
            _label = $("<label/>").text("Regex");
            _radio = $("<input/>").attr({
                "name": "input-type-edge" + i,
                "value": "regex",
                "type": "radio",
                "checked": "checked"
            });
            _label.append(_radio);
            _div.append(_label);

            _label = $("<label/>").text("Ids");
            _radio = $("<input/>").attr({
                "name": "input-type-edge" + i,
                "value": "ids",
                "type": "radio"
            });
            _label.append(_radio);
            _div.append(_label);
            _input = $("<input/>").attr({
                "id": "edge-" + i,
                "type": "text",
                "class": "form-control"
            });
            _div.append(_input);
            filter_container.append(_div);
        }
        var div = $("<div/>");
        div.append("<p/>").text("Node " + i + " Type: ");
        var label = $("<label/>").text("Regex");
        var radio = $("<input/>").attr({
            "name": "input-type-node" + i,
            "value": "regex",
            "type": "radio",
            "checked": "checked"
        });
        label.append(radio);
        div.append(label);

        label = $("<label/>").text("Ids");
        radio = $("<input/>").attr({
            "name": "input-type-node" + i,
            "value": "ids",
            "type": "radio"
        });
        label.append(radio);
        div.append(label);
        var input = $("<input/>").attr({
            "id": "node-" + i,
            "type": "text",
            "class": "form-control"
        });
        div.append(input);
        filter_container.append(div);
        div = $("<div/>");
        var button = $("<button/>").attr({
            "class": "btn btn-default",
            "id": "get-paths",
            "onclick": "main()"
        }).text("Get Paths");
        div.append(button);
        filter_container.append(div);
    });
});
$(window).on('load', function () {
    $("#loadFile").prop('disabled', true);
    $("#loadSample").on("change", function () {
        if ($(this).is(":checked")) {
            $("#fileToLoad").closest(".col-md-4").hide();
            $("#loadFile").prop('disabled', false);
        } else {
            $("#fileToLoad").closest(".col-md-4").show();
            if ($("#fileToLoad").val().length > 1) $("#loadFile").prop('disabled', false);else $("#loadFile").prop('disabled', true);
        }
    });
    $("#fileToLoad").on("change", function () {
        $("#fileName").html($("#fileToLoad").val().replace("C:\\fakepath\\", ""));
        $("#loadFile").prop('disabled', false);
    });
    $('#myModal').modal('show');
});

function loadFileAsText() {
    $("#adjacency_matrix_table")[0].innerHTML = "";
    $("#intermediate_node_table")[0].innerHTML = "";
    if ($("#loadSample").is(":checked")) {
        d3.json('assets/tiny-network.json', function (error, data) {
            globalJSON = data;
        });
        $('#myModal').modal('hide');
    } else {
        var fileToLoad = document.getElementById("fileToLoad").files[0];
        var fileReader = new FileReader();
        fileReader.onload = function (fileLoadedEvent) {
            var textFromFileLoaded = JSON.parse(fileLoadedEvent.target.result);
            if (textFromFileLoaded.nodes.length < 1 || textFromFileLoaded.edges.length < 1) alert("Invalid File!");else {
                globalJSON = textFromFileLoaded;
                $('#myModal').modal('hide');
            }
        };
        fileReader.readAsText(fileToLoad, "UTF-8");
    }
}
//# sourceMappingURL=main.js.map
