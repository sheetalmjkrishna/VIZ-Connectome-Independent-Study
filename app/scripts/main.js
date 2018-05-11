let globalJSON = [];
let listOfFinalPaths = [];
let graph = [];


function main() {
    let createGraph = function(data) {
        let t0 = performance.now();
        graph = new Graph(data);
        $('.headers').show();
        let t1 = performance.now();
        //console.log('Created the graph in ' + (t1 - t0) + ' milliseconds.', graph);
        t0 = performance.now();
        let nodeConstraints = [];
        let edgeConstraints = [];
        for (let nodeType of $('input[id^=\'node\']')) {
            let type = $(nodeType).parent().find('input[name^=\'input-type\']:checked').val();
            if (type == 'regex')
                nodeConstraints.push(new RegExp($(nodeType).val() == '' ? '.*' : $(nodeType).val().replace(/ *, */g, '|')));
            else
                nodeConstraints.push($(nodeType).val().split(',').map(Number));
        }
        for (let edgeType of $('input[id^=\'edge\']')) {
            let type = $(edgeType).parent().find('input[name^=\'input-type\']:checked').val();
            if (type == 'regex')
                edgeConstraints.push(new RegExp($(edgeType).val() == '' ? '.*' : $(edgeType).val().replace(/ *, */g, '|')));
            else
                edgeConstraints.push($(edgeType).val().split(',').map(Number));
        }
        //let paths = graph.findPathsByRegex([new RegExp('CBb.*'), new RegExp('YAC Ai')], [new RegExp('.*')]);
        let paths = graph.findPathsByRegex(nodeConstraints, edgeConstraints);
        t1 = performance.now();
        //console.log('Found  ' + paths.length + ' paths in ' + (t1 - t0) + ' milliseconds.', paths)
        //console.log(paths);
        listOfFinalPaths = paths;
        /*let mungedData = mungePathDataOld(listOfFinalPaths);
        let am = new Adj_matrix(mungedData);
        am.draw();*/
        let mungedData = mungePathData(listOfFinalPaths, graph, nodeConstraints);
        let am = new Adjacency_matrix(mungedData, paths.length);
        am.draw();
    };
    createGraph(globalJSON);
}

function getIntermediateNodeData(paths) {
    var temp = {};
    for (let path of paths.paths) {
        for (let i = 1; i < path.nodes.length - 1; i++) {
            if (path.nodes[i].id in temp) {
                if (i in temp[path.nodes[i].id]) {
                    temp[path.nodes[i].id][i] += 1;
                    temp[path.nodes[i].id]['paths-' + i].push(path);
                } else {
                    temp[path.nodes[i].id][i] = 1;
                    temp[path.nodes[i].id]['paths-' + i] = [path];
                }
            } else {
                temp[path.nodes[i].id] = {};
                temp[path.nodes[i].id][i] = 1;
                temp[path.nodes[i].id]['paths-' + i] = [path];
            }
        }
    }
    return temp;
}

