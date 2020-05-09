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
* ### Customization
  * [User upload driving question](#User-upload-driving-question-[source])
  * [User select database](#User-select-database-[source])
  * [User specify database from URL](#User-specify-database-from-URL-[source])

## Customization [[source]](https://github.com/chenderm/chenderm.github.io/blob/84232cd8d70a5fc8a30dda57f145d87008c2a4d7/scripts/script%20r.js#L139)
The user can click on the `Custom` button, which opens a pop-up window with customization choices.

### User upload driving question [[source]](https://github.com/chenderm/chenderm.github.io/blob/84232cd8d70a5fc8a30dda57f145d87008c2a4d7/scripts/script%20r.js#L154)
* At the top of the window, where it says `Driving Question`, the user can upload a file with `.csv` file with their own driving question.
* This driving question will apply to all databases the user selects.

### User select database  [[source]](https://github.com/chenderm/chenderm.github.io/blob/84232cd8d70a5fc8a30dda57f145d87008c2a4d7/scripts/script%20r.js#L197)
* In the `Custom` window, the user will be provided a clickable list of all avaliable databases. The user can choose all databases to be included in this session of DV4L. 

### User specify database from URL  [[source]](https://github.com/chenderm/chenderm.github.io/blob/84232cd8d70a5fc8a30dda57f145d87008c2a4d7/scripts/script%20r.js#L201)
* The second field of the `Custom` window says 'Database URL'. The user can paste in a URL to a `.csv` file they found on the internet. The DV4L tool will read from that file and incorporate this database into the current session. The user can find this URL under the dropdown menu `Database (DB)`. 

