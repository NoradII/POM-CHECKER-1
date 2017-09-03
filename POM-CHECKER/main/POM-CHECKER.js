var selectedId;
var i = 1;
window.onload = function(){
  getPatientName();
  setInterval(getPatientName, 1000);
};

function viewBeforeMeasurementList()
{
  $.ajax({
    url: 'http://127.0.0.1/php/rom_server_php/kinectsclist.php',
    type: 'GET',
    dataType: 'json',
    success: function(data){
      $("#BeforeMeasurement").empty();

      for(var i = 1; i < data.length; i++){
        //console.log("Patient List DATA : "+data[i]);
        var patientid = data[i].patientid;
        var name = data[i].name;
        var jointdirection = data[i].jointdirection;
        jointdirection = setNamingforJointdirection(jointdirection);
        var new_kinectscList = document.createElement("div");
        new_kinectscList.setAttribute("id",patientid);
        new_kinectscList.style["border"] = "1px solid #ccc";
        new_kinectscList.style["border-radius"] = "5px";
        new_kinectscList.style["margin-top"] = "3px";
        new_kinectscList.style["margin-bottom"] = "3px";
        new_kinectscList.style['padding'] = "5px";
        var row_div = document.createElement("div");
        row_div.setAttribute("class", "row");

        var patient_id = document.createElement("div");
        patient_id.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
        patient_id.innerHTML = "<b>이름 : </b>"+ name;

        var patientjointdirection = document.createElement("div");
        patientjointdirection.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
        patientjointdirection.innerHTML = "<b>부위 : </b>" + jointdirection;

        row_div.appendChild(patient_id);
        row_div.appendChild(patientjointdirection);

        new_kinectscList.appendChild(row_div);

        new_kinectscList.style.textAlign = "left";
        document.getElementById("BeforeMeasurement").appendChild(new_kinectscList);
      }
    },
    error: function(request, status, error){
      console.log(request, status, error);
    },
  });
  viewAfterMeasurementList();
  viewMeasuring();
}

function viewAfterMeasurementList()
{
  $.ajax({
    url: 'http://127.0.0.1/php/rom_server_php/kinectsc2list.php',
    type: 'GET',
    dataType: 'json',
    success: function(data){
      $("#AfterMeasurement").empty();
      console.log("AfterMeasurement List DATA :"+data);
      for(var i = 0; i < data.length; i++){
        var patientid = data[i].patientid;
        var name = data[i].name;
        var jointdirection = data[i].jointdirection;
        jointdirection = setNamingforJointdirection(jointdirection);
        var new_kinectscList = document.createElement("div");
        new_kinectscList.setAttribute("id",patientid);
        new_kinectscList.style["border"] = "1px solid #ccc";
        new_kinectscList.style["border-radius"] = "5px";
        new_kinectscList.style["margin-top"] = "3px";
        new_kinectscList.style["margin-bottom"] = "3px";
        new_kinectscList.style["padding"] = "5px";
        var row_div = document.createElement("div");
        row_div.setAttribute("class", "row");

        var patient_id = document.createElement("div");
        patient_id.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
        patient_id.innerHTML = "<b>이름 : </b>"+ name;

        var patientjointdirection = document.createElement("div");
        patientjointdirection.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
        patientjointdirection.innerHTML = "<b>부위 : </b>" + jointdirection;

        row_div.appendChild(patient_id);
        row_div.appendChild(patientjointdirection);

        new_kinectscList.appendChild(row_div);

        new_kinectscList.style.textAlign = "left";
        document.getElementById("AfterMeasurement").appendChild(new_kinectscList);
      }
    },
    error: function(request, status, error){
      console.log(request, status, error);
    },
  });
}

