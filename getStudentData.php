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
    
    $statment = "SELECT DISTINCT sessionid FROM export WHERE customCode=";
    $statment .= "'".$idPHP."'";
    
    $output = array(); // all student data will be added here and returned to common.js

    $result = $dbh->prepare($statment);
    $result -> execute();
    
    $row = $result->fetch();
    
    $studentCount = $result->rowCount();
    
    
    array_push($output, $studentCount);
    
    $statment = "SELECT * FROM export WHERE yaxis IS NULL AND locationdata IS NULL AND lowdate IS NULL AND highdate IS NULL AND graphtype IS NULL AND color IS NULL AND drivingQuestion IS NULL AND isDropDown IS NULL AND hasNotes IS NULL AND scriptSeen IS NULL AND savedgraphnum IS NULL AND exportnum IS NULL AND  customCode=";
    $statment .= "'".$idPHP."'";
    
//    echo $idPHP;

    $result = $dbh->prepare($statment);
    $result -> execute();
    
    $count = $result->rowCount();
    
    $sum_time = 0;
    
    for($i = 0; $i < $count; $i++){
        
        $row = $result->fetch();
        
        
        $time1 = $row["accesstime"];
        
        $row = $result->fetch();
        
        $time2 = $row["accesstime"];
        
        $difference_in_seconds = strtotime($time2) - strtotime($time1);
        
        $sumTime += $difference_in_seconds;
        
        $timeSpent =  gmdate("H:i:s", $difference_in_seconds); // convert seconds into timestamp

        
        
        array_push($output, $timeSpent);
        
        $i++;
        
    }
    
    $avgTime = $sumTime / $count / 60;
    
    
    array_push($output, $avgTime);

    
    
    
    echo json_encode($output);
    
    
    

    
    
}catch(PDOException $ex){
    echo $ex;
    echo '{"status":0, "line":'.__LINE__.'}';
    
//    echo "fail";
    exit;
}
?>
