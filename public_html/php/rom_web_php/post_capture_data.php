<?php
header("Content-Type:application/json; charset=utf-8");
header('Content-Type: text/html; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT');

ini_set('default_charset', 'utf-8');

include '../include/Config.php';

if (isset($_POST["canvasData"]) &&isset($_POST["patient_name"]) && isset($_POST["patient_birth"]))
{ 
 $canvasData=$_POST['canvasData'];
 $patient_name= $_POST['patient_name'];
 $patient_birth=$_POST['patient_birth'];
 $patient_jointdirection=$_POST['patient_jointdirection'];
 
 $canvasData = str_replace(' ','+',$canvasData);
 $filteredData = substr($canvasData, strpos($canvasData, ",")+1);
 $unencodedData = base64_decode($filteredData);

 //write new file 
 $write_filename = 'tmpimage.png';
 $file = fopen($write_filename, 'wb');
 fwrite($file, $unencodedData);
 fclose($file);  

 //read file
 $file_read = fopen($write_filename, 'r');

 //server save file and path
 $file_name = iconv("utf-8", "cp949", $patient_name.'_'.$patient_birth.'_'.$patient_jointdirection.'.png');  

 //UTF-8 
 Header("Content-type: file/unknown");
 Header("Content-Disposition: attachment; filename=$file_name");
 Header("Content-Description: PHP3 Generated Data");
 header("Pragma: no-cache");
 header("Expires: 0");

 $file_path = "/html/kakao/images/";
 $file =  $file_path."/".$file_name;

 //ftp login info
 $ftp_server = "igrus.mireene.com";  
 $ftp_user_name = "igrus";  
 $ftp_user_pass = "dkdlrmfntm123";  

 $conn_id = ftp_connect($ftp_server);  

 $login_result = ftp_login($conn_id, $ftp_user_name, $ftp_user_pass);  

 //ftp file input
 if (ftp_fput($conn_id, $file, $file_read, FTP_BINARY)) {  
    echo "Successfully uploaded"; 

 } else {  
    echo "There was a problem while uploading";  
 }  

 ftp_close($conn_id);  

}

else{
	echo "select patient!";
}


?>