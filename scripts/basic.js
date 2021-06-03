var savedGraphs = [];
var savedGraphColor = undefined;
var isDeleted = [false, false, false, false, false, false, false, false, false, false];
var dragging = [false, false];

//When the page first loads.
$(document).ready(function () {
    for (var i = 0; i < 10; i++) {
        
        savedGraphs.push(undefined);
        
    }
    savedGraphColor = "#524636";
});

//Runs when the user drags from SAVE GRAPH onto a space on the right
function saveGraph(saveNum, graphNum, swap) {
    if (graphNum == 1 && graph1 == undefined)   //just in case there's a bug and the save button appears when no graph is present
        return;
    else if (graphNum == 2 && graph2 == undefined)
        return;

    var g = savedGraphs[saveNum - 1];
    if (g != null)
        g.destroy();    //deletes graph currently in the destined saved area
    savedGraphs[saveNum - 1] = undefined;
    //clear tooltip
    var tip = document.getElementById("tip" + saveNum);
    tip.style.display = "none";
    tip.style.backgroundColor = "transparent";
    tip.innerHTML = "";

    //temporarily store current graph values
    var tempGraph = undefined;
    if (graphNum == 1)
        tempGraph = graph1;
    else
        tempGraph = graph2;
    var labelsArr = tempGraph.config.data.labels;
    var dataArr = tempGraph.config.data.datasets[0].data;
    var hoverText = tempGraph.description;
    var db = tempGraph.DB;
    var x = tempGraph.X;
    var y = tempGraph.Y;
    var lowDate = tempGraph.lowDate;
    var highDate = tempGraph.highDate;
    var minDate = tempGraph.minDate;
    var maxDate = tempGraph.maxDate;
    var graph_type = tempGraph.type;
    var color = tempGraph.color;

    //check if current graph is already saved somewhere
    for (var i = 0; i < savedGraphs.length; i++) {
        if (savedGraphs[i] != undefined && hoverText == savedGraphs[i].description) {
            if (!swap) {
                dragging[i] = false;
                alert("Graph " + graphNum + " is already saved at box #" + (i + 1));
            }
            document.getElementById("exit" + saveNum).style.visibility = "hidden";
            document.getElementById("swap" + saveNum).style.visibility = "hidden";
            return;
        }
    }

    //graph current data into saved region
    var canvas = document.getElementById("saved" + saveNum);
    canvas = canvas.getContext("2d");
    var g = new Chart(canvas, {
        type: graph_type,
        options: {
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false
                }],
            },
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            tooltips: false,
            animation: {
                duration: 0
            }
        },
        data: {
            labels: labelsArr,
            datasets: [{
                data: dataArr,
                backgroundColor: savedGraphColor,
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        }
    });
    g.description = hoverText;  //settings these values makes it easy to bring the graph back to the regular view later
    g.DB = db;
    g.X = x;
    g.Y = y;
    g.lowDate = lowDate;
    g.highDate = highDate;
    g.minDate = minDate;
    g.maxDate = maxDate;
    g.type = graph_type;
    g.color = color;
    savedGraphs[saveNum - 1] = g;

    //update tooltip text and make it hidden
    var tip = document.getElementById("tip" + saveNum);
    tip.style.display = "block";
    tip.style.backgroundColor = "#0000005c";
    hoverText = hoverText.replace(/\n( *)/g, function (match, p1) {
        return '<br>' + '&nbsp;'.repeat(p1.length);
    });
    tip.innerHTML = hoverText;
    tip.style.visibility = "hidden";

    //display x and swap buttons next to saved region
    document.getElementById("exit" + saveNum).style.visibility = "visible";
    document.getElementById("swap" + saveNum).style.visibility = "visible";
}

//Transfers a saved graph to one of the main graphs,
//Saves the main graph in the saved spot
function swap(savedNum, graphNum) {
    var savedGraph = savedGraphs[savedNum - 1];
    var savedDB = savedGraph.DB;
    var savedX = savedGraph.X;
    var savedY = savedGraph.Y;
    var savedLowDate = savedGraph.lowDate;
    var savedHighDate = savedGraph.highDate;
    var savedMinDate = savedGraph.minDate;
    var savedMaxDate = savedGraph.maxDate;
    var savedType = savedGraph.type;
    var savedColor = savedGraph.color;

    saveGraph(savedNum, graphNum, false);

    //update menus on the left side and graph data
    setOptions(savedDB, savedY, savedX, savedType, savedLowDate, savedHighDate, savedMinDate, savedMaxDate, graphNum, savedColor, true);
}

