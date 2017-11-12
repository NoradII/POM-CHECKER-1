<?php
  header("Content-Type:application/json; charset=utf-8");
  header('Access-Control-Allow-Origin: *');
  header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
  header('Access-Control-Allow-Methods: GET, POST, PUT');

  include '../include/Config.php';

  echo shell_exec('C:\Users\Eunsik\Anaconda3\python C:\AutoSet9\public_html\C2M\lab01.py');
  
?>