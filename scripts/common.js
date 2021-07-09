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

//default values, stored inside a dictionary
var defaultValues = {};
defaultValues.db = 'Populations';
defaultValues.y1 = 'Rwanda';
defaultValues.x1 = 'Year';
defaultValues.lowDate1 = 1800;
defaultValues.highDate1 = 2019;
defaultValues.gtype1 = 'bar';
defaultValues.color1 = 'orange';
defaultValues.y2 = 'Algeria';
defaultValues.x2 = 'Year';
defaultValues.lowDate2 = 1800;
defaultValues.highDate2 = 2019;
defaultValues.gtype2 = 'bar';
defaultValues.color2 = 'darkBrown';

//Sessionid code
var rstring = randomstring(
  32,
  '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
);

var logs = [];

//Chart.js has color schemes available here: https://nagix.github.io/chartjs-plugin-colorschemes/colorchart.html
//We use color scheme instead of regular single colors
//because color schemes have a little more features available.
//For example, giving a bar graph a color theme will
//mean the bars will be a certain color, and hovering over
//a bar in the graph will show it in a slightly different
//color. This just helps the user highlight a particular
//value when viewing the graph. It's possible to manually
//select a color for the hover feature, but it's easier to
//use the available color schemes.
//The color themes are weird when you use it for a single
//graph. Color themes are typically used when you have
//multiple data sets displayed in one graph, because then
//it will automatically assign different colors for each
//curve. For a single data set, it only uses the first
//color in each theme (e.g. brewer.YlGn3 means the graph
//will be the light yellow color). If you wanted to use
//the particular green from brewer.YlGn3, you'll just
//have to pick a different scheme.
//The colorValues dictionary simply stores the rgb values
//for the first color in each scheme. This is used to
//change the color of the color picker button in DV4L.
//To get the particular value for the color shown in the
//color scheme page, right click on the color and choose
//"Inspect".
var colorValues = {
  gray: '#6f6f6f',
  lightGray: '#a9a57c',
  white: '#ffffff',
  darkRed: '#990000',
  red: '#f81b02',
  lightRed: 'ef8a62',
  pink: '#ff388c',
  lightPink: '#e9a3c9',
  darkBrown: '#543005',
  brown: '#a6611a',
  lightBrown: '#d8b365',
  darkOrange: '#e66101',
  orange: '#f09415',
  lightOrange: '#ffc685',
  darkYellow: '#f0ad00',
  yellow: '#f2d908',
  lightYellow: '#ffeda0',
  lightGreen: '#9acd4c',
  green: '#549e39',
  darkGreen: '#24693d',
  lightBlue: '#31b6fd',
  blue: '#0f6fc6',
  darkBlue: '#294171',
  darkPurple: '#663366',
  purple: '#ac3ec1',
  lightPurple: '#af8dc3',
};

//The colorSchemeValues dictionary will
//store the names of each color scheme.
//This is used for graphing.
var colorSchemeValues = {
  gray: 'office.Angles6',
  lightGray: 'office.Adjacency6',
  white: 'brewer.Greys8',
  darkRed: 'office.Codex6',
  red: 'office.Atlas6',
  lightRed: 'brewer.RdBu3',
  pink: 'office.Verve6',
  lightPink: 'brewer.PiYG3',
  darkBrown: 'brewer.BrBG11',
  brown: 'brewer.BrBG4',
  lightBrown: 'brewer.BrBG3',
  darkOrange: 'brewer.PuOr5',
  orange: 'office.Basis6',
  lightOrange: 'tableau.Orange20',
  darkYellow: 'office.Module6',
  yellow: 'office.Orbit6',
  lightYellow: 'brewer.YlOrRd3',
  lightGreen: 'office.Circuit6',
  green: 'office.Green6',
  darkGreen: 'tableau.GreenBlue7',
  lightBlue: 'office.Waveform6',
  blue: 'office.Blue6',
  darkBlue: 'office.Folio6',
  darkPurple: 'office.Advantage6',
  purple: 'office.Celestial6',
  lightPurple: 'brewer.PRGn3',
};

//Dictionary with key value pairs {category: list of databases}
//This is supposed to be useful when the user specifies
//which data sets they want to display/remove in the dropdown
//menu, but this feature is temporarily disabled.
var database_dict = {
  'Life, Death, Populations': [
    'Populations',
    'Population Female Percentage',
    'Population Female Percentage at Birth',
    'Life Expectancy - Continents',
    'Median Age',
    'Births',
    'Births Per Woman',
    'Births Per 1000 People',
    'Child Deaths',
    'Child Mortality Rates',
    'Survival Rate to Age 65 - Male',
    'Survival Rate to Age 65 - Female',
    'Projected Race & Hispanic Origin',
  ],
  Military: [
    'Military Personnel',
    'Military Personnel Percent of Population',
    'Military Spending',
    'Military Spending Percent of GDP',
    'Military Spending in thousands of US dollars',
    'Battle Related Deaths in State Based Conflicts',
    'Nuclear Warhead Inventory in Nuclear Powers',
  ],
  Economies: ['GDP',
              'GDP Per Capita',
              'Economic Freedom Scores',
              'Poverty Threshold',
              'Registered Mobile Money Accounts',
              ],
    
  Environment: [
    'CO2 Emissions',
    'CO2 Emissions Per Capita',
    'CO2 Emissions Percentages',
    'CO2 Emissions Cumulative',
    'CO2 Emissions Cumulative Percentages',
  ],
};

