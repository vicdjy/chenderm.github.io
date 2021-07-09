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


//send the data to the sql database
function useSelected(){
    
    var linkDiv = document.getElementById("link");
    var lastName = document.getElementById("lastname");
    
    var customCode = lastName.value;
    
    selectedstr = selected + "";
    
    var submitdata = {
        
        'code': lastName.value,
        'dbs': selected.toString(),
        'dqs': selectedDQ.toString(),
        'replace': 0,
        
        
    };
    
    
   

    
    //if we are updating an already existing link, then replace its sql row
    if(Updating){
        
        alert("DV4L Updated");
        
        //change the code from last name to the custom id entered
        submitdata['code'] = getId();
        
        submitdata['replace'] = 1;

        console.log("here");
        console.log(submitdata);
        
    }
    
    
    var submitdatastr = JSON.stringify(submitdata);

    
    $.ajax({
        
        url:'../sendData.php',
        type: 'POST',
    data: {submitdata: submitdatastr },
    success: function(data){

        
        console.log(data);
        
        //only generate a link if we are not replacing data
        if(submitdata['replace'] == 0){
            
        //-1 to signify use lastname as custom code
        generateLink(data, -1);
        
        }
        
    },
        
    error: function (XMLHttpRequest, textStatus, errorThrown) {
  
        alert('Status: ' + textStatus);
        alert('Error: ' + errorThrown);
        
    },
        
        
    });
    
    
    
    
}

function generateLink(data, customCode){
    
    var linkDiv = document.getElementById("link");
    var lastName = document.getElementById("lastname");
    
    if(customCode == -1){
        customCode = lastName.value;
    }
    
    
    console.log(data);
    
    //the last name already exists, alter it
    if(data == "fail"){
        
        modifyCode(customCode);
        return;
    }
    
   
    
    
    linkDiv.innerHTML = '' ;
    
    
    //populate the custom code div
    var link = "historyindata.org/dv4l/customDV4l.php?id=" + customCode;
    
    var title = document.createElement("label");
    var description = document.createTextNode(link);
    
    
    
    
      
      title.appendChild(description);
      linkDiv.appendChild(title);
    

    
}


function modifyCode(customCode){
    
    customCode += "1";
    
    selectedstr = selected + "";
    
    var submitdata = {
        
        'code': customCode,
        'dbs': selected.toString(),
        'dqs': selectedDQ.toString(),
        
    };
    
    var submitdatastr = JSON.stringify(submitdata);
    
    $.ajax({
        
        url:'../sendData.php',
        type: 'POST',
    data: {submitdata: submitdatastr },
    success: function(data){

        
//        console.log(data);
        
        generateLink(data, customCode);
        

        
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
        
        updateSelected();
    
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
        
        updateSelected();
   
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
        var check = document.getElementsByClassName("checkDQ");
        
        for(var i = 0; i < check.length; i++){
            
            check[i].checked = true;
            
        }
    
        updateSelectedDQ();
    }
    else {
        
        DQList.style.filter = "brightness(100%)";
        DQList.style.pointerEvents = "all";
        customDQ.style.filter = "brightness(100%)";
        customDQ.style.pointerEvents = "all";
         
        
        //uncheck all of the boxes in the list
        var check = document.getElementsByClassName("checkDQ");
        
        for(var i = 0; i < check.length; i++){
            
            check[i].checked = false;
            
        }
        
        updateSelectedDQ();
   
    }
    
    
    
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


//contains the selected driving questions
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
                
                var question = checkTitle[i].outerText
              var temp = question.replace(/[.,()]/g,"");
              question = temp.replace(/\s{2,}/g," ");
                
                selectedDQ.push(question);
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


//gets the id from the entered custom link
function getId(){
    
    //get the customCode from the entered link
    var link = document.getElementById("customLink");
    
    console.log(link.value);
    
    //get the id
    var id = link.value.substring(link.value.lastIndexOf('=') + 1);
    
    return id;
    
    console.log(id);
    
}



//using an entered custom link
function configureDV4L(){
    
   

    
        var customCode = getId();
    
        var idPHP = JSON.stringify(customCode);
   
        
        
        //search in the database for matching primary key(id)
        $.ajax({
          url: '../getCustomInfo.php',
          type: 'POST',
          data: { idPHP: customCode },
          success: function (data) {
//              console.log(data);
              console.log(idPHP);
              //"|" would be the only output if nothing is found
              if(idPHP == "" || data == "|"){
                  
                  alert("Custom Link Not Found, Configure a New Version of DV4L");
                  
              }
              else {
              
    //          console.log(data);
              
           var newData = data.split("|");

            var databases = newData[0].split(",");
            
              var dqs = newData[1].split(",");

              useCustomDatabases(databases);
              useCustomDQs(dqs);
              
                  //displays the new link
                  updateLink();
              
              }
          
          },
          error: function (XMLHttpRequest, textStatus, errorThrown) {
            alert('Status: ' + textStatus);
            alert('Error: ' + errorThrown); //error?
          },
        });
    
    
    
}

//updates the link
function updateLink(){
    
    var linkDiv = document.getElementById("link");
    
    linkDiv.innerHTML = "";
    
    var link = document.getElementById("customLink").value;
    
    var title = document.createElement("label");
    var description = document.createTextNode(link);
    
    
    
    
      
      title.appendChild(description);
      linkDiv.appendChild(title);
    
    
    var linkDiv = document.getElementById("generateLink");
    
    linkDiv.innerHTML = "Update Link";
    
    
    
}


var Updating = 0;
function useCustomDatabases(databases){
    Updating = 1;
    
    
    selected = databases;
    
    
    //loop through the options and select if in the databases list
    var checkTitles = document.getElementsByClassName("checkTitle");
    var checks = document.getElementsByClassName("check");
    
    for(var i = 0 ; i < checks.length; i++){
        
        for(var j = 0; j < databases.length; j++){
            
            if(databases[j] == checkTitles[i].outerText){
                
                checks[i].checked = true;
            }
            
        }
        
    }
    
    updateSelected();
    
}


function useCustomDQs(dqs){
  
    selectedDQ = dqs;
    
    
    //loop through the options and select if in the databases list
    var checkTitles = document.getElementsByClassName("checkTitleDQ");
    var checks = document.getElementsByClassName("checkDQ");
    

    
    //loop through the selectedDQs and check the appropiate ones, create if not
    
    for(var i = 0; i < dqs.length; i++){
        
        var added = 0;
        
        for(var j = 0; j < checkTitles.length; j++){
            
            if(dqs[i] == checkTitles[j].outerText){
                
                checks[i].checked = true;
                added = 1;
                
            }
            
        }
        
        //have to add the custom question
        if(added == 0){
            
            
            
            var question = dqs[i];
            
            var DQList = document.getElementById("DQList");
            
            
            var option = document.createElement('option');
            var title = document.createElement("label");
            var description = document.createTextNode(question);
            var checkbox = document.createElement("input");

              checkbox.type = "checkbox";
              checkbox.name = question;
            
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
            
        }
        
    }
    
    
    updateSelectedDQ();
    
    
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
