let globalJSON = [];
let listOfFinalPaths = [];

function main() {
    let createGraph = function(data) {
        let t0 = performance.now();
        let graph = new Graph(data);
        let t1 = performance.now();
        console.log('Created the graph in ' + (t1 - t0) + ' milliseconds.', graph);
        t0 = performance.now();
        let nodeConstraints = [];
        let edgeConstraints = [];
        for (let nodeType of $("input[id^='node']")) {
            let type = $(nodeType).parent().find("input[name^='input-type']:checked").val();
            if (type == "regex")
                nodeConstraints.push(new RegExp($(nodeType).val() == "" ? ".*" : $(nodeType).val().replace(/ *, */g, '|')));
            else
                nodeConstraints.push($(nodeType).val().split(',').map(Number));
        }
        for (let edgeType of $("input[id^='edge']")) {
            let type = $(edgeType).parent().find("input[name^='input-type']:checked").val();
            if (type == "regex")
                edgeConstraints.push(new RegExp($(edgeType).val() == "" ? ".*" : $(edgeType).val().replace(/ *, */g, '|')));
            else
                edgeConstraints.push($(edgeType).val().split(',').map(Number));
        }
        //let paths = graph.findPathsByRegex([new RegExp('CBb.*'), new RegExp('YAC Ai')], [new RegExp('.*')]);
        let paths = graph.findPathsByRegex(nodeConstraints, edgeConstraints);
        t1 = performance.now();
        console.log('Found  ' + paths.length + ' paths in ' + (t1 - t0) + ' milliseconds.', paths)
        listOfFinalPaths = paths;
        let mungedData = mungePathData(listOfFinalPaths);
        let am = new Adjacency_matrix(mungedData);
        am.draw();
    };
    createGraph(globalJSON);
}

function getIntermediateNodeData(data) {
    var temp = {};
    for (let path of data.paths) {
        for (let i = 1; i < path.nodes.length - 1; i++) {
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
    return temp;
}

function mungePathData(data) {
    let temp = {};
    let maxCount = 0;
    let tempLastNodesTypes = [];
    for (let path of listOfFinalPaths) {
        if (path.nodes[0].label in temp) { //source type exists
            if (path.nodes.slice(-1)[0].label in temp[path.nodes[0].label]) { //dest type exists
                temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].paths.push(path);
                temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count = temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].paths.length;
                maxCount = temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count > maxCount ? temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count : maxCount;
            } else { //source type exists  but not dest type
                if (!tempLastNodesTypes.includes(path.nodes.slice(-1)[0].label))
                    tempLastNodesTypes.push(path.nodes.slice(-1)[0].label);
                temp[path.nodes[0].label][path.nodes.slice(-1)[0].label] = {};
                temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].paths = [path];
                temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count = 1;
                maxCount = temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count > maxCount ? temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count : maxCount;
            }
        } else { //source type doesn't exist
            if (!tempLastNodesTypes.includes(path.nodes.slice(-1)[0].label))
                tempLastNodesTypes.push(path.nodes.slice(-1)[0].label);
            temp[path.nodes[0].label] = {};
            temp[path.nodes[0].label][path.nodes.slice(-1)[0].label] = {};
            temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].paths = [path];
            temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count = 1;
            maxCount = temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count > maxCount ? temp[path.nodes[0].label][path.nodes.slice(-1)[0].label].count : maxCount;
        }
    }
    return {
        "nestedPaths": temp,
        "sortedStartTypes": Object.keys(temp).sort(),
        "sortedEndTypes": tempLastNodesTypes.sort(),
        "maxCount": maxCount
    };
}
$(document).ready(function() {
    $("#hop-count").on("change", function() {
        $("#change-file").show();
        let hop_count = parseInt($("#hop-count").val());
        let filter_container = $("#filter-dropdowns");
        filter_container.html("");
        let i = 1;
        for (i = 1; i <= hop_count; i++) {
            let div = $("<div/>");
            div.append("<p/>").text("Node " + i + " Type: ");
            let label = $("<label/>").text("Regex");
            let radio = $("<input/>").attr({
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

            let input = $("<input/>").attr({
                "id": "node-" + i,
                "type": "text",
                "class": "form-control"
            });
            div.append(input);
            filter_container.append(div);
            div = $("<div/>");
            div.append("<p/>").text("Edge " + i + " Type: ");
            label = $("<label/>").text("Regex");
            radio = $("<input/>").attr({
                "name": "input-type-edge" + i,
                "value": "regex",
                "type": "radio",
                "checked": "checked"
            });
            label.append(radio);
            div.append(label);

            label = $("<label/>").text("Ids");
            radio = $("<input/>").attr({
                "name": "input-type-edge" + i,
                "value": "ids",
                "type": "radio"
            });
            label.append(radio);
            div.append(label);
            input = $("<input/>").attr({
                "id": "edge-" + i,
                "type": "text",
                "class": "form-control"
            });
            div.append(input);
            filter_container.append(div);
        }
        let div = $("<div/>");
        div.append("<p/>").text("Node " + i + " Type: ");
        let label = $("<label/>").text("Regex");
        let radio = $("<input/>").attr({
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
        let input = $("<input/>").attr({
            "id": "node-" + i,
            "type": "text",
            "class": "form-control"
        });
        div.append(input);
        filter_container.append(div);
        div = $("<div/>");
        let button = $("<button/>").attr({
            "class": "btn btn-default",
            "id": "get-paths",
            "onclick": "main()"
        }).text("Get Paths");
        div.append(button);
        filter_container.append(div);
    });
});
$(window).on('load', function() {
    $("#loadFile").prop('disabled', true);
    $("#loadSample").on("change", function() {
        if ($(this).is(":checked")) {
            $("#fileToLoad").closest(".col-md-4").hide();
            $("#loadFile").prop('disabled', false);
        } else {
            $("#fileToLoad").closest(".col-md-4").show();
            if ($("#fileToLoad").val().length > 1)
                $("#loadFile").prop('disabled', false);
            else
                $("#loadFile").prop('disabled', true);
        }
    });
    $("#fileToLoad").on("change", function() {
        $("#fileName").html($("#fileToLoad").val().replace("C:\\fakepath\\", ""));
        $("#loadFile").prop('disabled', false);
    });
    $('#myModal').modal('show');
});

function loadFileAsText() {
    $("#adjacency_matrix_table")[0].innerHTML = "";
    $("#intermediate_node_table")[0].innerHTML = "";
    if ($("#loadSample").is(":checked")) {
        d3.json('assets/tiny-network.json', function(error, data) {
            globalJSON = data;
        });
        $('#myModal').modal('hide');
    } else {
        let fileToLoad = document.getElementById("fileToLoad").files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            let textFromFileLoaded = JSON.parse(fileLoadedEvent.target.result);
            if (textFromFileLoaded.nodes.length < 1 || textFromFileLoaded.edges.length < 1)
                alert("Invalid File!");
            else {
                globalJSON = textFromFileLoaded;
                $('#myModal').modal('hide');
            }

        };
        fileReader.readAsText(fileToLoad, "UTF-8");
    }
}