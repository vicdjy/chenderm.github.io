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

var defaultDatabase = "Populations";
var defaultXAxis1 = "Year";
var defaultYAxis1 = "Rwanda";
var defaultXAxis2 = "Year";
var defaultYAxis2 = "Algeria";

var colorValues = {
    "gray": "#6f6f6f",
    "white": "#ffffff",
    "red": "#f81b02",
    "pink": "#ff388c",
    "darkBrown": "#543005",
    "brown": "#a6611a",
    "orange": "#f09415",
    "yellow": "#f2d908",
    "lightGreen": "#9acd4c",
    "green": "#549e39",
    "lightBlue": "#31b6fd",
    "blue": "#0f6fc6",
    "darkBlue": "#294171",
    "darkPurple": "#663366",
    "purple": "#ac3ec1",
    "lightPurple": "#af8dc3",
};

var colorSchemeValues = {
    "gray": "office.Mesh6",
    "white": "brewer.Greys8",
    "red": "office.Atlas6",
    "pink": "office.Verve6",
    "darkBrown": "brewer.BrBG11",
    "brown": "brewer.BrBG4",
    "orange": "office.Basis6",
    "yellow": "office.Orbit6",
    "green": "office.UrbanPop6",
    "lightGreen": "office.Circuit6",
    "green": "office.Green6",
    "blue": "office.Blue6",
    "darkBlue": "office.Folio6",
    "darkPurple": "office.Advantage6",
    "purple": "office.Celestial6",
    "lightPurple": "brewer.PRGn3",
}

var database_dict = {"Life, Death, Populations": [
                        "Populations", 
                        "Population Female Percentage", 
                        "Population Female Percentage at Birth",
                        "Life Expectancy - Continents",
                        "Median Age",
                        "Births",
                        "Births Per Woman",
                        "Births Per 1000 People",
                        "Child Deaths",
                        "Child Mortality Rates",
                        "Survival Rate to Age 65 - Male",
                        "Survival Rate to Age 65 - Female"],
                     "Military": [
                        "Military Personnel",
                        "Military Personnel Percent of Population",
                        "Military Spending",
                        "Military Spending Percent of GDP"],
                     "Economies": [
                        "GDP",
                        "GDP Per Capita",
                        "Economic Freedom Scores"],
                     "Environment": [
                        "CO2 Emissions",
                        "CO2 Emissions Per Capita",
                        "CO2 Emissions Percentages",
                        "CO2 Emissions Cumulative",
                        "CO2 Emissions Cumulative Percentages"]
                    }

var graph1 = undefined;
var graph2 = undefined;

var savedGraphs = [];

window.drivingQuestion = {};
var line = "";