function viewMeasuring()
{
  $.ajax({
    url: 'http://127.0.0.1/php/rom_server_php/kinectsclist.php',
    type: 'GET',
    dataType: 'json',
    success: function(data){
      $("#Measuring").empty();
      console.log("Measuring DATA :"+data);

      var patientid = data[0].patientid;
      var name = data[0].name;
      var jointdirection = data[0].jointdirection;
      jointdirection = setNamingforJointdirection(jointdirection);
      var new_kinectscList = document.createElement("div");
      new_kinectscList.setAttribute("id",patientid);
      new_kinectscList.style["border"] = "1px solid #ccc";
      new_kinectscList.style["border-radius"] = "5px";
      new_kinectscList.style["margin-top"] = "3px";
      new_kinectscList.style["margin-bottom"] = "3px";
      new_kinectscList.style["padding"] = "5px";
      var row_div = document.createElement("div");
      row_div.setAttribute("class", "row");

      var patient_id = document.createElement("div");
      patient_id.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
      patient_id.innerHTML = "<b>이름 : </b>"+ name;

      var patientjointdirection = document.createElement("div");
      patientjointdirection.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
      patientjointdirection.innerHTML = "<b>부위 : </b>" + jointdirection;

      row_div.appendChild(patient_id);
      row_div.appendChild(patientjointdirection);

      new_kinectscList.appendChild(row_div);

      new_kinectscList.style.textAlign = "left";
      document.getElementById("Measuring").appendChild(new_kinectscList);
    },
    error: function(request, status, error){
      console.log(request, status, error);
    },
  });
}

function getPatientName(){
    viewBeforeMeasurementList();
    $.ajax({
      url: 'http://127.0.0.1/php/rom_server_php/patientlist.php',
      type: 'GET',
      dataType: 'json',
      success: function(data){
        $("#patientlist").empty();

        for(var i = 0; i < data.length; i++){
          //console.log("PatientName : "+data[i].name);
          var name = data[i].name;
          var birth = data[i].birth;
          var number = data[i].number;
          var patientid = data[i].patientid;
          var sex;
          if(data[i].sex == 1)
            sex = "남";
          else
            sex = "여";
          createButton(name,birth,number,sex, patientid);
        }
      },
      error: function(request, status, error){
        console.log(request, status, error);
      },
    });
}

function getSearchName(){
  $.ajax({
    url: 'http://127.0.0.1/php/rom_server_php/patientlist.php',
    type: 'GET',
    dataType: 'json',
    success: function(data){
      $("#patientlist").empty();

      console.log("NAME : " + data);
      for(var i = 0; i < data.length; i++){
        var name = data[i].name;
        var birth = data[i].birth;
        var number = data[i].number;
        var patientid = data[i].patientid;
        var sex;
        if(data[i].sex == 1)
          sex = "남";
        else
          sex = "여";
        var sname = document.getElementById("searchName").value;
        var namecount = name.search(sname);
        if(namecount >= 0)
        {
          createButton(name,birth,number,sex, patientid);
        }
      }
    },
    error: function(request, status, error){
      console.log(request, status, error);
    },
  });
}

function createButton(name, birth, number, sex, patientid)
{
  var new_patientinfo = document.createElement("div");
  new_patientinfo.setAttribute("class","btn btn-default btn-group-justified");
  new_patientinfo.setAttribute("onclick","getCheckDate(this.id)")
  new_patientinfo.setAttribute("id",patientid);
  new_patientinfo.setAttribute("type", "button");
  var row_div = document.createElement("div");
  row_div.setAttribute("class", "row");

  var patientname = document.createElement("div");
  patientname.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");
  patientname.innerHTML = "<b>이름 : </b>"+ name;

  var patientnumber = document.createElement("div");
  patientnumber.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");
  patientnumber.innerHTML = "<b>병록번호 : </b>" + number;

  var row_div2 = document.createElement("div");
  row_div2.setAttribute("class", "row");

  var patientsex = document.createElement("div");
  patientsex.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");
  patientsex.innerHTML = "<b>성별 : </b>"+ sex;

  var patientbirth = document.createElement("div");
  patientbirth.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");
  patientbirth.innerHTML = "<b>생년월일 : </b>" + birth;


  row_div.appendChild(patientname);
  row_div.appendChild(patientnumber);
  row_div2.appendChild(patientsex);
  row_div2.appendChild(patientbirth);

  new_patientinfo.appendChild(row_div);
  new_patientinfo.appendChild(row_div2);

  new_patientinfo.style.textAlign = "left";

  document.getElementById("patientlist").appendChild(new_patientinfo);
}

