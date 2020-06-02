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

var defaultDatabase0 = "Populations";
var defaultXAxis0 = "Year";
var defaultYAxis0 = "Rwanda";
var defaultDatabase1 = "Populations";
var defaultXAxis1 = "Year";
var defaultYAxis1 = "Algeria";

var graph0 = undefined;
var graph1 = undefined;

var jsonObj = {};

//Use browser's FileReader to read in uploaded file
function handleScriptingFiles(files) {
    //Check for file API support
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    }
    else {
        alert('FileReader are not supported in this browser.');
    }
    closeModal();
}

//reads uploaded script file as text
//calls loadHandler() when the file finishes loading
function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8

    reader.readAsText(fileToRead);
    reader.onload = loadHandler;
    // Handle errors load

    reader.onerror = errorHandler;
}

//Is called when the script file is uploaded
//It parses the script as a json object
//It writes the script into the text boxes
//It plots graphs based on script inputs
function loadHandler(event) {
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

//runs if file upload is unsuccessful
function errorHandler(evt) {
    if (evt.target.error.name == "NotReadableError") {
        alert("Cannot read file !");
    }
}

//Runs whenever the scripts in the text boxes are changed
//And the user clicks out of the text boxes' focus
//It reads the script and plots the new graphs
function submitText(id) {
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
    let help = document.querySelector("#help");
    help.style.display = "block";
}

function closeHelp() {
    let help = document.querySelector("#help");
    help.style.display = "none";
}

window.onclick = function(e) {
    let help = document.querySelector("#help");
    if (e.target == help) {
        help.style.display = "none";
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
    document.getElementById("box" + Id).value = textValue;
}

//sets menus on the left to appropriate values
//plots graphs based on input
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
            document.getElementById("box" + (parseInt(i) + 1)).value = textValue;
        }
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
    setOptions(defaultDatabase0, defaultYAxis0, defaultXAxis0, 'bar', 0, 0, 1, "orange");
    setOptions(defaultDatabase1, defaultYAxis1, defaultXAxis1, 'bar', 0, 0, 2, "darkBrown");
    firstLoad = false;
}

//Download graph as jpg
function downloadGraph(n) {
    var url_base64jp = document.getElementById("canvas" + n).toDataURL("image/jpg");
    var a = document.getElementById("download" + n);
    a.href = url_base64jp;
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