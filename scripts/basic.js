//When the page first loads.
$(document).ready(function () {
  
    populateCheckboxList();
});





////populate database dropdown menus with the selected databases
//function useSuggestedDatabase(){
//
//    var database = document.getElementById('suggestedDBs');
//
//    if(database.value == "No Suggested Databases"){
//        return;
//    }
//
//    var graph1Menu = document.getElementById('database1');
//
//    for(var i = 0; i < graph1Menu.options.length; i++){
//
//        if(graph1Menu.options[i].value == database.value){
//            graph1Menu.options[i].selected = true;
//        }
//
//    }
//
//
//    submitGraphData(1);
//
//
//}

//global var to keep track of the selected databases
var selected = [];

function populateCheckboxList(){
    
    var div = document.getElementById('textEntered');
    var checkboxList = document.getElementById('checkboxlist');
    var label = document.getElementById('checkboxLabel');




    //have to clear previous options first
    checkboxList.innerHTML = "";

    






        for (var key in database_dict) {
          var value = database_dict[key];

          for (var index = 0; index < value.length; index++) {
            var option = document.createElement('option');
            var title = document.createElement("label");
            var description = document.createTextNode(value[index]);
            var checkbox = document.createElement("input");

              checkbox.type = "checkbox";
              checkbox.name = index;
              checkbox.addEventListener("click", updateSelected);
              title.className = "checkTitle";
              checkbox.className = "check";

              
              
              for(var i = 0; i < selected.length; i++){
                  
                  if(selected[i] == value[index]){
                      checkbox.checked = true;
                  }
                  
              }

              title.appendChild(checkbox);
              title.appendChild(description);
              checkboxList.appendChild(title);

          }


        }

    
    
    
}




//updates the list of selected databases to be used
function updateSelected(){

    
    
    var checks = document.getElementsByClassName("check");
    var checkTitle = document.getElementsByClassName("checkTitle");
    
   
    
    //go through the checkboxes and make a list of the selected ones
    for(var i = 0; i < checks.length; i++){
        
        
        //if checked ensure that it is in the selected list
        if(checks[i].checked === true){
            var add = 1;
            for(var j = 0; j < selected.length; j++){
                
                if(selected[j] == checkTitle[i].outerText){
                    add = 0;
                }
                
            }
            
            if(add){
                selected.push(checkTitle[i].outerText);
            }
            
        } else {
        
            //if unchecked ensure that it is not in the selected list
            
            for(var j = 0; j < selected.length; j++){
                
                if(selected[j] == checkTitle[i].outerText){
                    
                    selected.splice(j, 1);
                }
                
            }
            
        }
        
        
    }
    
    //update the content of the "selected databases" div
    populateSelected(selected);
   
    
}

function populateSelected(databaseList){
    var selectedList = document.getElementById("selectedList");
    selectedList.innerHTML='';

    for(var i = 0; i < databaseList.length; i++){
        
        
        var title = document.createElement("label");
        var description = document.createTextNode(databaseList[i]);
        
        var name = databaseList[i];
        
//        title.addEventListener("click", function(){
//           deleteSelected(name);
//        }, false);
        
        title.addEventListener("click",deleteSelected, false);
          
          title.appendChild(description);
          selectedList.appendChild(title);

        

}
    
    if(selectedList.innerHTML ==  ''){
        selectedList.innerHTML= 'No Selected Databases';
    }
    
}



function deleteSelected(){
    
    console.log(this.innerHTML);
    
    var dbName = this.innerHTML;
    
    var index = selected.indexOf(dbName);

    if(index > -1){
        selected.splice(index, 1);
    }

    
    populateSelected(selected);
    
    updateChecks();
    
    console.log(selected);
    

}


//after deleting a database, ensure that it becomes unchecked
function updateChecks(){
    
    var div = document.getElementById('textEntered');
    var checkboxList = document.getElementById('checkboxlist');
    var label = document.getElementById('checkboxLabel');




    //have to clear previous options first
    checkboxList.innerHTML = "";
    
    for (var key in database_dict) {
      var value = database_dict[key];

      for (var index = 0; index < value.length; index++) {
        var option = document.createElement('option');
        var title = document.createElement("label");
        var description = document.createTextNode(value[index]);
        var checkbox = document.createElement("input");

          checkbox.type = "checkbox";
          checkbox.name = index;
          checkbox.addEventListener("click", updateSelected);
          title.className = "checkTitle";
          checkbox.className = "check";

          
          
          for(var i = 0; i < selected.length; i++){
              
              if(selected[i] == value[index]){
                  checkbox.checked = true;
              }
              
          }

          title.appendChild(checkbox);
          title.appendChild(description);
          checkboxList.appendChild(title);

      }


    }
    
}


//generate the code
function useSelected(){
    
    var linkDiv = document.getElementById("link");
    var lastName = document.getElementById("lastname");
    
    
    linkDiv.innerHTML = '' ;
    
    //temporary value, will be replaced with a custom link
    
    //populate the custom code div
    var link = "historyindata.org/dv4l/" + lastName.value;
    
    var title = document.createElement("label");
    var description = document.createTextNode(link);
    
    title.addEventListener("click",copy, false);
    
    var name = 'aban';
      
      title.appendChild(description);
      linkDiv.appendChild(title);
    
    
    //send data to sql data base
    
    console.log(selected);
    console.log(selectedDQ);
    
    
    
    var submitdata = {
        
        'code': lastName.value,
        'databases': lastName.value,
        'drivingQuestions': selectedDQ,
        
    };
    
    var submitdatastr = JSON.stringify(submitdata);
    
    $.ajax({
        
        url:'../sendData.php',
        type: 'POST',
    data: {submitdata: submitdatastr },
    success: function(response){
        console.log("data sent");
        console.log(response);
    },
        
    error: function (XMLHttpRequest, textStatus, errorThrown) {
  
        alert('Status: ' + textStatus);
        alert('Error: ' + errorThrown);
    },
        
        
    });
    
    
}

