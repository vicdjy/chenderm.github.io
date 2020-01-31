/*
To run this app, it needs to be hosted on localhost to read any files.
Open the DV4L folder in a terminal and type:
npm install
(I'm not sure if the above command is needed but just to be safe) Then:
npm install http-server -g
And then type:
http-server -p 4200 -c-1
And open localhost:4200/index.html in a browser. You can replace 4200 with any number.
To get a public URL, open another terminal and navigate to this folder again. Then:
ngrok http 4200
There will be a public URL displayed that looks like a scramble of random letters & numbers.
This URL will tunnel to your localhost. It expires after a day unless you sign into ngrok.
The ngrok website will have instructions for that. It's free.
Once you get the ngrok URL that looks something like [jumbledMess].ngrok.io, just go to
[jumbledMess].ngrok.io/index.html
*/

var defaultDatabase1 = "Populations";
var defaultXAxis1 = "Year";
var defaultYAxis1 = "Rwanda";

var defaultDatabase2 = "Populations";
var defaultXAxis2 = "Year";
var defaultYAxis2 = "Algeria";

var graph1 = undefined;
var graph2 = undefined;

var savedGraphs = [];

//When the page first loads.
$(document).ready( function() {
    console.log("Ready!");
    Chart.defaults.global.defaultFontColor = "#524636";

    for (var i = 0; i < 12; i++) {
        savedGraphs.push(undefined);
    }

    switchToDefault();
});

//Graphs data for the first graph.
function graphData(database, xaxis, yaxis, n, gtype) {
    if (n == 1 && graph1 !== undefined)
        graph1.destroy();
    else if (n == 2 && graph2 !== undefined)
        graph2.destroy();

    //add labels and data to respective arrays
    d3.csv("/csv/" + database + ".csv")
    .then(function(data) {
        var labelsArr = [];
        var dataArr = [];
        for (var i = 0; i < data.length; i++) {
            labelsArr.push(data[i][xaxis]);
            dataArr.push(data[i][yaxis]);
        }

        //add driving question
        var dq = document.getElementById("driving_question" + n);
        d3.csv("/csv/driving-questions.csv").then(function(q_data){
            question = q_data[0][database];
            dq.innerHTML = question;
        })

        //create graph
        var ctx = document.getElementById("canvas" + n);
        ctx = ctx.getContext("2d");
        if (n == 1) {
            graph1 = new Chart(ctx, {
                type: gtype,
                data: {
                    datasets: [{
                        label: yaxis + " (" + gtype + ")",
                        data: dataArr,
                        backgroundColor: "rgba(183, 82, 30, 1)",
                        hoverBackgroundColor: "rgba(228, 176, 74, 1)",
                    }],
                    labels: labelsArr
                },
                options: {
                    plugins: {
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: 'x',
                                speed: 3000,
                            },
                            zoom: {
                                enabled: true,
                                mode: 'x',
                                speed: 3000,
                            }
                        }
                    }
                }
            });

            //create descriptions & properties for graphs
            //needed for tooltip hover in saved region
            graph1.description = "DB: " + database + "<br>X axis: " + xaxis + "<br>Y axis: " + yaxis + "<br>Type: " + gtype;
            graph1.DB = database;
            graph1.X = xaxis;
            graph1.Y = yaxis;
            graph1.type = gtype;
            document.getElementById("save" + n).style.display = "block";
        }
        else if (n == 2) {
            graph2 = new Chart(ctx, {
                type: gtype,
                data: {
                    datasets: [{
                        label: yaxis + " (" + gtype + ")",
                        data: dataArr,
                        backgroundColor: "rgba(228, 176, 74, 1)",
                        hoverBackgroundColor: "rgba(183, 82, 30, 1)",
                    }],
                    labels: labelsArr
                },
                options: {
                    plugins: {
                        zoom: {
                            pan: {
                                enabled: true,
                                mode: 'x',
                                speed: 3000,
                            },
                            zoom: {
                                enabled: true,
                                mode: 'x',
                                speed: 3000,
                            }
                        }
                    }
                }
            });

            //create descriptions & properties for graphs
            //needed for tooltip hover in saved region
            graph2.description = "DB: " + database + "<br>X axis: " + xaxis + "<br>Y axis: " + yaxis+ "<br>Type: " + gtype;
            graph2.DB = database;
            graph2.X = xaxis;
            graph2.Y = yaxis;
            graph2.type = gtype;
            document.getElementById("save" + n).style.display = "block";
        }
    })
}

