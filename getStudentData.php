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
    
    
//    array_push($output, $studentCount);
    
    //get the start and end times for the visits
    $statment = "SELECT * FROM export WHERE yaxis IS NULL AND locationdata IS NULL AND lowdate IS NULL AND highdate IS NULL AND graphtype IS NULL AND color IS NULL AND drivingQuestion IS NULL AND isDropDown IS NULL AND hasNotes IS NULL AND scriptSeen IS NULL AND savedgraphnum IS NULL AND exportnum IS NULL AND  customCode=";
    $statment .= "'".$idPHP."'";


    $result = $dbh->prepare($statment);
    $result -> execute();
    
    $count = $result->rowCount();
    
    $sum_time = 0;
    $numValidVisits = 0;
    
    for($i = 0; $i < $count ; $i++){
        
        $row = $result->fetch();
        
        //time user opens the page
        $time1 = $row["accesstime"];
        
//        look for a matching session id which would indicate the time user left
        $statment = "SELECT * FROM export WHERE sessionid ='".$row["sessionid"]."' AND yaxis IS NULL AND locationdata IS NULL AND lowdate IS NULL AND highdate IS NULL AND graphtype IS NULL AND color IS NULL AND drivingQuestion IS NULL AND isDropDown IS NULL AND hasNotes IS NULL AND scriptSeen IS NULL AND savedgraphnum IS NULL AND exportnum IS NULL AND  customCode=";
        $statment .= "'".$idPHP."'";


        $result2 = $dbh->prepare($statment);
        $result2 -> execute();

        $fetchResult2 = $result2->fetch();
        $fetchResult2 = $result2->fetch();
        
        
        $time2 = $fetchResult2["accesstime"];
        
        $difference_in_seconds = strtotime($time2) - strtotime($time1);
        
        //only count the visit if its longer than a minute or shorter than 10 hours
        if($difference_in_seconds > 60 && $difference_in_seconds < 36000) {
        
        $sumTime += $difference_in_seconds;
        
        $timeSpent =  gmdate("H:i:s", $difference_in_seconds); // convert seconds into timestamp

        
        array_push($output, $timeSpent);
            $numValidVisits++;
            
        
        //get the databases that the student used
        $statment = "SELECT DISTINCT yaxis FROM export WHERE yaxis IS NOT NULL AND sessionid='".$row["sessionid"]. "' AND customCode=";
        $statment .= "'".$idPHP."'";
        $dbresult = $dbh->prepare($statment);
        $dbresult -> execute();
            
        $databases = array();
            
        $dbcount = $dbresult->rowCount();
        
        for($j = 0; $j < $dbcount; $j++){
            
            $db = $dbresult->fetch();
            
            array_push($databases, $db['yaxis']);
            
        }
            
        array_push($output, $databases);
            
        //get the dqs that the student used
        $statment = "SELECT DISTINCT drivingQuestion FROM export WHERE drivingQuestion IS NOT NULL AND sessionid='".$row["sessionid"]. "' AND customCode=";
        $statment .= "'".$idPHP."'";
        $dqresult = $dbh->prepare($statment);
            $dqresult -> execute();
            
        $dqs = array();
            
        $dqcount = $dqresult->rowCount();
        
        for($j = 0; $j < $dqcount; $j++){
            
            $dq = $dqresult->fetch();
            
            array_push($dqs, $dq['drivingQuestion']);
            
        }
            
        array_push($output, $dqs);
        
        
        //get if student edited the json
        $statment = "SELECT * FROM customizeGraph WHERE sessionid='".$row['sessionid']. "'";
        $custResult = $dbh->prepare($statment);
        $custResult -> execute();

        if($custResult->rowCount() >= 1){
            array_push($output, "true");
        } else {
            array_push($output, "false");
        }
        
        
            
        }
            
        
            
        
    }
    
    $avgTime = 0;
    
    if($numValidVisits !== 0){
        $avgTime = $sumTime / $numValidVisits / 60 ;
        }
    
    array_push($output, $avgTime);

    array_unshift($output, $numValidVisits);
    
    
        
        echo json_encode($output);
        
    
    
    

    
    
}catch(PDOException $ex){
    echo $ex;
    echo '{"status":0, "line":'.__LINE__.'}';
    
//    echo "fail";
    exit;
}
?>