//graphs are defined here to have easier access
//throughout the rest of the file. Remember to
//set each of them as undefined if you ever
//delete a graph, and remember to set each of
//them to a value if you make a graph.
var graph1 = undefined;
var graph2 = undefined;

//These are used to help make driving questions show up.
//Currently it looks like functionality hasn't been fully
//implemented.
//To do: resolve driving question issues here and
//possibly anywhere else in this file
window.drivingQuestion = {};
var line = '';

//When the page first loads.
$(document).ready(function () {
  console.log('Ready!');
  sessionStorage.clear(); //clear session storage, which is used when the user uploades an external data set
  Chart.defaults.global.defaultFontColor = '#524636';

  //initialize date range sliders
  $('#range1').ionRangeSlider({
    //http://ionden.com/a/plugins/ion.rangeSlider/start.html
    type: 'double',
    min: 0,
    max: 0,
    from: 0,
    to: 0,
    hide_min_max: true,
    prettify_enabled: false,
  });
  $('#range2').ionRangeSlider({
    type: 'double',
    min: 0,
    max: 0,
    from: 0,
    to: 0,
    hide_min_max: true,
    prettify_enabled: false,
  });
    
    

    

  switchToDefault(); //load default view when the page first loads


  sendData(200, -1);


});

//Display Modal when user clicks 'Custom'
//Opens a new popup from the browser to allow users
//to upload a files from local computer
function displayModal() {
  var modal = document.getElementById('modalbox');
    
//  modal.style.display = 'block';
    modal.classList.add("show");
    populateCheckboxList();
}

//When the user clicks on (x), close the modal
function closeModal() {
  let modal = document.querySelector('.modal');
//  modal.style.display = 'none';
    modal.classList.remove("show");
}

//Close modal when user clicks anywhere outside of it.
window.onclick = function (e) {
  let modal = document.querySelector('.modal');
  if (e.target == modal) {
//    modal.style.display = 'none';
      modal.classList.remove("show");
  }
};

//Use browser's FileReader to read in uploaded file for driving questions
//Currently not quite working
//To do: implement this
function handleDrivingQuestionFiles(files) {
  //Check for file API support
  if (window.FileReader) {
    //FileReader is supported.
    //only one file, the first one, is read
    var fileToRead = files[0];

    var reader = new FileReader();
    reader.readAsText(fileToRead);
    //handle errors load
    reader.onload = loadHandler;
    reader.onerror = errorHandler;
  } else {
    alert('FileReader is not supported on this browser.');
  }
}

//Runs if file from driving question upload is successfully read.
//To do: implement this
function loadHandler(event) {
  var csv = event.target.result;
  var allTextLines = csv.split(/\r\n|\n/);
  for (var i = 0; i < allTextLines.length; i++) {
    var data = allTextLines[i].split(';');
    console.log(data);
  }
}

//Is called when the submit button is clicked for
//database URL input box in modal
//It reads the data from the URL and stores all data as
//a long string inside session storage with the key
//"external:" + URL
//Reading data from this string will take some processing
function handleDataURL() {
  //Read text from URL text box
  var url = document.getElementById('data_url').value;
  if (sessionStorage.getItem('external:' + url) != null) {
    //check that the data set wasn't already uploaded
    alert(url + ' is already uploaded.');
    return;
  }

  //make request to read file
  var request = new XMLHttpRequest();
  //url = "https://chenderm.github.io/csv/Life Expectancy - Continents.csv";  //this is an example data set, just for testing purposes
  request.open('GET', url, true);
  request.send(null);
  request.onreadystatechange = function () {
    if (request.readyState == 4 && request.status === 200) {
      var type = request.getResponseHeader('Content-Type');
      if (type.indexOf('text') !== 1) {
        //everything above this is syntax
        //below: sets up each data set as a long string
        //e.g. if data set is:
        //Year  USA     UK
        //2020  10      15
        //It will be stored as
        //"Year,2020
        //USA,10
        //UK,15"
        var dataSetTemp = []; //will be an array of arrays

        var allRows = request.responseText.split('\n');
        for (var i = 0; i < allRows.length; i++) {
          var rowText = allRows[i].split(','); //rowText stores individual text values in a row

          for (var j = 0; j < rowText.length; j++) {
            if (dataSetTemp[j] == undefined) dataSetTemp[j] = [];
            dataSetTemp[j].push(rowText[j]);
            //sets up data like [Year, 2020], [USA, 10], [UK, 15]
          }
        }

        //session storage can only store strings, not arrays
        //here we convert the array into a large string
        var bigString = '';
        for (var i = 0; i < dataSetTemp.length; i++) {
          for (var j = 0; j < dataSetTemp[i].length; j++) {
            bigString += dataSetTemp[i][j] + ',';
          }
          while (bigString.endsWith(',')) {
            //remove excess commas
            bigString = bigString.substr(0, bigString.length - 1);
          }
          bigString += '\n'; //add newline between categorized data
        }
        bigString = bigString.substr(0, bigString.length - 1); //remove last newline of string
        //data is now stored like "Year,2020\nUSA,10\nUK,15"

        sessionStorage.setItem('external:' + url, bigString);
        alert(url + ' uploaded.'); //big string is stored now

        //close popup
        closeModal();

        //add this data set to database dropdown menus
        //if URL is too long, it will be abbreviated
        var dbMenu1 = document.getElementById('database1');
        var option = document.createElement('option');
        if (url.length > 25)
          option.appendChild(
            document.createTextNode(
              'external: ...' + url.substring(url.length - 25)
            )
          );
        else option.appendChild(document.createTextNode('external: ' + url));
        option.value = 'external:' + url;
        dbMenu1.appendChild(option);

        var dbMenu2 = document.getElementById('database2');
        option = document.createElement('option');
        if (url.length > 25)
          option.appendChild(
            document.createTextNode(
              'external: ...' + url.substring(url.length - 25)
            )
          );
        else option.appendChild(document.createTextNode('external: ' + url));
        option.value = 'external:' + url;
        dbMenu2.appendChild(option);
      }
    } else if (request.readyState == 4 && request.status == 404) {
      alert('File ' + url + ' was not found.');
    }
  };

  /*$.ajax({
        url: 'write.php',
        method: 'POST',
        data: { functionToCall: "func", data: "hello" },
        success: function(data) {
            alert("Success");
        },
        error: function(data) {
            alert("error");
        }
    });*/
}

