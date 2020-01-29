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

var defaultDatabase2 = "Military";
var defaultXAxis2 = "Year";
var defaultYAxis2 = "Algeria";

var defaultDatabase3 = "County Demographic";
var defaultXAxis3 = "State";
var defaultYAxis3 = "Income.Median Household Income";

var defaultDatabase4 = "LifeExpectancy";
var defaultXAxis4 = "Entity";
var defaultYAxis4 = "Life expectancy (years)";

var defaultDatabase5 = "Slavery";
var defaultXAxis5 = "Buyer.County of Origin";
var defaultYAxis5 = "Transaction.Sale Details.Price";

var graph1 = undefined;
var graph2 = undefined;

//When the page first loads.
$(document).ready( function() {
    console.log("Ready!");
    Chart.defaults.global.defaultFontColor = "white";

    switchToDefault();
});

//Graphs data for the first graph.
function graphData(database, xaxis, yaxis, n) {
    if (n == 1 && graph1 !== undefined) {
        graph1.destroy();
    }
    else if (n == 2 && graph2 !== undefined) {
        graph2.destroy();
    }

    d3.csv("/csv/" + database + ".csv")
    .then(function(data) {
        var labelsArr = [];
        var dataArr = [];
        for (var i = 0; i < data.length; i++) {
            labelsArr.push(data[i][xaxis]);
            dataArr.push(data[i][yaxis]);
        }

        //add driving question
        var dq = document.getElementById("driving_question");
        d3.csv("/csv/driving-questions.csv").then(function(q_data){
            question = q_data[0][database];
            dq.innerHTML=question;
        })
        
        var ctx = document.getElementById("canvas" + n);
        ctx.height = 175;
        ctx = ctx.getContext("2d");
        if (n == 1) {
            graph1 = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labelsArr,
                    datasets: [{
                        label: yaxis,
                        data: dataArr,
                        backgroundColor: "rgba(188,230,255,1)",
                    }]
                }
            });
        }
        else if (n == 2) {
            graph2 = new Chart(ctx, {
                type: "line",
                data: {
                    labels: labelsArr,
                    datasets: [{
                        label: yaxis,
                        data: dataArr,
                        backgroundColor: "rgba(248,214,5,1)"
                    }]
                }
            });
        }
    })
}

//Runs when user clicks the submit button.
//n = 1 when the button is for the first graph
//n = 2 when the button is for the second graph
function submitGraphData(n) {
    var el = document.getElementById("database" + n);
    var dbOption = el.options[el.selectedIndex].value;
    el = document.getElementById("xaxis" + n);
    var xOption = el.options[el.selectedIndex].value;
    el = document.getElementById("yaxis" + n);
    var yOption = el.options[el.selectedIndex].value;
    graphData(dbOption, xOption, yOption, n);
}

//Runs when the user clicks the default button.
//Switches all database, x-axis, y-axis values to
//default values, which are set at the top of this file.
//Enables x-axis and y-axis select menus
function switchToDefault() {
    //set database 1 to default
    // var fs = require('fs');
    // var files = fs.readdirSync('/csv/');
    var el = document.getElementById("database1");
    for (var i = 0; i < el.options.length; i++) {
        if (el.options[i].text === defaultDatabase1) {
            el.selectedIndex = i;
            break;
        }
    }

    clearMenu("xaxis1", false);
    clearMenu("yaxis1", false);

    //read the csv file to get all keys
    d3.csv("/csv/" + defaultDatabase1 + ".csv")
    .then(function(data) {
        var keys = Object.keys(data[0]);
        keys.sort();
        var elX = document.getElementById("xaxis1");
        var option = document.createElement("option");
        console.log(keys);
        option.appendChild(document.createTextNode(keys[11]));
        option.value = keys[11];
        elX.appendChild(option);
        elX.selectedIndex = 1;
        //add each key to x-axis and y-axis menu
        for (var i = 0; i < keys.length-1; i++) {
            var elY = document.getElementById("yaxis1");
            option = document.createElement("option");
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
        graphData(defaultDatabase1, defaultXAxis1, defaultYAxis1, 1);
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

    clearMenu("xaxis2", false);
    clearMenu("yaxis2", false);

    //read the csv file to get all keys
    d3.csv("/csv/" + defaultDatabase2 + ".csv")
    .then(function(data) {
        var keys = Object.keys(data[0]);
        keys.sort();
        var elX = document.getElementById("xaxis2");
        var option = document.createElement("option");
        console.log(keys);
        option.appendChild(document.createTextNode(keys[11]));
        option.value = keys[11];
        elX.appendChild(option);
        elX.selectedIndex = 1;
        //add each key to x-axis and y-axis menu
        for (var i = 0; i < keys.length-1; i++) {
            var elY = document.getElementById("yaxis2");
            option = document.createElement("option");
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
        graphData(defaultDatabase2, defaultXAxis2, defaultYAxis2, 2);
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

//Clears values for database, x-axis, and y-axis.
function clearValues(n) {
    var el = document.getElementById("database" + n);
    el.selectedIndex = 0;
    clearMenu("xaxis" + n, true);
    clearMenu("yaxis" + n, true);
    document.getElementById("submit" + n).disabled = true;
    
    if (n == 1) {
        graph1.destroy();
    }
    else if (n == 2) {
        graph2.destroy();
    }
    // clear driving question
    var dq = document.getElementById("driving_question");
    dq.innerHTML = "";
}

//Runs when the option for database changes.
//If the empty option is selected, the x-axis and y-axis menus
//and submit button are disabled.
//If a non-empty option is selected, the x-axis and y-axis menus
//are enabled, but the submit button will remain disabled
//until there are non-empty values for x-axis and y-axis menus.
function verifyDB(n) {
    var menu = document.getElementById("database" + n);
    var dbOption = menu.options[menu.selectedIndex].value;
    if (dbOption == "") {
        //if no database selected, disable x-axis, y-axis, submit button
        clearMenu("xaxis" + n, true);
        clearMenu("yaxis" + n, true);
        document.getElementById("submit" + n).disabled = true;
    }
    else {
        //enable x-axis, y-axis
        //disable submit button because x-axis and y-axis are empty
        clearMenu("xaxis" + n, false);
        clearMenu("yaxis" + n, false);
        document.getElementById("submit" + n).disabled = true;

        //load keys into x-axis, y-axis menus
        d3.csv("/csv/" + dbOption + ".csv")
        .then(function(data) {
            var keys = Object.keys(data[0]);
            keys.sort();
		    var elX = document.getElementById("xaxis" + n);
		    var option = document.createElement("option");
		    console.log(keys);
		    option.appendChild(document.createTextNode(keys[11]));
		    option.value = keys[11];
		    elX.appendChild(option);
		    elX.selectedIndex = 1;
            for (var i = 0; i < keys.length-1; i++) {
                var elY = document.getElementById("yaxis" + n);
                option = document.createElement("option");
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
    var el = document.getElementById("xaxis" + n);
    var xOption = el.options[el.selectedIndex].value;
    el = document.getElementById("yaxis" + n);
    var yOption = el.options[el.selectedIndex].value;
    //enable submit button if both x-axis and y-axis menus are non-empty
    if (xOption == "" || yOption == "") {
        document.getElementById("submit" + n).disabled = true;
    }
    else {
        document.getElementById("submit" + n).disabled = false;
    }
}