//Runs when user clicks the submit button.
//n = 1 when the button is for the first graph
//n = 2 when the button is for the second graph
function submitGraphData(n) {
    var el = document.getElementById("database" + n);
    var dbOption = el.options[el.selectedIndex].value;

    var xOption = "Year";

    el = document.getElementById("yaxis" + n);
    var yOption = el.options[el.selectedIndex].value;

    el = document.getElementById("gtype" + n);
    var gtype = el.options[el.selectedIndex].value;

    graphData(dbOption, xOption, yOption, n, gtype);
}

//Runs when the user clicks the default button.
//Switches all database, y-axis, graph type values to
//default values, which are set at the top of this file.
//Enables y-axis, graph type select menus
function switchToDefault() {
    //set database 1 to default
    var el = document.getElementById("database1");
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].text === defaultDatabase1) {
            el.selectedIndex = i;
            break;
        }
    }

    //reset graph type menu
    clearMenu("gtype1", false);
    el = document.getElementById("gtype1");
    var option = document.createElement("option");
    option.appendChild(document.createTextNode("bar"));
    option.value = "bar";
    el.appendChild(option);
    el.selectedIndex = 1;
    option = document.createElement("option");
    option.appendChild(document.createTextNode("line"));
    option.value = "line";
    el.appendChild(option);

    //clear y-axis menu
    clearMenu("yaxis1", false);

    //read the csv file to get all keys
    d3.csv("/csv/" + defaultDatabase1 + ".csv")
    .then(function(data) {
        var keys = Object.keys(data[0]);
        keys.sort();
        //add each key to y-axis menu
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == "Year")
                continue;

            var elY = document.getElementById("yaxis1");
            var option = document.createElement("option");
            option.appendChild(document.createTextNode(keys[i]));
            option.value = keys[i];
            elY.appendChild(option);
            if (keys[i] == defaultYAxis1) {
                elY.selectedIndex = i + 1;
            }
        }

        //enable the submit button
        document.getElementById("submit1").disabled = false;

        //graph data
        graphData(defaultDatabase1, defaultXAxis1, defaultYAxis1, 1, 'bar');
    })
    .catch(function(error) {
        if (error.message === "404 Not Found") {
            alert("File not found: " + database);
        }
    })

    //set database 2 to default
    el = document.getElementById("database2");
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].text === defaultDatabase2) {
            el.selectedIndex = i;
            break;
        }
    }

    //reset graph type menu
    clearMenu("gtype2", false);
    el = document.getElementById("gtype2");
    var option = document.createElement("option");
    option.appendChild(document.createTextNode("bar"));
    option.value = "bar";
    el.appendChild(option);
    el.selectedIndex = 1;
    option = document.createElement("option");
    option.appendChild(document.createTextNode("line"));
    option.value = "line";
    el.appendChild(option);

    //clear y-axis menu
    clearMenu("yaxis2", false);

    //read the csv file to get all keys
    d3.csv("/csv/" + defaultDatabase2 + ".csv")
    .then(function(data) {
        var keys = Object.keys(data[0]);
        keys.sort();
        //add each key to y-axis menu
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == "Year")
                continue;

            var elY = document.getElementById("yaxis2");
            var option = document.createElement("option");
            option.appendChild(document.createTextNode(keys[i]));
            option.value = keys[i];
            elY.appendChild(option);
            if (keys[i] == defaultYAxis2) {
                elY.selectedIndex = i + 1;
            }
        }

        //enable the submit button
        document.getElementById("submit2").disabled = false;

        //graph data
        graphData(defaultDatabase2, defaultXAxis2, defaultYAxis2, 2, 'bar');
    })
    .catch(function(error) {
        if (error.message === "404 Not Found") {
            alert("File not found: " + database);
        }
    })
}