//Relocates a saved graph to another spot
//Swaps if both saved spots have graphs
function relocate(prevSave, nextSave) {
    if (prevSave == nextSave) return;

    if (savedGraphs[nextSave - 1] == undefined || savedGraphs[nextSave - 1] == null) {  //move graph to an empty slot
        //temporarily store data
        var prevSavedGraph = savedGraphs[prevSave - 1];
        var prevLabelsArr = prevSavedGraph.config.data.labels;
        var prevDataArr = prevSavedGraph.config.data.datasets[0].data;
        var prevHoverText = prevSavedGraph.description;
        var prevDB = prevSavedGraph.DB;
        var prevX = prevSavedGraph.X;
        var prevY = prevSavedGraph.Y;
        var prevLowDate = prevSavedGraph.lowDate;
        var prevHighDate = prevSavedGraph.highDate;
        var prevMinDate = prevSavedGraph.minDate;
        var prevMaxDate = prevSavedGraph.maxDate;
        var prevGraphType = prevSavedGraph.type;
        var prevColor = prevSavedGraph.color;

        //clear tooltip
        var tip = document.getElementById("tip" + prevSave);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";

        deleteGraph(prevSave);

        //graph data in new region
        var canvas = document.getElementById("saved" + nextSave);
        canvas = canvas.getContext("2d");
        var g = new Chart(canvas, {
            type: prevGraphType,
            options: {
                scales: {
                    xAxes: [{ display: false }],
                    yAxes: [{ display: false }],
                },
                legend: { display: false },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: false,
                animation: { duration: 0 }
            },
            data: {
                labels: prevLabelsArr,
                datasets: [{
                    data: prevDataArr,
                    backgroundColor: savedGraphColor,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            }
        });
        g.description = prevHoverText;  //resetting these values
        g.DB = prevDB;
        g.X = prevX;
        g.Y = prevY;
        g.lowDate = prevLowDate;
        g.highDate = prevHighDate;
        g.minDate = prevMinDate;
        g.maxDate = prevMaxDate;
        g.type = prevGraphType;
        g.color = prevColor;
        savedGraphs[nextSave - 1] = g;

        //update tooltip text and make it hidden
        tip = document.getElementById("tip" + nextSave);
        tip.style.display = "block";
        tip.style.backgroundColor = "#0000005c";
        prevHoverText = prevHoverText.replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
        tip.innerHTML = prevHoverText;
        tip.style.visibility = "hidden";

        //display x and swap buttons next to saved region
        document.getElementById("exit" + nextSave).style.visibility = "visible";
        document.getElementById("swap" + nextSave).style.visibility = "visible";
    }
    else {  //swap saved graphs, as opposed to just moving one to an empty slot
        //temporarily store data
        var savedGraph1 = savedGraphs[prevSave - 1];
        var labelsArr1 = savedGraph1.config.data.labels;
        var dataArr1 = savedGraph1.config.data.datasets[0].data;
        var hoverText1 = savedGraph1.description;
        var db1 = savedGraph1.DB;
        var x1 = savedGraph1.X;
        var y1 = savedGraph1.Y;
        var lowDate1 = savedGraph1.lowDate;
        var highDate1 = savedGraph1.highDate;
        var minDate1 = savedGraph1.minDate;
        var maxDate1 = savedGraph1.maxDate;
        var graphType1 = savedGraph1.type;
        var color1 = savedGraph1.color;

        //clear tooltip
        var tip = document.getElementById("tip" + prevSave);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";

        deleteGraph(prevSave);

        //temporarily store data
        var savedGraph2 = savedGraphs[nextSave - 1];
        var labelsArr2 = savedGraph2.config.data.labels;
        var dataArr2 = savedGraph2.config.data.datasets[0].data;
        var hoverText2 = savedGraph2.description;
        var db2 = savedGraph2.DB;
        var x2 = savedGraph2.X;
        var y2 = savedGraph2.Y;
        var lowDate2 = savedGraph2.lowDate;
        var highDate2 = savedGraph2.highDate;
        var minDate2 = savedGraph2.minDate;
        var maxDate2 = savedGraph2.maxDate;
        var graphType2 = savedGraph2.type;
        var color2 = savedGraph2.color;

        //clear tooltip
        tip = document.getElementById("tip" + nextSave);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";

        deleteGraph(nextSave);

        //graph data in new region
        var canvas1 = document.getElementById("saved" + nextSave);
        canvas1 = canvas1.getContext("2d");
        var g1 = new Chart(canvas1, {
            type: graphType1,
            options: {
                scales: {
                    xAxes: [{ display: false }],
                    yAxes: [{ display: false }],
                },
                legend: { display: false },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: false,
                animation: { duration: 0 }
            },
            data: {
                labels: labelsArr1,
                datasets: [{
                    data: dataArr1,
                    backgroundColor: savedGraphColor,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            }
        });
        g1.description = hoverText1;    //resetting these values
        g1.DB = db1;
        g1.X = x1;
        g1.Y = y1;
        g1.lowDate = lowDate1;
        g1.highDate = highDate1;
        g1.minDate = minDate1;
        g1.maxDate = maxDate1;
        g1.type = graphType1;
        g1.color = color1;
        savedGraphs[nextSave - 1] = g1;

        //update tooltip text and make it hidden
        tip = document.getElementById("tip" + nextSave);
        tip.style.display = "block";
        tip.style.backgroundColor = "#0000005c";
        hoverText1 = hoverText1.replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
        tip.innerHTML = hoverText1;
        tip.style.visibility = "hidden";

        //display x and swap buttons next to saved region
        document.getElementById("exit" + nextSave).style.visibility = "visible";
        document.getElementById("swap" + nextSave).style.visibility = "visible";

        //graph data in new region
        var canvas2 = document.getElementById("saved" + prevSave);
        canvas2 = canvas2.getContext("2d");
        var g2 = new Chart(canvas2, {
            type: graphType2,
            options: {
                scales: {
                    xAxes: [{ display: false }],
                    yAxes: [{ display: false }],
                },
                legend: { display: false },
                responsive: true,
                maintainAspectRatio: false,
                tooltips: false,
                animation: { duration: 0 }
            },
            data: {
                labels: labelsArr2,
                datasets: [{
                    data: dataArr2,
                    backgroundColor: savedGraphColor,
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            }
        });
        g2.description = hoverText2;    //resetting these values
        g2.DB = db2;
        g2.X = x2;
        g2.Y = y2;
        g2.lowDate = lowDate2;
        g2.highDate = highDate2;
        g2.minDate = minDate2;
        g2.maxDate = maxDate2;
        g2.type = graphType2;
        g2.color = color2;
        savedGraphs[prevSave - 1] = g2;

        //update tooltip text and make it hidden
        tip = document.getElementById("tip" + prevSave);
        tip.style.display = "block";
        tip.style.backgroundColor = "#0000005c";
        hoverText2 = hoverText2.replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
        tip.innerHTML = hoverText2;
        tip.style.visibility = "hidden";

        //display x and swap buttons next to saved region
        document.getElementById("exit" + prevSave).style.visibility = "visible";
        document.getElementById("swap" + prevSave).style.visibility = "visible";
    }
}
//changes bool to true if we are deleting the saved graph
function changeBool(num) {
    isDeleted[num - 1] = true;
}
//Removes a graph from the saved section
//Runs when the user clicks the x next to a saved region
function deleteGraph(savedNum) {
    var g = savedGraphs[savedNum - 1];
    g.destroy();    //deletes graph
    savedGraphs[savedNum - 1] = undefined;

    //clears tooltip
    var tip = document.getElementById("tip" + savedNum);
    tip.style.display = "none";
    tip.style.backgroundColor = "transparent";
    tip.innerHTML = "";
    tip.style.visibility = "hidden";

    //clears exit and swap buttons
    document.getElementById("exit" + savedNum).style.visibility = "hidden";
    document.getElementById("swap" + savedNum).style.visibility = "hidden";
    isDeleted[savedNum - 1] = false;
    sendData(-1, -100);//second param is a dummy val
}

//Shows tooltip over saved graph
//Runs when the user clicks a saved graph
function showToolTip(savedNum) {
    //alert("in show tool tip");
    var tip = document.getElementById("tip" + savedNum);
    if (isDeleted[savedNum - 1]) {
        deleteGraph(savedNum);
        return;
    }
    if (tip.style.visibility != "visible") {//hidden turn visible
        tip.style.visibility = "visible";
        //var scriptSeen = 1;
        sendData(0, savedNum);
        //console.log("data sent - shown tool tip");
    }
    else
        tip.style.visibility = "hidden";
}

//set to false wheter it makes its destination or not
function dropEnd() {
    setTimeout(function () {
        dragging[0] = false;
        dragging[1] = false;
    }, 5);

}

//if graph makes the destination, we sendData, set to false
function droppedDest() {
    window.setTimeout(function () {
        if (dragging[0] == true) {
            sendData(1, "saved");
            dragging[0] = false;
        }
        else if (dragging[1] == true) {
            sendData(2, "saved");
            dragging[1] = false;
        }
    }, 10);
}

function dragstart(graphNum) {
    dragging[graphNum - 1] = true;
}
//Runs when dragging to save a graph into a saved region
//It's mostly syntax
function drag(ev, graph) {
    ev.dataTransfer.setData("text", graph);
}

//Runs when dropping a graph over a saved region
function drop(ev, destination) {
    ev.preventDefault();

    var data = ev.dataTransfer.getData("text");
    if (data.startsWith("graph")) { //drag from regular view
        //if (destination.startsWith("graph")) {  //drag from regular view to regular view
        //do nothing
        //}
        //else 
        if (destination.startsWith("saved")) { //drag from regular view to saved region
            var graphNum = data.substring(5);
            var saveNum = destination.substring(5);
            if (savedGraphs[saveNum - 1] == undefined || savedGraphs[saveNum - 1] == null) { //second saved region is empty
                saveGraph(saveNum, graphNum, false);

//                sendData(destination, 0);

                //sendData(destination, 0);

                //alert(destination);
            }
            else    //second saved region has a graph already
                swap(saveNum, graphNum);
        }
    }
    else if (data.startsWith("saved")) {    //drag from saved region
        if (destination.startsWith("graph")) {  //drag from saved region to regular view
            var graphNum = destination.substring(5);
            var saveNum = data.substring(5);
            swap(saveNum, graphNum);
            if ((graphNum == 1 && graph1 == undefined) || (graphNum == 2 && graph2 == undefined))   //if regular view originally was empty
                deleteGraph(saveNum);
        }
        else if (destination.startsWith("saved")) { //drag from saved region to another saved region
            var prevSave = data.substring(5);
            var nextSave = destination.substring(5);
            relocate(prevSave, nextSave);   //relocate() already accounts for if the destination saved region is empty/occupied
        }
    }
}

//Allows drops to occur
//It's mostly syntax
function allowDrop(ev) {
    ev.preventDefault();
}

//Changes site color theme
//Defined here and in scripting.js because each page
//has elements that don't exist in the other, and it's
//easier to just have them separate for now.
function changeColorTheme(element) {
    if (element.checked) {  //dark theme chosen
        //change color for graph text
        Chart.defaults.global.defaultFontColor = "white";

        //redraw graphs 1 and 2
        regraph(1);
        regraph(2);

        //changes the color of the saved graphs
        savedGraphColor = "white";
        for (var i = 1; i <= 10; i++) {
            resave(i);
        }

        //switch logo
        document.getElementsByClassName("logo")[0].src = "img/HistoryInDatalogodark.png";

        //change background color
        document.getElementsByTagName("BODY")[0].style.backgroundColor = "#413f3d";

        //change font color of column 1
        document.getElementsByClassName("col1")[0].style.color = "white";

        //change color of rows in column 1
        document.getElementsByClassName("row")[0].style.backgroundColor = "#263859";
        document.getElementsByClassName("row")[1].style.backgroundColor = "#263859";

        //change color of dropdown menus
        var x = document.getElementsByClassName("select");
        for (var y = 0; y < x.length; y++) {
            x[y].style.backgroundColor = "black";
            x[y].style.color = "white";
        }

        //change color and font color of column 2
        x = document.getElementsByClassName("col2")[0];
        x.style.backgroundColor = "#525252";
        x.style.color = "white";

        //change color and font color of column 3
        x = document.getElementsByClassName("col3")[0];
        x.style.backgroundColor = "#160f30";
        x.style.color = "white";

        //change color of saved region boxes
        x = document.getElementsByClassName("tile");
        for (var y = 0; y < x.length; y++) {
            x[y].style.border = "1px solid white";
        }

        //change color of delete buttons for saved graphs
        x = document.getElementsByClassName("exit");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "white";
        }

        //change color of swap buttons for saved graphs
        x = document.getElementsByClassName("swap");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "white";
        }

        //change color and font color of modal
        x = document.getElementsByClassName("modal-content")[0];
        x.style.backgroundColor = "#555555";
        x.style.color = "white";

        //change color of legends
        x = document.getElementsByTagName("legend");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "white";
        }
    }
    else {  //light theme chosen
        //change color for graph text
        Chart.defaults.global.defaultFontColor = "#524636";

        //redraw graphs 1 and 2
        regraph(1);
        regraph(2);

        //changes the color of the saved graphs
        savedGraphColor = "#524636";
        for (var i = 1; i <= 10; i++) {
            resave(i);
        }

        //switch logo
        var x = document.getElementsByClassName("logo")[0];
        x.src = "img/HistoryInDatalogolight.png";

        //change background color
        document.getElementsByTagName("BODY")[0].style.backgroundColor = "#c2edce";

        //change font color of column 1
        document.getElementsByClassName("col1")[0].style.color = "#524636";

        //change color of rows in column 1
        document.getElementsByClassName("row")[0].style.backgroundColor = "#92bbbd";
        document.getElementsByClassName("row")[1].style.backgroundColor = "#92bbbd";

        //change color of dropdown menus
        var x = document.getElementsByClassName("select");
        for (var y = 0; y < x.length; y++) {
            x[y].style.backgroundColor = "white";
            x[y].style.color = "black";
        }

        //change color and font color of column 2
        x = document.getElementsByClassName("col2")[0];
        x.style.backgroundColor = "#f6f6f2";
        x.style.color = "#524636";

        //change color and font color of column 3
        x = document.getElementsByClassName("col3")[0];
        x.style.backgroundColor = "#66aedb";
        x.style.color = "524636";

        //change color of saved region boxes
        x = document.getElementsByClassName("tile");
        for (var y = 0; y < x.length; y++) {
            x[y].style.border = "1px solid #524636";
        }

        //change color of delete buttons for saved graphs
        x = document.getElementsByClassName("exit");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "#524636";
        }

        //change color of swap buttons for saved graphs
        x = document.getElementsByClassName("swap");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "#524636";
        }

        //change color and font color of modal
        x = document.getElementsByClassName("modal-content")[0];
        x.style.backgroundColor = "white";
        x.style.color = "black";

        //change color of legends
        x = document.getElementsByTagName("legend");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "black";
        }
    }
}

