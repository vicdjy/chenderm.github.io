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

var defaultDatabase0 = "Populations";
var defaultXAxis0 = "Year";
var defaultYAxis0 = "Rwanda";

var defaultDatabase1 = "Populations";
var defaultXAxis1 = "Year";
var defaultYAxis1 = "Algeria";

var colorValues = {
    "gray": "#797b7e",
    "lightGray": "#a9a57c",
    "white": "#ffffff",
    "darkRed": "#990000",
    "red": "#f81b02",
    "lightRed": "ef8a62",
    "pink": "#ff388c",
    "lightPink": "#e9a3c9",
    "darkBrown": "#543005",
    "brown": "#a6611a",
    "lightBrown": "#d8b365",
    "darkOrange": "#e66101",
    "orange": "#f09415",
    "lightOrange": "#ffc685",
    "darkYellow": "#f0ad00",
    "yellow": "#f2d908",
    "lightYellow": "#ffeda0",
    "lightGreen": "#9acd4c",
    "green": "#549e39",
    "darkGreen": "#24693d",
    "lightBlue": "#31b6fd",
    "blue": "#0f6fc6",
    "darkBlue": "#294171",
    "darkPurple": "#663366",
    "purple": "#ac3ec1",
    "lightPurple": "#af8dc3",
};

var colorSchemeValues = {
    "gray": "office.Angles6",
    "lightGray": "office.Adjacency6",
    "white": "brewer.Greys8",
    "darkRed": "office.Codex6",
    "red": "office.Atlas6",
    "lightRed": "brewer.RdBu3",
    "pink": "office.Verve6",
    "lightPink": "brewer.PiYG3",
    "darkBrown": "brewer.BrBG11",
    "brown": "brewer.BrBG4",
    "lightBrown": "brewer.BrBG3",
    "darkOrange": "brewer.PuOr5",
    "orange": "office.Basis6",
    "lightOrange": "tableau.Orange20",
    "darkYellow": "office.Module6",
    "yellow": "office.Orbit6",
    "lightYellow": "brewer.YlOrRd3",
    "lightGreen": "office.Circuit6",
    "green": "office.Green6",
    "darkGreen": "tableau.GreenBlue7",
    "lightBlue": "office.Waveform6",
    "blue": "office.Blue6",
    "darkBlue": "office.Folio6",
    "darkPurple": "office.Advantage6",
    "purple": "office.Celestial6",
    "lightPurple": "brewer.PRGn3",
}

var defaultTextValue = {
    "Graphs": [
        {
            "DB": "Populations",
            "Yaxis": "Rwanda",
            "lowDate": 1800,
            "highDate": 2019,
            "gtype": "bar",
            "color": "orange"
        },
        {
            "DB": "Populations",
            "Yaxis": "Algeria",
            "lowDate": 1800,
            "highDate": 2019,
            "gtype": "bar",
            "color": "darkBrown"
        }
    ]
};
var firstLoad = true;

var graph0 = undefined;
var graph1 = undefined;

var jsonObj = {};

//When the page first loads.
$(document).ready(function () {
    console.log("Ready!");
    Chart.defaults.global.defaultFontColor = "#524636";

    //initialize date range sliders
    $("#range0").ionRangeSlider({//http://ionden.com/a/plugins/ion.rangeSlider/start.html
        type: "double",
        min: 0,
        max: 0,
        from: 0,
        to: 0,
        hide_min_max: true,
        prettify_enabled: false,
    });
    $("#range1").ionRangeSlider({
        type: "double",
        min: 0,
        max: 0,
        from: 0,
        to: 0,
        hide_min_max: true,
        prettify_enabled: false,
    });

    switchToDefault();
    sendData(-1, 200);
});

function displayModal() {
    /*
    This function display the fileUpload Modal.
    Opens up a new window from the browser to allow users
    to upload a script file from their local computer.
    */
    let modal = document.querySelector("#modal")
    modal.style.display = "block"
}
function closeModal() {
    //Close the fileupload window
    let modal = document.querySelector("#modal")
    modal.style.display = "none"
}
window.onclick = function (e) {
    let modal = document.querySelector("#modal")
    if (e.target == modal) {
        modal.style.display = "none"
    }
}

