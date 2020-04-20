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

    //initialize date range sliders
    $("#range1").ionRangeSlider({//http://ionden.com/a/plugins/ion.rangeSlider/start.html
        type: "double",
        min: 0,
        max: 0,
        from: 0,
        to: 0,
        hide_min_max: true,
        prettify_enabled: false,
    });
    $("#range2").ionRangeSlider({
        type: "double",
        min: 0,
        max: 0,
        from: 0,
        to: 0,
        hide_min_max: true,
        prettify_enabled: false,
    });

    switchToDefault();
});

//Graphs data for the nth graph.
function graphData(database, xaxis, yaxis, n, lowDate, highDate, minDate, maxDate, gtype, color, colorScheme) {
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
            if (parseInt(data[i][xaxis], 10) >= lowDate && parseInt(data[i][xaxis], 10) <= highDate) {
                labelsArr.push(data[i][xaxis]);
                dataArr.push(data[i][yaxis]);
            }
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
                        },
                        colorschemes: {
                            scheme: colorScheme,
                        }
                    }
                }
            });

            //create descriptions & properties for graphs
            //needed for tooltip hover in saved region
            graph1.description = "DB: " + database + "<br>Y axis: " + yaxis + "<br>X axis: " + xaxis + " " + lowDate + "-" + highDate;
            graph1.DB = database;
            graph1.X = xaxis;
            graph1.Y = yaxis;
            graph1.lowDate = lowDate;
            graph1.highDate = highDate;
            graph1.fromDate = minDate;
            graph1.toDate = maxDate;
            graph1.type = gtype;
            graph1.color = color;
            graph1.colorScheme = colorScheme;
            document.getElementById("save" + n).style.display = "block";
        }
        else if (n == 2) {
            graph2 = new Chart(ctx, {
                type: gtype,
                data: {
                    datasets: [{
                        label: yaxis + " (" + gtype + ")",
                        data: dataArr,
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
                        },
                        colorschemes: {
                            scheme: colorScheme,
                        }
                    }
                }
            });

            //create descriptions & properties for graphs
            //needed for tooltip hover in saved region
            graph2.description = "DB: " + database + "<br>Y axis: " + yaxis + "<br>X axis: " + xaxis + " " + lowDate + "-" + highDate;
            graph2.DB = database;
            graph2.X = xaxis;
            graph2.Y = yaxis;
            graph2.lowDate = lowDate;
            graph2.highDate = highDate;
            graph2.fromDate = minDate;
            graph2.toDate = maxDate;
            graph2.type = gtype;
            graph2.color = color;
            graph2.colorScheme = colorScheme;
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

    var lowDate = $("#range1").data("from");
    var highDate = $("#range1").data("to");

    el = document.getElementById("colorButton" + n);
    var color = el.style.backgroundColor;
    var colorScheme = el.description;

    graphData(dbOption, xOption, yOption, n, lowDate, highDate, lowDate, highDate, gtype, color, colorScheme);
}

//Runs when the user clicks the default button.
//Switches databases to default
//Switches y axes to default and enables the menu
//Resets date ranges
//Switches graph types to default and enables the menu
//Resets & enables color button
function switchToDefault() {
    //set database 1 to default
    var el = document.getElementById("database1");
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].text === defaultDatabase1) {
            el.selectedIndex = i;
            break;
        }
    }

    //clear y-axis menu 1
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

        //update date range slider values
        var years = [];
        for (var i = 0; i < data.length; i++) {
            years.push(data[i]["Year"]);
        }
        updateSlider(1, years[0], years[years.length - 1]);

        //enable the submit button
        document.getElementById("submit1").disabled = false;

        //graph data
        graphData(defaultDatabase1, defaultXAxis1, defaultYAxis1, 1, years[0], years[years.length - 1], years[0], years[years.length - 1], 'bar', document.getElementById("colorButton1").style.backgroundColor, document.getElementById("colorButton1").description);
    })
    .catch(function(error) {
        if (error.message === "404 Not Found") {
            alert("File not found: " + database);
        }
    })

    //reset graph type menu 1
    document.getElementById("gtype1").selectedIndex = 2;

    //reset color button 1
    changeColorButton(1, "#f09415", "office.Basis6");
    document.getElementById("colorButton1").disabled = false;

    //set database 2 to default
    el = document.getElementById("database2");
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].text === defaultDatabase2) {
            el.selectedIndex = i;
            break;
        }
    }

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

        //update date range slider values
        var years = [];
        for (var i = 0; i < data.length; i++) {
            years.push(data[i]["Year"]);
        }
        updateSlider(2, years[0], years[years.length - 1]);

        //enable the submit button
        document.getElementById("submit2").disabled = false;

        //graph data
        graphData(defaultDatabase2, defaultXAxis2, defaultYAxis2, 2, years[0], years[years.length - 1], years[0], years[years.length - 1], 'bar', document.getElementById("colorButton2").style.backgroundColor, document.getElementById("colorButton2").description);
    })
    .catch(function(error) {
        if (error.message === "404 Not Found") {
            alert("File not found: " + database);
        }
    })

    //reset graph type menu 2
    el = document.getElementById("gtype2");
    el.selectedIndex = 2;

    //reset color button 2
    changeColorButton(2, "#543005", "brewer.BrBG11");
    document.getElementById("colorButton2").disabled = false;
}