function getIntermediateNodeDataOld(data) {
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

function mungePathData(data, graph, nodeConstraints) {
    let mungedData = mungePathDataOld(data);
    let nestedPaths = mungedData.nestedPaths;
    let temp = {};
    let i = 0;
    temp['nodes'] = [];
    temp['links'] = [];
    temp['nestedPaths'] = [];
    let node_index = {};
    //get nodes that ssatisfy first node condition or last
    // for (let node of graph.nodes) {
    //    if (((nodeConstraints[0].length == null && node.label.match(nodeConstraints[0])) || (nodeConstraints[0].length != null && nodeConstraints[0].includes(node.id))) || ((nodeConstraints[nodeConstraints.length - 1].length == null && node.label.match(nodeConstraints[nodeConstraints.length - 1])) || (nodeConstraints[nodeConstraints.length - 1].length != null && nodeConstraints[nodeConstraints.length - 1].includes(node.id)))) {
    for (let node of mungedData.sortedStartTypes) {
        let x = {};
        x['name'] = node;
        if (!(node in node_index)) {
            temp.nodes.push(x);
            node_index[node] = i++;
        }
    }
    for (let node of mungedData.sortedEndTypes) {
        let x = {};
        x['name'] = node;
        if (!(node in node_index)) {
            temp.nodes.push(x);
            node_index[node] = i++;
        }
    }
    // }
    // }
    for (let path of data) {
        let y = {};
        y['source'] = node_index[path.nodes[0].label];
        y['target'] = node_index[path.nodes.slice(-1)[0].label];
        y['value'] = 1;
        temp.links.push(y);
    }
    temp.nestedPaths = nestedPaths;
    return {
        'data': temp,
        'node_index': node_index
    }
}

function mungePathDataOld(data) {
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
        'nestedPaths': temp,
        'sortedStartTypes': Object.keys(temp).sort(),
        'sortedEndTypes': tempLastNodesTypes.sort(),
        'maxCount': maxCount
    };
}
$(document).ready(function() {
    $('#hop-count').on('change', function() {
        $('#change-file').show();
        let hop_count = parseInt($('#hop-count').val());
        let filter_container = $('#filter-dropdowns');
        filter_container.html('');
        let i = 1;
        for (i = 1; i <= hop_count; i++) {
            let div = $('<div/>');
            div.append('<p/>').text('Node ' + i + ' Type: ');
            let label = $('<label/>').text('Regex');
            let radio = $('<input/>').attr({
                'name': 'input-type-node' + i,
                'value': 'regex',
                'type': 'radio',
                'checked': 'checked'
            });
            label.append(radio);
            div.append(label);

            label = $('<label/>').text('Ids');
            radio = $('<input/>').attr({
                'name': 'input-type-node' + i,
                'value': 'ids',
                'type': 'radio'
            });
            label.append(radio);
            div.append(label);

            let input = $('<input/>').attr({
                'id': 'node-' + i,
                'type': 'text',
                'class': 'form-control'
            });
            div.append(input);
            filter_container.append(div);
            div = $('<div/>');
            div.append('<p/>').text('Edge ' + i + ' Type: ');
            label = $('<label/>').text('Regex');
            radio = $('<input/>').attr({
                'name': 'input-type-edge' + i,
                'value': 'regex',
                'type': 'radio',
                'checked': 'checked'
            });
            label.append(radio);
            div.append(label);

            label = $('<label/>').text('Ids');
            radio = $('<input/>').attr({
                'name': 'input-type-edge' + i,
                'value': 'ids',
                'type': 'radio'
            });
            label.append(radio);
            div.append(label);
            input = $('<input/>').attr({
                'id': 'edge-' + i,
                'type': 'text',
                'class': 'form-control'
            });
            div.append(input);
            filter_container.append(div);
        }
        let div = $('<div/>');
        div.append('<p/>').text('Node ' + i + ' Type: ');
        let label = $('<label/>').text('Regex');
        let radio = $('<input/>').attr({
            'name': 'input-type-node' + i,
            'value': 'regex',
            'type': 'radio',
            'checked': 'checked'
        });
        label.append(radio);
        div.append(label);

        label = $('<label/>').text('Ids');
        radio = $('<input/>').attr({
            'name': 'input-type-node' + i,
            'value': 'ids',
            'type': 'radio'
        });
        label.append(radio);
        div.append(label);
        let input = $('<input/>').attr({
            'id': 'node-' + i,
            'type': 'text',
            'class': 'form-control'
        });
        div.append(input);
        filter_container.append(div);
        div = $('<div/>');
        button = $('<button/>').attr({
            'class': 'btn btn-default',
            'id': 'get-paths',
            'onclick': 'main()'
        }).text('Get Paths');
        div.append(button);

        let button = $('<button/>').attr({
            'class': 'btn btn-default',
            'id': 'save-state',
            'onclick': 'save_state()'
        }).text('Save State');
        div.append(button);
        filter_container.append(div);

        let hr = $('<hr>').attr('style', 'margin-top:80px; border-top: 1px solid #cccccc');
        let p = $('<p/>').text('Saved States').attr('style', 'text-align:-webkit-center; font-weight: bold;margin: 0px;');
        let itag = $('<p/>').text('(Click to restore)').attr('style', 'text-align:-webkit-center; font-style:italic;');
        let ol = $('<ol/>').attr('style', 'padding-left: 0px');
        for (let i = 1; i <= 5; i++) {
            let li = $('<li/>');
            let a = $('<a/>').text('State ' + i + ': ' + getCookie('state' + i).replace(/%%%/g, ', ')).attr('style', 'cursor: pointer; white-space: nowrap; width: 235px;overflow: hidden; text-overflow: ellipsis; display: block;');
            a.attr('title', getCookie('state' + i).replace(/%%%/g, ', '));
            a.attr('id', 'state' + i);
            a.click(function(event) {
                restoreState(event.target.id);
            });
            li.append(a);
            ol.append(li);
        }
        filter_container.append(hr);
        filter_container.append(p);
        filter_container.append(itag);
        filter_container.append(ol);
    });

});
$(window).on('load', function() {
    $('#loadFile').prop('disabled', true);
    $('#loadSample').on('change', function() {
        if ($(this).is(':checked')) {
            $('#fileToLoad').closest('.col-md-4').hide();
            $('#loadFile').prop('disabled', false);
        } else {
            $('#fileToLoad').closest('.col-md-4').show();
            if ($('#fileToLoad').val().length > 1)
                $('#loadFile').prop('disabled', false);
            else
                $('#loadFile').prop('disabled', true);
        }
    });
    $('#fileToLoad').on('change', function() {
        $('#fileName').html($('#fileToLoad').val().replace('C:\\fakepath\\', ''));
        $('#loadFile').prop('disabled', false);
    });
    $('#myModal').modal('show');
});

