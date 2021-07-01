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
    
    $statement = $dbh->prepare("INSERT INTO customCodes
    (code, dbs, dqs)
    
VALUES
    (:code, :dbs, :dqs)");

    $statement->bindValue(':code', $decoded['code']);
    $statement->bindValue(':dbs', $decoded['dbs']);
    $statement->bindValue(':dqs', $decoded['dqs']);
//    $statement->bindValue(':databases', $decoded['databases']);
//    $statement->bindValue(':drivingQuestions', $decoded['drivingQuestions']);
    $statement->execute();
   
}catch(PDOException $ex){
    echo $ex;
    echo '{"status":0, "line":'.__LINE__.'}';
    exit;
}

?>
