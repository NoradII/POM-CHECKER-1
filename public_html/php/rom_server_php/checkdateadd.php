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

// Branch statement for ROM
if(isset($_POST['patientid']) && isset($_POST['jointdirection']) && isset($_POST['maxangle'])) {
	$patientid = $_POST['patientid'];
	$jointdirection = $_POST['jointdirection'];
	$maxangle = $_POST['maxangle'];

	$connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);

	$return_arr = Array();

	$result = mysqli_query($connection,"INSERT INTO rom_checkdate(patientid, datetime, jointdirection, maxangle)
		values('".$patientid."' ,now() , '".$jointdirection."', '".$maxangle."')");

	$result = mysqli_query($connection,"UPDATE rom_patient SET lastupdate = now() WHERE patientid = '".$patientid."'");

	$result = mysqli_query($connection,"SELECT * FROM rom_checkdate ORDER BY checkdateid DESC LIMIT 1");

	while ($row = mysqli_fetch_array($result)) {
		$row_array['checkdateid'] = $row['checkdateid'];
		$row_array['patientid'] = $row['patientid'];
		$row_array['datetime'] = $row['datetime'];
		$row_array['jointdirection'] = $row['jointdirection'];
		$row_array['maxangle'] = $row['maxangle'];

		array_push($return_arr, $row_array);
	}

	echo json_encode($return_arr, JSON_UNESCAPED_UNICODE);
}
// Branch statement for Postures
else if(isset($_POST['patientid']) && isset($_POST['jointdirection']) && isset($_POST['sh_angle'])  && isset($_POST['hh_angle'])) {
	$patientid = $_POST['patientid'];
	$jointdirection = $_POST['jointdirection'];
	$sh_angle = $_POST['sh_angle'];
	$hh_angle = $_POST['hh_angle'];

	$connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);

	$return_arr = Array();

	//echo $query;
	$result = mysqli_query($connection,"INSERT INTO rom_checkdate(patientid, datetime, jointdirection, sh_angle, hh_angle)
		values('".$patientid."', now() , '".$jointdirection."', '".$sh_angle."', '".$hh_angle."')");

	$result = mysqli_query($connection,"UPDATE rom_patient SET lastupdate = now() WHERE patientid = '".$patientid."'");

	$result = mysqli_query($connection,"SELECT * FROM rom_checkdate ORDER BY checkdateid DESC LIMIT 1");

	while ($row = mysqli_fetch_array($result)) {
		$row_array['checkdateid'] = $row['checkdateid'];
		$row_array['patientid'] = $row['patientid'];
		$row_array['datetime'] = $row['datetime'];
		$row_array['jointdirection'] = $row['jointdirection'];
		$row_array['sh_angle'] = $row['sh_angle'];
		$row_array['hh_angle'] = $row['hh_angle'];

		array_push($return_arr, $row_array);
	}

	echo json_encode($return_arr, JSON_UNESCAPED_UNICODE);
}
// Branch statement for Side
else if(isset($_POST['patientid']) && isset($_POST['jointdirection']) && isset($_POST['side_head_length'])  && isset($_POST['side_shoulder_length'])
 && isset($_POST['side_hip_length']) && isset($_POST['side_angle'])) {
   $patientid = $_POST['patientid'];
   $jointdirection = $_POST['jointdirection'];
   $side_head_length = $_POST['side_head_length'];
   $side_shoulder_length = $_POST['side_shoulder_length'];
   $side_hip_length = $_POST['side_hip_length'];
   $side_angle = $_POST['side_angle'];

   $connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);

   $return_arr = Array();

   //echo $query;
   $result = mysqli_query($connection,"INSERT INTO rom_checkdate(patientid, datetime, jointdirection, side_head_length, side_shoulder_length, side_hip_length, side_angle)
      values('".$patientid."', now() , '".$jointdirection."', '".$side_head_length."', '".$side_shoulder_length."', '".$side_hip_length."', '".$side_angle."')");

   $result = mysqli_query($connection,"UPDATE rom_patient SET lastupdate = now() WHERE patientid = '".$patientid."'");

   $result = mysqli_query($connection,"SELECT * FROM rom_checkdate ORDER BY checkdateid DESC LIMIT 1");

   while ($row = mysqli_fetch_array($result)) {
      $row_array['checkdateid'] = $row['checkdateid'];
      $row_array['patientid'] = $row['patientid'];
      $row_array['datetime'] = $row['datetime'];
      $row_array['jointdirection'] = $row['jointdirection'];
      $row_array['side_head_length'] = $row['side_head_length'];
      $row_array['side_shoulder_length'] = $row['side_shoulder_length'];
      $row_array['side_hip_length'] = $row['side_hip_length'];
      $row_array['side_angle'] = $row['side_angle'];

      array_push($return_arr, $row_array);
   }

   echo json_encode($return_arr, JSON_UNESCAPED_UNICODE);
}
else {
	// $connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);
	// $return_arr = Array();
	//
	// $result = mysqli_query($connection,"INSERT INTO rom_checkdate(patientid, datetime, jointdirection, maxangle)
	// 	values('".$patientid."', now() , '".$jointdirection."', '".$maxangle."')");
	//
	// $result = mysqli_query($connection, "UPDATE rom_patient SET lastupdate = now() WHERE patientid = '".$patientid."'");
	//
	// $result = mysqli_query($connection, "SELECT * FROM rom_checkdate ORDER BY checkdateid DESC LIMIT 1");
	//
	// while ($row = mysqli_fetch_array($result)) {
	// 	$row_array['checkdateid'] = $row['checkdateid'];
	//
	// 	array_push($return_arr, $row_array);
	// }
	//
	// echo json_encode($return_arr, JSON_UNESCAPED_UNICODE);

	echo "check postdata";
}
?>