//Runs when the user clicks the clear button.
//Calls clearValues() for both graph 1 and 2.
function clearAllValues() {
    clearValues(1);
    clearValues(2);
}

//Clears database menu
//Clears and disables y axis menu
//Clears and disables date range slider
//"Clears" and disables graph type menu
//"Clears" and disables color button
//Disables submit button
//Clears graphs and driving question
//Disables save button
function clearValues(n) {
    var el = document.getElementById("database" + n);
    el.selectedIndex = 0;

    clearMenu("yaxis" + n, true);

    clearSlider(n);

    el = document.getElementById("gtype" + n);
    el.selectedIndex = 0;
    el.disabled = true;

    resetColorButton(n);
    document.getElementById("colorButton" + n).disabled = true;

    document.getElementById("submit" + n).disabled = true;

    if (n == 1)
        graph1.destroy();
    else if (n == 2)
        graph2.destroy();
    document.getElementById("save" + n).style.display = "none";

    // clear driving question
    document.getElementById("driving_question" + n).innerHTML = "";
}

//Runs when the option for database changes.
//If the empty option is selected, clear and/or disable the y-axis menu,
//date range slider, graph type menu, color button, and submit button.
//If a non-empty option is selected, clear and/or enable the the
//y-axis menu, date range slider, graph type menu, and color button,
//but the submit button will remain disabled
//until there are non-empty values for y-axis, graph type menus.
function verifyDB(n) {
    var menu = document.getElementById("database" + n);
    var dbOption = menu.options[menu.selectedIndex].value;
    if (dbOption == "") {
        //if no database selected...
        //clear and disable y axis menu...
        clearMenu("yaxis" + n, true);

        //clear and disable date range slider
        clearSlider(n);
        
        //"clear" and disable graph type menu
        var el = document.getElementById("gtype" + n);
        el.selectedIndex = 0;
        el.disabled = true;

        //"clear" and disable color button
        resetColorButton(n);
        document.getElementById("colorButton" + n).disabled = true;

        //disable submit button
        document.getElementById("submit" + n).disabled = true;
    }
    else {
        //save all previous data
        var previousYAxisMenu = document.getElementById("yaxis" + n);
        var previousYAxisValue = previousYAxisMenu.options[previousYAxisMenu.selectedIndex].value;
        var previousLowDate = $("#range" + n).data("from");
        var previousHighDate = $("#range" + n).data("to");
        var previousGTypeMenu = document.getElementById("gtype" + n);
        var previousGTypeValue = previousGTypeMenu.options[previousGTypeMenu.selectedIndex].value;
        var previousColor = document.getElementById("colorButton" + n).style.backgroundColor;
        var previousColorScheme = document.getElementById("colorButton" + n).description;
        
        //clear and enable y-axis menu
        clearMenu("yaxis" + n, false);

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
                if (keys[i] == previousYAxisValue)
                    elY.selectedIndex = i + 1;
            }

            //update date range slider values
            var years = [];
            for (var i = 0; i < data.length; i++) {
                years.push(data[i]["Year"]);
            }
            if (years[0] > previousLowDate || years[years.length - 1] < previousHighDate)
                updateSlider(n, years[0], years[years.length - 1]);
            else
                updateSliderOnlyRange(n, years[0], years[years.length - 1], previousLowDate, previousHighDate);
        })
        .catch(function(error) {
            if (error.message === "404 Not Found") {
                alert("File not found: " + database);
            }
        })
        
        //enable graph type menu
        document.getElementById("gtype" + n).disabled = false;
        if (previousGTypeValue == "bar")
            el.selectedIndex = 1;
        if (previousGTypeValue == "line")
            el.selectedIndex = 2;
        
        //enable color button
        changeColorButton(n, previousColor, previousColorScheme);
        document.getElementById("colorButton" + n).disabled = false;
    }
}

//Clears all options from select menu except for the empty option.
//Can also disable menu
function clearMenu(name, disable) {
    var menu = document.getElementById(name);
    menu.selectedIndex = 0;
    var length = 1;
    while (menu.options.length != length) {
        menu.remove(menu.options.length - 1);
    }
    menu.disabled = disable;
}

