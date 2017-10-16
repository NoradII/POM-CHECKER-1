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

$patient_id = $_GET['patient_id'];
$patient_jointdirection = $_GET['patient_jointdirection'];
$type = $_GET['type'];

if(isset($_GET['patient_id']) && isset($_GET['patient_jointdirection'])) {
  // 폴더명 지정
  $dir = 'C:\AutoSet9\public_html\\'.$type;
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
          if($jointdirection == $patient_jointdirection && $patient_id == $patientid){
            if(strcmp($type,'screenshot')==0){
              $screenshotType = $filenames[4];
              if(strcmp($screenshotType,'normal.png')==0){
                $files[] = $filename;
              }
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
