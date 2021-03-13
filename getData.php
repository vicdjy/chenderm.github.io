<?php
    //print "in getdata";
    /*
    $q = $_GET['q'];
    $con = mysqli_connect("127.0.0.1", "root", "Abbeyhills1", "DV4L_schema");
    if (!$con){
        die('Could not connect: ' . mysqli_error($con));
    }

    //get the
    mysqli_select_db($con,"DV4L_schema");
    $sql = "SELECT * FROM export";
    $result = mysqli_query($con,$sql);
    while ($row = $result->fetch_assoc()) {
        echo $row['classtype'];
    }
    */

    $dsn = 'mysql:dbname=DV4L_schema; host=127.0.0.1';//local host
    $user = 'root';
    $password = 'password';//change

    $dbh = new PDO($dsn, $user, $password);
    //echo $dbh;
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $result = $dbh->query("SELECT * FROM export");//error here 

    //echo $result;
    echo "numrows: ";
    echo $result -> num_rows;
    //error getting 0 rows going into else
    //if ($result -> num_rows >0){
        while($row = $result->fetch_assoc()) {
            //only works w fetch association
            //can't say fetch_assoc() undefined method
            //echo "sessionid: " . $row["sessionid"]."<br>";
            print_r("printing");
        }//while
    //}//if
    /*else {
        echo " no results";
    }*/
    //$dbh -> close();

?>