//Runs when the user clicks the clear button.
//Calls clearValues() for both graph 1 and 2.
function clearAllValues() {
    clearValues(1);
    clearValues(2);
}

//Clears values for database and y-axis.
function clearValues(n) {
    var el = document.getElementById("database" + n);
    el.selectedIndex = 0;
    clearMenu("yaxis" + n, true);
    clearMenu("gtype" + n, true);
    document.getElementById("submit" + n).disabled = true;

    if (n == 1) {
        graph1.destroy();
        document.getElementById("save" + n).style.display = "none";
    }
    else if (n == 2) {
        graph2.destroy();
        document.getElementById("save" + n).style.display = "none";
    }

    // clear driving question
    var dq1 = document.getElementById("driving_question1");
    dq1.innerHTML = "";
    var dq2 = document.getElementById("driving_question2");
    dq2.innerHTML = "";
}

//Runs when the option for database changes.
//If the empty option is selected, the y-axis, graph type menus
//and submit button are disabled.
//If a non-empty option is selected, the y-axis, graph type menus
//are enabled, but the submit button will remain disabled
//until there are non-empty values for y-axis, graph type menus.
function verifyDB(n) {
    var menu = document.getElementById("database" + n);
    var dbOption = menu.options[menu.selectedIndex].value;
    if (dbOption == "") {
        //if no database selected, disable y-axis, graph type, submit button
        clearMenu("yaxis" + n, true);
        clearMenu("gtype" + n, true);
        document.getElementById("submit" + n).disabled = true;
    }
    else {
        //enable y-axis, graph type
        //disable submit button because y-axis, graph type are empty
        clearMenu("yaxis" + n, false);
        clearMenu("gtype" + n, false);
        document.getElementById("submit" + n).disabled = true;

        //load keys into y-axis menu
        d3.csv("/csv/" + dbOption + ".csv")
        .then(function(data) {
            var keys = Object.keys(data[0]);
            keys.sort();

            //add each key to y-axis menu
            for (var i = 0; i < keys.length; i++) {
                if (keys[i] == "Year")
                    continue;
    
                var elY = document.getElementById("yaxis" + n);
                var option = document.createElement("option");
                option.appendChild(document.createTextNode(keys[i]));
                option.value = keys[i];
                elY.appendChild(option);
            }
        })
        .catch(function(error) {
            if (error.message === "404 Not Found") {
                alert("File not found: " + database);
            }
        })

        //reset graph type menu
        var el = document.getElementById("gtype" + n);
        var option = document.createElement("option");
        option.appendChild(document.createTextNode("bar"));
        option.value = "bar";
        el.appendChild(option);
        el.selectedIndex = 0;
        option = document.createElement("option");
        option.appendChild(document.createTextNode("line"));
        option.value = "line";
        el.appendChild(option);
    }
}

//Clears all options from select menu except for the empty option.
//Can also disable menu
function clearMenu(name, disable) {
    var menu = document.getElementById(name);
    menu.selectedIndex = 0;
    while (menu.options.length != 1) {
        menu.remove(menu.options.length - 1);
    }
    menu.disabled = disable;
}

//Runs when the option for x-axis or y-axis menu option changes.
//If either are empty, the submit button is disabled.
//Once both are non-empty, the submit button is enabled.
function verifyOptions(n) {
    var el = document.getElementById("yaxis" + n);
    var yOption = el.options[el.selectedIndex].value;

    el = document.getElementById("gtype" + n);
    var gtype = el.options[el.selectedIndex].value;

    //enable submit button if both y-axis and graph type menus are non-empty
    if (yOption == "" || gtype == "") {
        document.getElementById("submit" + n).disabled = true;
    }
    else {
        document.getElementById("submit" + n).disabled = false;
    }
}

function nextAvailableSaveSpot() {
    for (var i = 0; i < savedGraphs.length; i++) {
        if (savedGraphs[i] == undefined) {
            return i + 1;
        }
    }
    return -1;
}