function restoreState(id) {
    let cookieVal = getCookie(id).split('%%%');
    //trigger hop count and prefill
    $('#hop-count').selectpicker('val', (cookieVal.length - 1) / 2);
    $('#hop-count').trigger('change');
    let fields = $('#filter-dropdowns .form-control');
    let i = 0;
    for (let field of fields) {
        $(field).val(cookieVal[i]);
        i++;
    }
}

function save_state() {
    let hop_count = parseInt($('#hop-count').val());
    let i = 1,
        state = getCookie('stateNum'),
        valString = '';
    //need to find out which state to save to
    if (state == '')
        state = 1;
    for (i = 1; i <= hop_count; i++) {
        valString += ($('#node-' + i).val() == '' ? '.*' : $('#node-' + i).val()) + '%%%';
        valString += ($('#edge-' + i).val() == '' ? '.*' : $('#edge-' + i).val()) + '%%%';
    }
    valString += ($('#node-' + i).val() == '' ? '.*' : $('#node-' + i).val());
    setCookie('state' + state, valString);
    $('#state' + state).text('State ' + state + ': ' + valString.replace(/%%%/g, ', '));
    $('#state' + state).attr('title', valString.replace(/%%%/g, ', '));
    setCookie('stateNum', (+state + 1) > 5 ? 1 : (+state + 1));
}

function loadFileAsText() {
    $('#adjacency_matrix')[0].innerHTML = '';
    $('#intermediate_node_table')[0].innerHTML = '';
    d3.select('#allPaths').node().innerHTML = '';
    d3.select('#adj_totPaths').node().innerHTML = '';
    d3.select('#int_totPaths').node().innerHTML = '';
    $('#nodeDataTable')[0].innerHTML = '';
    $('#nodeDataValidation')[0].innerHTML = '';
    $('.headers').hide();
    if ($('#loadSample').is(':checked')) {
        d3.json('assets/medium-network.json', function(error, data) {
            globalJSON = data;
        });
        $('#myModal').modal('hide');
    } else {
        let fileToLoad = document.getElementById('fileToLoad').files[0];
        let fileReader = new FileReader();
        fileReader.onload = function(fileLoadedEvent) {
            let textFromFileLoaded = JSON.parse(fileLoadedEvent.target.result);
            if (textFromFileLoaded.nodes.length < 1 || textFromFileLoaded.edges.length < 1)
                alert('Invalid File!');
            else {
                globalJSON = textFromFileLoaded;
                $('#myModal').modal('hide');
            }

        };
        fileReader.readAsText(fileToLoad, 'UTF-8');
    }
}