//Redraws a graph in the saved region
//This is used when the color theme of the page changes
//and there are existing saved graphs. Resaves are
//necessary to change the graph colors.
function resave(saveNum) {
    //deletes current graph if it exists, and will regraph below
    var savedGraph = savedGraphs[saveNum - 1];
    if (savedGraph == undefined)
        return;
    else if (savedGraph != null)
        savedGraph.destroy();
    savedGraph[saveNum - 1] = undefined;

    //temporarily store values
    var labelsArr = savedGraph.config.data.labels;
    var dataArr = savedGraph.config.data.datasets[0].data;
    var hoverText = savedGraph.description;
    var db = savedGraph.DB;
    var x = savedGraph.X;
    var y = savedGraph.Y;
    var lowDate = savedGraph.lowDate;
    var highDate = savedGraph.highDate;
    var minDate = savedGraph.minDate;
    var maxDate = savedGraph.maxDate;
    var graph_type = savedGraph.type;
    var color = savedGraph.color;

    //graph data in the same saved area
    var canvas = document.getElementById("saved" + saveNum);
    canvas = canvas.getContext("2d");
    var g = new Chart(canvas, {
        type: graph_type,
        options: {
            scales: {
                xAxes: [{
                    display: false
                }],
                yAxes: [{
                    display: false
                }],
            },
            legend: {
                display: false
            },
            responsive: true,
            maintainAspectRatio: false,
            tooltips: false,
            animation: {
                duration: 0
            }
        },
        data: {
            labels: labelsArr,
            datasets: [{
                data: dataArr,
                backgroundColor: savedGraphColor,
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        }
    });
    g.description = hoverText;  //resetting the values
    g.DB = db;
    g.X = x;
    g.Y = y;
    g.lowDate = lowDate;
    g.highDate = highDate;
    g.minDate = minDate;
    g.maxDate = maxDate;
    g.type = graph_type;
    g.color = color;
    savedGraphs[saveNum - 1] = g;

    //hide tooltip
    document.getElementById("tip" + saveNum).style.visibility = "hidden";

    //display exit and swap buttons for saved region
    document.getElementById("exit" + saveNum).style.visibility = "visible";
    document.getElementById("swap" + saveNum).style.visibility = "visible";
}

//Exports current graph into new page
//This runs when the export button is clicked
function exportGraph(n) {
    var tempGraph = undefined;
    if (n == 1) {
        tempGraph = graph1;
        sendData(1, "export");
    }
    else if (n == 2) {
        tempGraph = graph2;
        sendData(2, "export");
    }

    sessionStorage.setItem("labelsArr", tempGraph.config.data.labels);
    sessionStorage.setItem("dataArr", tempGraph.config.data.datasets[0].data);
    sessionStorage.setItem("db", tempGraph.DB);
    sessionStorage.setItem("x", tempGraph.X);
    sessionStorage.setItem("y", tempGraph.Y);
    sessionStorage.setItem("lowDate", tempGraph.lowDate);
    sessionStorage.setItem("highDate", tempGraph.highDate);
    sessionStorage.setItem("minDate", tempGraph.minDate);
    sessionStorage.setItem("maxDate", tempGraph.maxDate);
    sessionStorage.setItem("graph_type", tempGraph.type);
    sessionStorage.setItem("color", tempGraph.color);

    window.open("/export.html", "_blank");
}

function exportNotes() {
    var txt = document.getElementById('notes').value;
    txt = txt.replace(/\r?\n/g, '<br />');
    sessionStorage.setItem("notesarea", txt);
    window.open("/notes.html", "_blank");
}

function addNotes(element) {
    var x = document.getElementById("myNotes");
    var a = document.getElementById("hide1");
    var b = document.getElementById("hide2");
    var c = document.getElementById("hide3");
    var d = document.getElementById("hide4");

    if (element.checked) {
        x.style.display = "block";
        a.style.display = "none"
        b.style.display = "none"
        c.style.display = "none"
        d.style.display = "none"
    } else {
        x.style.display = "none";
        a.style.display = "block";
        b.style.display = "block"
        c.style.display = "block"
        d.style.display = "block"
    }
}

function addDrivingQuestion() {
    var input = document.getElementById('textinput')
    var div = document.getElementById('textEntered');
    div.innerHTML = input.value;
    suggestDatabases(input.value);
}

function addDrivingQuestion2() {
    var input = document.getElementById('textinput2')
    var div = document.getElementById('textEntered');
    div.innerHTML = input.value;
    suggestDatabases(input.value);
}

//finds the most relevant databases to return
function suggestDatabases(query){
    
    var suggestedMenu = document.getElementById("suggestedDBs");
    
    suggestedMenu.innerHTML = '';

    //cleaned Query will become a list of words in the query
    var cleanedQuery = parseAndClean(query);
    
    //database_dict is defined in common.js, it contains the default databases
    
    //keyword_dict is defined at the end of this file, it contains the keyword mappings for the databases
    
    //holds the scores of different databases
    var databaseScores = {
        
        
          'Populations':0,
          'Population Female Percentage':0,
          'Population Female Percentage at Birth':0,
          'Life Expectancy - Continents':0,
          'Median Age':0,
          'Births':0,
          'Births Per Woman':0,
          'Births Per 1000 People':0,
          'Child Deaths':0,
          'Child Mortality Rates':0,
          'Survival Rate to Age 65 - Male':0,
          'Survival Rate to Age 65 - Female':0,
        
       
          'Military Personnel':0,
          'Military Personnel Percent of Population':0,
          'Military Spending':0,
          'Military Spending Percent of GDP':0,
          'Military Spending in thousands of US dollars':0,
       
        'GDP':0,
            'GDP Per Capita':0,
            'Economic Freedom Scores':0,
                    
          
        
          'CO2 Emissions':0,
          'CO2 Emissions Per Capita':0,
          'CO2 Emissions Percentages':0,
          'CO2 Emissions Cumulative':0,
          'CO2 Emissions Cumulative Percentages':0,
        
    };
    

    
    
    //go through the cleaned query and assign each database a score based on keywords
    for(var word in cleanedQuery){

        for(var key in keyword_dict){

            for(var i = 0; i < keyword_dict[key].length; i++){

                if(cleanedQuery[word] == keyword_dict[key][i]){

                    databaseScores[key]++;
                    
                }
                
            }

        }

    }
    
    
  
    var sorted = sortScores(databaseScores);
    
    
    
    //list of suggested databases
    var suggestions = [];
    
    //populate with all non zero score databases
    for(var i = sorted.length - 1; i >= 0 ; i--){
        if(sorted[i][1] > 1){
        suggestions.push(sorted[i][0]);
        }
    }
    
    console.log(suggestions);
    
    //populate the suggested drop down menu
    for(var i = 0; i < suggestions.length; i++){
        
        console.log(suggestions[i]);
        
        var option = document.createElement("OPTION");
        var database = document.createTextNode(suggestions[i]);
        option.appendChild(database);
        option.setAttribute("value", suggestions[i]);
        suggestedMenu.insertBefore(option, suggestedMenu.firstChild);
        
    }
    
    //in the case nothing is found
    if(suggestedMenu.innerHTML == ''){
        var option = document.createElement("OPTION");
        var message = document.createTextNode("No Suggested Databases");
        option.appendChild(message);
        suggestedMenu.insertBefore(option, suggestedMenu.lastChild);
    }

    
}



function sortScores(obj)
{
  // convert object into array
    var sortable=[];
    for(var key in obj)
        if(obj.hasOwnProperty(key))
            sortable.push([key, obj[key]]);
    
    // sort items by value
    sortable.sort(function(a, b)
    {
      return b[1]-a[1];
    });
    
    
    console.log(sortable);
    
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
}

//seperates query into list of words, removes punctuation, uppercase, and stop words
function parseAndClean(query){
    
    query = query.toLowerCase();

    //splits string into list of words
    var cleanedQuery = query.trim().split(" ");
    
    //removes punctuation from words
    
    for(var i = 0; i < cleanedQuery.length; i++){
        var orig = cleanedQuery[i];
        var temp = orig.replace(/[.,\/#!?$%\^&\*;:{}=\-_~()]/g,"");
        cleanedQuery[i] = temp.replace(/\s{2,}/g," ");
    }
                                  
      
    return cleanedQuery;
    
    
}


function useSuggestedDatabase(){
    
    var database = document.getElementById('suggestedDBs');
    
    if(database.value == "No Suggested Databases"){
        return;
    }
    
    var graph1Menu = document.getElementById('database1');
    
    for(var i = 0; i < graph1Menu.options.length; i++){
        
        if(graph1Menu.options[i].value == database.value){
            graph1Menu.options[i].selected = true;
        }
        
    }
    
    
    submitGraphData(1);
    
    
}



//defining the keywords for each database
//there may be some repeated words in the dictionary because some words carry extra value
var keyword_dict = {
    'Populations': [
                    'population','population','population',
                    'populations','populations','populations','populations',
                    'populated','populated',
                    'populus' ,
                    'industrial',
                    ],
    'Population Female Percentage': [
                    'population', 'population','population',
                    'populations','populations',
                    'populated','populated',
                    'female','female',
                    'females',
                    'women',
                    'girl',
                    'girls',
                    'percentage'
                    ],
    'Population Female Percentage at Birth': [
                      'population', 'population',
                      'populations',
                      'populated',
                      'female','female',
                      'females',
                      'women',
                      'girl',
                      'girls',
                  'percentage',
                    'birth','birth',
                    'child',
                    'infant',
                    'pastoral',
                    ],

    'Life Expectancy - Continents': [
                     'life','life','life',
                     'expectancy','expectancy','expectancy',
                     'continents','continents','continents',
                     'mortality',
                     'death',
                     'dying',
                     'living','living',
                     
                      'pastoral',
                                     
                     ],
    'Median Age': [
                     'population',
                     'median',
                     'age',
                   'median',
                   'age',
                   
                     ],
    'Births': [
                     'birth','birth',
                    'births', 'births',
                     'expectancy',
                     'population',
                     'death',
                     'dying',
                
                                     
                     ],
    
    'Births Per Woman': [
                     'birth',
                     'births','births',
                     'expectancy',
                     'continents',
                     'population',
                     'death',
                     'dying',
                    'woman','woman',
                    'women',
                                                       
                     ],
    
    'Births Per 1000 People': [
                     'birth',
                   'births','births',
                     'expectancy',
                     'continents',
                     'population',
                     '1000',
                     'people',
                               '1000',
                               'people',
                                     
                     ],
    
    'Child Deaths': [
                     
                     'child',
                     'deaths',
                     'child',
                     'deaths',
                     'population',
                     
                     ],
    
    'Child Mortality Rates': [
                              
                     'child', 'child',
                     'mortality', 'mortality',
                     'rates', 'rates',
                     'birth',
                                     
                     ],
    'Survival Rate to Age 65 - Male': [
                                       
                                       
                     'survival',
                     'rate',
                     'age',
                     '65',
                     'male',
                                       'survival',
                                       'rate',
                                       'age',
                                       '65',
                                       'male',
                     'sixty',
                   'five',
                   'sixty-five',
                                       
                     ],
    
    
    'Survival Rate to Age 65 - Female': [
                                         
                     'survival',
                     'rate',
                     'age',
                     '65',
                     'female',
                                         'survival',
                                         'rate',
                                         'age',
                                         '65',
                                         'female',
                     'sixty',
                   'five',
                   'sixty-five',
                    
                     ],
    
    'Military Personnel': [
                     'military',
                     'personnel',
                   'military',
                   'personnel',
                     'soldiers',
                           
                     ],
    
    'Military Personnel Percent of Population': [
                                                 
                     'military',
                     'personnel',
                     'percent',
                     'population',
                                                 'military',
                                                 'personnel',
                                                 'percent',
                                                 'population'
                    
                   
                     ],
    
    'Military Spending': [
                                                 
                     'military',
                     'spending',
                          'military',
                          'spending',
                     'army',
                     'cost',
                     'expense',
                     'budget',
                    'economy'
                    
                   
                     ],
    
    'Military Spending Percent of GDP': [
                                                 
                     'military',
                     'spending',
                     'army',
                     'cost',
                     'expense',
                     'budget',
                    'gdp',
                 'percent',
                     
                    
                   
                     ],
    
    'Military Spending in thousands of US dollars': [
                                                 
                     'military',
                     'spending',
                     'army',
                     'cost',
                     'expense',
                     'budget',
                     'in',
                     'thousands',
                     'of',
                     'US',
                     'dollars',
                    
                   
                     ],
    
    'GDP': [
                                                 
                     'gdp','gdp','gdp','gdp',
                     'gross',
                     'domestic',
                     'product',
                     'spending',
                     'budget','budget',
                     'dollars',
                    'money',
                    'economy','economy',
                    
                   
                     ],
    
    'GDP Per Capita': [
                                                 
                       'gdp','gdp','gdp','gdp',
                       'gross',
                       'domestic',
                       'product',
                       'spending',
                       'budget','budget',
                       'dollars',
                      'money',
                      'economy','economy',
                    'capita'
                    
                   
                     ],
    
    'Economic Freedom Scores': [
                                                 
                     'economic',
                     'freedom',
                     'scores',
                     'economy','economy',
                     'spend',
                     'spending',
                    
                   
                     ],
    
    'CO2 Emissions': [
                                                 
                     'CO2','CO2',
                     'emissions','emissions',
                     'carbon',
                     'emission',
                     'dioxide',
                    
                   
                     ],
    
    'CO2 Emissions Per Capita': [
                                                 
                                 'CO2','CO2',
                                 'emissions','emissions',
                     'carbon',
                     'emission',
                     'dioxide',
                      'per',
                      'capita',
                    
                   
                     ],
    
    'CO2 Emissions Percentages': [
                                                 
                                  'CO2','CO2',
                                  'emissions','emissions',
                     'carbon',
                     'emission',
                     'dioxide',
                    'percentages',
                   
                     ],
    
    'CO2 Emissions Cumulative': [
                                                 
                     'CO2','CO2',
                     'emissions','emissions',
                     'carbon',
                     'emission',
                     'dioxide',
                    'cumulative',
                   
                     ],
    
    'CO2 Emissions Cumulative Percentages': [
                                                 
                     'CO2','CO2',
                 'emissions','emissions',
                     'carbon',
                     'emission',
                     'dioxide',
                    'cumulative',
                     'percentages',
                   
                     ],
    
    
};
