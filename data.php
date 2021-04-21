<?php

//Retrieve the string, which was sent via the POST parameter "user" 
$submitdata = $_POST['submitdata'];

//Decode the JSON string and convert it into a PHP associative array.
$decoded = json_decode($submitdata, true);

try{
    $dsn = 'mysql:dbname=DV4L_schema; host=127.0.0.1';//local host
    $user = 'root';
    $password = 'Abbeyhills1';//change

    $dbh = new PDO($dsn, $user, $password);

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $statement = $dbh->prepare("INSERT INTO scripts
    (sessionid,accesstime,yaxis,locationdata,lowdate,highdate,graphtype,color, graphNum, actionItem)
VALUES
    (:sessionid, :accesstime, :yaxis, :locationdata, :lowdate, :highdate, :graphtype, :color, :graphNum, :actionItem)");

    $statement->bindValue(':sessionid', $decoded['sessionid']);
    $statement->bindValue(':accesstime', $decoded['accesstime']);
    $statement->bindValue(':yaxis', $decoded['yaxis']);
    $statement->bindValue(':locationdata', $decoded['locationdata']);
    $statement->bindValue(':lowdate', $decoded['lowdate']);
    $statement->bindValue(':highdate', $decoded['highdate']);
    $statement->bindValue(':graphtype', $decoded['graphtype']);
    $statement->bindValue(':color', $decoded['color']);
    $statement->bindValue(':graphNum', $decoded['graphNum']);
    $statement->bindValue(':actionItem', $decoded['actionItem']);
    $statement->execute();
   
}catch(PDOException $ex){
    echo $ex;
    echo '{"status":0, "line":'.__LINE__.'}';
    exit;
}

?>