# Source code for DV4L
### This is the standard version of DV4L, the [`advanced`](https://github.com/chenderm/chenderm.github.io/tree/advance) branch contains the scripting version of the tool.

## Installation
Open the DV4L folder in a terminal and type:
```bash
npm install
npm install http-server -g
```

## Running the tool locally
Open a terminal and type:
```bash
http-server -p 4200 -c-1
```
And open <localhost:4200/index.html> in a browser. You can replace `4200` with any number.

## Features
* ### Upload Script [[source]](https://github.com/chenderm/chenderm.github.io/blob/da9a25670a6c1f3e7d1d121848bc8952858a22b9/scripts/script%20r.js#L161)
  Users can upload an existing script in json format. Each field should be specified in the script.
  An example script is
```
  {
 "Graphs": [
  { 
   "DB": "Populations",
   "Yaxis": "Norway",
   "lowDate": 1800,
   "highDate": 2000,
   "gtype": "bar",
   "color": "orange"
  },
  { 
   "DB": "Populations",
   "Yaxis": "North Korea",
   "lowDate": 1830,
   "highDate": 1900,
   "gtype": "bar",
   "color": "darkGreen"
  }
 ]
}
```
* ### Modify graph through script [[source]](https://github.com/chenderm/chenderm.github.io/blob/da9a25670a6c1f3e7d1d121848bc8952858a22b9/scripts/script%20r.js#L215)
  Each graph will have a corresponding script. Users can modify the script through text boxes located in the middle of the page. The graphs and drop down menus will automatically update based on the scripts.