function setCookie(cname, cvalue) {
    var d = new Date();
    d.setTime(d.getTime() + (30 * 2 * 60 * 60 * 1000));
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}

function getCookie(cname) {
    var name = cname + '=';
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return '';
}

function deleteCookie(cname) {
    var d = new Date();
    d.setTime(d.getTime());
    var expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '= ;' + expires + ';path=/';
}

function minMax(d) {
    if ($(d).attr('data-attr') == 'max') {
        $(d).attr('data-attr', 'min');
        $(d).parent().addClass('minimized');
        $(d).find('span')[0].innerHTML = '&#751;';
    } else {
        $(d).attr('data-attr', 'max');
        $(d).parent().removeClass('minimized');
        $(d).find('span')[0].innerHTML = '&#752;';
    }
}

function getNodeData() {
    let nodeIds = $('#nodeData').val().trim().split(',');
    let table = $('#nodeDataTable');
    let validation = $('#nodeDataValidation');
    let flag = 0;
    table[0].innerHTML = '';
    validation[0].innerHTML = '';
    let tr1 = $('<tr/>');
    let th = $('<th/>').text('Node');
    tr1.append(th[0]);
    th = $('<th/>').text('Incoming Edge(s)');
    tr1.append(th[0]);
    th = $('<th/>').text('From');
    tr1.append(th[0]);
    th = $('<th/>').text('Outgoing Edge(s)');
    tr1.append(th[0]);
    th = $('<th/>').text('To');
    tr1.append(th[0]);
    table.append(tr1[0]);
    for (let id of nodeIds) {
        if (isNaN(id)) {
            validation[0].innerHTML = ('Please enter \',\' seperated numbers!');
            table[0].innerHTML = '';
            break;
        }
        let nodeIndex = graph.nodeIdToIndexes[id];
        if (nodeIndex == null) {
            if (!flag) {
                validation[0].innerHTML += ('Invalid Id(s): ' + id);
                flag = 1;
            } else
                validation[0].innerHTML += (', ' + id);
            continue;
        }

        let outEdges = graph.nodeOutEdgeIndexes[nodeIndex];
        let inEdges = graph.nodeInEdgeIndexes[nodeIndex];

        let tr = $('<tr/>');
        let td = $('<td/>').text(id + ' (' + graph.nodes[nodeIndex].label + ')');
        tr.append(td[0]);
        let td1 = $('<td/>'),
            td2 = $('<td/>');
        let text1 = '',
            text2 = '';
        for (let inEdge of inEdges) {
            text1 += (Math.abs(graph.edges[inEdge].id) + ' <span class=\'grey\'>(' + graph.edges[inEdge].type + ')</span>' + ' <br/>');
            text2 += (Math.abs(graph.edges[inEdge].sourceId) + ' <span class=\'grey\'> (' + graph.nodes[graph.nodeIdToIndexes[graph.edges[inEdge].sourceId]].label + ')</span>' + ' <br/>')
        }
        td1[0].innerHTML = (text1);
        td2[0].innerHTML = (text2);
        tr.append(td1[0]);
        tr.append(td2[0]);

        td1 = $('<td/>'), td2 = $('<td/>');
        text1 = '', text2 = '';
        for (let outEdge of outEdges) {
            text1 += (Math.abs(graph.edges[outEdge].id) + ' <span class=\'grey\'> (' + graph.edges[outEdge].type + ')</span>' + ' <br/>');
            text2 += (Math.abs(graph.edges[outEdge].targetId) + ' <span class=\'grey\'> (' + graph.nodes[graph.nodeIdToIndexes[graph.edges[outEdge].targetId]].label + ')</span>' + ' <br/>')
        }
        td1[0].innerHTML = (text1);
        td2[0].innerHTML = (text2);
        tr.append(td1[0]);
        tr.append(td2[0]);
        table.append(tr[0]);
    }
}