//When the page first loads.
$(document).ready( function() {
    console.log("Ready!");
    Chart.defaults.global.defaultFontColor = "#524636";

    for (var i = 0; i < 10; i++) {
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

let modal = document.querySelector(".modal")

function displayModal(){
    let modal = document.querySelector(".modal")
    modal.style.display = "block"
}
function closeModal(){
    let modal = document.querySelector(".modal")
    modal.style.display = "none" 
}
window.onclick = function(e){
    let modal = document.querySelector(".modal")
    if(e.target == modal){
        modal.style.display = "none"
    }
}

function handleFiles(files) {
    // Check for the various File API support.
    if (window.FileReader) {
        // FileReader are supported.
        getAsText(files[0]);
    } else {
        alert('FileReader are not supported in this browser.');
    }
}

function getAsText(fileToRead) {
    var reader = new FileReader();
    // Read file into memory as UTF-8      
    reader.readAsText(fileToRead);
    // Handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
}

function loadHandler(event) {
    var csv = event.target.result;
    processData(csv);
}

function processData(csv) {
    var allTextLines = csv.split(/\r\n|\n/);
    for (var i=0; i<1; i++) {
        var data = allTextLines[i].split(';');
        var tarr = [];
        for (var j=0; j<data.length; j++) {
            tarr.push(data[j]);
        }
        line = tarr;
    }

}

function errorHandler(evt) {
    if(evt.target.error.name == "NotReadableError") {
        alert("Canno't read file !");
    }
}

function submitDrivingQuestions(){
    var checkboxes = document.getElementsByName("database_selection");  
    var numberOfCheckedItems = 0;  
    var dbSelected = [];
    for(var i = 0; i < checkboxes.length; i++)  
    {   
        if(checkboxes[i].checked)
        { 
            numberOfCheckedItems++;
            dbSelected.push(checkboxes[i].value);
            drivingQuestion[checkboxes[i].value] = line;
        }
    }
    if (numberOfCheckedItems == 0)
    {  
        alert("You have to select a database");  
        return false;  
    }
    selectDatabases(dbSelected);
    verifyDB(1);
    verifyDB(2);
    alert("Submitted");
}

function selectDatabases(dbSelected){
    select = document.getElementById("database1");
    select.innerHTML = '';
    var empty_option = document.createElement("option");
    select.appendChild(empty_option);
    for (const db of dbSelected) {
        var option = document.createElement("option");
        option.val = db;
        option.text = db.charAt(0).toUpperCase() + db.slice(1);
        select.appendChild(option);
    }
    select = document.getElementById("database2");
    select.innerHTML = '';
    var empty_option = document.createElement("option");
    select.appendChild(empty_option);
    for (const db of dbSelected) {
        var option = document.createElement("option");
        option.val = db;
        option.text = db.charAt(0).toUpperCase() + db.slice(1);
        select.appendChild(option);
    }
}


/*function displayQuestion(){
    var dq = document.getElementById("driving_question1");
    const selectedFile = document.getElementById('driving_question_input').files[0];
    d3.csv(selectedFile).then(function(q_data){
        question = q_data[0]['Populations'];
        dq.innerHTML = question;
    })
}*/

//Graphs data for the nth graph.
function graphData(database, xaxis, yaxis, n, lowDate, highDate, minDate, maxDate, gtype, color) {
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

        //add driving question (only use the first graph)
        if (n==1) {
            var dq = document.getElementById("driving_question");
            var question = "";
            if (typeof drivingQuestion[database] === 'undefined') {
                //alert("this database does not have a driving question");
                question = "default driving question";
            }
            else {
                question = drivingQuestion[database];
            }
            
            dq.innerHTML = question;
        }   

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
                        colorschemes: {scheme: colorSchemeValues[color],}
                    }
                }
            });

            //create descriptions & properties for graphs
            //needed for tooltip hover in saved region
            var description = {
                "DB": database,
                "Yaxis": yaxis,
                "lowDate": lowDate,
                "highDate": highDate,
                "gtype": gtype
            }
            graph1.description = JSON.stringify(description, null, 2);
            graph1.DB = database;
            graph1.X = xaxis;
            graph1.Y = yaxis;
            graph1.lowDate = lowDate;
            graph1.highDate = highDate;
            graph1.minDate = minDate;
            graph1.maxDate = maxDate;
            graph1.type = gtype;
            graph1.color = color;
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
                        colorschemes: {scheme: colorSchemeValues[color],}
                    }
                }
            });

            //create descriptions & properties for graphs
            //needed for tooltip hover in saved region
            var description = { 
                "DB": database,
                "Yaxis": yaxis,
                "lowDate": lowDate,
                "highDate": highDate,
                "gtype": gtype
            }
            graph2.description = JSON.stringify(description, null, 2);
            graph2.DB = database;
            graph2.X = xaxis;
            graph2.Y = yaxis;
            graph2.lowDate = lowDate;
            graph2.highDate = highDate;
            graph2.minDate = minDate;
            graph2.maxDate = maxDate;
            graph2.type = gtype;
            graph2.color = color;
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

    var color = document.getElementById("colorButton" + n).value;

    graphData(dbOption, xOption, yOption, n, lowDate, highDate, lowDate, highDate, gtype, color);
}

//Runs when the user clicks the default button.
//Switches databases to default
//Switches y axes to default and enables the menu
//Resets date ranges
//Switches graph types to default and enables the menu
//Resets & enables color button
function switchToDefault() {
    //set database 1 to default
    switchToDefaultDatabases(1);

    //clear y-axis menu 1
    clearMenu("yaxis1", false);
    //read the csv file to get all keys
    d3.csv("/csv/" + defaultDatabase + ".csv")
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
        graphData(defaultDatabase, defaultXAxis1, defaultYAxis1, 1, years[0], years[years.length - 1], years[0], years[years.length - 1], 'bar', "orange");
    })
    .catch(function(error) {
        if (error.message === "404 Not Found") {
            alert("File not found: " + database);
        }
    })

    //reset graph type menu 1
    document.getElementById("gtype1").selectedIndex = 2;

    //reset color button 1
    changeColorButton(1, "orange");
    document.getElementById("colorButton1").disabled = false;

    //set database 2 to default
    switchToDefaultDatabases(2);

    //clear y-axis menu
    clearMenu("yaxis2", false);
    //read the csv file to get all keys
    d3.csv("/csv/" + defaultDatabase + ".csv")
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
        graphData(defaultDatabase, defaultXAxis2, defaultYAxis2, 2, years[0], years[years.length - 1], years[0], years[years.length - 1], 'bar', "darkBrown");
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
    changeColorButton(2, "darkBrown");
    document.getElementById("colorButton2").disabled = false;
}

