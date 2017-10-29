<?php

/**
 * @author Ravi Tamada
 * @link http://www.androidhive.info/2012/01/android-login-and-registration-with-php-mysql-and-sqlite/ Complete tutorial
 */
header("Content-Type:application/json; charset=utf-8");
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Access-Control-Allow-Methods: GET, POST, PUT');

include '../include/Config.php';

$connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);

$patient_id = $_GET['patient_id'];
$patient_jointdirection = $_GET['patient_jointdirection'];
$type = $_GET['type'];

if(isset($_GET['patient_id']) && isset($_GET['patient_jointdirection'])) {
  // 폴더명 지정
  $dir = 'C:\AutoSet9\public_html\\'.$type;
  $patient_id_sub = substr($patient_id, 0,7);
  // 핸들 획득
  $handle  = opendir($dir);
  $files = array();
  // 디렉터리에 포함된 파일을 저장한다.
  while (false !== ($filename = readdir($handle))) {
      if($filename == "." || $filename == ".."){
          continue;
      }

      // 파일인 경우만 목록에 추가한다.
      if(is_file($dir . "/" . $filename)){
          $filenames = explode ("_", $filename);
          //XUGTFTI_11_10-10-2017_16-20-01(ONLY screenshot:_hud)
          //0:patientid 1:jointdirection 2:date 3:time 4:type
          $jointdirection = $filenames[1];
          $patientid = $filenames[0];
          if($jointdirection == $patient_jointdirection && $patient_id_sub == $patientid){
            if(strcmp($type,'screenshot')==0){
              $screenshotType = $filenames[4];
              if(strcmp($screenshotType,'normal.png')==0){
                $files[] = $filename;
              }
            }
            else if(strcmp($type,'movie')==0){
              $dates = explode("-", $filenames[2]); //0:월10 1:일10 2:년2017
              $times = explode("-", $filenames[3]); //16-20-01
              $datetime = $dates[2]."-".$dates[0]."-".$dates[1]." ".$times[0].":".$times[1].":".$times[2];
              if($patient_jointdirection=='201'){
                $result = mysqli_query($connection,"SELECT sh_angle, hh_angle FROM rom_checkdate WHERE datetime = '".$datetime."' AND patientid = '".$patient_id."'");
                $row = mysqli_fetch_assoc($result);
                $file_array['sh_angle'] = $row['sh_angle'];
                $file_array['hh_angle'] = $row['hh_angle'];
              }
              else if($patient_jointdirection=='300'){
                $result = mysqli_query($connection,"SELECT side_head_length, side_shoulder_length, side_hip_length, side_angle FROM rom_checkdate WHERE datetime = '".$datetime."' AND patientid = '".$patient_id."'");
                $row = mysqli_fetch_assoc($result);
                $file_array['side_head_length'] = $row['side_head_length'];
                $file_array['side_shoulder_length'] = $row['side_shoulder_length'];
                $file_array['side_hip_length'] = $row['side_hip_length'];
                $file_array['side_length'] = $row['side_length'];
              }
              else{                  
                $result = mysqli_query($connection,"SELECT maxangle FROM rom_checkdate WHERE datetime = '".$datetime."' AND patientid = '".$patient_id."'");
                $row = mysqli_fetch_assoc($result);
                $file_array['angle'] = $row['maxangle'];
              }
              $file_array['filename'] = $filename;
              array_push($files,$file_array);
            }
            else{
              $files[] = $filename;
            }
          }
      }

  }

  // 핸들 해제
  closedir($handle);
  echo json_encode($files,JSON_UNESCAPED_UNICODE);
}

?>
