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


  


  



});



//looks through the sql database to analyze
function getStudentData(){
    
    var customCode = getId();

    var idPHP = JSON.stringify(customCode);
    
    

    
    
    //search in the database for matching primary key(id)
    $.ajax({
      url: '../getStudentData.php',
      type: 'POST',
      data: { idPHP: customCode },
      success: function (data) {
//              console.log(data);
          console.log(idPHP);
          
          data = JSON.parse(data);
          
          console.log(data);
          
          populateStudentData(data);
         
          
          
      
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        alert('Status: ' + textStatus);
        alert('Error: ' + errorThrown);
      },
    });
    
}


//populate the student data div
function populateStudentData(data) {
    
    var div = document.getElementById("studentdata");
    
    div.innerHTML =   "<h4>Number of visits: " + data[0] + "<h4>";
    
    
    div.innerHTML += "<h4>Average time spent: " + data[data.length-1] + " minutes<h4>";
    
    div.innerHTML+=  "<h4>Breakdown of each visit: <h4>";
    
    for(var i = 1; i < data.length - 2; i ++) {
        
        div.innerHTML += "<h4>Student " + i + ":<h4>";
        div.innerHTML += "<label>Time Spent: " + data[i] + "</label>";
        
    }
    
    
}