function getCheckDate(clickid) {
  var data = {patientid : clickid};
  selectedId = clickid;
  console.log("selectedId : " + selectedId);
    $.ajax({
      url: 'http://127.0.0.1/php/rom_server_php/checkdatelist.php',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function(data){

        data.sort(function(a, b) {
            return parseFloat(b.checkdateid) - parseFloat(a.checkdateid);
        });

        $("#cdatelist").empty();

        console.log("getCheckDate : " + data);

        for(var i = 0; i < data.length; i++){
          var checkdateid = data[i].checkdateid;
          var patientid = data[i].patientid;
          var datetime = data[i].datetime;
          var jointdirection = data[i].jointdirection;
          var maxangle = data[i].maxangle;
          jointdirection = setNamingforJointdirection(jointdirection);
          var new_checkdatelist = document.createElement("div");
          new_checkdatelist.setAttribute("id",patientid);
          new_checkdatelist.style["border"] = "1px solid #ccc";
          new_checkdatelist.style["border-radius"] = "5px";
          new_checkdatelist.style["margin-top"] = "3px";
          new_checkdatelist.style["margin-bottom"] = "3px";
          new_checkdatelist.style["padding"] = "5px";
          var row_div = document.createElement("div");
          row_div.setAttribute("class", "row");

          var checkdatetime = document.createElement("div");
          checkdatetime.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
          checkdatetime.innerHTML = "<b>날짜 : </b>"+ datetime;

          var patientjointdirection = document.createElement("div");
          patientjointdirection.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
          patientjointdirection.innerHTML = "<b>부위 : </b>" + jointdirection;

          var row_div2 = document.createElement("div");
          row_div2.setAttribute("class", "row");

          var patientmaxangle = document.createElement("div");
          patientmaxangle.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
          patientmaxangle.innerHTML = "<b>최대각도 : </b>"+ maxangle + "°";

          row_div.appendChild(checkdatetime);
          row_div.appendChild(patientjointdirection);
          row_div2.appendChild(patientmaxangle);

          new_checkdatelist.appendChild(row_div);
          new_checkdatelist.appendChild(row_div2);

          new_checkdatelist.style.textAlign = "left";
          document.getElementById("cdatelist").appendChild(new_checkdatelist);
          }
        },
      error: function(request, status, error){
        console.log(request, status, error);
    },
  });
}

function registerFirstMeasurement() {
  var name = document.getElementById('inputPatientName');
  var birth = document.getElementById('inputPatientBirth');
  var number = document.getElementById('inputPatientNumber');
  var man = document.getElementById('test1');
  var woman = document.getElementById('test2');
  var gender;

  if(name.value === ""){
    alert("이름란을 입력해주세요.");
    document.getElementById('form-group-name').setAttribute('class','form-group has-error has-feedback');
    name.focus();
    return;
  }else{
    document.getElementById('form-group-name').setAttribute('class','form-group has-success has-feedback');
    name = name.value;
  }

  //(patientNumber.length != 10)
  if(number.value === ""){
    alert("병록번호란을 입력해주세요.");
    document.getElementById('form-group-number').setAttribute('class','form-group has-error has-feedback');
    number.focus();
    return;
  }else{
    number = number.value;
  }

  if(man.checked === true){
    gender = man.value;
  }else if(woman.checked === true){
    gender = woman.value;
  }
  if((woman.checked === false) && (man.checked === false)){
    alert("성별란을 입력해주세요.");
    return;
  }

  if(birth.value === "" || (birth.value.length != 8)){
    alert("생년월일란을 정확히 입력해주세요.");
    document.getElementById('form-group-birth').setAttribute('class','form-group has-error has-feedback');
    birth.focus();
    return;
  }else{
    birth = birth.value;
  }

  var data = {name : name, sex : gender, birth : birth, number : number};

  $.ajax({
    url: 'http://127.0.0.1/php/rom_server_php/patientadd.php',
    type: 'POST',
    data: data,
    dataType: 'html',
    success: function(data){
      console.log("DATA " + data);
      $('#registerModal').modal('hide');
    },
    error: function(request, status, error){
      console.log(request, status, error);
    },
  });
}

var left = document.getElementById('test3');
var right = document.getElementById('test4');

