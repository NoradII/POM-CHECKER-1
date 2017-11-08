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

	$nrs = $_POST['nrs'];
	$checkdateid = $_POST['checkdateid'];

	$connection = mysqli_connect(DB_HOST,DB_USER,DB_PASSWORD,DB_DATABASE);
	$return_arr = Array();

	if(TRUE == mysqli_query($connection,
		"UPDATE teamelysium.rom_checkdate SET nrs = '".$nrs."' WHERE rom_checkdate.checkdateid = '".$checkdateid."'")){
		echo "working!";
	}
	else{
		echo "fail";
	}

?>
