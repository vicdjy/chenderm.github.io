<html>

<head>
    <title>Data Visualization For Literacy</title>

    <!-- JS -->
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="scripts/common.js"></script>
    <script src="scripts/basic.js"></script>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.1"></script>
    <script src="https://cdn.jsdelivr.net/npm/hammerjs@2.0.8"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-zoom@0.7.4"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.1/js/ion.rangeSlider.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-colorschemes"></script>
    <script src="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/js/bootstrap4-toggle.min.js"></script>


    <!-- CSS -->
    <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/ion-rangeslider/2.3.1/css/ion.rangeSlider.min.css" />
    <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/gh/gitbrent/bootstrap4-toggle@3.6.1/css/bootstrap4-toggle.min.css">
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
    <link rel="stylesheet" type="text/css" href="style/common.css">
    <link rel="stylesheet" type="text/css" href="style/basic.css">

</head>

<!-- HTML -->

<body>

    <div class="container">
        <div class="col1">
            <img class="logo" src="img/HistoryInDatalogolight.png">

            <div style="width: 100%">
                <h2 style="display: inline-block;">Data</h2>
                <!-- <button id="clear" onclick="clearAllValues()" style="float: right; margin-left: 10px; margin-top: 30px;">CLEAR</button> -->
                <button id="default" onclick="switchToDefault()"
                    style="float: right; margin-left: 10px; margin-top: 30px;">DEFAULT</button>
                <!-- <button id="modal-btn" onclick="displayModal()" style="float: right; margin-left: 10px; margin-top: 30px;">CUSTOM</button> -->
                <div class="modal">
                    <div class="modal-content">
                        <span class="close-btn" onclick="closeModal()">&times;</span>
                        <!-- <b>Database URL</b><input type="text" id="data_url"><button onclick="handleDataURL()">SUBMIT</button> -->
                        <br>
                        <form onsubmit="submitDrivingQuestions();return false">
                            <!-- <label for="question"><b>Driving Question</b></label>
                            <input type="file" id="driving_question_input" onchange="handleDrivingQuestionFiles(this.files)" accept=".csv"> -->
                            <br>
                            Select datasets this driving question applies to:
                            <br>
                            <fieldset>
                                <legend>Life, Death, Populations</legend>
                                <input type="checkbox" name="database_selection" value="Populations"> Populations <br>
                                <input type="checkbox" name="database_selection" value="Population Female Percentage">
                                Population Female % <br>
                                <input type="checkbox" name="database_selection"
                                    value="Population Female Percentage at Birth">
                                Population Female % at Birth<br>
                                <input type="checkbox" name="database_selection" value="Life Expectancy - Continents">
                                Life Expectancy - Continents<br>
                                <input type="checkbox" name="database_selection" value="Median Age">Median Age<br>
                                <input type="checkbox" name="database_selection" value="Births">Births<br>
                                <input type="checkbox" name="database_selection" value="Births Per Woman">Births Per
                                Woman<br>
                                <input type="checkbox" name="database_selection" value="Births Per 1000 People">
                                Births Per 1000 People<br>
                                <input type="checkbox" name="database_selection" value="Child Deaths">Child Deaths<br>
                                <input type="checkbox" name="database_selection" value="Child Mortality Rates">Child
                                Mortality Rates<br>
                                <input type="checkbox" name="database_selection" value="Survival Rate to Age 65 - Male">
                                Survival Rate to Age 65 - Male<br>
                                <input type="checkbox" name="database_selection"
                                    value="Survival Rate to Age 65 - Female">
                                Survival Rate to Age 65 - Female<br>
                            </fieldset>
                            <fieldset>
                                <legend>Military</legend>
                                <input type="checkbox" name="database_selection" value="Military Personnel">Military
                                Personnel<br>
                                <input type="checkbox" name="database_selection"
                                    value="Military Personnel Percent of Population">
                                Military Personnel % Population<br>
                                <input type="checkbox" name="database_selection" value="Military Spending">Military
                                Spending<br>
                                <input type="checkbox" name="database_selection"
                                    value="Military Spending Percent of GDP">
                                Military Spending % GDP<br>
                            </fieldset>
                            <fieldset>
                                <legend>Economies</legend>
                                <input type="checkbox" name="database_selection" value="GDP">GDP<br>
                                <input type="checkbox" name="database_selection" value="GDP Per Capita">GDP Per
                                Capita<br>
                                <input type="checkbox" name="database_selection" value="Economic Freedom Scores">
                                Economic Freedom Scores<br>
                            </fieldset>
                            <fieldset>
                                <legend>Environment</legend>
                                <input type="checkbox" name="database_selection" value="CO2 Emissions">CO2 Emissions<br>
                                <input type="checkbox" name="database_selection" value="CO2 Emissions Per Capita">
                                CO2 Emissions Per Capita<br>
                                <input type="checkbox" name="database_selection" value="CO2 Emissions Percentages">
                                CO2 Emissions %<br>
                                <input type="checkbox" name="database_selection" value="CO2 Emissions Cumulative">
                                CO2 Emissions Cumulative<br>
                                <input type="checkbox" name="database_selection"
                                    value="CO2 Emissions Cumulative Percentages">
                                CO2 Emissions Cumulative %<br>
                            </fieldset>
                            <input type="submit" value="Submit" style="color: black"><br>
                        </form>
                    </div>
                </div>
                <!-- Driving Question Code: DG -->
                <!-- <label><h4>Choose or Enter a Driving Question</h4>
                    <input style="width:450px;" list="dq" name="myDq" />
                </label> -->
                <!-- <datalist style="width:700px" id="dq">
                    <option>How do rates of population growth among countries in the same <p> region/continent compare? What explains observed differences?</p></option>
                    <option value="Question 2"
                    <option value="Question 3">
                    <option value="Question 4">
                    <option value="Question 5">
                    <option value="Question 6">
                </datalist> -->

                <form onSubmit="return false;">
                    <label for="dqs">Choose a Driving Question:</label><br>
                    <select style="width:350px" id="textinput" onchange="addDrivingQuestion()">
                        <option value="" disabled selected>Select Driving Question</option>
                        <option>How do rates of population growth among countries in the same region/continent compare?
                            What explains observed differences?</option>
                        <option>What accounts for sharp increases or decreases in military spending? Do increases in
                            military spending seem to be cause, consequence, or deterrent of violent conflict? </option>
                        <option>Is there a consistent relationship between child mortality rates and births per women?
                            What explains consistencies and inconsistencies in this relationship across countries?
                        </option>
                        <option>How do CO2 emissions per capita compare among countries? What are the implications of
                            similarities/differences for national/international policymaking?</option>

                    </select>
                    <br>OR<br>
                    <input style="width:350px" placeholder="Enter Driving Question here" id="textinput2"
                        name="textinput2" value="" onkeypress="addDrivingQuestion2()"></input>
                </form>
                <div>
                    <h3>Driving Question:</h3>
                    <p id="textEntered"></p>
                </div>
            </div>
            <br>
            <div class="row">
                <h3 style="margin-top: 10px;">Graph 1:</h3>


                <form>
                    Database (y-axis):
                    <select name="db" class="select" id="database1" onchange="verifyDB(1)">
                    </select>
                </form>

                <!-- <button id ="modal-btn" onclick="displayModal()" style="font-size:11px; line-height:180%;float: right; margin-left: 0px; margin-top: 0px;">CUSTOM</button> -->

                <p></p>

                Location:
                <select name="loc" class="select" id="yaxis1" onchange="verifyOptions(1)">
                    <option value="" selected></option>
                </select>
                <p></p>

                Year Range (x-axis):
                <div style="margin-left: 7px; width: 75%; display: inline-block;">
                    <input type="text" class="js-range-slider" id="range1" value="" />
                </div>
                <p></p>

                <div style="display: inline-block; position: relative;">
                    Graph type:
                    <select name="gty" class="select" id="gtype1" onchange="verifyOptions(1)">
                        <option value="" selected></option>
                        <option value="line">line</option>
                        <option value="bar">bar</option>
                    </select>
                    <div style="display: inline-block; position: relative;">
                        <c style="margin-left: 10px;">Color:</c>
                        <button class="colorButton" id="colorButton1" onclick="showColorWheel(1)"></button>
                        <div class="colorwheelMenu" id="colorWheel1">
                            <item style="background-color: #6f6f6f" onclick="changeColorButton(1,'gray')"></item>
                            <item style="background-color: #ffffff" onclick="changeColorButton(1,'white')"></item>
                            <item style="background-color: #f81b02" onclick="changeColorButton(1,'red')"></item>
                            <item style="background-color: #ff388c" onclick="changeColorButton(1,'pink')"></item>
                            <item style="background-color: #543005" onclick="changeColorButton(1,'darkBrown')"></item>
                            <item style="background-color: #a6611a" onclick="changeColorButton(1,'brown')"></item>
                            <item style="background-color: #f09415" onclick="changeColorButton(1,'orange')"></item>
                            <item style="background-color: #f2d908" onclick="changeColorButton(1,'yellow')"></item>
                            <item style="background-color: #9acd4c" onclick="changeColorButton(1,'lightGreen')"></item>
                            <item style="background-color: #549e39" onclick="changeColorButton(1,'green')"></item>
                            <item style="background-color: #31b6fd" onclick="changeColorButton(1,'lightBlue')"></item>
                            <item style="background-color: #0f6fc6" onclick="changeColorButton(1,'blue')"></item>
                            <item style="background-color: #294171" onclick="changeColorButton(1,'darkBlue')"></item>
                            <item style="background-color: #663366" onclick="changeColorButton(1,'darkPurple')"></item>
                            <item style="background-color: #ac3ec1" onclick="changeColorButton(1,'purple')"></item>
                            <item style="background-color: #af8dc3" onclick="changeColorButton(1,'lightPurple')"></item>
                        </div>
                    </div>
                </div>
                <p></p>

                <button class="submit" id="submit1" onclick="submitGraphData(1)">SUBMIT</button>
            </div>
            <p></p>
            <div class="row">
                <h3 style="margin-top: 10px;">Graph 2:</h3>

                Database (y-axis):
                <select class="select" id="database2" onchange="verifyDB(2)">
                </select>
                <!-- <button id ="modal-btn" onclick="displayModal()" style="font-size:11px; line-height:180%;float: right; margin-left: 0px; margin-top: 0px;">CUSTOM</button> -->

                <p></p>

                Location:
                <select class="select" id="yaxis2" onchange="verifyOptions(2)">
                    <option value="" selected></option>
                </select>
                <p></p>

                Year Range (x-axis):
                <div style="margin-left: 7px; width: 75%; display: inline-block;">
                    <input type="text" class="js-range-slider" id="range2" value="" />
                </div>
                <p></p>

                <div style="display: inline-block; position: relative;">
                    Graph type:
                    <select class="select" id="gtype2" onchange="verifyOptions(2)">
                        <option value="" selected></option>
                        <option value="line">line</option>
                        <option value="bar">bar</option>
                    </select>
                    <div style="display: inline-block; position: relative;">
                        <c style="margin-left: 10px;">Color:</c>
                        <button class="colorButton" id="colorButton2" onclick="showColorWheel(2)"></button>
                        <div class="colorwheelMenu" id="colorWheel2">
                            <item style="background-color: #6f6f6f" onclick="changeColorButton(2,'gray')"></item>
                            <item style="background-color: #ffffff" onclick="changeColorButton(2,'white')"></item>
                            <item style="background-color: #f81b02" onclick="changeColorButton(2,'red')"></item>
                            <item style="background-color: #ff388c" onclick="changeColorButton(2,'pink')"></item>
                            <item style="background-color: #543005" onclick="changeColorButton(2,'darkBrown')"></item>
                            <item style="background-color: #a6611a" onclick="changeColorButton(2,'brown')"></item>
                            <item style="background-color: #f09415" onclick="changeColorButton(2,'orange')"></item>
                            <item style="background-color: #f2d908" onclick="changeColorButton(2,'yellow')"></item>
                            <item style="background-color: #9acd4c" onclick="changeColorButton(2,'lightGreen')"></item>
                            <item style="background-color: #549e39" onclick="changeColorButton(2,'green')"></item>
                            <item style="background-color: #31b6fd" onclick="changeColorButton(2,'lightBlue')"></item>
                            <item style="background-color: #0f6fc6" onclick="changeColorButton(2,'blue')"></item>
                            <item style="background-color: #294171" onclick="changeColorButton(2,'darkBlue')"></item>
                            <item style="background-color: #663366" onclick="changeColorButton(2,'darkPurple')"></item>
                            <item style="background-color: #ac3ec1" onclick="changeColorButton(2,'purple')"></item>
                            <item style="background-color: #af8dc3" onclick="changeColorButton(2,'lightPurple')"></item>
                        </div>
                    </div>
                </div>
                <p></p>

                <button class="submit" id="submit2" onclick="submitGraphData(2)">SUBMIT</button>
            </div>
            <div id="themeToggle" style="margin-top: 5px;">
                <c style="font-size: 12px;">Light</c>
                OR<input type="checkbox" unchecked data-toggle="toggle" data-onstyle="primary" data-on=" "
                    data-offstyle="info" data-off=" " data-size="sm" onchange="changeColorTheme(this)">
                <c style="font-size: 12px;">Dark</c>
            </div>
        </div>

        <div class="col2">
            <h2>Graphs</h2>
            <div id="driving_question" style="font-size: 14px"></div>

            <div class="graphRegion" ondrop="drop(event, 'graph1'); dropEnd()" ondragover="
                allowDrop(event)" ondragend="sendData(1, 'saved')">
                <canvas id="canvas1"></canvas>
                <button class="saveButton" id="save1" draggable="true"
                    ondragstart="drag(event, 'graph1'); dragstart('1')">SAVE GRAPH 1
                    (drag & drop)</button>
                <button class="export" id="export1" onclick="exportGraph(1);">EXPORT</button>

            </div>

            <br><br>
            <div class="graphRegion" ondrop="drop(event, 'graph2'); dropEnd()" ondragover="allowDrop(event)"
                ondragend="sendData(1, 'saved')">
                <canvas id="canvas2"></canvas>
                <button class="saveButton" id="save2" draggable="true"
                    ondragstart="drag(event, 'graph2'); dragstart('2')">SAVE GRAPH 2
                    (drag & drop)</button>
                <button class="export" id="export2" onclick="exportGraph(2);">EXPORT</button>

            </div>
        </div>

        <div class="col3">
            <div id="themeToggle" style="margin-top: 5px;">
                <h2>Saved</h2>
                <p align="right">
                    <c style="font-size: 20px;text-align:right">Add Notes</c>
                    <input type="checkbox" unchecked data-toggle="toggle" data-onstyle="primary" data-on=" "
                        data-offstyle="info" data-off=" " data-size="sm" onchange="addNotes(this)">
                </p>
            </div>

            <br>
            <div class="pillar">

                <div class="frame" id="frame1">
                    <div class="tile" ondrop="drop(event, 'saved1'); droppedDest()" ondragover="allowDrop(event)"
                        onclick="showToolTip(1)">
                        <div class="tooltiptext" id="tip1"></div>
                        <canvas id="saved1"></canvas>

                        <a id="exit1" class="exit" onclick="changeBool(1)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap1" class="swap" draggable="true" ondragstart="drag(event, 'saved1')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>

                <div class="frame">
                    <div class="tile" ondrop="drop(event, 'saved2'); droppedDest()" ondragover="allowDrop(event)"
                        onclick="showToolTip(2)">
                        <span class="tooltiptext" id="tip2"></span>
                        <canvas id="saved2"></canvas>
                        <a id="exit2" class="exit" onclick="changeBool(2)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap2" class="swap" draggable="true" ondragstart="drag(event, 'saved2')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>

                <div class="frame">
                    <div class="tile" ondrop="drop(event, 'saved3'); droppedDest()" ondragover="allowDrop(event)"
                        onclick="showToolTip(3)">
                        <span class="tooltiptext" id="tip3"></span>
                        <canvas id="saved3"></canvas>
                        <a id="exit3" class="exit" onclick="changeBool(3)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap3" class="swap" draggable="true" ondragstart="drag(event, 'saved3')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>

                <div class="frame" id="hide1">
                    <div class="tile" ondrop="drop(event, 'saved4'); droppedDest()" ondragover="allowDrop(event)"
                        onclick="showToolTip(4)">
                        <span class="tooltiptext" id="tip4"></span>
                        <canvas id="saved4"></canvas>
                        <a id="exit4" class="exit" onclick="changeBool(4)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap4" class="swap" draggable="true" ondragstart="drag(event, 'saved4')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>

                <div class="frame" id="hide2">
                    <div class="tile" ondrop="drop(event, 'saved5'); droppedDest()" ondragover="allowDrop(event)"
                        onclick="showToolTip(5)">
                        <span class="tooltiptext" id="tip5"></span>
                        <canvas id="saved5"></canvas>
                        <a id="exit5" class="exit" onclick="changeBool(5)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap5" class="swap" draggable="true" ondragstart="drag(event, 'saved5')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>
            </div>
            <div class="pillar">
                <div class="frame">
                    <div class="tile" ondrop="drop(event, 'saved6'); droppedDest()" ondragover="allowDrop(event)"
                        onclick="showToolTip(6)">
                        <span class="tooltiptext" id="tip6"></span>
                        <canvas id="saved6"></canvas>
                        <a id="exit6" class="exit" onclick="changeBool(6)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap6" class="swap" draggable="true" ondragstart="drag(event, 'saved6')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>

                <div class="frame">
                    <div class="tile" onclick="showToolTip(7)" ondrop="drop(event, 'saved7'); droppedDest()"
                        ondragover="allowDrop(event)">
                        <span class="tooltiptext" id="tip7"></span>
                        <canvas id="saved7"></canvas>
                        <a id="exit7" class="exit" onclick="changeBool(7)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap7" class="swap" draggable="true" ondragstart="drag(event, 'saved7')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>

                <div class="frame">
                    <div class="tile" onclick="showToolTip(8)" ondrop="drop(event, 'saved8'); droppedDest()"
                        ondragover="allowDrop(event)">
                        <span class="tooltiptext" id="tip8"></span>
                        <canvas id="saved8"></canvas>
                        <a id="exit8" class="exit" onclick="changeBool(8)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap8" class="swap" draggable="true" ondragstart="drag(event, 'saved8')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>

                <div class="frame" id="hide3">
                    <div class="tile" onclick="showToolTip(9)" ondrop="drop(event, 'saved9'); droppedDest()"
                        ondragover="allowDrop(event)">
                        <span class="tooltiptext" id="tip9"></span>
                        <canvas id="saved9"></canvas>
                        <a id="exit9" class="exit" onclick="changeBool(9)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap9" class="swap" draggable="true" ondragstart="drag(event, 'saved9')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>

                <div class="frame" id="hide4">
                    <div class="tile" onclick="showToolTip(10)" ondrop="drop(event, 'saved10'); droppedDest()"
                        ondragover="allowDrop(event)">
                        <span class="tooltiptext" id="tip10"></span>
                        <canvas id="saved10"></canvas>
                        <a id="exit10" class="exit" onclick="changeBool(10)">x
                            <div class="hoverTip">delete</div>
                        </a>
                        <a id="swap10" class="swap" draggable="true" ondragstart="drag(event, 'saved10')">&#x21c4;
                            <div class="hoverTip">transfer (drag & drop)</div>
                        </a>
                    </div>
                </div>
            </div>

            <!-- Notes code by DG -->
            <div id="myNotes" style="display:none;">
                <h2>Notes</h2>
                <textarea id="notes" rows="10" cols="40" value=""></textarea>
                <br><br>
                <button class="export" onclick="exportNotes()">EXPORT NOTE</button>
            </div>

        </div>
    </div>
    <div class="button" onclick="getData()">
        button
    </div>

</body>
</html>