//runs if file from driving question upload is unsuccessful
function errorHandler(evt) {
  if (evt.target.error.name == 'NotReadableError') {
    alert('Cannot read file!');
  }
}

//Runs when the submit button at the bottom of the modal is clicked
//To do: implement this if it's not working as intended
function submitDrivingQuestions() {
  var checkboxes = document.getElementsByName('database_selection');
  var numberOfCheckedItems = 0;
  var dbSelected = [];

  for (var i = 0; i < checkboxes.length; i++) {
    if (checkboxes[i].checked) {
      var databaseName = checkboxes[i].value;
      dbSelected.push(databaseName);

      //update driving question associated with the database
      drivingQuestion[databaseName] = line;

      numberOfCheckedItems++;
    }
  }
  if (numberOfCheckedItems == 0) {
    alert('You have to select a database');
    return false;
  }
  selectDatabases(dbSelected);
  verifyDB(1);
  verifyDB(2);
  alert('Submitted');
}

//only display the currently selected databases
//This feature is removed temporarily, because there are
//issues involved if a saved graph is ever transferred
//back to regular view and its database isn't included
//in the menu
//To do: find a good compromise between the option
//to reduce the amount of info in the dropdown menu
//and the bug mentioned above
function selectDatabases(dbSelected) {
  /*var select = document.getElementById("database1");
    select.innerHTML = '';
    var empty_option = document.createElement("option");
    select.appendChild(empty_option);
    for (const db of dbSelected) {
        var option = document.createElement("option");
        option.val = db;
        option.text = db;
        select.appendChild(option);
    }

    select = document.getElementById("database2");
    select.innerHTML = '';
    empty_option = document.createElement("option");
    select.appendChild(empty_option);
    for (const db of dbSelected) {
        var option = document.createElement("option");
        option.val = db;
        option.text = db;
        select.appendChild(option);
    }*/
  //removed option to only show selected databases
  //because in the case where the user saves a
  //graph from a data set currently not shown
  //in the menu, and does a swap, it causes a lot
  //of problems
}

