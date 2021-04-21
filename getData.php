<!--getData.php file for scripting version-->
<?php
//tabs not working
//TODO: potentionally put it in a table form, make it neater
try{
    $dsn = 'mysql:dbname=DV4L; host=localhost';//local host
    $user = 'DV4Luser';
    $password = 'DV4Lpassword';//change

    $dbh = new PDO($dsn, $user, $password);
    //echo $dbh;
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $result = $dbh->prepare("SELECT * FROM scripts");//error here
    $result -> execute();

    //echo $result;
    
    echo "numrows: ";
    var_dump($result -> rowCount());
    echo "<br><br>";
    
    echo "sessionid, accesstime, yaxis, location, lowDate, 
    highDate, graphType, Color, graphNum, ActionItem ";
    echo "<br><br>";


    //error getting 0 rows going into else
    //if ($result -> num_rows >0){
    while($row = $result->fetch()) {
        echo $row["sessionid"], ", ";
        echo $row["accesstime"], ", ";
        echo $row["yaxis"], ", ";
        echo $row["locationdata"], ", ";
        echo $row["lowDate"], ", ";
        echo $row["highDate"], ", ";
        echo $row["graphType"], ", ";
        echo $row["color"], ", ";
        echo $row["graphNum"], ", ";
        echo $row["actionItem"];
        
        echo "<br>";
    }//while
   
    
    
}catch(PDOException $ex){
    echo $ex;
    echo '{"status":0, "line":'.__LINE__.'}';
    exit;
}
?>