//Runs when the user clicks SAVE GRAPH
function saveGraph(saveNum, graphNum, swap) {
    var labelsArr = undefined;
    var dataArr = undefined;
    var hoverText = undefined;
    var db = undefined;
    var x = undefined;
    var y = undefined;
    var graph_type = undefined;

    var destination = undefined;
    if (saveNum == 0) {
        destination = nextAvailableSaveSpot();
        if (destination == -1) {
            alert("No more space available to save graphs! Try deleting some");
            return;
        }
    }
    else {
        destination = saveNum;
        var g = savedGraphs[saveNum - 1];
        g.destroy();
        savedGraphs[saveNum - 1] = undefined;
        var tip = document.getElementById("tip" + saveNum);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";
    }

    if (graphNum == 1) {
        labelsArr = graph1.config.data.labels;
        dataArr = graph1.config.data.datasets[0].data;
        hoverText = graph1.description;
        db = graph1.DB;
        x = graph1.X;
        y = graph1.Y;
        graph_type = graph1.type;
    }
    else if (graphNum == 2) {
        labelsArr = graph2.config.data.labels;
        dataArr = graph2.config.data.datasets[0].data;
        hoverText = graph2.description;
        db = graph2.DB;
        x = graph2.X;
        y = graph2.Y;
        graph_type = graph2.type;
    }

    //check if current graph is already saved
    for (var i = 0; i < savedGraphs.length; i++) {
        if (savedGraphs[i] != undefined && hoverText == savedGraphs[i].description) {
            if (!swap) {
                alert("Graph " + graphNum + " is already saved at box #" + i + 1);
            }
            return;
        }
    }

    var canvas = document.getElementById("saved" + destination);
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
                backgroundColor: "rgba(255,255,255,1)",
                pointRadius: 0,
                pointHoverRadius: 0
            }]
        }
    });
    g.description = hoverText;
    g.DB = db;
    g.X = x;
    g.Y = y;
    g.type = graph_type;
    savedGraphs[destination - 1] = g;

    var tip = document.getElementById("tip" + destination);
    tip.style.display = "block";
    tip.style.backgroundColor = "#0000005c";
    tip.innerHTML = "<span onclick='deleteGraph(" + destination + ")' style='cursor: pointer; background-color: black;'>X</span><br>" + hoverText + "<br><span onclick='swap(" + destination + ", 1)' style='cursor: pointer; background-color: black;'>Transfer to Graph 1</span><br><span onclick='swap(" + destination + ", 2)' style='cursor: pointer; background-color: black;'>Transfer to Graph 2</span>";
}

//Transfers a saved graph to one of the main graphs,
//Saves the main graph in the saved spot
function swap(savedNum, graphNum) {
    var savedGraph = savedGraphs[savedNum - 1];
    var savedDB = savedGraph.DB;
    var savedX = savedGraph.X;
    var savedY = savedGraph.Y;
    var savedType = savedGraph.type;

    saveGraph(savedNum, graphNum, true);
    graphData(savedDB, savedX, savedY, graphNum, savedType);

    //updating the controls on the left side
    //set database 1 to savedDB
    var el = document.getElementById("database" + graphNum);
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].text === savedDB) {
            el.selectedIndex = i;
            break;
        }
    }

    var el = document.getElementById("gtype" + graphNum);
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].text === savedType) {
            el.selectedIndex = i;
            break;
        }
    }

    clearMenu("yaxis" + graphNum, false);

    d3.csv("/csv/" + savedDB + ".csv")
    .then(function(data) {
        var keys = Object.keys(data[0]);
        keys.sort();
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] == "Year")
                continue;

            var elY = document.getElementById("yaxis" + graphNum);
            var option = document.createElement("option");
            option.appendChild(document.createTextNode(keys[i]));
            option.value = keys[i];
            elY.appendChild(option);
            if (keys[i] == savedY) {
                elY.selectedIndex = i + 1;
            }
        }

        document.getElementById("submit" + graphNum).disabled = false;
    });
}

function deleteGraph(savedNum) {
    var g = savedGraphs[savedNum - 1];
    g.destroy();
    savedGraphs[savedNum - 1] = undefined;
    var tip = document.getElementById("tip" + savedNum);
    tip.style.display = "none";
    tip.style.backgroundColor = "transparent";
    tip.innerHTML = "";
}