//Graphs data for the nth graph. n = 1 or 2
function graphData(
  database,
  xaxis,
  yaxis,
  n,
  lowDate,
  highDate,
  minDate,
  maxDate,
  gtype,
  color
) {
  //clear existing graph if there is one
  if (n == 1 && graph1 !== undefined) graph1.destroy();
  else if (n == 2 && graph2 !== undefined) graph2.destroy();

  //add labels and data to respective arrays
  //labelsArr will be the x axis (years)
  //dataArr will be the y axis (actual data)
  d3.csv('/csv/' + database + '.csv').then(function (data) {
    var labelsArr = [];
    var dataArr = [];
    for (var i = 0; i < data.length; i++) {
      if (
        parseInt(data[i][xaxis], 10) >= lowDate &&
        parseInt(data[i][xaxis], 10) <= highDate
      ) {
        labelsArr.push(data[i][xaxis]);
        dataArr.push(data[i][yaxis]);
      }
    }

    //add driving question (only use the first graph)
    //To do: make sure this is implemented correctly
    // if (n == 1) {
    //   var dq = document.getElementById('textinput2');
    //   if (typeof drivingQuestion[database] === undefined)
    //     dq.innerHTML = 'default driving question';
    //   else dq.innerHTML = drivingQuestion[database];

    //   //always saying default driving question
    //   console.log(dq.innerHTML);
    // }

    // if (n==1){
    //   var driving_text_input = document.getElementById('textinput2').value;

    // }

    //create graph
    var ctx = document.getElementById('canvas' + n);
    ctx = ctx.getContext('2d');
    var tempGraph = new Chart(ctx, {
      type: gtype,
      data: {
        datasets: [
          {
            label: yaxis + ' (' + gtype + ')',
            data: dataArr,
          },
        ],
        labels: labelsArr,
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
            },
          },
          colorschemes: { scheme: colorSchemeValues[color] },
        },
      },
    });

    //create descriptions & properties for graphs
    //needed for tooltip hover in saved region.
    //The saved feature is only used for the basic
    //version of DV4L
    var description = {
      DB: database,
      Yaxis: yaxis,
      lowDate: lowDate,
      highDate: highDate,
      gtype: gtype,
    };
    tempGraph.description = JSON.stringify(description, null, 2);
    tempGraph.DB = database;
    tempGraph.X = xaxis;
    tempGraph.Y = yaxis;
    tempGraph.lowDate = lowDate;
    tempGraph.highDate = highDate;
    tempGraph.minDate = minDate;
    tempGraph.maxDate = maxDate;
    tempGraph.type = gtype;
    tempGraph.color = color;

    if (n == 1)
      //setting values to graph1 or graph2
      graph1 = tempGraph;
    else if (n == 2) graph2 = tempGraph;

    try {
      //display save and export buttons when data gets graphed
      document.getElementById('save' + n).style.display = 'block';
      document.getElementById('export' + n).style.display = 'block';
    } catch (ex) {
      //save and export buttons don't
      //exist in the scripting version
    }
  });
}

//Graphs data for the nth grade, using an external data set. n = 1 or 2
function graphExternalData(
  database,
  xaxis,
  yaxis,
  n,
  lowDate,
  highDate,
  minDate,
  maxDate,
  gtype,
  color
) {
  //clear existing graph if there is one
  if (n == 1 && graph1 !== undefined) graph1.destroy();
  else if (n == 2 && graph2 !== undefined) graph2.destroy();

  //a little extra work is needed to extract data
  //from external data sets. The data are stored as
  //a long string. See functions above to see
  //formatting of the data
  var allText = sessionStorage.getItem(database);
  allText = allText.split('\n');
  var dataSet = {};
  for (var i = 0; i < allText.length; i++) {
    var temp = allText[i].substring(0, allText[i].length - 1);
    temp = temp.split(',');
    dataSet[temp[0]] = temp.slice(1);
    //dataSet stores data (array) as the value, with the label (typcially a country name) as the key
  }
  var tempLabels = dataSet[xaxis];
  var tempData = dataSet[yaxis];
  //tempLabels & tempData store all the data, but we still
  //have to parse to get data between the high and low dates
  var labelsArr = [];
  var dataArr = [];
  for (var i = 0; i < tempLabels.length; i++) {
    if (
      parseInt(tempLabels[i], 10) >= lowDate &&
      parseInt(tempLabels[i], 10) <= highDate
    ) {
      labelsArr.push(tempLabels[i]);
      dataArr.push(tempData[i]);
    }
  }

  //To do: replace with actual driving question
  document.getElementById('driving_question').innerHTML = '';

  //create graph
  var ctx = document.getElementById('canvas' + n);
  ctx = ctx.getContext('2d');
  var tempGraph = new Chart(ctx, {
    type: gtype,
    data: {
      datasets: [
        {
          label: yaxis + ' (' + gtype + ')',
          data: dataArr,
        },
      ],
      labels: labelsArr,
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
            enalbed: true,
            mode: 'x',
            speed: 3000,
          },
        },
        colorschemes: { scheme: colorSchemeValues[color] },
      },
    },
  });

  //create descriptions & properties for graphs
  //needed for tooltip hover in saved region.
  //The saved feature is only used for the basic
  //version of DV4L
  var description = {
    DB: 'external:' + database.substr(database.lastIndexOf('/') + 1),
    Yaxis: yaxis,
    lowDate: lowDate,
    highDate: highDate,
    gtype: gtype,
  };
  tempGraph.description = JSON.stringify(description, null, 2);
  tempGraph.DB = database;
  tempGraph.X = xaxis;
  tempGraph.Y = yaxis;
  tempGraph.lowDate = lowDate;
  tempGraph.highDate = highDate;
  tempGraph.minDate = minDate;
  tempGraph.maxDate = maxDate;
  tempGraph.type = gtype;
  tempGraph.color = color;

  if (n == 1)
    //setting values to graph1 or graph2
    graph1 = tempGraph;
  else if (n == 2) graph2 = tempGraph;

  try {
    //display save and export buttons when data gets graphed
    document.getElementById('save' + n).style.display = 'block';
    document.getElementById('export' + n).style.display = 'block';
  } catch (ex) {
    //save and export buttons don't
    //exist in the scripting version
  }
}