//grays out and removes functionality of databaselist if default checkbox selected
function updateDatabaseList(){
    
    var checkbox = document.getElementById("defaultDatabase");
    var databaselist = document.getElementById("checkboxlist");
    var selectedList = document.getElementById("selectedList");
    
    if(checkbox.checked){
        
        databaselist.style.filter = "brightness(55%)";
        databaselist.style.pointerEvents = "none";
        selectedList.style.filter = "brightness(55%)";
        selectedList.style.pointerEvents = "none";
        
        //check all of the boxes in the list
        var check = document.getElementsByClassName("check");
        
        for(var i = 0; i < check.length; i++){
            
            check[i].checked = true;
            
        }
    
    }
    else {
        
        databaselist.style.filter = "brightness(100%)";
        databaselist.style.pointerEvents = "all";
        selectedList.style.filter = "brightness(100%)";
        selectedList.style.pointerEvents = "all";
        
        //uncheck all of the boxes in the list
        var check = document.getElementsByClassName("check");
        
        for(var i = 0; i < check.length; i++){
            
            check[i].checked = false;
            
        }
   
    }
    
   

}

//grays out and removes functionality of databaselist if default checkbox selected
function updateDQList(){
    
    
    var checkbox = document.getElementById("defaultDQs");
    var DQList = document.getElementById("DQList");
    var customDQ = document.getElementById("customDQ");
    
    
    if(checkbox.checked){
        
        DQList.style.filter = "brightness(35%)";
        DQList.style.pointerEvents = "none";
        customDQ.style.filter = "brightness(35%)";
        customDQ.style.pointerEvents = "none";
         
        
        //check all of the boxes in the list
        var check = document.getElementsByClassName("DQcheck");
        
        for(var i = 0; i < check.length; i++){
            
            check[i].checked = true;
            
        }
    
    }
    else {
        
        DQList.style.filter = "brightness(100%)";
        DQList.style.pointerEvents = "all";
        customDQ.style.filter = "brightness(100%)";
        customDQ.style.pointerEvents = "all";
         
        
        //uncheck all of the boxes in the list
        var check = document.getElementsByClassName("DQcheck");
        
        for(var i = 0; i < check.length; i++){
            
            check[i].checked = false;
            
        }
   
    }
    
    
    
}



//copy custom link to clipboard
function copy(){
    
    alert("Copied to Clipboard");
    
}


//add the custom driving question to the DQList and selected list
function addCustomQuestion(){
    
    var question = document.getElementById("customQuestion");
    
    var DQList = document.getElementById("DQList");
    
    
    var option = document.createElement('option');
    var title = document.createElement("label");
    var description = document.createTextNode(" " + question.value);
    var checkbox = document.createElement("input");

      checkbox.type = "checkbox";
      checkbox.name = question.value;
    
    //add an event listener
      checkbox.addEventListener("click", updateSelectedDQ);
    
      title.className = "checkTitleDQ";
      checkbox.className = "checkDQ";

        
    checkbox.checked = true;
    

      title.appendChild(checkbox);
      title.appendChild(description);
    DQList.appendChild(title);
    
    
    var linebreak = document.createElement("br");
    DQList.appendChild(linebreak);
    
    updateSelectedDQ();
}



var selectedDQ = [];
 
function updateSelectedDQ(){
    
    var checks = document.getElementsByClassName("checkDQ");
    var checkTitle = document.getElementsByClassName("checkTitleDQ");
    
    
    
    //go through the checkboxes and make a list of the selected ones
    for(var i = 0; i < checks.length; i++){
        
        
        //if checked ensure that it is in the selected list
        if(checks[i].checked === true){
            var add = 1;
            for(var j = 0; j < selectedDQ.length; j++){
                
                if(selectedDQ[j] == checkTitle[i].outerText){
                    add = 0;
                }
                
            }
            
            if(add){
                selectedDQ.push(checkTitle[i].outerText);
            }
            
        } else {
        
            //if unchecked ensure that it is not in the selected list
            
            for(var j = 0; j < selectedDQ.length; j++){
                
                if(selectedDQ[j] == checkTitle[i].outerText){
                    
                    selectedDQ.splice(j, 1);
                }
                
            }
            
        }
        
        
    }
    
    
}


//defining the keywords for each database
//there may be some repeated words in the dictionary because some words carry extra value
//note: all keywords should be entered in lowercase
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
                     'thousands',
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
    
    
    'Battle Related Deaths in State Based Conflicts': [
                                                     
                    'conflicts','conflicts',
                    'conflict','conflict',
                    'battle', 'battle',
                    'related',
                    'death',
                    'deaths',
                    'state',
                                
                                                       
                                                    ],
    
    'Nuclear Warhead Inventory in Nuclear Powers': [
    
                    'nuclear', 'nuclear',
                    'warhead', 'warhead',
                    'nuke', 'nukes',
                    'power', 'powers',
                    'superpower',
                                                    
                                                    
                                                    
                                                    ],
    
    'Registered Mobile Money Accounts' :[
                                         
                 'registered',
                'mobile',
                'money', 'money',
                'account','account',
                 'accounts','accounts',
                                         
                                         ],
    
    
                                                    
                                                       
                                                    
                                                   
    
};
