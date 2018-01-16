"use strict";

var uid, name, ip;
window.onload = function(){
  var data = { web : 'web'};
  var version = document.getElementById('version').innerHTML;

  $.ajax({
    url: "https://elysium.azurewebsites.net/php/rom_azure_php/checkversion.php",
    type: 'POST',
    data: data,
    dataType: 'json',
    success: function(data){
      if(data[0].web !== version){
        $('#versionCheckModal').modal('show');
      }
    },
    error: function(request, status, error){

    },
  });

  $('#adminPassword').keyup(function (event) {
    if (event.keyCode === 13) {
        loginForAdmin();
    }
  });

  // Check browser support
  if (typeof(Storage) !== "undefined") {
    ip = localStorage.getItem("IP");
    uid = localStorage.getItem("uid");
    document.getElementById('inputLocalIP').value = ip;

    if(uid === null || uid === 'undefined'){
      return;
    }else{
      window.location.href = "../POM-CHECKER/POM-CHECKER.html";
    }

  } else {

    alert("Sorry, your browser does not support Web Storage...");
  }
};

function registerForAdmin(){
  var name = document.getElementById('inputAdminName');
  var userid = document.getElementById('inputAdminID');
  var password = document.getElementById('inputAdminPassword');
  var doctor = document.getElementById('test1');
  var nurse = document.getElementById('test2');
  var grade;

  var email = document.getElementById('inputAdminEmail');

  if(name.value === ""){
    alert("이름란을 입력해주세요.");
    name.focus();
    return;
  }else{

    name = name.value;
  }

  if(userid.value === ""){
    alert("ID란을 입력해주세요.");
    userid.focus();
    return;
  }else{
    userid = userid.value;
  }

  if(password.value === ""){
    alert("Password란을 입력해주세요.");
    password.focus();
    return;
  }else{
    password = password.value;
  }

  if(doctor.checked === true){
    grade = doctor.value;
  }else if(nurse.checked === true){
    grade = nurse.value;
  }
  if((doctor.checked === false) && (nurse.checked === false)){
    alert("등급란을 입력해주세요.");
    return;
  }

  if(email.value === ""){
    alert("e-mail란을 입력해주세요.");
    email.focus();
    return;
  }else{
    email = email.value;
  }

  var data = {name:name, userid:userid, password:password, grade:grade, email:email};

  $.ajax({
    url: "http://" + ip + "/php/rom_server_php/register.php",
    type: 'POST',
    data: data,
    dataType: 'html',
    success: function(data){
      console.log("registerForAdmin " + data);
      $('#registerModal').modal('hide');
    },
    error: function(request, status, error){
      console.log(request, status, error);
    },
  });
}

function loginForAdmin() {

  var userid = document.getElementById('adminID');
  var password = document.getElementById('adminPassword');

  if(userid.value === ""){
    alert("ID란을 입력해주세요.");
    userid.focus();
    return;
  }else{
    userid = userid.value;
  }

  if(password.value === ""){
    alert("Password란을 입력해주세요.");
    password.focus();
    return;
  }else{
    password = password.value;
  }
  var data = {userid:userid, password:password};

  //ip Time out 해결
  var time = setInterval(function(){ myTimer() }, 2000);
  function myTimer(){
    clearInterval(time);
    $('#ipCheckModal').modal('show');
  }

  $.ajax({
    url: "http://" + ip + "/php/rom_server_php/login.php",
    type: 'POST',
    data: data,
    dataType: 'html',
    success: function(data){
      clearInterval(time);
      var parsedData = JSON.parse(data);
      console.log("loginForAdmin " + parsedData.error_msg);
      console.log("uid " + parsedData.uid);
      if(parsedData.error_msg === "Login credentials are wrong. Please try again!"){
        alert("ID와 비밀번호를 다시 확인해주세요!");
      } else {
        localStorage.setItem("uid", parsedData.uid);
        localStorage.setItem("name", parsedData.name);
        location.href = "./POM-CHECKER.html";
      }

    },
    error: function(request, status, error){

    },
  });

}

function registerForIP(){
    ip = document.getElementById('inputLocalIP').value;
    localStorage.setItem("IP", ip);
    $('#registerIPModal').modal('hide');
}