//Runs when user clicks the submit button on the left.
//n = 1 when the button is for the first graph
//n = 2 when the button is for the second graph
function submitGraphData(n) {
  var el = document.getElementById('database' + n);
  var dbOption = el.options[el.selectedIndex].value;

  var xOption = 'Year';

  el = document.getElementById('yaxis' + n);
  var yOption = el.options[el.selectedIndex].value;

  el = document.getElementById('gtype' + n);
  var gtype = el.options[el.selectedIndex].value;

  var lowDate = $('#range' + n).data('from');
  var highDate = $('#range' + n).data('to');
  var minDate = $('#range' + n).data('ionRangeSlider').options.min;
  var maxDate = $('#range' + n).data('ionRangeSlider').options.max;

  var color = document.getElementById('colorButton' + n).value;

  if (dbOption.startsWith('external'))
    graphExternalData(
      dbOption,
      xOption,
      yOption,
      n,
      lowDate,
      highDate,
      minDate,
      maxDate,
      gtype,
      color
    );
  else
    graphData(
      dbOption,
      xOption,
      yOption,
      n,
      lowDate,
      highDate,
      minDate,
      maxDate,
      gtype,
      color
    );
  sendData(n, 0);
  //Export file log analysis code
  //   var sessionid = globe;
  //   var accesstime = '2008-01-01 00:00:01';
  //   var xname1 = lowDate;
  //   var xname2 = highDate;
  //   var yname = yOption;
  //   //var locationname="";
  //   var graphoption = gtype;
  //   var colorgraph = color;

  //   var xmlhttp = new XMLHttpRequest();
  //   xmlhttp.onreadystatechange = function () {
  //     if (this.readyState == 4 && this.status == 200) {
  //       alert(this.responseText);
  //     }
  //   };
  //   xmlhttp.open('POST', 'data.php', true);
  //   xmlhttp.send();

  //   $.ajax('data.php', {
  //     success: function (data) {
  //       alert('AJAX call was successful!');
  //       alert('Data from the server' + data);
  //     },
  //     error: function (request, status, error) {
  //       alert(error);
  //     },
  //   });
}

//Runs when the user clicks the default button.
//Sets database menu options to default
//Sets y axis menu optioms to default
//Switches databases to default
//Switches y axes to default and enables the menu
//Resets date ranges
//Switches graph types to default and enables the menu
//Resets & enables color button
function switchToDefault() {
  //set database 1 to default
  switchToDefaultDatabases(1);
  setOptions(
    defaultValues.db,
    defaultValues.y1,
    defaultValues.x1,
    defaultValues.gtype1,
    defaultValues.lowDate1,
    defaultValues.highDate1,
    defaultValues.lowDate1,
    defaultValues.highDate1,
    1,
    defaultValues.color1,
    true
  );

  //set database 2 to default
  switchToDefaultDatabases(2);
  setOptions(
    defaultValues.db,
    defaultValues.y2,
    defaultValues.x2,
    defaultValues.gtype2,
    defaultValues.lowDate2,
    defaultValues.highDate2,
    defaultValues.lowDate2,
    defaultValues.highDate2,
    2,
    defaultValues.color2,
    true
  );
}

//Runs when user clicks the default button
//Show all available databases in the drop down menu
//Select the default database
function switchToDefaultDatabases(n) {
  var el = document.getElementById('database' + n);
  el.innerHTML = '';
  var empty_option = document.createElement('option');
  el.appendChild(empty_option);
  for (var key in database_dict) {
    var value = database_dict[key];
    var optgroup = document.createElement('optgroup');
    optgroup.label = key;
    for (var index = 0; index < value.length; index++) {
      var option = document.createElement('option');
      option.val = value[index];
      option.text = value[index];
      optgroup.appendChild(option);
    }
    el.appendChild(optgroup);
  }

  for (var i = 0; i < el.options.length; i++) {
    if (el.options[i].text === defaultValues.db) {
      el.selectedIndex = i;
      break;
    }
  }
}