// Runs when user clicks the default button
// Show all avaliable databases in the drop down menu
// Select the default database
function switchToDefaultDatabases(n) {
    var el = document.getElementById("database" + n);
    el.innerHTML = '';
    var empty_option = document.createElement("option");
    el.appendChild(empty_option);
    for(var key in database_dict) {
        var value = database_dict[key];
        var optgroup = document.createElement("optgroup");
        optgroup.label = key;
        for (index=0; index < value.length; index++) {
            var option = document.createElement("option");
            option.val = value[index];
            option.text = value[index];
            optgroup.appendChild(option);
        }
        el.appendChild(optgroup);
    }
    
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].text === defaultDatabase) {
            el.selectedIndex = i;
            break;
        }
    }
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

    var destination = saveNum;
    var g = savedGraphs[saveNum - 1];
    if (g != null)
        g.destroy();
    savedGraphs[saveNum - 1] = undefined;
    var tip = document.getElementById("tip" + saveNum);
    tip.style.display = "none";
    tip.style.backgroundColor = "transparent";
    tip.innerHTML = "";

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
    }

    //check if current graph is already saved
    for (var i = 0; i < savedGraphs.length; i++) {
        if (savedGraphs[i] != undefined && hoverText == savedGraphs[i].description) {
            if (!swap) {
                alert("Graph " + graphNum + " is already saved at box #" + (i + 1));
            }
            var exit = document.getElementById("exit" + saveNum);
            exit.style.visibility = "hidden";
            var swap = document.getElementById("swap" + saveNum);
            swap.style.visibility = "hidden";
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
                backgroundColor: "#015c92",
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
    savedGraphs[destination - 1] = g;

    var tip = document.getElementById("tip" + destination);
    tip.style.display = "block";
    tip.style.backgroundColor = "#0000005c";
    hoverText = hoverText.replace(/\n( *)/g, function (match, p1) {
        return '<br>' + '&nbsp;'.repeat(p1.length);
    });
    tip.innerHTML = hoverText;
    tip.style.visibility = "hidden";

    var exit = document.getElementById("exit" + destination);
    exit.style.visibility = "visible";

    var swap = document.getElementById("swap" + destination);
    swap.style.visibility = "visible";
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
    graphData(savedDB, savedX, savedY, graphNum, savedLowDate, savedHighDate, savedMinDate, savedMaxDate, savedType, savedColor);

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

    changeColorButton(graphNum, savedColor);

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

//Relocates a saved graph to another spot
//Swaps if both saved spots have graphs
function relocate(prevSave, nextSave) {
    if (prevSave == nextSave) return;
    if (savedGraphs[nextSave - 1] == undefined || savedGraphs[nextSave - 1] == null) {
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

        var tip = document.getElementById("tip" + prevSave);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";

        deleteGraph(prevSave);

        var canvas = document.getElementById("saved" + nextSave);
        canvas = canvas.getContext("2d");
        var g = new Chart(canvas, {
            type: prevGraphType,
            options: {
                scales: {
                    xAxes: [{display: false}],
                    yAxes: [{display: false}],
                },
                legend: {display: false},
                responsive: true,
                maintainAspectRatio: false,
                tooltips: false,
                animation: {duration: 0}
            },
            data: {
                labels: prevLabelsArr,
                datasets: [{
                    data: prevDataArr,
                    backgroundColor: "rgba(255,255,255,1)",
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            }
        });
        g.description = prevHoverText;
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

        tip = document.getElementById("tip" + nextSave);
        tip.style.display = "block";
        tip.style.backgroundColor = "#0000005c";
        prevHoverText = prevHoverText.replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
        tip.innerHTML = prevHoverText;
        tip.style.visibility = "hidden";

        var exit = document.getElementById("exit" + nextSave);
        exit.style.visibility = "visible";

        var swap = document.getElementById("swap" + nextSave);
        swap.style.visibility = "visible";
    }
    else {
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

        var tip = document.getElementById("tip" + prevSave);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";

        deleteGraph(prevSave);

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

        tip = document.getElementById("tip" + nextSave);
        tip.style.display = "none";
        tip.style.backgroundColor = "transparent";
        tip.innerHTML = "";

        deleteGraph(nextSave);

        var canvas1 = document.getElementById("saved" + nextSave);
        canvas1 = canvas1.getContext("2d");
        var g1 = new Chart(canvas1, {
            type: graphType1,
            options: {
                scales: {
                    xAxes: [{display: false}],
                    yAxes: [{display: false}],
                },
                legend: {display: false},
                responsive: true,
                maintainAspectRatio: false,
                tooltips: false,
                animation: {duration: 0}
            },
            data: {
                labels: labelsArr1,
                datasets: [{
                    data: dataArr1,
                    backgroundColor: "rgba(255,255,255,1)",
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            }
        });
        g1.description = hoverText1;
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

        tip = document.getElementById("tip" + nextSave);
        tip.style.display = "block";
        tip.style.backgroundColor = "#0000005c";
        hoverText1 = hoverText1.replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
        tip.innerHTML = hoverText1;
        tip.style.visibility = "hidden";

        var exit = document.getElementById("exit" + nextSave);
        exit.style.visibility = "visible";

        var swap = document.getElementById("swap" + nextSave);
        swap.style.visibility = "visible";

        var canvas2 = document.getElementById("saved" + prevSave);
        canvas2 = canvas2.getContext("2d");
        var g2 = new Chart(canvas2, {
            type: graphType2,
            options: {
                scales: {
                    xAxes: [{display: false}],
                    yAxes: [{display: false}],
                },
                legend: {display: false},
                responsive: true,
                maintainAspectRatio: false,
                tooltips: false,
                animation: {duration: 0}
            },
            data: {
                labels: labelsArr2,
                datasets: [{
                    data: dataArr2,
                    backgroundColor: "rgba(255,255,255,1)",
                    pointRadius: 0,
                    pointHoverRadius: 0
                }]
            }
        });
        g2.description = hoverText2;
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

        tip = document.getElementById("tip" + prevSave);
        tip.style.display = "block";
        tip.style.backgroundColor = "#0000005c";
        hoverText2 = hoverText2.replace(/\n( *)/g, function (match, p1) {
            return '<br>' + '&nbsp;'.repeat(p1.length);
        });
        tip.innerHTML = hoverText2;
        tip.style.visibility = "hidden";

        exit = document.getElementById("exit" + prevSave);
        exit.style.visibility = "visible";

        swap = document.getElementById("swap" + prevSave);
        swap.style.visibility = "visible";
    }
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

    var swap = document.getElementById("swap" + savedNum);
    swap.style.visibility = "hidden";
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
    changeColorButton(num, "white");
}

//Runs when dragging to save a graph into a saved region
function drag(ev, graph) {
    ev.dataTransfer.setData("text", graph);
}

//Runs when dropping a graph over a saved region
function drop(ev, destination) {
    ev.preventDefault();
    
    var data = ev.dataTransfer.getData("text");
    if (data.startsWith("graph")) {
        if (destination.startsWith("graph")) {
            //do nothing
        }
        else if (destination.startsWith("saved")) {
            var graphNum = data.substring(5);
            var saveNum = destination.substring(5);
            if (savedGraphs[saveNum - 1] == undefined || savedGraphs[saveNum - 1] == null) {
                saveGraph(saveNum, graphNum, false)
            }
            else {
                swap(saveNum, graphNum);
            }
        }
    }
    else if (data.startsWith("saved")) {
        if (destination.startsWith("graph")) {
            var graphNum = destination.substring(5);
            var saveNum = data.substring(5);
            swap(saveNum, graphNum);
        }
        else if (destination.startsWith("saved")) {
            var prevSave = data.substring(5);
            var nextSave = destination.substring(5);
            relocate(prevSave, nextSave);
        }
    }
}

//Allows drops to occur
function allowDrop(ev) {
    ev.preventDefault();
}