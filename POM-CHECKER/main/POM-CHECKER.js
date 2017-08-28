var selectedId;
var i=1;
window.onload = function(){
  getPatientName();
  setInterval(viewBeforeMeasurementList,1000);
}


function viewBeforeMeasurementList()
{
  $.ajax({
    url: 'http://127.0.0.1/php/rom_server_php/kinectsclist.php',
    type: 'GET',
    dataType: 'json',
    success: function(data){
      $("#BeforeMeasurement").empty();
      console.log("asdfasdfasdf:"+data);
      for(var i = 1; i < data.length; i++){
        var patientid = data[i].patientid;
        var name = data[i].name;
        var jointdirection = data[i].jointdirection;
        jointdirection = setNamingforJointdirection(jointdirection);
        var new_kinectscList = document.createElement("div");
        new_kinectscList.setAttribute("id",patientid);
        new_kinectscList.style['border'] = '1px solid #ccc';
        new_kinectscList.style['border-radius'] = "5px";
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
      console.log("asdfasdfasdf:"+data);
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
      console.log("asdfasdfasdf:"+data);
      for(var i = 0; i < 1; i++){
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
        document.getElementById("Measuring").appendChild(new_kinectscList);
      }
    },
    error: function(request, status, error){
      console.log(request, status, error);
    },
  });
}

function getPatientName(){
    $.ajax({
      url: 'http://127.0.0.1/php/rom_server_php/patientlist.php',
      type: 'GET',
      dataType: 'json',
      success: function(data){
        $("#patientlist").empty();

        console.log("asdfasdfasdf:"+data);
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

      console.log("asdfasdfasdf:"+data);
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
  console.log(clickjointdirection);
    $.ajax({
      url: 'http://127.0.0.1/php/rom_server_php/checkdatelist.php',
      type: 'POST',
      data: data,
      dataType: 'json',
      success: function(data){
        console.log(data);
        data.sort(function(a, b) {
            return parseFloat(b.checkdateid) - parseFloat(a.checkdateid);
        });
        console.log(data);
        $("#cdatelist").empty();
        console.log("asdfasdfasdf:"+data);
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

function registerMeasurement(){
  var name = $("#"+selectedId+">div:first-child>div:first-child").text();
  var patient_number = $("#"+selectedId+">div:first-child>div:eq(1)").text();
  name = name.substr(5,name.length);
  patient_number = patient_number.substr(7,patient_number.length);
  console.log(patient_number);
  if(name.length == 0){
    document.getElementById("Modaltitle").innerHTML = "등록 실패";
    document.getElementById("ModalName").innerHTML = "환자를 선택해주세요";
  }
  else {
    document.getElementById("Modaltitle").innerHTML = "검진 등록";
    document.getElementById("ModalName").innerHTML = "이름 : " + name + " / 병록번호 : " + patient_number;
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
