<?PHP

    $id = $_GET['id'];

//    alert($id);

?>

<html>

<head>
    <title>Data Visualization For Literacy</title>

    <!-- JS -->
    <script type="text/javascript" src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
    <script src="scripts/script r.js"></script>
    <script src="scripts/sendData.js"></script>

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
    <link rel="stylesheet" type="text/css" href="style/style.css">

    <script>

//send id to javascript function
       var id = '<?php echo $id; ?>';
    
//        alert(id);

        populateGraph(id);

    </script>

</head>

<!-- HTML -->

<body>
    <div class="container">
        <div class="col1">
            <div style="width: 100%">
                <img class="logo" id="logo" src="img/HistoryInDatalogolight.png">

                <div>
                    <h2 style="display: inline-block;">Data</h2>

                    <button id="modal-help" style="float: right; margin-left: 5px; margin-top: 30px;"
                        onclick="displayHelp()">HELP</button>
                    <div class="modal" id="help">
                        <div class="modal-content">
                            <span class="close-btn" onclick="closeHelp()">&times;</span>
                            <input type="text" id="help_input" onkeyup="searchHelp()"
                                placeholder="Search for keywords...">
                            <ul id="ul">
                                <li><a href="#">Script</a></li>
                                <li><a href="#">Test1</a></li>
                                <li><a href="#">Test2</a></li>
                                <li><a href="#">Test2</a></li>
                            </ul>
                        </div>
                    </div>

                    <button id="clear" onclick="clearAllValues()"
                        style="float: right; margin-left: 5px; margin-top: 30px;">CLEAR</button>

                    <button id="default" onclick="switchToDefault()"
                        style="float: right; margin-left: 5px; margin-top: 30px;">DEFAULT</button>

                    <button id="modal-btn" onclick="displayModal()"
                        style="float: right; margin-left: 5px; margin-top: 30px;">UPLOAD SCRIPT</button>
                    <div class="modal" id="modal">
                        <div class="modal-content">
                            <span class="close-btn" onclick="closeModal()">&times;</span>
                            <form>
                                <label for="script"><b>Script File</b></label>
                                <input type="file" id="script_input" onchange="handleFiles(this.files)" accept=".json">
                                <br>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div class="row">
                <div style="width: 47%; display: inline-block;">
                    <h3 style="margin-top: 10px;" id="title">Graph 1:</h3>

                    Database (DB):
                    <select class="select" id="database0" onchange="verifyDB(0)">
                        <option value=""></option>
                        <optgroup label="Life, Death, Populations">
                            <option value="Populations" selected>Populations</option>
                            <option value="Population Female Percentage" selected>Population Female %</option>
                            <option value="Population Female Percentage at Birth" selected>Population Female % at Birth
                            </option>
                            <option value="Life Expectancy - Continents">Life Expectancy - Continents</option>
                            <option value="Median Age">Median Age</option>
                            <option value="Births">Births</option>
                            <option value="Births Per Woman">Births Per Woman</option>
                            <option value="Births Per 1000 People">Births Per 1000 People</option>
                            <option value="Child Deaths">Child Deaths</option>
                            <option value="Child Mortality Rates">Child Mortality Rates</option>
                            <option value="Survival Rate to Age 65 - Male">Survival Rate to Age 65 - Male</option>
                            <option value="Survival Rate to Age 65 - Female">Survival Rate to Age 65 - Female</option>
                        </optgroup>
                        <optgroup label="Military">
                            <option value="Military Personnel">Military Personnel</option>
                            <option value="Military Personnel Percent of Population">Military Personnel % Population
                            </option>
                            <option value="Military Spending">Military Spending</option>
                            <option value="Military Spending Percent of GDP">Military Spending % GDP</option>
                        </optgroup>
                        <optgroup label="Economies">
                            <option value="GDP">GDP</option>
                            <option value="GDP Per Capita">GDP Per Capita</option>
                            <option value="Economic Freedom Scores">Economic Freedom Scores</option>
                        </optgroup>
                        <optgroup label="Environment">
                            <option value="CO2 Emissions">CO2 Emissions</option>
                            <option value="CO2 Emissions Per Capita">CO2 Emissions Per Capita</option>
                            <option value="CO2 Emissions Percentages">CO2 Emissions %</option>
                            <option value="CO2 Emissions Cumulative">CO2 Emissions Cumulative</option>
                            <option value="CO2 Emissions Cumulative Percentages">CO2 Emissions Cumulative %</option>
                        </optgroup>
                    </select>
                    <p></p>

                    Y axis:
                    <select class="select" id="yaxis0" onchange="verifyOptions(0)">
                        <option value="" selected></option>
                    </select>
                    <p></p>

                    Year Range:
                    <div style="margin-left: 7px; width: 75%; display: inline-block;">
                        <input type="text" class="js-range-slider" id="range0" value="" />
                    </div>
                    <p></p>

                    Graph type:
                    <select class="select" id="gtype0" onchange="verifyOptions(0)">
                        <option value="" selected></option>
                        <option value="line">line</option>
                        <option value="bar">bar</option>
                    </select>
                    <div style="display: inline-block; position: relative;">
                        <c style="margin-left: 10px;">Color:</c>
                        <button class="colorButton" id="colorButton0" onclick="showColorWheel(0)"></button>
                        <div class="colorwheelMenu" id="colorWheel0">
                            <item style="background-color: #6f6f6f" onclick="changeColorButton(0,'gray')"></item>
                            <item style="background-color: #ffffff" onclick="changeColorButton(0,'white')"></item>
                            <item style="background-color: #f81b02" onclick="changeColorButton(0,'red')"></item>
                            <item style="background-color: #ff388c" onclick="changeColorButton(0,'pink')"></item>
                            <item style="background-color: #543005" onclick="changeColorButton(0,'darkBrown')"></item>
                            <item style="background-color: #a6611a" onclick="changeColorButton(0,'brown')"></item>
                            <item style="background-color: #f09415" onclick="changeColorButton(0,'orange')"></item>
                            <item style="background-color: #f2d908" onclick="changeColorButton(0,'yellow')"></item>
                            <item style="background-color: #9acd4c" onclick="changeColorButton(0,'lightGreen')"></item>
                            <item style="background-color: #549e39" onclick="changeColorButton(0,'green')"></item>
                            <item style="background-color: #31b6fd" onclick="changeColorButton(0,'lightBlue')"></item>
                            <item style="background-color: #0f6fc6" onclick="changeColorButton(0,'blue')"></item>
                            <item style="background-color: #294171" onclick="changeColorButton(0,'darkBlue')"></item>
                            <item style="background-color: #663366" onclick="changeColorButton(0,'darkPurple')"></item>
                            <item style="background-color: #ac3ec1" onclick="changeColorButton(0,'purple')"></item>
                            <item style="background-color: #af8dc3" onclick="changeColorButton(0,'lightPurple')"></item>
                        </div>
                    </div>

                    <p></p>

                    <button class="submit" id="submit0" onclick="submitGraphData(0)">SUBMIT</button>
                </div>

                <div style="height: 180px; width: 47%; float: right; margin-right: 5%; margin-top: 15px;">
                    <textarea class="form-control" id="box0" onchange="submitText(0)"
                        style="height: 100%; width: 100%; border: none" spellcheck="false"></textarea>
                </div>
            </div>
            <p></p>

            <div class="row">
                <div style="width: 47%; display: inline-block;">
                    <h3 style="margin-top: 10px;">Graph 2:</h3>

                    Database (DB):
                    <select class="select" id="database1" onchange="verifyDB(1)">
                        <option value=""></option>
                        <optgroup label="Life, Death, Populations">
                            <option value="Populations" selected>Populations</option>
                            <option value="Population Female Percentage" selected>Population Female %</option>
                            <option value="Population Female Percentage at Birth" selected>Population Female % at Birth
                            </option>
                            <option value="Life Expectancy - Continents">Life Expectancy - Continents</option>
                            <option value="Median Age">Median Age</option>
                            <option value="Births">Births</option>
                            <option value="Births Per Woman">Births Per Woman</option>
                            <option value="Births Per 1000 People">Births Per 1000 People</option>
                            <option value="Child Deaths">Child Deaths</option>
                            <option value="Child Mortality Rates">Child Mortality Rates</option>
                            <option value="Survival Rate to Age 65 - Male">Survival Rate to Age 65 - Male</option>
                            <option value="Survival Rate to Age 65 - Female">Survival Rate to Age 65 - Female</option>
                        </optgroup>
                        <optgroup label="Military">
                            <option value="Military Personnel">Military Personnel</option>
                            <option value="Military Personnel Percent of Population">Military Personnel % Population
                            </option>
                            <option value="Military Spending">Military Spending</option>
                            <option value="Military Spending Percent of GDP">Military Spending % GDP</option>
                        </optgroup>
                        <optgroup label="Economies">
                            <option value="GDP">GDP</option>
                            <option value="GDP Per Capita">GDP Per Capita</option>
                            <option value="Economic Freedom Scores">Economic Freedom Scores</option>
                        </optgroup>
                        <optgroup label="Environment">
                            <option value="CO2 Emissions">CO2 Emissions</option>
                            <option value="CO2 Emissions Per Capita">CO2 Emissions Per Capita</option>
                            <option value="CO2 Emissions Percentages">CO2 Emissions %</option>
                            <option value="CO2 Emissions Cumulative">CO2 Emissions Cumulative</option>
                            <option value="CO2 Emissions Cumulative Percentages">CO2 Emissions Cumulative %</option>
                        </optgroup>
                    </select>
                    <p></p>

                    Y axis:
                    <select class="select" id="yaxis1" onchange="verifyOptions(1)">
                        <option value="" selected></option>
                    </select>
                    <p></p>

                    Year Range:
                    <div style="margin-left: 7px; width: 75%; display: inline-block;">
                        <input type="text" class="js-range-slider" id="range1" value="" />
                    </div>
                    <p></p>

                    Graph type:
                    <select class="select" id="gtype1" onchange="verifyOptions(1)">
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
                    <p></p>
                    <button class="submit" id="submit1" onclick="submitGraphData(1)">SUBMIT</button>
                </div>

                <div style="height: 180px; width: 47%; float: right; margin-right: 5%; margin-top: 15px;">
                    <textarea class="form-control" id="box1" onchange="submitText(1)"
                        style="height: 100%; width: 100%; border: none" spellcheck="false"></textarea>
                </div>
            </div>
            <div id="themeToggle" style="margin-top: 5px;">
                <c style="font-size: 12px;">Light</c>
                <input type="checkbox" unchecked data-toggle="toggle" data-onstyle="primary" data-on=" "
                    data-offstyle="info" data-off=" " data-size="sm" onchange="changeColorTheme(this)">
                <c style="font-size: 12px;">Dark</c>
            </div>
        </div>

        <div class="col2">
            <h2>Graphs</h2>

            <div id="driving_question" style="font-size: 14px"></div>

            <div style="display: block; height: 40%;">
                <div class="graphRegion">
                    <canvas id="canvas0"></canvas>
                </div>
                <a id="download0" download="graph0.jpg" href="" onclick="downloadGraph(0)">
                    <img class="downloadIcon" src="img/downloadIcon.png" alt="Download Graph">
                </a>
            </div>

            <div style="display: block;">
                <div class="graphRegion">
                    <canvas id="canvas1"></canvas>
                </div>
                <a id="download1" download="graph1.jpg" href="" onclick="downloadGraph(1)">
                    <img class="downloadIcon" src="img/downloadIcon.png" alt="Download Graph">
                </a>
            </div>

        </div>
    </div>
</body>

</html>