//sets menus on the left to appropriate values
//plots graphs based on input
function setOptions(
  databaseName,
  yaxis,
  xaxis,
  gtype,
  lowDate,
  highDate,
  minDate,
  maxDate,
  n,
  color,
  graphDataBool
) {
  var el = document.getElementById('database' + n);
  for (var i = 0; i < el.options.length; i++) {
    if (el.options[i].value === databaseName) {
      el.selectedIndex = i;
      break;
    }
  }

  el = document.getElementById('gtype' + n);
  for (var i = 0; i < el.options.length; i++) {
    if (el.options[i].value === gtype) {
      el.selectedIndex = i;
      break;
    }
  }

  //Clear y-axis menu, we'll repopulate it later.
  //It's always cleared because the database
  //could be switched to something else, so it
  //would have to be cleared anyways
  clearMenu('yaxis' + n, false);

  if (databaseName.startsWith('external')) {
    //load keys into y-axis menu
    var allData = sessionStorage.getItem(dbOption);
    allData = allData.split('\n');
    var keys = [];
    for (var i = 0; i < allData.length; i++) {
      var subject = allData[i].substr(0, allData[i].indexOf(','));
      keys.push(subject);
    }
    keys.sort();

    //add each key to y-axis menu
    var elY = document.getElementById('yaxis' + n);
    for (var i = 0; i < keys.length; i++) {
      if (keys[i] == 'Year') continue;

      var option = document.createElement('option');
      option.appendChild(document.createTextNode(keys[i]));
      option.value = keys[i];
      elY.appendChild(option);
      if (keys[i] == previousYAxisValue) elY.selectedIndex = i + 1;
    }

    if (minDate == 0) {
      //no minDate or maxDate provided
      var years = allData[0].split(',');
      years = years.slice(1);
      minDate = Math.min(...years);
      maxDate = Math.max(...years);
    }

    //update date range slider values
    updateSliderOnlyRange(n, minDate, maxDate, lowDate, highDate);

    //enables submit button, if in the right circumstances
    verifyOptions(n);

    if (graphDataBool == true)
      graphExternalData(
        databaseName,
        xaxis,
        yaxis,
        n,
        lowDate,
        highDate,
        minDate,
        maxDate,
        gtype,
        color
      );
  } else {
    //read the csv file to get all keys
    d3.csv('/csv/' + databaseName + '.csv')
      .then(function (data) {
        var keys = Object.keys(data[0]);
        keys.sort();

        //add each key to y-axis menu
        var elY = document.getElementById('yaxis' + n);
        for (var i = 0; i < keys.length; i++) {
          if (keys[i] == xaxis) continue;

          var option = document.createElement('option');
          option.appendChild(document.createTextNode(keys[i]));
          option.value = keys[i];
          elY.appendChild(option);
          if (keys[i] == yaxis) {
            elY.selectedIndex = i + 1;
          }
        }

        if (minDate == 0) {
          //no minDate or maxDate provided
          var years = [];
          for (var i = 0; i < data.length; i++) years.push(data[i]['Year']);
          minDate = Math.min(...years);
          maxDate = Math.max(...years);
        }

        //update date range slider values
        updateSliderOnlyRange(n, minDate, maxDate, lowDate, highDate);

        //enables submit button, if in the right circumstances
        verifyOptions(n);

        if (graphDataBool == true)
          graphData(
            databaseName,
            xaxis,
            yaxis,
            n,
            lowDate,
            highDate,
            minDate,
            maxDate,
            gtype,
            color
          );
      })
      .catch(function (error) {
        if (error.message === '404 Not Found') {
          alert('Database not found: ' + databaseName);
        }
      });
  }

  //reset color button;
  changeColorButton(n, color);
  document.getElementById('colorButton' + n).disabled = false;
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
  var el = document.getElementById('database' + n);
  el.selectedIndex = 0;

  clearMenu('yaxis' + n, true);

  clearSlider(n);

  el = document.getElementById('gtype' + n);
  el.selectedIndex = 0;
  el.disabled = true;

  resetColorButton(n);
  document.getElementById('colorButton' + n).disabled = true;

  document.getElementById('submit' + n).disabled = true;

  if (n == 1) {
    graph1.destroy();
    graph1 = undefined;
  } else if (n == 2) {
    graph2.destroy();
    graph2 = undefined;
  }

  try {
    //try to disable save and export buttons
    document.getElementById('save' + n).style.display = 'none';
    document.getElementById('export' + n).style.display = 'none';
  } catch (ex) {
    //save and export buttons don't exist in scripting version
  }

  //clear driving question
  document.getElementById('driving_question').innerHTML = '';
}

