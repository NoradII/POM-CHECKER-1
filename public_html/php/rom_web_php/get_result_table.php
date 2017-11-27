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
if(isset($_POST['name']) && isset($_POST['jointdirection']))
{
	$name = $_POST['name'];
	$jointdirection = $_POST['jointdirection'];
	$connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);
	$return_arr = Array();

	if($jointdirection == '500'){
		$result = mysqli_query($connection, "SELECT rom_checkdate.datetime, rom_checkdate.maxangle, rom_checkdate.sh_angle, rom_checkdate.hh_angle, rom_checkdate.side_head_length, rom_checkdate.side_shoulder_length, rom_checkdate.side_hip_length, rom_checkdate.side_angle, rom_checkdate.checkdateid, rom_checkdate.nrs, rom_checkdate.count, rom_checkdate.jointdirection FROM rom_checkdate, (SELECT patientid FROM rom_patient WHERE rom_patient.name = '".$name."') as A WHERE jointdirection LIKE '5%' AND rom_checkdate.patientid = A.patientid ORDER BY rom_checkdate.datetime");
	}

	else{
		$result = mysqli_query($connection, "SELECT rom_checkdate.datetime, rom_checkdate.maxangle, rom_checkdate.sh_angle, rom_checkdate.hh_angle, rom_checkdate.side_head_length, rom_checkdate.side_shoulder_length, rom_checkdate.side_hip_length, rom_checkdate.side_angle, rom_checkdate.checkdateid, rom_checkdate.nrs, rom_checkdate.count, rom_checkdate.jointdirection FROM rom_checkdate, (SELECT patientid FROM rom_patient WHERE rom_patient.name = '".$name."') as A WHERE jointdirection = '".$jointdirection."' AND rom_checkdate.patientid = A.patientid ORDER BY rom_checkdate.datetime");
	}



	while ($row = mysqli_fetch_array($result)) {
		$row_array['datetime'] = $row['datetime'];
		$row_array['maxangle'] = $row['maxangle'];
		$row_array['sh_angle'] = $row['sh_angle'];
		$row_array['hh_angle'] = $row['hh_angle'];
		$row_array['checkdateid'] = $row['checkdateid'];
		$row_array['nrs'] = $row['nrs'];
		$row_array['side_head_length'] = $row['side_head_length'];
		$row_array['side_shoulder_length'] = $row['side_shoulder_length'];
		$row_array['side_hip_length'] = $row['side_hip_length'];
		$row_array['side_angle'] = $row['side_angle'];
		$row_array['count'] = $row['count'];
		$row_array['jointdirection'] = $row['jointdirection'];
		array_push($return_arr,$row_array);
	}
	echo json_encode($return_arr,JSON_UNESCAPED_UNICODE);
}
else
{
	$response["error"] = TRUE;
	$response["error_msg"] = "Required parameters (Name or Jointdirection) is missing!";
    echo json_encode($response);
}
?>