function handleFiles(files) {
    /*
    This function is called when a script file is being uploaded.
    */
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
    closeModal();
}

function getAsText(fileToRead) {
    /*
    The function reads the uploaded script file as text.
    Calls loadHandler function when the file finish loading.
    */
    var reader = new FileReader();
    // Read file into memory as UTF-8

    reader.readAsText(fileToRead);
    reader.onload = loadHandler;
    // Handle errors load

    reader.onerror = errorHandler;
}

function loadHandler(event) {
    /*
    This function is called when a script file is uploaded.
    It does the following:
    1. Parses the script as a json object
    2. Write the script into the text boxes
    3. Plot graphs based on script input
    */
    var textFromFileLoaded = event.target.result;

    jsonObj = JSON.parse(textFromFileLoaded);
    for (i in jsonObj.Graphs) {
        g = jsonObj.Graphs[i];
        textValue = JSON.stringify(g, null, 2);
        console.log(textValue);
        document.getElementById("box" + i).value = textValue;
        submitText(i);
    }
}

function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Cannot read file !");
    }
}

function submitText(id) {
    /*
    The function is called whenever the scripts in the text boxes are changed.
    It reads the script and plot the new graphs.
    */
    var textFromFileLoaded = document.getElementById("box" + id).value;

    g = JSON.parse(textFromFileLoaded);
    database = g.DB;
    xaxis = "Year";
    yaxis = g.Yaxis;
    n = id;
    lowDate = g.lowDate;
    highDate = g.highDate;
    gtype = g.gtype;
    color = g.color;

    setOptions(database, yaxis, xaxis, gtype, lowDate, highDate, n, color);
}

function displayHelp() {
    let help = document.querySelector("#help")
    help.style.display = "block"
}
function closeHelp() {
    //Close the fileupload window
    let help = document.querySelector("#help")
    help.style.display = "none"
}
window.onclick = function (e) {
    let help = document.querySelector("#help")
    if (e.target == help) {
        help.style.display = "none"
    }
}

function searchHelp() {
    var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("help_input");
    filter = input.value.toUpperCase();
    ul = document.getElementById("ul");
    li = ul.getElementsByTagName("li");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByTagName("a")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

//Graphs data for the nth graph.
function graphData(database, xaxis, yaxis, n, lowDate, highDate, minDate, maxDate, gtype, color) {
    if (n == 0 && graph0 !== undefined)
        graph0.destroy();
    else if (n == 1 && graph1 !== undefined)
        graph1.destroy();

    //add labels and data to respective arrays
    d3.csv("/csv/" + database + ".csv")
        .then(function (data) {
            var labelsArr = [];
            var dataArr = [];
            for (var i = 0; i < data.length; i++) {
                if (parseInt(data[i][xaxis], 10) >= lowDate && parseInt(data[i][xaxis], 10) <= highDate) {
                    labelsArr.push(data[i][xaxis]);
                    dataArr.push(data[i][yaxis]);
                }
            }

            //add driving question
            var dq = document.getElementById("driving_question");
            d3.csv("/csv/driving-questions.csv").then(function (q_data) {
                question = q_data[0][database];
                dq.innerHTML = question;
            })

            //create graph
            var ctx = document.getElementById("canvas" + n);
            ctx = ctx.getContext("2d");
            if (n == 0) {
                graph0 = new Chart(ctx, {
                    type: gtype,
                    data: {
                        datasets: [{
                            label: yaxis + " (" + gtype + ")",
                            data: dataArr
                        }],
                        labels: labelsArr
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Year'
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: database
                                }
                            }]
                        },
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
                            colorschemes: { scheme: colorSchemeValues[color] }
                        }
                    }
                });
                graph0.DB = database;
                graph0.X = xaxis;
                graph0.Y = yaxis;
                graph0.lowDate = lowDate;
                graph0.highDate = highDate;
                graph0.minDate = minDate;
                graph0.maxDate = maxDate;
                graph0.type = gtype;
                graph0.color = color;
            }
            else if (n == 1) {
                graph1 = new Chart(ctx, {
                    type: gtype,
                    data: {
                        datasets: [{
                            label: yaxis + " (" + gtype + ")",
                            data: dataArr
                        }],
                        labels: labelsArr
                    },
                    options: {
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Year'
                                }
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: database
                                }
                            }]
                        },
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
                            colorschemes: { scheme: colorSchemeValues[color] }
                        }
                    }
                });
                graph1.DB = database;
                graph1.X = xaxis;
                graph1.Y = yaxis;
                graph1.lowDate = lowDate;
                graph1.highDate = highDate;
                graph1.minDate = minDate;
                graph1.maxDate = maxDate;
                graph1.type = gtype;
                graph1.color = color;
            }
        })
}