//Clears all values in slider
//Also disables slider
function clearSlider(n) {
    $("#range" + n).data("ionRangeSlider").update({
        min: 0,
        max: 0,
        from: 0,
        to: 0,
        disable: true,
    });
}

//Updates min, max in slider
//Sets from = min, to = max
//Also enables slider
function updateSlider(n, minimum, maximum) {
    $("#range" + n).data("ionRangeSlider").update({
        min: minimum,
        max: maximum,
        from: minimum,
        to: maximum,
        disable: false,
    });
}

//Updates min, max in slider
//Sets from = lowDate, to = highDate
//Also enables slider
function updateSliderOnlyRange(n, minimum, maximum, lowDate, highDate) {
    $("#range" + n).data("ionRangeSlider").update({
        min: minimum,
        max: maximum,
        from: lowDate,
        to: highDate,
        disable: false,
    });
}

//Runs when the option for y-axis menu or graph type menu option changes.
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

//Finds the next available spot to save a graph, returns this number
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
    var lowDate = undefined;
    var highDate = undefined;
    var minDate = undefined;
    var maxDate = undefined;
    var graph_type = undefined;
    var color = undefined;
    var colorScheme = undefined;

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
        lowDate = graph1.lowDate;
        highDate = graph1.highDate;
        minDate = graph1.minDate;
        maxDate = graph1.maxDate;
        graph_type = graph1.type;
        color = graph1.color;
        colorScheme = graph1.colorScheme;
    }
    else if (graphNum == 2) {
        labelsArr = graph2.config.data.labels;
        dataArr = graph2.config.data.datasets[0].data;
        hoverText = graph2.description;
        db = graph2.DB;
        x = graph2.X;
        y = graph2.Y;
        lowDate = graph2.lowDate;
        highDate = graph2.highDate;
        minDate = graph2.minDate;
        maxDate = graph2.maxDate;
        graph_type = graph2.type;
        color = graph2.color;
        colorScheme = graph2.colorScheme;
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
    g.lowDate = lowDate;
    g.highDate = highDate;
    g.minDate = minDate;
    g.maxDate = maxDate;
    g.type = graph_type;
    g.color = color;
    g.colorScheme = colorScheme;
    savedGraphs[destination - 1] = g;

    var tip = document.getElementById("tip" + destination);
    tip.style.display = "block";
    tip.style.backgroundColor = "#0000005c";
    tip.innerHTML = hoverText + "<br><span onclick='swap(" + destination + ", 1)' style='cursor: pointer; background-color: black;'>Transfer to Graph 1</span><br><span onclick='swap(" + destination + ", 2)' style='cursor: pointer; background-color: black;'>Transfer to Graph 2</span>";
    tip.style.visibility = "hidden";

    var exit = document.getElementById("exit" + destination);
    exit.style.visibility = "visible";
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
    var savedColorScheme = savedGraph.colorScheme;

    saveGraph(savedNum, graphNum, true);
    graphData(savedDB, savedX, savedY, graphNum, savedLowDate, savedHighDate, savedMinDate, savedMaxDate, savedType, savedColor, savedColorScheme);

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

    //update slider range
    updateSliderOnlyRange(graphNum, savedMinDate, savedMaxDate, savedLowDate, savedHighDate);

    changeColorButton(graphNum, savedColor, savedColorScheme);

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

//Removes a graph from the saved section
function deleteGraph(savedNum) {
    var g = savedGraphs[savedNum - 1];
    g.destroy();
    savedGraphs[savedNum - 1] = undefined;

    var tip = document.getElementById("tip" + savedNum);
    tip.style.display = "none";
    tip.style.backgroundColor = "transparent";
    tip.innerHTML = "";
    tip.style.visibility = "hidden";

    var exit = document.getElementById("exit" + savedNum);
    exit.style.visibility = "hidden";
}

//Shows tooltip over saved graph
function showToolTip(savedNum) {
    var tip = document.getElementById("tip" + savedNum);
    if (tip.style.visibility != "visible")
        tip.style.visibility = "visible";
    else
        tip.style.visibility = "hidden";
}

//Opens and closes color pallette
function showColorWheel(num) {
    var wheel = document.getElementById("colorWheel" + num);
    if (wheel.style.visibility != "visible")
        wheel.style.visibility = "visible";
    else
        wheel.style.visibility = "hidden";
}

//Changes color button
function changeColorButton(num, color, description) {
    var btn = document.getElementById("colorButton" + num);
    btn.style.backgroundColor = color;
    btn.description = description;
    var wheel = document.getElementById("colorWheel" + num);
    wheel.style.visibility = "hidden";
}

//Reset color button
function resetColorButton(num) {
    changeColorButton(num, "#ffffff", "brewer.Greys8");
}