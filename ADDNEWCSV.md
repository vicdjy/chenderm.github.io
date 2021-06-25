#  HOW TO ADD A NEW DATABASE INTO DV4L


### STEP 1
* Add a new csv file for the database in the csv folder of the project
* ensure that the csv file is in the correct format
* the correct format has "year" in block A1, all the locations in the first row, and all the years in the first column. It is allowed to have blank spots in the data. 


### STEP 2
*  Add new database into common.js database dictionary. [[source]](https://github.com/vicdjy/chenderm.github.io/blob/2959fdf79c482c23f1d7fc6de8c24739ba221657/scripts/common.js#L133)


### STEP 3
* Ensure that the pathname is correct in common.js so that the right csv folder is searched
* [[source]](https://github.com/vicdjy/chenderm.github.io/blob/2959fdf79c482c23f1d7fc6de8c24739ba221657/scripts/common.js#L467) and [[source]](https://github.com/vicdjy/chenderm.github.io/blob/2959fdf79c482c23f1d7fc6de8c24739ba221657/scripts/common.js#L926), look in '/dv4l/csv/' so that it searches the right csv folder
* when running locally '/csv/' is the correct path name

### Trail Run 
* To practice entering a new database into DV4L there is test.csv in both cpanel and the github repo. Use this valid format csv to create a new database