function updateScript(Id, DB, Yaxis, lowDate, highDate, gtype, color) {
    var newTextValue = {
        "DB": DB,
        "Yaxis": Yaxis,
        "lowDate": lowDate,
        "highDate": highDate,
        "gtype": gtype,
        "color": color
    };

    textValue = JSON.stringify(newTextValue, null, 2);
    // console.log(textValue)
    document.getElementById("box" + Id).value = textValue;
    //console.log(" updateScript");
}

//Runs when user clicks the submit button.
//n = 0 when the button is for the first graph
//n = 1 when the button is for the second graph
function submitGraphData(n) {
    var el = document.getElementById("database" + n);
    var dbOption = el.options[el.selectedIndex].value;

    var xOption = "Year";

    el = document.getElementById("yaxis" + n);
    var yOption = el.options[el.selectedIndex].value;

    el = document.getElementById("gtype" + n);
    var gtype = el.options[el.selectedIndex].value;

    var lowDate = $("#range" + n).data("from");
    var highDate = $("#range" + n).data("to");
    var minDate = $("#range" + n).data("min");
    var maxDate = $("#range" + n).data("max");

    var color = document.getElementById("colorButton" + n).value;

    graphData(dbOption, xOption, yOption, n, lowDate, highDate, minDate, maxDate, gtype, color);
    updateScript(n, dbOption, yOption, lowDate, highDate, gtype, color);

    sendData(n, 'submit')
}

/* setOption does the following two things:
   1. set the menu on the left to the appropriate values: 
   input parameters (databaseName, yaxis, xaixs, gtype, lowDate, highDate)
   2. plot graphs based on input. 
*/
function setOptions(databaseName, yaxis, xaxis, gtype, lowDate, highDate, n, color) {


    var el = document.getElementById("database" + n);
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].text === databaseName) {
            el.selectedIndex = i;
            break;
        }
    }

    el = document.getElementById("gtype" + n);
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].value === gtype) {
            el.selectedIndex = i;
            break;
        }
    }

    //clear y-axis menu
    clearMenu("yaxis" + n, false);

    //read the csv file to get all keys
    d3.csv("/csv/" + databaseName + ".csv")
        .then(function (data) {
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
                if (keys[i] == yaxis) {
                    elY.selectedIndex = i + 1;
                }
            }

            //update date range slider values
            var years = [];
            for (var i = 0; i < data.length; i++) {
                years.push(data[i]["Year"]);
            }
            if (highDate === 0) {
                lowDate = years[0];
                highDate = years[years.length - 1];
            }

            updateSliderOnlyRange(n, years[0], years[years.length - 1], lowDate, highDate);

            //enable the submit button
            document.getElementById("submit" + n).disabled = false;

            //graph data
            graphData(databaseName, xaxis, yaxis, n, lowDate, highDate, years[0], years[years.length - 1], gtype, color);
        })
        .catch(function (error) {
            if (error.message === "404 Not Found") {
                alert("Database not found: " + databaseName);
            }
        })

    //reset color button;
    changeColorButton(n, color);
    document.getElementById("colorButton" + n).disabled = false;

    if (firstLoad) {
        for (i in defaultTextValue.Graphs) {
            g = defaultTextValue.Graphs[i];
            textValue = JSON.stringify(g, null, 2);
            // console.log(textValue);
            document.getElementById("box" + i).value = textValue;
        }
    } else {
        sendData(n, 'setOptions');
    }
    
}