function registerMeasurement(){
  var name = $("#"+selectedId+" > div:first-child > div:first-child").text();
  var patient_number = $("#"+selectedId+" > div:first-child > div:eq(1)").text();
  name = name.substr(5,name.length);
  patient_number = patient_number.substr(7,patient_number.length);
  var select_jointdirection = document.getElementById('drop1');
  var selected_jointdirection = select_jointdirection.options[select_jointdirection.selectedIndex].value;
  console.log("selected_jointdirection : " + selected_jointdirection);

  if(name.length === 0){
    document.getElementById("Modaltitle").innerHTML = "등록 실패";
    document.getElementById("ModalPatientName").innerHTML = "환자를 선택해주세요";
    document.getElementById("ModalFooter").innerHTML = "확인";
    $('#modal-body').hide();
  }
  else {
    document.getElementById("Modaltitle").innerHTML = "검진 등록";
    document.getElementById("ModalPatientName").innerHTML = "이름 : " + name + " / 병록번호 : " + patient_number;
    document.getElementById("ModalPatientName").setAttribute('style', 'font-size: 15px; font-weight: bold');
    document.getElementById("ModalFooter").innerHTML = "검진 시작하기";
    $('#modal-body').show();

    if(selected_jointdirection === "201"){ // Posture인 경우
      document.getElementById('modal-direction').style.visibility = 'hidden';
      left = 0;
      right = 0;
    }else{
      document.getElementById('modal-direction').style.visibility = 'visible';
      left = 1;
      right = 2;
    }
  }
}

function startMeasurement(){
  var select_jointdirection = document.getElementById('drop1');
  var selected_jointdirection = select_jointdirection.options[select_jointdirection.selectedIndex].value;

  console.log("selectedId : " + selectedId);

  if(typeof selectedId === 'undefined') { // 환자를 선택하지 않았을 경우
    $('#checkupModal').modal('hide');

  }else{ // 환자를 선택한 경우

    // 측정 부위에 대한 예외처리
    if((selected_jointdirection === "0" && left.checked === true) || (selected_jointdirection === "0" && right.checked === true)){
      alert("측정 부위를 선택해주세요.");
      return;
    }

    // 측정 방향에 대한 예외처리
    if((left.checked === false) && (right.checked === false)){
      alert("측정방향을 선택해주세요.");
      return;
    }else if(left.checked === true){
      selected_jointdirection = parseInt(selected_jointdirection) + parseInt(left.value);
    }else if(right.checked === true){
      selected_jointdirection = parseInt(selected_jointdirection) + parseInt(right.value);
    }



    var data = {patientid : selectedId, jointdirection : selected_jointdirection, forcecode : 0};

    $.ajax({
      url: 'http://127.0.0.1/php/rom_server_php/fronttokinect.php',
      type: 'POST',
      data: data,
      dataType: 'html',
      success: function(data){
        console.log("startMeasurement DATA " + data);
        $('#checkupModal').modal('hide');
      },
      error: function(request, status, error){
        console.log(request, status, error);
      },
    });

    }
}

function setNamingforJointdirection(jointdirection) {
  switch (jointdirection) {
    case "11":
      jointdirection = 'Left shoulder-flexion';
      break;
    case "12":
      jointdirection = 'Right shoulder-flexion';
      break;
    case "21":
      jointdirection = 'Left shoulder-abduction';
      break;
    case "22":
      jointdirection = 'Right shoulder-abduction';
      break;
    case "31":
      jointdirection = 'Left shoulder-rotation';
      break;
    case "32":
      jointdirection = 'Right shoulder-rotation';
      break;
    case "41":
      jointdirection = 'Left elbow-flexion';
      break;
    case "42":
      jointdirection = 'Right elbow-flexion';
      break;
    case "51":
      jointdirection = 'Left elbow-pronation';
      break;
    case "52":
      jointdirection = 'Right elbow-pronation';
      break;
    case "61":
      jointdirection = 'Left knee-flexion';
      break;
    case "62":
      jointdirection = 'Right knee-flexion';
      break;
    case "71":
      jointdirection = 'Left hip-flexion';
      break;
    case "72":
      jointdirection = 'Right hip-flexion';
      break;
    case "81":
      jointdirection = 'Left hip-rotation';
      break;
    case "82":
      jointdirection = 'Right hip-rotation';
      break;
    case "91":
      jointdirection = 'Left neck-rotation';
      break;
    case "92":
      jointdirection = 'Right neck-rotation';
      break;
    case "101":
      jointdirection = 'Left neck-flexion';
      break;
    case "102":
      jointdirection = 'Right neck-flexion';
      break;
    case "111":
      jointdirection = 'Left neck-abduction';
      break;
    case "112":
      jointdirection = 'Right neck-abduction';
      break;
    case "201":
      jointdirection = 'Posture';
      break;
    default:
  }
  return jointdirection;
}
