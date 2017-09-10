"use strict";
let uid, name, ip;
window.onload = function(){
  // Check browser support
  if (typeof(Storage) != "undefined") {
    $('#registerIPModal').modal('show');
    // Store
    document.getElementById('inputLocalIP').value = localStorage.getItem("IP");
    localStorage.setItem("uid", uid);
    localStorage.setItem("name", name);
  } else {
    alert("Sorry, your browser does not support Web Storage...");
  }

};

// made  by Sungho...
$('#adminPassword').keyup(function(event) {
  if(event.keyCode === 13){
    loginForAdmin();
  }
});

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
    //document.getElementById('form-group-name').setAttribute('class','form-group has-error has-feedback');
    name.focus();
    return;
  }else{
    //document.getElementById('form-group-name').setAttribute('class','form-group has-success has-feedback');
    name = name.value;
  }

  if(userid.value === ""){
    alert("ID란을 입력해주세요.");
    //document.getElementById('form-group-number').setAttribute('class','form-group has-error has-feedback');
    userid.focus();
    return;
  }else{
    userid = userid.value;
  }

  if(password.value === ""){
    alert("Password란을 입력해주세요.");
    //document.getElementById('form-group-number').setAttribute('class','form-group has-error has-feedback');
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
    alert("Password란을 입력해주세요.");
    //document.getElementById('form-group-number').setAttribute('class','form-group has-error has-feedback');
    email.focus();
    return;
  }else{
    email = email.value;
  }

  var data = {name:name, userid:userid, password:password, grade:grade, email:email};

  $.ajax({
    url: "http:/" + ip + "/php/rom_server_php/register.php",
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

function loginForAdmin(){
  var userid = document.getElementById('adminID');
  var password = document.getElementById('adminPassword');

  if(userid.value === ""){
    alert("ID란을 입력해주세요.");
    //document.getElementById('form-group-number').setAttribute('class','form-group has-error has-feedback');
    userid.focus();
    return;
  }else{
    userid = userid.value;
  }

  if(password.value === ""){
    alert("Password란을 입력해주세요.");
    //document.getElementById('form-group-number').setAttribute('class','form-group has-error has-feedback');
    password.focus();
    return;
  }else{
    password = password.value;
  }

  var data = {userid:userid, password:password};

  $.ajax({
    url: "http://" + ip + "/php/rom_server_php/login.php",
    type: 'POST',
    data: data,
    dataType: 'html',
    success: function(data){
      var parsedData = JSON.parse(data);
      console.log("loginForAdmin " + parsedData.error_msg);
      console.log("uid " + parsedData.uid);
      if(parsedData.error_msg === "Login credentials are wrong. Please try again!"){
        alert("ID와 비밀번호를 다시 확인해주세요!");
      }else{
        alert("로그인 성공!");
        sessionStorage.setItem("uid", parsedData.uid);
        localStorage.setItem("uid", parsedData.uid);
        localStorage.setItem("name", parsedData.name);

        location.href = "./POM-CHECKER.html";
      }

    },
    error: function(request, status, error){
      console.log("Error " + error);
    },
  });

}

function registerForIP(){
  ip = document.getElementById('inputLocalIP').value;
  localStorage.setItem("IP", ip);
  var http = document.getElementById('inputLocalHttp').value;
  $('#registerIPModal').modal('hide');
}