//Runs when the user clicks the default button.
//Switches all database, y-axis, graph type values to
//default values, which are set at the top of this file.
//Enables y-axis, graph type select menus
//Updates date range sliders to proper mins & maxes
//Enables date range sliders
function switchToDefault() {
    firstLoad = true;
    setOptions(defaultDatabase0, defaultYAxis0, defaultXAxis0, 'bar', 0, 0, 0, "orange");
    setOptions(defaultDatabase1, defaultYAxis1, defaultXAxis1, 'bar', 0, 0, 1, "darkBrown");
    firstLoad = false;
}

//Runs when the user clicks the clear button.
//Calls clearValues() for both graph 1 and 2.
function clearAllValues() {
    clearValues(0);
    clearValues(1);
}

//Clears values for database, y-axis, graph type menus.
//Clears date range sliders
//Disables submit buttons
//Clears graphs and driving questions
//Disables save buttons
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

    if (n == 0) {
        graph0.destroy();
        graph0 = undefined;
    }
    else if (n == 1) {
        graph1.destroy();
        graph1 = undefined;
    }

    // clear driving question
    document.getElementById("driving_question").innerHTML = "";
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
        var previousColor = document.getElementById("colorButton" + n).value;

        //clear and enable y-axis menu
        clearMenu("yaxis" + n, false);

        //load keys into y-axis menu
        d3.csv("/csv/" + dbOption + ".csv")
            .then(function (data) {
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
            .catch(function (error) {
                if (error.message === "404 Not Found") {
                    alert("Database not found: " + database);
                }
            })

        //enable graph type menu
        var el = document.getElementById("gtype" + n);
        el.disabled = false;
        if (previousGTypeValue == "line")
            el.selectedIndex = 1;
        if (previousGTypeValue == "bar")
            el.selectedIndex = 2;

        //enable color button
        changeColorButton(n, previousColor);
        document.getElementById("colorButton" + n).disabled = false;
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

//Clears all values in slider
//Can also disable slider
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
//Can also enable slider
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
//Can also enable slider
function updateSliderOnlyRange(n, minimum, maximum, lowDate, highDate) {
    $("#range" + n).data("ionRangeSlider").update({
        min: minimum,
        max: maximum,
        from: lowDate,
        to: highDate,
        disable: false,
    });
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

//Opens and closes color pallette
function showColorWheel(num) {
    var wheel = document.getElementById("colorWheel" + num);
    if (wheel.style.visibility != "visible")
        wheel.style.visibility = "visible";
    else
        wheel.style.visibility = "hidden";
}

//Changes color button
function changeColorButton(num, colorStr) {
    var btn = document.getElementById("colorButton" + num);
    btn.style.backgroundColor = colorValues[colorStr];
    btn.description = colorSchemeValues[colorStr];
    btn.value = colorStr;
    var wheel = document.getElementById("colorWheel" + num);
    wheel.style.visibility = "hidden";
}

//Reset color button
function resetColorButton(num) {
    changeColorButton(num, "gray");
}

//Download graph as jpg
function downloadGraph(n) {
    var url_base64jp = document.getElementById("canvas" + n).toDataURL("image/jpg");
    var a = document.getElementById("download" + n);
    a.href = url_base64jp;
    sendData(n, 'download');
}

//Changes site color theme
function changeColorTheme(element) {
    if (element.checked) {  //dark
        Chart.defaults.global.defaultFontColor = "white";
        //redraw graphs 0 and 1
        regraph(0);
        regraph(1);

        var x = document.getElementsByClassName("logo")[0];
        x.src = "img/HistoryInDatalogodark.png";

        x = document.getElementsByTagName("BODY")[0];
        x.style.backgroundColor = "#413f3d";

        x = document.getElementsByClassName("col1")[0];
        x.style.color = "white";

        x = document.getElementsByClassName("row")[0];
        x.style.backgroundColor = "#263859";
        x = document.getElementsByClassName("row")[1];
        x.style.backgroundColor = "#263859";

        x = document.getElementsByClassName("form-control")[0];
        x.style.backgroundColor = "black";
        x.style.color = "white";
        x = document.getElementsByClassName("form-control")[1];
        x.style.backgroundColor = "black";
        x.style.color = "white";

        x = document.getElementsByClassName("select");
        for (var y = 0; y < x.length; y++) {
            x[y].style.backgroundColor = "black";
            x[y].style.color = "white";
        }

        x = document.getElementsByClassName("col2")[0];
        x.style.backgroundColor = "#525252";
        x.style.color = "white";

        x = document.getElementsByClassName("modal-content")[0];
        x.style.backgroundColor = "#555555";
        x.style.color = "white";

        x = document.getElementsByTagName("legend");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "white";
        }
    }
    else {  //light
        Chart.defaults.global.defaultFontColor = "#524636";
        //redraw graphs 0 and 1
        regraph(0);
        regraph(1);

        var x = document.getElementsByClassName("logo")[0];
        x.src = "img/HistoryInDatalogolight.png";

        x = document.getElementsByTagName("BODY")[0];
        x.style.backgroundColor = "#c2edce";

        x = document.getElementsByClassName("col1")[0];
        x.style.color = "#524636";

        x = document.getElementsByClassName("select");
        for (var y = 0; y < x.length; y++) {
            x[y].style.backgroundColor = "white";
            x[y].style.color = "black";
        }

        x = document.getElementsByClassName("row")[0];
        x.style.backgroundColor = "#92bbbd";
        x = document.getElementsByClassName("row")[1];
        x.style.backgroundColor = "#92bbbd";

        x = document.getElementsByClassName("form-control")[0];
        x.style.backgroundColor = "white";
        x.style.color = "black";
        x = document.getElementsByClassName("form-control")[1];
        x.style.backgroundColor = "white";
        x.style.color = "black";

        x = document.getElementsByClassName("col2")[0];
        x.style.backgroundColor = "#f6f6f2";
        x.style.color = "#524636";

        x = document.getElementsByClassName("modal-content")[0];
        x.style.backgroundColor = "white";
        x.style.color = "black";

        x = document.getElementsByTagName("legend");
        for (var y = 0; y < x.length; y++) {
            x[y].style.color = "black";
        }
    }
}

//redraws a graph in the second column
function regraph(n) {
    var db = undefined;
    var x = undefined;
    var y = undefined;
    var lowDate = undefined;
    var highDate = undefined;
    var minDate = undefined;
    var maxDate = undefined;
    var graphType = undefined;
    var color = undefined;

    if (n == 0) {
        if (graph0 == undefined)
            return;
        db = graph0.DB;
        x = graph0.X;
        y = graph0.Y;
        lowDate = graph0.lowDate;
        highDate = graph0.highDate;
        minDate = graph0.minDate;
        maxDate = graph0.maxDate;
        graphType = graph0.type;
        color = graph0.color;
    }
    else {
        if (graph1 == undefined)
            return;
        db = graph1.DB;
        x = graph1.X;
        y = graph1.Y;
        lowDate = graph1.lowDate;
        highDate = graph1.highDate;
        minDate = graph1.minDate;
        maxDate = graph1.maxDate;
        graphType = graph1.type;
        color = graph1.color;
    }

    graphData(db, x, y, n, lowDate, highDate, minDate, maxDate, graphType, color);
}



function populateGraph(id){
    
    var idPHP = JSON.stringify(id);
      
      
      //search in the database for matching primary key(id)
      $.ajax({
        url: '../getData.php',
        type: 'POST',
        data: { idPHP: id },
        success: function (data) {
            
            
            
            var title = document.getElementById("title");
            title.innerHTML = "";
            title.innerHTML = "Graph 1: Imported From DV4L"
           
            
            console.log(data);
                
            
            //removes spaces to put data in a json format
            data = data.replace(/\s\s/g, '');

            
            console.log(data);
            
            
            var json = JSON.parse(data);
            
            
            db = json["DB"];
            y = json["Yaxis"];
            lowDate = json["lowDate"];
            highDate = json["highDate"];
            graphType = json['gtype'];
            color = 'orange'; //change
        

        setOptions(db, y, "Year", graphType, lowDate, highDate, 0, color);
        
        updateScript(0, db, y, lowDate, highDate, graphType, color);
            

            
            
            
        
        
        },
        error: function (XMLHttpRequest, textStatus, errorThrown) {
          alert('Status: ' + textStatus);
          alert('Error: ' + errorThrown);
        },
      });
    
    
    
}
