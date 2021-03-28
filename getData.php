<?php
try{
    $dsn = 'mysql:dbname=DV4L_schema; host=127.0.0.1';//local host
    $user = 'root';
    $password = 'Abbeyhills1';//change

    $dbh = new PDO($dsn, $user, $password);
    //echo $dbh;
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $result = $dbh->prepare("SELECT * FROM export");//error here
    $result -> execute();

    echo "numrows: ";
    var_dump($result -> rowCount());
        
    echo "rows: ";
    //error getting 0 rows going into else
    //if ($result -> num_rows >0){
    while($row = $result->fetch()) {
        var_dump($row);
    }//while
        
    
    
}catch(PDOException $ex){
    echo $ex;
    echo '{"status":0, "line":'.__LINE__.'}';
    exit;
}
?>

