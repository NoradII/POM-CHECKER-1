"use strict";

var selectedId;
var ip;
var setViewList;

window.onload = function() {
    ip = localStorage.getItem("IP");

    $(".dragColumns").sortable();
    getPatientName();
    setViewList = setInterval(viewBeforeMeasurementList, 1000);
    var uid = localStorage.getItem("uid");
    if (uid === 'undefined' || uid === null) {
        location.href = "./login.html";
    } else if (uid !== 'undefined') {
        document.getElementById("nav-user-name").innerHTML = localStorage.getItem("name");
    }

    $('#inputPatientBirth').keyup(function(event) {
        if (event.keyCode === 13) {
            registerFirstMeasurement();
        }
    });
};

$('#checkupModal').on('hidden.bs.modal', function() {
    document.getElementById("drop1").selectedIndex = 0;
    document.getElementById("test3").checked = false;
    document.getElementById("test4").checked = false;
});

function clickCloseButton(kinectid) {
    var kinectscId = kinectid.parentNode.parentNode.getAttribute("data_kinectid");
    var data = {
        kinectid: kinectscId
    };
    $.ajax({
        url: "http://" + ip + "/php/rom_web_php/delete_schedule_item.php",
        type: 'POST',
        data: data,
        dataType: 'html',
        success: function(data) {},
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

function setViewListPause() {
    //onDragStart
    window.clearInterval(setViewList);
}

function setViewListPlay(kinectid, changeForcecodePrev, changeForcecodeNext, index, forcecode) {
    //onDrop
    var forcecodeAdd = (changeForcecodeNext - changeForcecodePrev) / 2;
    forcecode = parseInt(changeForcecodePrev) + parseInt(forcecodeAdd);

    if (index !== -1) {
        var data = {
            kinectid: kinectid,
            forcecode: forcecode
        };
        $.ajax({
            url: "http://" + ip + "/php/rom_server_php/beforePatientUpdate.php",
            type: 'POST',
            data: data,
            dataType: 'html',
            success: function(data) {
                setViewList = setInterval(viewBeforeMeasurementList, 1000);
            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
    }
}

function getPatientName() {
    viewBeforeMeasurementList();
    $.ajax({
        url: "http://" + ip + "/php/rom_server_php/patientlist.php",
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $("#patientlist").empty();

            data.sort(function(a, b) {
                return b.lastupdate > a.lastupdate ? 1 : b.lastupdate < a.lastupdate ? -1 : 0;
            });

            for (var i = 0; i < data.length; i++) {
                var name = data[i].name;
                var birth = data[i].birth;
                var number = data[i].number;
                var patientid = data[i].patientid;
                var sex;
                if (data[i].sex === "1")
                    sex = "남";
                else
                    sex = "여";
                var phone = data[i].phone;
                createButton(name, birth, number, sex, patientid, phone);
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

var prevClickId;

function getCheckDate(clickId) {
    // 처음에 클릭한 사람 style 변환
    document.getElementById(clickId).style = "background-color: #e6e6e6; text-align: left;";

    if (prevClickId !== clickId && prevClickId !== undefined) {
        document.getElementById(prevClickId).style = "background-color: white; text-align: left;";
    }

    var data = {
        patientid: clickId
    };
    selectedId = clickId;
    $.ajax({
        url: "http://" + ip + "/php/rom_server_php/checkdatelist.php",
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data) {

            data.sort(function(a, b) {
                if ((new Date(b.datetime).getDate() - new Date(a.datetime).getDate()) >= 0) {
                    return new Date(b.datetime).getTime() - new Date(a.datetime).getTime();
                }
            });

            $("#cdatelist").empty();

            for (var i = 0; i < data.length; i++) {
                var checkdateid = data[i].checkdateid;
                var patientid = data[i].patientid;
                var datetime = data[i].datetime;
                var jointdirection = data[i].jointdirection;
                var maxangle = data[i].maxangle;
                var side_angle = data[i].side_angle;
                var sh_angle = data[i].sh_angle;
                var hh_angle = data[i].hh_angle
                var count = data[i].count;
                var jointdirectionName = setNamingforJointdirection(jointdirection);
                var new_checkdatelist = document.createElement("div");
                new_checkdatelist.setAttribute("class", "btn btn-default btn-group-justified");
                new_checkdatelist.setAttribute("id", checkdateid);
                new_checkdatelist.style["border"] = "1px solid #ccc";
                new_checkdatelist.style["border-radius"] = "5px";
                new_checkdatelist.style["margin-top"] = "3px";
                new_checkdatelist.style["margin-bottom"] = "3px";
                new_checkdatelist.style["padding"] = "5px";
                var row_div = document.createElement("div");
                row_div.setAttribute("class", "row");

                var checkdatetime = document.createElement("div");
                checkdatetime.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
                checkdatetime.innerHTML = "<b>날짜 : </b>" + datetime;

                var patientjointdirection = document.createElement("div");
                patientjointdirection.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
                patientjointdirection.innerHTML = "<b>부위 : </b>" + jointdirectionName;

                var row_div2 = document.createElement("div");
                row_div2.setAttribute("class", "row");

                var patientmaxangle = document.createElement("div");
                patientmaxangle.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");

                console.log(jointdirection);
                //JointDirection에 따른 분류
                if (jointdirection === "300") { //side posture
                    patientmaxangle.innerHTML = "<b>각도 : </b>" + side_angle + "°";
                } else if (jointdirection === "201") { //posture
                    patientmaxangle.innerHTML = "<b>S.balance : </b>" + sh_angle + "°, <b>P.balance : </b>" + hh_angle + "°";
                } else if (jointdirection === "400") { //moire
                    patientmaxangle.innerHTML = " ";
                } else if (parseInt((parseInt(jointdirection) / 100)) === 5 || parseInt((parseInt(jointdirection) / 100)) === 7) { //exercise, yoga
                    patientmaxangle.innerHTML = "<b>횟수 : </b>" + data[i].count + "회";
                } else {
                    patientmaxangle.innerHTML = "<b>최대각도 : </b>" + maxangle + "°";
                }

                row_div.appendChild(checkdatetime);
                row_div.appendChild(patientjointdirection);
                row_div2.appendChild(patientmaxangle);

                new_checkdatelist.appendChild(row_div);
                new_checkdatelist.appendChild(row_div2);

                new_checkdatelist.style.textAlign = "left";
                document.getElementById("cdatelist").appendChild(new_checkdatelist);
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
    prevClickId = clickId;
}

function registerFirstMeasurement(type, modifypatientid) {
    var name = document.getElementById('inputPatientName');
    var birth = document.getElementById('inputPatientBirth');
    var number = document.getElementById('inputPatientNumber');
    var man = document.getElementById('test1');
    var woman = document.getElementById('test2');
    var gender;
    var phone = document.getElementById('inputPatientPhone');

    if (name.value === "") {
        alert("이름란을 입력해주세요.");
        document.getElementById('form-group-name').setAttribute('class', 'form-group has-error has-feedback');
        name.focus();
        return;
    } else {
        document.getElementById('form-group-name').setAttribute('class', 'form-group has-success has-feedback');
        name = name.value;
    }

    if (number.value === "" || number.value === null) {
        alert("병록번호란을 입력해주세요.");
        document.getElementById('form-group-number').setAttribute('class', 'form-group has-error has-feedback');
        number.focus();
        return;
    } else {
         document.getElementById('form-group-number').setAttribute('class', 'form-group has-success has-feedback');
         number = number.value;
    }

    if (man.checked === true) {
        gender = man.value;
    } else if (woman.checked === true) {
        gender = woman.value;
    }
    if ((woman.checked === false) && (man.checked === false)) {
        alert("성별란을 입력해주세요.");
        return;
    }

    if (birth.value === "" || (birth.value.length !== 8)) {
        alert("생년월일란을 정확히 입력해주세요.");
        document.getElementById('form-group-birth').setAttribute('class', 'form-group has-error has-feedback');
        birth.focus();
        return;
    } else {
        //생년월일 정규화식 : 19000101 ~ 20991231
        var format = /^(19\d{2}|20\d{2})(0[0-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])$/;
        var bool=format.test(birth.value);
        if(!bool){
            alert("생년월일란을 정확히 입력해주세요.");
            document.getElementById('form-group-birth').setAttribute('class', 'form-group has-error has-feedback');
            birth.focus();
            return;
        }
        else{
            document.getElementById('form-group-birth').setAttribute('class', 'form-group has-success has-feedback');
            birth = birth.value;
        }        
    }

    // TODO : 조건 생각해봐야 할듯
    if (phone.value === "") {
        alert("핸드폰번호란을 정확히 입력해주세요.");
        document.getElementById('form-group-phone').setAttribute('class', 'form-group has-error has-feedback');
        phone.focus();
        return;
    } else {
        document.getElementById('form-group-phone').setAttribute('class', 'form-group has-success has-feedback');
        phone = phone.value;
    }

    
    if(type === 'register'){
        var patientid = createHash();
        var insertdata = {
            patientid: patientid,
            name: name,
            sex: gender,
            birth: birth,
            number: number,
            phone: phone
        };

        $.ajax({
            url: "http://" + ip + "/php/rom_server_php/checkpatientnumber.php",
            type: 'POST',
            data: {number : number},
            dataType: 'html',
            success: function(data) {
                if (data.length > 2) {
                    alert("이미 존재하는 병록번호입니다.");
                    document.getElementById('form-group-number').setAttribute('class', 'form-group has-error has-feedback');
                    number = document.getElementById('inputPatientNumber');
                    number.focus();
                    return;
                } else {
                    $.ajax({
                        url: "http://" + ip + "/php/rom_server_php/patientadd.php",
                        type: 'POST',
                        data: insertdata,
                        dataType: 'html',
                        success: function(data) {
                            $('#registerModal').modal('hide');
                            getPatientName();
                        },
                        error: function(request, status, error) {
                            console.log(request, status, error);
                        },
                    });

                    $.ajax({
                        url: "https://elysium.azurewebsites.net/php/rom_server_php/patientadd.php",
                        type: 'POST',
                        data: insertdata,
                        dataType: 'html',
                        success: function(data) {
                            console.log("Save Azure data");
                        },
                        error: function(request, status, error) {
                            console.log(request, status, error);
                        },
                    });
                }
            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
    }

    else if(type === 'modify'){
        var data = {
            patientid: modifypatientid,
            name: name,
            sex: gender,
            birth: birth,
            number: number,
            phone: phone
        };

        $.ajax({
            url: "http://" + ip + "/php/rom_server_php/patientmodify.php",
            type: 'POST',
            data: data,
            dataType: 'html',
            success: function(data) {
                $('#registerModal').modal('hide');
                getPatientName();
            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });

        $.ajax({
            url: "https://elysium.azurewebsites.net/php/rom_server_php/patientmodify.php",
            type: 'POST',
            data: data,
            dataType: 'html',
            success: function(data) {
                console.log("Save Azure data");
            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
        
    }
}


function registerMeasurement() {
    var name = $("#" + selectedId + " > div:first-child > div:eq(0)").text();
    var patientNumber = $("#" + selectedId + " > div:first-child > div:eq(1)").text();
    name = name.substr(5, name.length);
    patientNumber = patientNumber.substr(7, patientNumber.length);

    var selectJointdirection = document.getElementById('drop1');
    var selectedJointdirection = selectJointdirection.options[selectJointdirection.selectedIndex].value;
    var selected_type = selectJointdirection.options[selectJointdirection.selectedIndex].getAttribute("data-type");

    if (name.length === 0) {
        document.getElementById("Modaltitle").innerHTML = "등록 실패";
        document.getElementById("ModalPatientName").innerHTML = "환자를 선택해주세요";
        document.getElementById("ModalFooter").innerHTML = "확인";
        name = "";
        patientNumber = "";
        $('#modal-body').hide();
    } else {
        document.getElementById("Modaltitle").innerHTML = "검진 등록";
        document.getElementById("ModalPatientName").innerHTML = "<b>이름 : </b>" + name + " / <b>병록번호 : </b>" + patientNumber;
        document.getElementById("ModalPatientName").setAttribute('style', 'font-size: 15px; margin-top: 10px; font-weight:bold;');
        document.getElementById("ModalFooter").innerHTML = "검진 시작하기";
        $('#modal-body').show();

        if (selected_type === "posture" || selected_type === "exercise") { // Posture 또는 Side Posture인 경우
            document.getElementById('modal-direction').style.display = 'none';
            document.getElementById('modal-time').style.display = 'block';
            document.getElementById('modal-count').style.display = 'none';
        } else if (selected_type === "moire") {
            document.getElementById('modal-direction').style.display = 'none';
            document.getElementById('modal-time').style.display = 'none';
            document.getElementById('modal-count').style.display = 'none';
        } else if (selected_type === "yoga") {
            document.getElementById('modal-direction').style.display = 'none';
            document.getElementById('modal-time').style.display = 'block';
            document.getElementById('modal-count').style.display = 'block';
        } else if (selectedJointdirection === "100") {
            document.getElementById('modal-direction').style.display = 'block';
            document.getElementById('modal-time').style.display = 'none';
            document.getElementById('modal-count').style.display = 'none';
            $("label[for*='test3']").html("Up(Extension)");
            $("label[for*='test4']").html("Down(Flexion)");
        } else {
            document.getElementById('modal-direction').style.display = 'block';
            document.getElementById('modal-time').style.display = 'none';
            document.getElementById('modal-count').style.display = 'none';
            $("label[for*='test3']").html("Left");
            $("label[for*='test4']").html("Right");
        }

    }
}

function startMeasurement() {
    var left = document.getElementById('test3');
    var right = document.getElementById('test4');
    var select_jointdirection = document.getElementById('drop1');
    var selected_jointdirection = select_jointdirection.options[select_jointdirection.selectedIndex].value;
    var selected_type = select_jointdirection.options[select_jointdirection.selectedIndex].getAttribute("data-type");
    var measureTime;
    var yogaCount;

    if (typeof selectedId === 'undefined') { // 환자를 선택하지 않았을 경우
        $('#checkupModal').modal('hide');

    } else { // 환자를 선택한 경우

        // 측정 부위에 대한 예외처리
        if ((selected_jointdirection === "0" && left.checked === true) || (selected_jointdirection === "0" && right.checked === true)) {
            alert("측정 부위를 선택해주세요.");
            return;
        }

        // 측정 방향에 대한 예외처리
        if (selected_type === "posture" || selected_type === "exercise" || selected_type === "yoga" || selected_type === "moire") {} else {
            if ((left.checked === false) && (right.checked === false)) {
                alert("측정방향을 선택해주세요.");
                return;
            } else if (left.checked === true) {
                selected_jointdirection = parseInt(selected_jointdirection) + parseInt(left.value);
            } else if (right.checked === true) {
                selected_jointdirection = parseInt(selected_jointdirection) + parseInt(right.value);
            }
        }

        //측정 시간, 목표 갯수에 대한 예외처리
        if (selected_type === "posture" || selected_type === "exercise" || selected_type === "yoga") {
            measureTime = document.getElementById("measureTime").value;
            yogaCount = null;
            if (selected_type === "yoga") {
                yogaCount = document.getElementById("yogaCount").value;
            }
        } else {
            measureTime = null;
            yogaCount = null;
        }

        var kinectid = createHash();
        var data = {
            kinectid: kinectid,
            patientid: selectedId,
            jointdirection: selected_jointdirection,
            measureTime: measureTime,
            yogaCount: yogaCount
        };

        $.ajax({
            url: "http://" + ip + "/php/rom_server_php/fronttokinect.php",
            type: 'POST',
            data: data,
            dataType: 'html',
            success: function(data) {
                $('#checkupModal').modal('hide');
            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });

    }
}

// 측정 전 환자
function viewBeforeMeasurementList() {
    $.ajax({
        url: "http://" + ip + "/php/rom_server_php/kinectsclist.php",
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $("#BeforeMeasurement").empty();

            for (var i = 1; i < data.length; i++) {
                var patientid = data[i].patientid;
                var name = data[i].name;
                var jointdirection = data[i].jointdirection;
                var jointdirectionName = setNamingforJointdirection(jointdirection);

                var kinectid = data[i].kinectid;
                var forcecode = data[i].forcecode;
                var measureTime = data[i].measureTime;
                var yogaCount = data[i].yogaCount;
                var new_kinectscList = document.createElement("div");
                new_kinectscList.setAttribute("id", patientid);
                new_kinectscList.setAttribute("class", "dragColumn");
                new_kinectscList.setAttribute("data_kinectid", kinectid);
                new_kinectscList.setAttribute("data-forcecode", forcecode);
                new_kinectscList.style["border"] = "1px solid #ccc";
                new_kinectscList.style["border-radius"] = "5px";
                new_kinectscList.style["margin-top"] = "3px";
                new_kinectscList.style["margin-bottom"] = "3px";
                new_kinectscList.style['padding'] = "5px";
                var row_div = document.createElement("div");
                row_div.setAttribute("class", "row");

                var close_container = document.createElement("span");
                close_container.setAttribute("class", "col-md-1");
                close_container.setAttribute("onclick", 'clickCloseButton(this)');
                close_container.innerHTML = "x";

                if (i === 1) {
                    new_kinectscList.style["border"] = "3px solid #eb5244";
                }

                var patient_id = document.createElement("div");
                patient_id.setAttribute("class", "col-md-11 col-sm-6 col-xs-6 baseinfo");
                patient_id.innerHTML = "<b>이름 : </b>" + name;

                var patientjointdirection = document.createElement("div");
                patientjointdirection.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
                patientjointdirection.innerHTML = "<b>부위 : </b>" + jointdirectionName;

                row_div.appendChild(patient_id);

                //yoga 목표 갯수 
                if (parseInt((parseInt(jointdirection) / 100)) === 7) {
                    patient_id.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");

                    var patientcount = document.createElement("div");
                    patientcount.setAttribute("class", "col-md-5 col-sm-6 col-xs-6 baseinfo");
                    patientcount.innerHTML = "<b>목표갯수 : </b>" + yogaCount + "회";

                    row_div.appendChild(patientcount);
                }

                row_div.appendChild(close_container);
                row_div.appendChild(patientjointdirection);

                //posture, sideposture, exercise, yoga
                if (jointdirection === "201" || jointdirection === "300" || parseInt((parseInt(jointdirection) / 100)) === 5 || parseInt((parseInt(jointdirection) / 100)) === 7) {
                    patientjointdirection.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");

                    var patienttime = document.createElement("div");
                    patienttime.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");
                    patienttime.innerHTML = "<b>측정시간 : </b>" + measureTime + "초";

                    row_div.appendChild(patienttime);
                }

                new_kinectscList.appendChild(row_div);

                new_kinectscList.style.textAlign = "left";

                document.getElementById("BeforeMeasurement").appendChild(new_kinectscList);
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
    viewAfterMeasurementList();
    viewMeasuring();
}

// 측정 중
function viewMeasuring() {
    return $.ajax({
        url: "http://" + ip + "/php/rom_server_php/kinectsclist.php",
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $("#Measuring").empty();

            if (data.length === 0) {
                return;
            }

            var patientid = data[0].patientid;
            var name = data[0].name;
            var jointdirection = data[0].jointdirection;
            var forcecode = data[0].forcecode;
            var kinectid = data[0].kinectid;
            var measureTime = data[0].measureTime;
            var yogaCount = data[0].yogaCount;
            var jointdirectionName = setNamingforJointdirection(jointdirection);
            var new_kinectscList = document.createElement("div");
            new_kinectscList.setAttribute("id", patientid);
            new_kinectscList.setAttribute("data_kinectid", kinectid);
            new_kinectscList.setAttribute("data-forcecode", forcecode);
            new_kinectscList.setAttribute("class", "measurePatient")
            new_kinectscList.style["border"] = "1px solid #ccc";
            new_kinectscList.style["border-radius"] = "5px";
            new_kinectscList.style["margin-top"] = "3px";
            new_kinectscList.style["margin-bottom"] = "3px";
            new_kinectscList.style["padding"] = "5px";
            var row_div = document.createElement("div");
            row_div.setAttribute("class", "row");

            var close_container = document.createElement("span");
            close_container.setAttribute("class", "col-md-1 MeasuringCloseBtn");
            close_container.setAttribute("onclick", 'clickCloseButton(this)');
            close_container.innerHTML = "x";

            var patient_id = document.createElement("div");
            patient_id.setAttribute("class", "col-md-11 col-sm-6 col-xs-6 baseinfo");
            patient_id.innerHTML = "<b>이름 : </b>" + name;

            var patientjointdirection = document.createElement("div");
            patientjointdirection.setAttribute("class", "col-md-12 col-sm-6 col-xs-6 baseinfo");
            patientjointdirection.innerHTML = "<b>부위 : </b>" + jointdirectionName;

            row_div.appendChild(patient_id);

            //yoga 목표 갯수 
            if (parseInt((parseInt(jointdirection) / 100)) === 7) {
                patient_id.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");

                var patientcount = document.createElement("div");
                patientcount.setAttribute("class", "col-md-5 col-sm-6 col-xs-6 baseinfo");
                patientcount.innerHTML = "<b>묙표갯수 : </b>" + yogaCount + "회";

                row_div.appendChild(patientcount);
            }

            row_div.appendChild(close_container);
            row_div.appendChild(patientjointdirection);

            if (jointdirection === "201" || jointdirection === "300" || parseInt((parseInt(jointdirection) / 100)) === 5 || parseInt((parseInt(jointdirection) / 100)) === 7) {
                patientjointdirection.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");

                var patienttime = document.createElement("div");
                patienttime.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");
                patienttime.innerHTML = "<b>측정시간 : </b>" + measureTime + "초";

                row_div.appendChild(patienttime);
            }

            new_kinectscList.appendChild(row_div);

            new_kinectscList.style.textAlign = "left";
            document.getElementById("Measuring").appendChild(new_kinectscList);

        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });


}

function viewMeasuringSwap() {
    var data = viewMeasuring();
    data.success(function(data) {
        var swapData = {
            kinectid: data[0].kinectid,
            forcecode: data[0].forcecode,
            nextKinectid: data[1].kinectid,
            nextForcecode: data[1].forcecode
        };
        $.ajax({
            url: "http://" + ip + "/php/rom_server_php/measurePatientUpdate.php",
            type: 'POST',
            data: swapData,
            dataType: 'html',
            success: function(data) {},
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
    });
}

function measurePatientUpdate() {

}

function checkGraph() {
    location.href = "../rom_web/rom_chart_maximum.html";
}

// 측정 후 환자
function viewAfterMeasurementList() {
    $.ajax({
        url: "http://" + ip + "/php/rom_server_php/kinectsc2list.php",
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $("#AfterMeasurement").empty();
            for (var i = 0; i < data.length; i++) {
                var patientid = data[i].patientid;
                var name = data[i].name;
                var jointdirection = data[i].jointdirection;
                var measureTime = data[i].measureTime;
                var jointdirectionName = setNamingforJointdirection(jointdirection);
                var new_kinectscList = document.createElement("div");
                new_kinectscList.setAttribute("class", "btn btn-default btn-group-justified");
                new_kinectscList.setAttribute("onclick", "deletePatientid(this.id)")
                new_kinectscList.setAttribute("id", patientid + "/");
                new_kinectscList.setAttribute("type", "button");
                new_kinectscList.style["border"] = "1px solid #ccc";
                new_kinectscList.style["border-radius"] = "5px";
                new_kinectscList.style["margin-top"] = "3px";
                new_kinectscList.style["margin-bottom"] = "3px";
                new_kinectscList.style["padding"] = "5px";
                var row_div = document.createElement("div");
                row_div.setAttribute("class", "row");

                var patient_id = document.createElement("div");
                patient_id.setAttribute("class", "col-md-12 col-sm-6 col-xs-6");
                patient_id.style.color = "#878787";
                patient_id.style.fontSize = "13px";
                patient_id.innerHTML = "<b>이름 : </b>" + name;

                var patientjointdirection = document.createElement("div");
                patientjointdirection.setAttribute("class", "col-md-12 col-sm-6 col-xs-6");
                patientjointdirection.style.color = "#878787";
                patientjointdirection.style.fontSize = "13px";
                patientjointdirection.innerHTML = "<b>부위 : </b>" + jointdirectionName;


                row_div.appendChild(patient_id);

                //yoga 목표 갯수 
                if (parseInt((parseInt(jointdirection) / 100)) === 7) {
                    patient_id.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");

                    var patientcount = document.createElement("div");
                    patientcount.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");
                    patientcount.innerHTML = "<b>목표갯수 : </b>" + yogaCount + "회";

                    row_div.appendChild(patientcount);
                }

                row_div.appendChild(patientjointdirection);

                if (jointdirection === "201" || jointdirection === "300" || parseInt((parseInt(jointdirection) / 100)) === "5" || parseInt((parseInt(jointdirection) / 100)) === "7") {
                    patientjointdirection.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");

                    var patienttime = document.createElement("div");
                    patienttime.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo");
                    patienttime.innerHTML = "<b>측정시간 : </b>" + measureTime + "초";

                    row_div.appendChild(patienttime);
                }


                new_kinectscList.appendChild(row_div);

                new_kinectscList.style.textAlign = "left";
                document.getElementById("AfterMeasurement").appendChild(new_kinectscList);
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

var clickdeleteid = '';

function deletePatientid(deleteid) {
    document.getElementById(deleteid).style = "background-color: #e6e6e6; text-align: left;";
    if (deleteid === clickdeleteid) {
        document.getElementById(deleteid).style = "background-color: #e6e6e6; text-align: left;";
    } else if (clickdeleteid > 0) {
        document.getElementById(deleteid).style = "background-color: #e6e6e6; text-align: left;";
        document.getElementById(clickdeleteid).style = "background-color: white; text-align: left;";
    }

    clickdeleteid = deleteid.substr(0, deleteid.length - 1);

}

function deletePatientAfterMeasurement() {
    if (clickdeleteid === null) {
        alert("환자를 선택해주세요.");
        return;
    }
    var patientid = {
        patientid: clickdeleteid
    };
    $.ajax({
        url: "http://" + ip + "/php/rom_server_php/kinect2delete.php",
        type: 'POST',
        data: patientid,
        dataType: 'html',
        success: function(data) {},
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

function getSearchName() {
    $.ajax({
        url: "http://" + ip + "/php/rom_server_php/patientlist.php",
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $("#patientlist").empty();

            for (var i = 0; i < data.length; i++) {
                var name = data[i].name;
                var birth = data[i].birth;
                var number = data[i].number;
                var patientid = data[i].patientid;
                var phone = data[i].phone;
                var sex;
                if (data[i].sex === 1)
                    sex = "남";
                else
                    sex = "여";
                var sname = document.getElementById("searchName").value;
                var namecount = name.search(sname);
                if (namecount >= 0) {
                    createButton(name, birth, number, sex, patientid, phone);
                }
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

$('#registerModal').on('show.bs.modal', function (e) {
    var status = e.relatedTarget.dataset.type;
    var registertitle = document.getElementById('register-title');
    var registerbtn = document.getElementById('register-btn');
    if(status === 'modify'){
        var patientid = e.relatedTarget.dataset.id;
        registertitle.innerHTML = '환자 정보 수정';
        registerbtn.innerHTML = '환자 정보 수정';
        registerbtn.setAttribute("onclick" , "registerFirstMeasurement('modify','"+patientid+"')");

        var patientname = document.getElementById(patientid).children[0].children[0].children[1].innerHTML;
        var patientnumber = document.getElementById(patientid).children[0].children[1].children[1].innerHTML;
        var patientsex = document.getElementById(patientid).children[1].children[0].children[1].innerHTML;
        var patientbirth = document.getElementById(patientid).children[1].children[1].children[1].innerHTML;
        var patientphone = document.getElementById(patientid).children[1].children[2].children[1].innerHTML;

        document.getElementById('inputPatientName').value = patientname;
        document.getElementById('inputPatientNumber').value = patientnumber;
        if(patientsex === '남'){
            document.getElementById('test1').checked = 'true';
        }
        else{
            document.getElementById('test2').checked = 'true';
        }
        document.getElementById('inputPatientBirth').value = patientbirth;
        document.getElementById('inputPatientPhone').value = patientphone;

        status = 'register';
    }

    else{
        registertitle.innerHTML = '초진 등록';
        registerbtn.innerHTML = '초진환자 등록 및 검진';
        registerbtn.setAttribute("onclick" , "registerFirstMeasurement('register', '0')");
    }

});

function createButton(name, birth, number, sex, patientid, phone) {
    var new_patientinfo = document.createElement("div");
    new_patientinfo.setAttribute("class", "btn btn-default btn-group-justified");
    new_patientinfo.setAttribute("onclick", "getCheckDate(this.id)");
    new_patientinfo.setAttribute("id", patientid);
    new_patientinfo.setAttribute("type", "button");
    var row_div = document.createElement("div");
    row_div.setAttribute("class", "row");

    var patientname = document.createElement("div");
    patientname.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo patientname");
    patientname.innerHTML = "<b>이름 : </b><span>" + name +"</span>";

    var patientnumber = document.createElement("div");
    patientnumber.setAttribute("class", "col-md-5 col-sm-5 col-xs-5 baseinfo patientnumber");
    patientnumber.innerHTML = "<b>병록번호 : </b><span>" + number +"</span>";

    var pencilicon = document.createElement("i");
    pencilicon.setAttribute("class", "col-md-1 col-sm-1 col-xs-1 baseinfo fa fa-pencil");
    pencilicon.setAttribute("data-toggle", "modal");
    pencilicon.setAttribute("data-target", "#registerModal");
    pencilicon.setAttribute("data-type", "modify");
    pencilicon.setAttribute("data-id", patientid);
    pencilicon.setAttribute("type", "button");
    pencilicon.style.textAlign = "right";
    pencilicon.style.color = "#222e38";

    var row_div2 = document.createElement("div");
    row_div2.setAttribute("class", "row");

    var patientsex = document.createElement("div");
    patientsex.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo patientsex");
    patientsex.innerHTML = "<b>성별 : </b><span>" + sex +"</span>";

    var patientbirth = document.createElement("div");
    patientbirth.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo patientbirth");
    patientbirth.innerHTML = "<b>생년월일 : </b><span>" + birth +"</span>";

    var patientphone = document.createElement("div");
    patientphone.setAttribute("class", "col-md-6 col-sm-6 col-xs-6 baseinfo patientphone");
    patientphone.innerHTML = "<b>핸드폰번호 : </b><span>" + phone +"</span>";
    patientphone.style.display = 'none';

    row_div.appendChild(patientname);
    row_div.appendChild(patientnumber);
    row_div.appendChild(pencilicon);
    row_div2.appendChild(patientsex);
    row_div2.appendChild(patientbirth);
    row_div2.appendChild(patientphone);

    new_patientinfo.appendChild(row_div);
    new_patientinfo.appendChild(row_div2);

    new_patientinfo.style.textAlign = "left";

    document.getElementById("patientlist").appendChild(new_patientinfo);
}

function setNamingforJointdirection(jointdirection) {
    switch (jointdirection) {
        case "11":
            jointdirection = 'Left Shoulder Flexion / Extension';
            break;
        case "12":
            jointdirection = 'Right Shoulder Flexion / Extension';
            break;
        case "21":
            jointdirection = 'Left Shoulder Abduction / Adduction';
            break;
        case "22":
            jointdirection = 'Right Shoulder Abduction / Adduction';
            break;
        case "31":
            jointdirection = 'Left Shoulder Rotation';
            break;
        case "32":
            jointdirection = 'Right Shoulder Rotation';
            break;
        case "41":
            jointdirection = 'Left Elbow Flexion / Extension';
            break;
        case "42":
            jointdirection = 'Right Elbow Flexion / Extension';
            break;
        case "51":
            jointdirection = 'Left Elbow Supination / Pronation';
            break;
        case "52":
            jointdirection = 'Right Elbow Supination / Pronation';
            break;
        case "61":
            jointdirection = 'Left Elbow Lateral Rotaion';
            break;
        case "62":
            jointdirection = 'Right Elbow Lateral Rotaion';
            break;
        case "71":
            jointdirection = 'Left Hip Flexion / Extension';
            break;
        case "72":
            jointdirection = 'Right Hip Flexion / Extension';
            break;
        case "81":
            jointdirection = 'Left Hip Rotation';
            break;
        case "82":
            jointdirection = 'Right Hip Rotation';
            break;
        case "91":
            jointdirection = 'Left Neck Rotation';
            break;
        case "92":
            jointdirection = 'Right Neck Rotation';
            break;
        case "101":
            jointdirection = 'Neck Extension';
            break;
        case "102":
            jointdirection = 'Neck Flexion';
            break;
        case "111":
            jointdirection = 'Left Neck Lateral Flexion';
            break;
        case "112":
            jointdirection = 'Right Neck Lateral Flexion';
            break;
        case "201":
            jointdirection = 'Posture';
            break;
        case "300":
            jointdirection = 'Side Posture';
            break;
        case "400":
            jointdirection = 'Moiré';
            break;
        case "500":
            jointdirection = 'Push Up';
            break;
        case "510":
            jointdirection = 'Squat';
            break;
        case "520":
            jointdirection = 'Hip Extension';
            break;
        case "530":
            jointdirection = 'Side Lunge';
            break;
        case "540":
            jointdirection = 'Slopes Towards';
            break;
        case "550":
            jointdirection = 'Windmills';
            break;
        case "560":
            jointdirection = 'Opposite Arm & Leg Extension';
            break;
        case "700":
            jointdirection = 'Cat pos (Bidalasana)';
            break;
        case "710":
            jointdirection = 'Downward dog';
            break;
        case "720":
            jointdirection = 'Hands to feet (pada hastasana)';
            break;
        default:
    }
    return jointdirection;
}

function createHash() {
    var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZ";
    var string_length = 40;
    var randomstring = '';
    for (var i = 0; i < string_length; i++) {
        var rnum = Math.floor(Math.random() * chars.length);
        randomstring += chars.substring(rnum, rnum + 1);
    }
    return randomstring;
}

function logOut() {
    localStorage.removeItem("name");
    localStorage.removeItem("uid");
    location.href = "./POM-CHECKER.html";
}

function setIP(IP_arg) {
    ip = IP_arg;
    localStorage.setItem("IP", IP_arg);
}