//Runs when the option for database changes.
//If the empty option is selected, clear and/or disable the y-axis menu,
//date range slider, graph type menu, color button, and submit button.
//If a non-empty option is selected, clear and/or enable the the
//y-axis menu, date range slider, graph type menu, and color button,
//but the submit button will remain disabled
//until there are non-empty values for y-axis, graph type menus.
function verifyDB(n) {
  var menu = document.getElementById('database' + n);
  var dbOption = menu.options[menu.selectedIndex].value;
  if (dbOption == '') {
    //if no database selected...
    //clear and disable y axis menu...
    clearMenu('yaxis' + n, true);

    //clear and disable date range slider
    clearSlider(n);

    //"clear" and disable graph type menu
    var el = document.getElementById('gtype' + n);
    el.selectedIndex = 0;
    el.disabled = true;

    //"clear" and disable color button
    resetColorButton(n);
    document.getElementById('colorButton' + n).disabled = true;

    //disable submit button
    document.getElementById('submit' + n).disabled = true;
  } else {
    //save all previous data
    //this was requested by a user during a study. They had
    //suggested if the database changed, keep the y axis
    //option the same because a lot of times they're studying
    //a specific country and would only want to see different
    //information about it
    var previousYAxisMenu = document.getElementById('yaxis' + n);
    var previousYAxisValue =
      previousYAxisMenu.options[previousYAxisMenu.selectedIndex].value;
    var previousLowDate = $('#range' + n).data('from');
    var previousHighDate = $('#range' + n).data('to');
    var previousMinDate = $('#range' + n).data('ionRangeSlider').options.min;
    var previousMaxDate = $('#range' + n).data('ionRangeSlider').options.max;
    var previousGTypeMenu = document.getElementById('gtype' + n);
    var previousGTypeValue =
      previousGTypeMenu.options[previousGTypeMenu.selectedIndex].value;
    var previousColor = document.getElementById('colorButton' + n).value;

    setOptions(
      dbOption,
      previousYAxisValue,
      'Year',
      previousGTypeValue,
      previousLowDate,
      previousHighDate,
      previousMinDate,
      previousMaxDate,
      n,
      previousColor,
      false
    );
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
//Also disables slider
function clearSlider(n) {
  $('#range' + n)
    .data('ionRangeSlider')
    .update({
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
  $('#range' + n)
    .data('ionRangeSlider')
    .update({
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
  $('#range' + n)
    .data('ionRangeSlider')
    .update({
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
  var el = document.getElementById('yaxis' + n);
  var yOption = el.options[el.selectedIndex].value;

  el = document.getElementById('gtype' + n);
  var gtype = el.options[el.selectedIndex].value;

  //enable submit button if both y-axis and graph type menus are non-empty
  if (yOption == '' || gtype == '') {
    document.getElementById('submit' + n).disabled = true;
  } else {
    document.getElementById('submit' + n).disabled = false;
  }
}

//Opens and closes color pallette
function showColorWheel(num) {
  var wheel = document.getElementById('colorWheel' + num);
  if (wheel.style.visibility != 'visible') wheel.style.visibility = 'visible';
  else wheel.style.visibility = 'hidden';
}

//Changes color button
function changeColorButton(num, colorStr) {
  var btn = document.getElementById('colorButton' + num);
  btn.style.backgroundColor = colorValues[colorStr];
  btn.description = colorSchemeValues[colorStr];
  btn.value = colorStr;
  var wheel = document.getElementById('colorWheel' + num);
  wheel.style.visibility = 'hidden';
}

//Reset color button
function resetColorButton(num) {
  changeColorButton(num, 'white');
}

//Redraws a graph in the second column
//This is used when the color theme of the page changes and there
//are existing graphs present. Regraphs are necessary to change
//the color of the text (e.g. axis labels) in the graph.
//The function for the color theme change is in basic.js and
//scripting.js
function regraph(n) {
  var tempGraph = undefined;
  if (n == 1) tempGraph = graph1;
  else tempGraph = graph2;
  if (tempGraph == undefined) return;

  var db = tempGraph.DB;
  var x = tempGraph.X;
  var y = tempGraph.Y;
  var lowDate = tempGraph.lowDate;
  var highDate = tempGraph.highDate;
  var minDate = tempGraph.minDate;
  var maxDate = tempGraph.maxDate;
  var graphType = tempGraph.type;
  var color = tempGraph.color;

  if (db.startsWith('external'))
    graphExternalData(
      db,
      x,
      y,
      n,
      lowDate,
      highDate,
      minDate,
      maxDate,
      graphType,
      color,
    );
  else
    graphData(
      db,
      x,
      y,
      n,
      lowDate,
      highDate,
      minDate,
      maxDate,
      graphType,
      color
    );
}

function randomstring(length, chars) {
  var result = '';
  for (var i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return result;
}

function sendData(n, savedNum) {

  //Sessionid code
  var sessionid = rstring;

  //Accesstime code
  var currentDate = new Date();
  var date = currentDate.getDate();
  var month = currentDate.getMonth(); //Be careful! January is 0 not 1
  var year = currentDate.getFullYear();
  var time =
    currentDate.getHours() -
    5 +
    ':' +
    currentDate.getMinutes() +
    ':' +
    currentDate.getSeconds();
  var datestring = year + '-' + (month + 1) + '-' + date;
  var accesstime = datestring + ' ' + time;

  var ydatabase = null;
  var locationname = null;
  var ranges = null;
  var rangestart = null;
  var rangesend = null;
  var gtypedata = null;
  var colordata = null;
  var drivingQuestion = null;
  var isDropDown = null;
  var hasNotes = null;
  var scriptSeen = null;
  var savedGraphNum = null;
  var exportNum = null;

  //tooltip clicked to see json code
  if (n == 0) {
    var data = document.getElementById('tip' + savedNum).textContent;
    data = data.replace(/\\n/g, "\\n")
      .replace(/\\'/g, "\\'")
      .replace(/\\"/g, '\\"')
      .replace(/\\&/g, "\\&")
      .replace(/\\r/g, "\\r")
      .replace(/\\t/g, "\\t")
      .replace(/\\b/g, "\\b")
      .replace(/\\f/g, "\\f")
      .replace(/\s/gm, '')
      .replace(/[\u0000-\u0019]+/g, "")
      .replace(/[\u0000-\u001F]+/g, "");
    // remove non-printable and other non-valid JSON chars
      
      var mydata = "";
      if(data != ""){
         mydata = JSON.parse(data);
      }
      
    rangestart = mydata.lowDate;
    rangesend = mydata.highDate;
    ydatabase = mydata.DB;
    gtypedata = mydata.gtype;
    locationname = mydata.Yaxis;
    scriptSeen = 1;
  }

  //Yaxis code
  else if (n == 1 || n == 2) { //not from showToolTip
    ydatabase = document.getElementById('database' + n).value;
    //Location code
    locationname = document.getElementById('yaxis' + n).value;

    //Range code
    ranges = document.getElementById('range' + n).value;
    rangesarray = ranges.split(';');
    rangestart = rangesarray[0];
    var rangesend = rangesarray[1];

    gtypedata = document.getElementById('gtype' + n).value;
    colordata = document.getElementById('colorButton' + n).value;
    drivingQuestion = document.getElementById('textinput2').value;
//    console.log(drivingQuestion);
    isDropDown = 0;
    if (drivingQuestion == "") {
      drivingQuestion = null;
      isDropDown = 1;
    }
    var notes = document.getElementById('notes').value;
    hasNotes = 1;// ?

    if (notes == "") {
      hasNotes = 0;
    }
    //getting called when we don't want to
    if (savedNum == "saved") {
      savedGraphNum = n;
    }
    else if (savedNum == "export") {
      exportNum = n;
    }
  }
  else if (n == -1) {
    scriptSeen = -1; //deleted graph
  }

  var submitdata = {
    'sessionid': sessionid,
    'accesstime': accesstime,
    'yaxis': ydatabase,
    'locationdata': locationname,
    'lowdate': rangestart,
    'highdate': rangesend,
    'graphtype': gtypedata,
    'color': colordata,
    'drivingQuestion': drivingQuestion,
    'isDropDown': isDropDown,
    'hasNotes': hasNotes,
    'scriptSeen': scriptSeen,
    'savedGraphNum': savedGraphNum,
    'exportNum': exportNum
  };

  logs.push(submitdata);

  //Send data to php code
  var submitdatastr = JSON.stringify(submitdata);

  $.ajax({
    url: '../data.php',
    type: 'POST',
    data: { submitdata: submitdatastr },
    success: function (response) {
      //alert('info sent to database');
      //alert(response.message);
      
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert('Status: ' + textStatus);
      alert('Error: ' + errorThrown); //error msg
    },
  });


  ydatabase = null;
  locationname = null;
  ranges = null;
  rangestart = null;
  rangesend = null;
  gtypedata = null;
  colordata = null;
  drivingQuestion = null;
  isDropDown = null;
  hasNotes = null;
  scriptSeen = null;
  savedGraphNum = null;
  exportNum = null;


}//send data


//go to historyindata.org/dv4l/getData.php to get all the data from mySQL
function getData() {
  $.ajax({
    url: '../getData.php',
    type: 'GET',
    //data: { submitdata: submitdatastr },
    success: function (response) {
      //do whatever.
      alert('Its done!');
      //alert(response.message);
      console.log(response);
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      alert('Status: ' + textStatus);
      alert('Error: ' + errorThrown); //error?
    },
  });
}


//use the php id from the url to configure the databases and the driving questions
function configureCustomDV4L(id){
    
//    alert(id); 
    var idPHP = JSON.stringify(id);
    
    
    //search in the database for matching primary key(id)
    $.ajax({
      url: '../getCustomInfo.php',
      type: 'POST',
      data: { idPHP: id },
      success: function (data) {
          
//          console.log(data);
          
       var newData = data.split("|");

        var databases = newData[0].split(",");
        
          var dqs = newData[1].split(",");

          useCustomDatabases(databases);
          useCustomDQs(dqs);
      
      
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('Status: ' + textStatus);
        alert('Error: ' + errorThrown); //error?
      },
    });
    
    
    

    

    
    
  
}

function useCustomDatabases(databases){
    
//    database_dict = databases;
    

    var dbMenu1 = document.getElementById('database1');
    var dbMenu2 = document.getElementById('database2');
    
    
    dbMenu1.innerHTML = "";
    dbMenu2.innerHTML = "";
    
    //have both database menus state that they are using a custom list
    var option = document.createElement('option');
    
    option.appendChild(document.createTextNode("Instructor Selected Databases"));
    option.value = "Custom Selected Databases";
    option.selected = true;
    option.disabled = true;
    dbMenu1.appendChild(option);
    
    option = document.createElement('option');
    
    option.appendChild(document.createTextNode("Instructor Selected Databases"));
    option.value = "Custom Selected Databases";
    option.selected = true;
    option.disabled = true;
    dbMenu2.appendChild(option);
   
    
    //populate the drop down menus
    for(var i = 0; i < databases.length; i++){
        
        
        //1
        var option = document.createElement('option');
        option.appendChild(document.createTextNode(databases[i]));
        option.value = databases[i];
        dbMenu1.appendChild(option);
        
        //2
        option = document.createElement("option");
        option.appendChild(document.createTextNode(databases[i]));
        option.value = databases[i];
        dbMenu2.appendChild(option);
    
    }
    
}

//populate driving questions with what the teacher chose
function useCustomDQs(dqs){
    
    console.log("here");
    console.log(dqs);
    console.log(dqs.length);
    
    var dqDiv = document.getElementById("textinput");
    dqDiv.innerHTML = "";
    
    var title = document.createElement("option");
    title.appendChild(document.createTextNode("Instructor Selected Driving Questions"));
    title.value = 0;
    title.selected = true;
    title.disabled = true;
    dqDiv.appendChild(title);
    
    
    for(var i = 0; i < dqs.length; i++){
        
        var option = document.createElement('option');
        
        
        
        option.appendChild(document.createTextNode(dqs[i]));
        option.value = dqs[i];
        dqDiv.appendChild(option);
        
    }
    
    
}
