<?php
  header("Content-Type:application/json; charset=utf-8");
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');
  
	$ct_image_path = $_POST['ct_image_path'];

  echo shell_exec('C:\Users\Eunsik\Anaconda3\python inference.py '.$ct_image_path);
  
?>