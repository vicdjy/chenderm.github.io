<?php
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
try{
    $dsn = 'mysql:dbname=DV4L_schema; host=127.0.0.1';//local host
    $user = 'root';
    $password = 'DV4L@uofm9163';//change

    $dbh = new PDO($dsn, $user, $password);
    //echo $dbh;
    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $dbh->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);

    $result = $dbh->prepare("SELECT * FROM export");//error here
    $result -> execute();

    //echo $result;
    
    echo "numrows: ";
    var_dump($result -> rowCount());
    echo "<br>";
    //echo $result -> num_rows;
//    $num_rows = mysql_num_rows($result);
    
    echo "rows: ";
    echo "<br>";
    //error getting 0 rows going into else
    //if ($result -> num_rows >0){
    
        while($row = $result->fetch()) {
        
            var_dump($row);
            echo "<br>";
            echo "<br>";
            echo "<br>";
            echo "<br>";
        }//while
   
    
    
}catch(PDOException $ex){
    echo $ex;
    echo '{"status":0, "line":'.__LINE__.'}';
    exit;
}
?>

