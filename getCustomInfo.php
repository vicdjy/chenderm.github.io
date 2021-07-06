<?php

//get id from common.js
$idPHP= $_POST['idPHP'];

try{
    $dsn = 'mysql:dbname=DV4L_schema; host=127.0.0.1';//local host
    $user = 'root';
    $password = 'DV4L@uofm9163';//change

    $dbh = new PDO($dsn, $user, $password);
    //echo $dbh;
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
    
    $statment = "SELECT * FROM customCodes WHERE code=";
    $statment .= "'".$idPHP."'";
    
//    echo $idPHP;

    $result = $dbh->prepare($statment);
    $result -> execute();


    
    $row = $result->fetch();
    
    $dbs = $row["dbs"];
    $dqs = $row["dqs"];
    
    echo $dbs;
    echo "|";
    echo $dqs;

    
    
}catch(PDOException $ex){
    echo $ex;
    echo '{"status":0, "line":'.__LINE__.'}';
    exit;
}
?>

