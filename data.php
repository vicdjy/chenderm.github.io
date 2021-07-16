<?php

//Retrieve the string, which was sent via the POST parameter "user" 
$submitdata = $_POST['submitdata'];

//Decode the JSON string and convert it into a PHP associative array.
$decoded = json_decode($submitdata, true);

//var_dump the array so that we can view it's structure.
//var_dump($submitdata);

//connect to database and perform sql queries
//echo $decoded['graphtype'];

try{
    $dsn = 'mysql:dbname=DV4L_schema; host=127.0.0.1';//local host
    $user = 'root';
    $password = 'DV4L@uofm9163';//change
    $dbh = new PDO($dsn, $user, $password);

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    $statement = $dbh->prepare("INSERT INTO export
    (sessionid,accesstime,yaxis,locationdata,lowdate,highdate,graphtype,color,drivingQuestion, isDropDown, hasNotes, scriptSeen, savedGraphNum, exportNum, customCode)
VALUES
    (:sessionid, :accestime, :yaxis, :locationdata, :lowdate, :highdate, :graphtype, :color, :drivingQuestion, :isDropDown, :hasNotes, :scriptSeen, :savedGraphNum, :exportNum, :customCode)");

    $statement->bindValue(':sessionid', $decoded['sessionid']);
    $statement->bindValue(':accestime', $decoded['accesstime']);
    $statement->bindValue(':yaxis', $decoded['yaxis']);
    $statement->bindValue(':locationdata', $decoded['locationdata']);
    $statement->bindValue(':lowdate', $decoded['lowdate']);
    $statement->bindValue(':highdate', $decoded['highdate']);
    $statement->bindValue(':graphtype', $decoded['graphtype']);
    $statement->bindValue(':color', $decoded['color']);
    $statement->bindValue(':drivingQuestion', $decoded['drivingQuestion']);
    $statement->bindValue(':isDropDown', $decoded['isDropDown']);
    $statement->bindValue(':hasNotes', $decoded['hasNotes']);
    $statement->bindValue(':scriptSeen', $decoded['scriptSeen']);
    $statement->bindValue(':savedGraphNum', $decoded['savedGraphNum']);
    $statement->bindValue(':exportNum', $decoded['exportNum']);
    $statement->bindValue(':customCode', $decoded['customCode']);
    $statement->execute();
   
}catch(PDOException $ex){
    echo $ex;
    echo '{"status":0, "line":'.__LINE__.'}';
    exit;
}

?>
