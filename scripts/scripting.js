//defaultTextValue is a dictionary that stores default values
//It's useful for writing scripts
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

var jsonObj = {};

//Use browser's FileReader to read in uploaded file
//To do: confirm this is working as intended
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
//To do: confirm this is working as intended
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
//and the user clicks out of the text boxes' focus
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

    setOptions(database, yaxis, xaxis, gtype, lowDate, highDate, 0, 0, n, color, true);
}

//Displays the help modal
//Runs when the help button is clicked
//To do: implement the help modal or confirm it is working
function displayHelp() {
    let help = document.querySelector("#help");
    help.style.display = "block";
}

//Closes the help modal
//Runs when the user clicks out of the modal's focus, or
//on the x button
function closeHelp() {
    let help = document.querySelector("#help");
    help.style.display = "none";
}

//Close modal when user clicks anywhere outside of it.
window.onclick = function(e) {
    let help = document.querySelector("#help");
    if (e.target == help) {
        help.style.display = "none";
    }
}

//Runs when user searches inside the help modal
//To do: implement this or confirm it is working
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

//Updates the script in the text box
//Runs when the options on the left side change
//To do: confirm this works as intended
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

//This function is redefined here because it needs to rewrite
//the script in the text boxes. This function overwrites
//switchToDefault() from common.js
function switchToDefault() {
    //set database 1 to default
    switchToDefaultDatabases(1);
    setOptions(defaultValues.db, defaultValues.y1, defaultValues.x1, defaultValues.gtype1, defaultValues.lowDate1, defaultValues.highDate1, defaultValues.lowDate1, defaultValues.highDate1, 1, defaultValues.color1, true);
    
    //set database 2 to default
    switchToDefaultDatabases(2);
    setOptions(defaultValues.db, defaultValues.y2, defaultValues.x2, defaultValues.gtype2, defaultValues.lowDate2, defaultValues.highDate2, defaultValues.lowDate2, defaultValues.highDate2, 2, defaultValues.color2, true);
    
    //update script in the text boxes
    for (var i in defaultTextValue.Graphs) {
        var g = defaultTextValue.Graphs[i];
        var textValue = JSON.stringify(g, null, 2);
        document.getElementById("box" + (parseInt(i) + 1)).value = textValue;
    }
}

//Download graph as jpg image to the user's device
function downloadGraph(n) {
    var url_base64jp = document.getElementById("canvas" + n).toDataURL("image/jpg");
    var a = document.getElementById("download" + n);
    a.href = url_base64jp;
}

//Changes site color theme
//Defined here and in basic.js because each page
//has elements that don't exist in the other, and it's
//easier to just have them separate for now.
function changeColorTheme(element) {
    if (element.checked) {  //dark theme chosen
        //change color for graph text
        Chart.defaults.global.defaultFontColor = "white";

        //redraw graphs 1 and 2
        regraph(1);
        regraph(2);

        //switch logo
        document.getElementsByClassName("logo")[0].src = "img/HistoryInDatalogodark.png";

        //change background color
        document.getElementsByTagName("BODY")[0].style.backgroundColor = "#413f3d";

        //change font color of column 1
        document.getElementsByClassName("col1")[0].style.color = "white";

        //change color of rows in column 1
        document.getElementsByClassName("row")[0].style.backgroundColor = "#263859";
        document.getElementsByClassName("row")[1].style.backgroundColor = "#263859";

        //change color and font color of form-controls
        var x = document.getElementsByClassName("form-control")[0];
        x.style.backgroundColor = "black";
        x.style.color = "white";
        x = document.getElementsByClassName("form-control")[1];
        x.style.backgroundColor = "black";
        x.style.color = "white";

        //change color of dropdown menus
        x = document.getElementsByClassName("select");
        for (var y = 0; y < x.length; y++) {
            x[y].style.backgroundColor = "black";
            x[y].style.color = "white";
        }

        //change color and font color of column 2
        x = document.getElementsByClassName("col2")[0];
        x.style.backgroundColor = "#525252";
        x.style.color = "white";

        //change color and font color of modals
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

        //switch logo
        document.getElementsByClassName("logo")[0].src = "img/HistoryInDatalogolight.png";

        //change background color
        document.getElementsByTagName("BODY")[0].style.backgroundColor = "#c2edce";

        //change font color of column 1
        document.getElementsByClassName("col1")[0].style.color = "#524636";

        //change color of dropdown menus
        x = document.getElementsByClassName("select");
        for (var y = 0; y < x.length; y++) {
            x[y].style.backgroundColor = "white";
            x[y].style.color = "black";
        }

        //change color of rows in column 1
        document.getElementsByClassName("row")[0].style.backgroundColor = "#92bbbd";
        document.getElementsByClassName("row")[1].style.backgroundColor = "#92bbbd";

        //change color and font color of form-controls
        x = document.getElementsByClassName("form-control")[0];
        x.style.backgroundColor = "white";
        x.style.color = "black";
        x = document.getElementsByClassName("form-control")[1];
        x.style.backgroundColor = "white";
        x.style.color = "black";

        //change color and font color of column 2
        x = document.getElementsByClassName("col2")[0];
        x.style.backgroundColor = "#f6f6f2";
        x.style.color = "#524636";

        //change color and font color of modals
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