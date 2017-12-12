<?php

	header("Content-Type:application/json; charset=utf-8");
	header('Access-Control-Allow-Origin: *');
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	header('Access-Control-Allow-Methods: GET, POST, PUT');

	include '../include/Config.php';

	if(isset($_POST['patientid']) && isset($_POST['name']) && isset($_POST['sex']) && isset($_POST['birth']))
	{
		$patientid = $_POST['patientid'];
		$name = $_POST['name'];
		$sex = $_POST['sex'];
		$birth = $_POST['birth'];
		$number = $_POST['number'];
		$phone = $_POST['phone'];

		$connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);

		$return_arr = Array();

		$result = mysqli_query($connection,
			"UPDATE teamelysium.rom_patient SET name = '".$name."' , sex = '".$sex."' , birth = '".$birth."' , number = '".$number."' , phone = '".$phone."' , lastupdate = now() WHERE rom_patient.patientid = '".$patientid."'");

	}
	else
	{
		echo "check patientid, name, sex, birth";
	}

?>
