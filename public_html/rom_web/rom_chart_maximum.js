"use strict";

var table;
var ip = localStorage.getItem("IP");

jQuery(document).bind("keyup keydown", function(e) {
    if (e.ctrlKey && e.keyCode === 80) {
        return false;
    }
});

window.onload = function() {
    var patientList = [];
    $.ajax({
        url: 'http://' + ip + '/php/rom_web_php/get_patient_name.php',
        type: 'GET',
        dataType: 'json',
        success: function(data) {
            $.each(data, function (i, itemData) {
                var patientId = itemData.patientid;
                var patientName = itemData.name;
                var patientNumber = itemData.number;

                var data = {"id" : patientId, "text" : patientName + "(No. " + patientNumber + ")"};
                patientList.push(data);
            });

            $("#drop1").select2({
                data: patientList
            });
            $('#drop1-wrapper > span').css("width", "100%");
            $('#drop1-wrapper > span').css("text-align", "center");
            $('#drop1-wrapper > select').css("height", "38px");
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });

    table = $('#rom-datatable').DataTable({
        select: {
            style: 'multi'
        },
        "language": {
            "lengthMenu": "Display _MENU_ records per page",
            "zeroRecords": "검색 정보가 없습니다.",
            "infoEmpty": "기록 없음",
            "infoFiltered": "(filtered from _MAX_ total records)"
        },
        paging: true,
        dom: 'rt<"bottom"ip><"clear">',

    });
    getPatientJonintDirection();
};

var data_count = 0;
var ctx = document.getElementById('myChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: '환자',
            borderColor: 'rgb(57, 113, 204)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
        }, {
            label: '정상범위',
            borderColor: 'rgb(255, 0, 0)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Left',
        },
        {
            label: 'NRS',
            borderColor: 'rgb(20, 179, 0)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Right',
        }]
    },
    // Configuration options go here
    options: {
        responsive: true,
        legend: {
            labels: {
                usePointStyle: false,
                position: 'bottom',
            }
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '날짜'
                }
            }],
            yAxes: [{
                display: true,
                id: 'Left',
                position : 'left',
                scaleLabel: {
                    display: true,
                    labelString: '각도'
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 180,
                    stepSize: 10
                }
            },
            {
                display: true,
                id:'Right',
                position:'right',
                scaleLabel: {
                    display: true,
                    labelString: 'NRS'
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 10,
                    stepSize: 1
                }
            },]
        },
        title: {
            display: true,
            text: '진단 결과'
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem) {
                    return tooltipItem.yLabel;
                }
            }
        }
    }
});

var ctx2 = document.getElementById('myChart2').getContext('2d');
var chartForPosture = new Chart(ctx2, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: 'Shoulder balance',
            borderColor: 'rgb(0, 153, 255)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Left',
        }, {
            label: 'Pelvic balance',
            borderColor: 'rgb(20, 179, 0)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Left',
        },
        {
            label: 'NRS',
            borderColor: 'rgb(255, 0, 0)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Right',
        }]
    },
    // Configuration options go here
    options: {
        responsive: true,
        legend: {
            labels: {
                usePointStyle: false,
                position: 'bottom',
            }
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '날짜'
                }
            }],
            yAxes: [{
                display: true,
                id:'Left',
                position:'left',
                scaleLabel: {
                    display: true,
                    labelString: '좌                                   각도                                   우'
                },
                ticks: {
                    suggestedMin: -10,
                    suggestedMax: 10,
                    stepSize: 10
                }
            },
            {
                display: true,
                id:'Right',
                position:'right',
                scaleLabel: {
                    display: true,
                    labelString: 'NRS'
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 10,
                    stepSize: 1
                }
            },
            ]
        },
        title: {
            display: true,
            text: '진단 결과'
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem) {
                    return tooltipItem.yLabel;
                }
            }
        }
    }
});

var ctx3 = document.getElementById('myChart3').getContext('2d');
var chartForSidePosture = new Chart(ctx3, {
    // The type of chart we want to create
    type: 'line',

    // The data for our dataset
    data: {
        labels: [],
        datasets: [{
            label: 'Head length',
            borderColor: 'rgb(233, 240, 24)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Left',
        }, {
            label: 'Shoulder length',
            borderColor: 'rgb(20, 179, 0)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Left',
        },
        {
            label: 'Hip length',
            borderColor: 'rgb(186, 60, 0)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Left',
        },
        {
            label: 'Angle',
            borderColor: 'rgb(57, 113, 204)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Left',
        },
        {
            label: 'NRS',
            borderColor: 'rgb(255, 0, 0)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Right',
        }]
    },
    // Configuration options go here
    options: {
        responsive: true,
        legend: {
            labels: {
                usePointStyle: false,
                position: 'bottom',
            }
        },
        scales: {
            xAxes: [{
                display: true,
                scaleLabel: {
                    display: true,
                    labelString: '날짜'
                }
            }],
            yAxes: [{
                display: true,
                id:'Left',
                position:'left',
                scaleLabel: {
                    display: true,
                    labelString: '좌                                   각도                                   우'
                },
                ticks: {
                    suggestedMin: -10,
                    suggestedMax: 10,
                    stepSize: 10
                }
            },
            {
                display: true,
                id:'Right',
                position:'right',
                scaleLabel: {
                    display: true,
                    labelString: 'NRS'
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 10,
                    stepSize: 1
                }
            },
            ]
        },
        title: {
            display: true,
            text: '진단 결과'
        },
        tooltips: {
            callbacks: {
                label: function(tooltipItem) {
                    return tooltipItem.yLabel;
                }
            }
        }
    }
});

function addData(chart, label, data, data2, data3) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data); // 환자
    chart.data.datasets[1].data.push(data2); // 정상범위
    chart.data.datasets[2].data.push(data3); // nrs
    chart.update();
}

function addDataForSidePosture(chart, label, data, data2, data3, data4, data5){
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data); //head length
    chart.data.datasets[1].data.push(data2); //shoulder length
    chart.data.datasets[2].data.push(data3); //hip length
    chart.data.datasets[3].data.push(data4); //angle
    chart.data.datasets[4].data.push(data5); //nrs
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function getPatientJonintDirection() {
    var select_name = document.getElementById('drop1');
    var selected_name = select_name.options[select_name.selectedIndex].text;
    var selected_patientid = select_name.options[select_name.selectedIndex].value;
    getPatientInfo(selected_name.split('(')[0], selected_patientid);
    var post_data = "name=" + selected_name.split('(')[0] + "&patientid=" + selected_patientid;
    console.log("patient_name=누구: " + post_data);

    if (selected_name === "--- Patient --") {
    } else {
        var jointdirectionList = [];
        $.ajax({
            url: 'http://' + ip + '/php/rom_web_php/get_jointdirection_list.php',
            type: 'POST',
            data: post_data,
            dataType: 'json',
            success: function(data) {
              $.each(data, function (i, itemData) {
                  var patientJointdirection = itemData.jointdirection;
                  patientJointdirection = setNamingforJointdirection(patientJointdirection);
                  var data = {"id" : patientJointdirection, "text" : patientJointdirection};
                  jointdirectionList.push(data);
              });

              $("#drop2").select2({
                  data: jointdirectionList
              });
              $('#drop2-wrapper > span').css("width", "100%");
              $('#drop2-wrapper > span').css("text-align", "center");
              $('#drop2-wrapper > select').css("height", "38px");

              setJointDirection();

            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
    }
}

function getPatientInfo(post_data_name, post_data_patientid) {

    var post_data = "name=" + post_data_name + "&patientid=" + post_data_patientid;
    $.ajax({
        url: 'http://' + ip + '/php/rom_web_php/get_patient_info.php',
        type: 'POST',
        data: post_data,
        dataType: 'json',
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                document.getElementById('patient_name').innerHTML = data[i].name;
                document.getElementById('patient_number').innerHTML = "No. " + data[i].number;
                document.getElementById('patient_id').innerHTML = data[i].patientid;
                if (data[i].sex === "1") {
                    document.getElementById('patient_gender').innerHTML = "남자";
                } else {
                    document.getElementById('patient_gender').innerHTML = "여자";
                }
                document.getElementById('patient_birth').innerHTML = data[i].birth;
            }
        },

        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

function setJointDirection() {
    $("#image_container").empty();
    $("#screenshot_container").empty();
    $("#video_tag").remove();
    var video_container = document.getElementById('video_container');
    var video_tag = document.createElement('video');
    video_tag.setAttribute("id", "video_tag");
    video_tag.setAttribute("width", "100%");
    video_tag.setAttribute("controls", "");
    video_tag.setAttribute("poster", "../image/videoposter.png");
    video_container.appendChild(video_tag);
    $("#video_select").empty();

    table.clear().draw();
    for (var i = 0; i < data_count; i++) {
        removeData(chart);
        removeData(chartForPosture);
        removeData(chartForSidePosture);
    }

    var select_name = document.getElementById('drop1');
    var selected_name = select_name.options[select_name.selectedIndex].text;

    var select_jointdirection = document.getElementById('drop2');
    var selected_jointdirection = select_jointdirection.options[select_jointdirection.selectedIndex].value;
    selected_jointdirection = setNumberingforJointdirection(selected_jointdirection);
    var post_data = "name=" + selected_name.split('(')[0] + "&jointdirection=" + selected_jointdirection;

    var info = "";
    var label = [];
    var data2 = [];

    if(selected_jointdirection!== '400'){
        $("#rom-data-chart").show();
        $("#rom-data-table").show();
        $("#image-box").show();
        $.ajax({
            url: 'http://' + ip + '/php/rom_web_php/get_result_table.php',
            type: 'POST',
            dataType: 'json',
            data: post_data,
            success: function(data) {
                for (var i = 0; i < data.length; i++) {
                    var jointdirection = selected_jointdirection;
                    switch (jointdirection) {
                        case "11":
                            data2.push("170");
                            break;
                        case "12":
                            data2.push("170");
                            break;
                        case "21":
                            data2.push("105");
                            break;
                        case "22":
                            data2.push("105");
                            break;
                        case "31":
                            data2.push("100");
                            break;
                        case "32":
                            data2.push("100");
                            break;
                        case "41":
                            data2.push("145");
                            break;
                        case "42":
                            data2.push("145");
                            break;
                        case "51":
                            data2.push("80");
                            break;
                        case "52":
                            data2.push("80");
                            break;
                        case "61":
                            data2.push("60");
                            break;
                        case "62":
                            data2.push("60");
                            break;
                        case "71":
                            data2.push("120");
                            break;
                        case "72":
                            data2.push("120");
                            break;
                        case "81":
                            data2.push("40");
                            break;
                        case "82":
                            data2.push("40");
                            break;
                        case "91":
                            data2.push("90");
                            break;
                        case "92":
                            data2.push("90");
                            break;
                        case "101":
                            data2.push("85");
                            break;
                        case "102":
                            data2.push("85");
                            break;
                        case "111":
                            data2.push("45");
                            break;
                        case "112":
                            data2.push("45");
                            break;
                        case "201":
                            jointdirection = 'Posture';
                            break;
                        case "300":
                            jointdirection = 'Side Posture';
                            break;
                        case "500":
                            jointdirection = 'Push Up';
                            break;
                        case "510":
                            jointdirection = 'Squat';
                            break;
                        default:
                    }

                    var rate = 0;
                    var angle = 0;

                    if (i === 0) {
                        rate = 0;
                    }

                    if (jointdirection === "Posture") {
                        document.getElementById('rom-table-thead-angle').innerHTML = "Shoudler, Pelvic balance";
                        data[i].sh_angle *= 1;
                        data[i].hh_angle *= 1;
                        angle = data[i].sh_angle.toFixed(2) + " °, " + data[i].hh_angle.toFixed(2) + " °";

                        if (i >= 1) {
                            rate = Math.floor(data[i].sh_angle.toFixed(2) - data[i - 1].sh_angle.toFixed(2)) + " °, " +
                                Math.floor(data[i].hh_angle.toFixed(2) - data[i - 1].hh_angle.toFixed(2));
                        }

                        document.getElementById('image-box').style.display = 'none';

                    }
                    else if(jointdirection === "Side Posture"){
                        document.getElementById('rom-table-thead-angle').innerHTML = "Angle";
                        document.getElementById('rom-table-thead-variation').innerHTML = "Head, Shoudler, Hip length";
                        data[i].side_head_length *= 1;
                        data[i].side_shoulder_length *= 1;
                        data[i].side_hip_length *= 1;
                        data[i].side_angle *= 1;
                        angle = data[i].side_angle+" °";
                        rate = data[i].side_head_length + " °, " + data[i].side_shoulder_length + " °, " + data[i].side_hip_length;
                        document.getElementById('image-box').style.display = 'none';
                    }

                    //TODO : Exercise Table ? 
                    else if(jointdirection === "Push Up" || jointdirection === "Squat"){
                        document.getElementById('image-box').style.display = 'block';
                        document.getElementById('rom-table-thead-angle').innerHTML = "Count";
                        document.getElementById('rom-table-thead-variation').innerHTML = "Variation";
                        data[i].count *= 1;
                        angle = data[i].count;
                    }

                    else {
                        document.getElementById('image-box').style.display = 'block';
                        document.getElementById('rom-table-thead-angle').innerHTML = "Max Angle";
                        document.getElementById('rom-table-thead-variation').innerHTML = "Variation";
                        data[i].maxangle *= 1;
                        angle = data[i].maxangle.toFixed(2) + " °";
                        if (i >= 1) {
                            data[i - 1].maxangle *= 1;
                            rate = Math.floor(data[i].maxangle.toFixed(2) - data[i - 1].maxangle.toFixed(2));
                        }
                    }

                    var nrs = "<button class='btn-primary' style='font-size: 10px; border-radius: 3px' onclick='setNRS(this)' data-status='create' data-toggle='modal' data-target='#NRSModal' data-id='"+data[i].checkdateid+"'> 평가하기 </button>";
                    if(data[i].nrs !== null){
                      nrs = "<span class='setNRSclick' onclick='setNRS(this)' data-status='modify' data-toggle='modal' data-target='#NRSModal' data-id='"+data[i].checkdateid+"' style='width:"+$('.setNRSclick').parent().width()+"px;' >"+data[i].nrs+"</span>";
                    }

                    table.row.add([
                        info + data[i].datetime,
                        info + angle,
                        info + rate + " °",
                        info + nrs,
                    ]).draw(false);
                }

                setNrsRange('submit',0);

                var j = 0;
                var cnt = 0;
                var flag = 0;
                var index = 0;
                var size;

                if ((data.length % 10) === 0) {
                    size = data.length / 10;
                } else {
                    size = (data.length / 10) + 1;
                }

                for (; j < data.length; j++) {
               
                    if (jointdirection === "Posture") {
                        document.getElementById('myChart').style.display = 'none';
                        document.getElementById('myChart2').style.display = 'block';
                        document.getElementById('myChart3').style.display = 'none';
                        data[j].sh_angle *= 1;
                        data[j].hh_angle *= 1;
                        addData(chartForPosture, data[j].datetime.substring(0, 10), data[j].sh_angle.toFixed(2), data[j].hh_angle.toFixed(2), data[j].nrs);
                    }
                    else if(jointdirection === "Side Posture"){
                        document.getElementById('myChart').style.display = 'none';
                        document.getElementById('myChart2').style.display = 'none';
                        document.getElementById('myChart3').style.display = 'block';
                        data[j].side_head_length *= 1;
                        data[j].side_shoulder_length *= 1;
                        data[j].side_hip_length *= 1;
                        data[j].side_angle *= 1;
                        addDataForSidePosture(chartForSidePosture, data[j].datetime.substring(0, 10), data[j].side_head_length, data[j].side_shoulder_length, data[j].side_hip_length, data[j].side_angle ,data[j].nrs);
                    }
                    //TODO : Exercise Graph ? 
                    else if(jointdirection === "Push Up" || jointdirection === "Squat"){

                    }
                    else {
                        document.getElementById('myChart2').style.display = 'none';
                        document.getElementById('myChart').style.display = 'block';
                        document.getElementById('myChart3').style.display = 'none';
                        data[j].maxangle *= 1;
                        addData(chart, data[j].datetime.substring(0, 10), data[j].maxangle.toFixed(2), data2[j], data[j].nrs);
                    }
                }
                cnt++;
                data_count = data.length;

                getImage();
                getScreenshot();
                getMovie();
            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
    }
    else{
        getScreenshot();
        getMovie();

        $("#rom-data-chart").hide();
        $("#rom-data-table").hide();
        $("#image-box").hide();
    }



}

function getImage() {
    var patient_id = document.getElementById("patient_id").textContent;
    var drop2 = document.getElementById("drop2");
    var patient_jointdirection = setNumberingforJointdirection(drop2.options[drop2.selectedIndex].value);
    var type = 'patientimage';

    var data = {
        patient_id: patient_id,
        patient_jointdirection: patient_jointdirection,
        type: type
    };

    $.ajax({
        url: "http://" + ip + "/php/rom_web_php/get_image.php",
        type: 'GET',
        data: data,
        dataType: 'json',
        success: function(data) {
            for (var i in data) {
                var image_container = document.getElementById('image_container');
                var div_container = document.createElement("div");
                var img_tag = document.createElement("img");

                img_tag.setAttribute("class", "img-responsive col-md-12 col-sm-12 col-xs-12");
                img_tag.setAttribute("width", "100%");
                img_tag.setAttribute("src", "http://" + ip + "/patientimage/" + data[i]);
                img_tag.setAttribute("alt", "There is no image");
                img_tag.setAttribute("id", "img_" + (i + 1));

                div_container.setAttribute("class", "div_container col-md-3 col-sm-4 col-xs-3");

                image_container.appendChild(div_container);
                div_container.appendChild(img_tag);
            }

        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

function getScreenshot() {
    var patient_id = document.getElementById("patient_id").textContent;
    var drop2 = document.getElementById("drop2");
    var patient_jointdirection = setNumberingforJointdirection(drop2.options[drop2.selectedIndex].value);
    var type = 'screenshot';
    var data = {
        patient_id: patient_id,
        patient_jointdirection: patient_jointdirection,
        type: type
    };

    $.ajax({
        url: "http://" + ip + "/php/rom_web_php/get_image.php",
        type: 'GET',
        data: data,
        dataType: 'json',
        success: function(data) {
            for (var i in data) {
                //XUGTFTI_11_11-10-2017_16-20-01_normal.png
                //0:id 1:joint 2:date 3:time 4:type
                var file = data[i];
                var fileInfo = file.split("_");
                var fileDate = fileInfo[2].split("-");
                //0:month 1:day 2:year
                if(i==0){
                   makeScreenshotFolder(fileInfo, fileDate, data);
                }
                else{
                    var beforeFile = data[i-1];
                    var beforeFileInfo = beforeFile.split("_");
                    if(fileInfo[2]!=beforeFileInfo[2]){
                        makeScreenshotFolder(fileInfo, fileDate, data);
                    }
                }
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

function makeScreenshotFolder(fileInfo, fileDate, data) {
    var screenshot_container = document.getElementById('screenshot_container');
    var div_container = document.createElement("div");
    var img_tag = document.createElement("img");
    var span_tag = document.createElement("span");

    img_tag.setAttribute("class", "img-responsive col-md-12 col-sm-12 col-xs-12");
    img_tag.setAttribute("width", "100%");
    img_tag.setAttribute("src", "../image/screenshotfolder.png");
    img_tag.setAttribute("alt", "There is no image");
    img_tag.setAttribute("id", fileInfo[2]);
    img_tag.style["cursor"] = "pointer";

    (function() {
        var filtered = data.filter(screenshotDateFilter, fileInfo[2]);
        var date = fileDate[2] + "년 " + fileDate[0] + "월 " + fileDate[1] + "일";
        img_tag.onclick = function() {
            viewPaintModal(filtered, date);
        };
    })();

    span_tag.innerHTML = fileDate[2] + "년 " + fileDate[0] + "월 " + fileDate[1] + "일";
    span_tag.style["display"] = "inline-block"
    span_tag.style["text-align"] = "center";
    span_tag.style["width"] = "100%";
    span_tag.style["margin-top"] = "5px";

    div_container.setAttribute("class", "div_container col-md-1 col-sm-2 col-xs-1");

    screenshot_container.appendChild(div_container);
    div_container.appendChild(img_tag);
    div_container.appendChild(span_tag);
}

function screenshotDateFilter(value){
    value = value.split("_");
    var valueDate = value[2];
    return valueDate == this;
}

function getMovie() {
    var video_height = $('#collapseMovie').height();
    document.getElementById("video_select").style["max-height"] = video_height;
    var patient_id = document.getElementById("patient_id").textContent;
    var drop2 = document.getElementById("drop2");
    var patient_jointdirection = setNumberingforJointdirection(drop2.options[drop2.selectedIndex].value);
    var type = 'movie';

    var data = {
        patient_id: patient_id,
        patient_jointdirection: patient_jointdirection,
        type: type
    };

    $.ajax({
        url: "http://" + ip + "/php/rom_web_php/get_image.php",
        type: 'GET',
        data: data,
        dataType: 'json',
        success: function(data) {
            for (var i in data) {
                var file = data[i].filename;
                var fileName = file.split('_');
                //0:uid 1:jointdirection(number) 2:date(mm-dd-yyyy) 3:time(hh-mm-ss)
                var date = fileName[2].split('-');
                //0:mm 1:dd 2:yyyy
                var time = fileName[3].split('-');
                //0:hh 1:mm 2:ss

                var video_select_container = document.getElementById('video_select');
                var li_tag = document.createElement("li");
                li_tag.setAttribute("class", "list-group-item video_list list-group-item-action");
                li_tag.setAttribute("data-filename", file);

                var p_tag = document.createElement("p");
                p_tag.setAttribute("class", "mb-1");
                p_tag.innerHTML = date[2] + '년 ' + date[0] + '월 ' + date[1] + '일 ' + time[0] + '시 ' + time[1] + '분';

                li_tag.appendChild(p_tag);
                video_select_container.appendChild(li_tag);
            }

            $(".video_list").click(function() {
                $(".video_list").removeClass('active');
                var select_fileName = $(this).attr('data-filename');
                $(this).addClass('active');
                selectMovie(select_fileName, patient_id);
            });

        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

function selectMovie(filename, patient_id) {
    var video_container = document.getElementById('video_container');
    $("#video_tag").remove();
    var video_tag = document.createElement('video');
    video_tag.setAttribute("id", "video_tag");
    video_tag.setAttribute("width", "100%");
    video_tag.setAttribute("controls", "");
    video_tag.setAttribute("poster", "../image/videoposter.png");
    video_container.appendChild(video_tag);
    var source_tag = document.createElement('source');
    source_tag.setAttribute("id", "source_tag");
    source_tag.setAttribute("type", "video/mp4");
    source_tag.setAttribute("src", "http://" + ip + "/movie/" + filename);

    video_tag.appendChild(source_tag);
    $('#video_tag').get(0).play()
}

function setNrsRange(target,index) {

    var sheet = document.createElement('style'),
        $rangeInput = $('.range input'),
        prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

    document.body.appendChild(sheet);

    var getTrackStyle = function(el) {
        var curVal = el.value,
            val = (curVal - 1) * 9.8,
            style = '';

        // Set active label
        $('.range-labels li').removeClass('active selected');

        var curLabel = $('.range-labels').find('li:nth-child(' + curVal + ')');

        curLabel.addClass('active selected');
        curLabel.prevAll().addClass('selected');

        // Change background gradient
        for (var i = 0; i < prefs.length; i++) {
            style += '.range {background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #fff ' + val + '%, #fff 100%)}';
            style += '.range input::-' + prefs[i] + '{background: linear-gradient(to right, #37adbf 0%, #37adbf ' + val + '%, #b2b2b2 ' + val + '%, #b2b2b2 100%)}';
        }
        return style;
    }

    $rangeInput.on('input', function() {
        sheet.textContent = getTrackStyle(this);
    });
    if(target === 'submit'){
        // Change input value on label click
        $('.range-labels li').on('click', function() {
            index = $(this).index();
            $rangeInput.val(index + 1).trigger('input');
        });
    }
    else{
        $rangeInput.val(index + 1).trigger('input');
    }
}

var checkdateid;
function setNRS(target){
  setNrsRange('modify', 0);
  checkdateid = target.getAttribute('data-id');
  var status = target.getAttribute('data-status');
  if(status === 'modify'){
    var index = parseInt(target.innerHTML);
    setNrsRange(status, index);
  }
}

function saveNRS() {
  var nrs = $('.range-labels .selected').last().text();  
  var data = {nrs : nrs, checkdateid : checkdateid};

   $.ajax({
        url: "http://" + ip + "/php/rom_web_php/post_nrs_data.php",
        type: 'POST',
        data: data,
        dataType: 'json',
        success: function(data) {
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
    $('#NRSModal').modal('hide');
    setJointDirection();
}

function viewPaintModal(data, date){
  var select_tag = document.getElementById("paintingModalSelect");
  $('#paintingModalSelect').find('option').remove().end();
  document.getElementById("paintingModalTitle").innerHTML = date;
  //XUGTFTI_11_10-10-2017_16-20-01_normal.png
  for(var i in data){
    var option = document.createElement("option");
    var filename = data[i].split("_");
    var filetime = filename[3].split("-");
    option.text = filetime[0]+"시 "+filetime[1]+"분 "+filetime[2]+"초";
    option.setAttribute("id",data[i]);
    select_tag.add(option);
  }
  paintOnImage();
}

function paintOnImage(){
  var selectedImgId = $("#paintingModalSelect option:selected").attr("id");
  var selectedImageSrc = "http://" + ip + "/screenshot/"+selectedImgId;
  var selectedImageHudSrc = selectedImageSrc.replace("normal","hud");
  var selectedImageSkeletonSrc = selectedImageSrc.replace("normal","");
  var canvas = document.getElementById('imageCanvas');
  paper.setup(canvas);
  paper.install(window);

  var raster = new Raster();

  document.getElementById("hudImg").setAttribute("src", selectedImageHudSrc);
  document.getElementById("normalImg").setAttribute("src", selectedImageSrc);
  document.getElementById("skeletonImg").setAttribute("src", selectedImageSkeletonSrc);
  $('#paintingModal').modal('show');
}

$("#paintingModalSelect").change(function(){
   paintOnImage();
});

$(".paintImgbtn").click(function() {
  var canvas = document.getElementById('imageCanvas');
  paper.setup(canvas);
  paper.install(window);
  var selectedtype = $(this).text();
  var selectedSrc = document.getElementById(selectedtype+"Img").getAttribute("src");
  var selectedWidth = $("."+selectedtype+"Img").width();
  var selectedHeight = $("."+selectedtype+"Img").height();
  var raster = new Raster(selectedSrc);
  raster.width = canvas.width;
  raster.height = (raster.width*651)/1159;
  raster.position = view.center;
});

function romPrint() {
    document.getElementById('myChart').style.width = "95%";
    document.getElementById('myChart').style.height = "95%";
    document.getElementById('myChart2').style.width = "95%";
    document.getElementById('myChart2').style.height = "95%";
    document.getElementById('myChart3').style.width = "95%";
    document.getElementById('myChart3').style.height = "95%";

    window.print();
}

/*
function alimtalk(){
    var data = [
    {
     "userId": "teamelysium",
     "message_type": "at",
     "phn": "821051358616",
     "profile": "722b710c822a43cef05bf53fe67cbc62724bc11b",
     "tmplId": "1",
     "msg": "[팀엘리시움]\n한소희님께서 요청하신 이미지를 보내드립니다.\n2017.10.31에 측정하신 이미지는 아래의 링크를 클릭하시면 보실 수 있습니다.\n\n▶이미지 링크 : www.naver.com"
     }];

   $.ajax({
       url: "https://alimtalk-api.bizmsg.kr/v1/sender/send",
       type: 'POST',
       data: JSON.stringify(data),
       contentType: "application/json; charset=utf-8",
       dataType: "json",
       success: function(data){
         console.log(data);
       },
       error: function(request, status, error){
         console.log(request, status, error);
       },
   });
}
*/
function goMainPage() {
    location.href = "../POM-CHECKER/POM-CHECKER.html";
}

function setNumberingforJointdirection(jointdirection) {
    switch (jointdirection) {
        case "Left Shoulder Flexion / Extension":
            jointdirection = '11';
            break;
        case "Right Shoulder Flexion / Extension":
            jointdirection = '12';
            break;
        case "Left Shoulder Abduction / Adduction":
            jointdirection = '21';
            break;
        case "Right Shoulder Abduction / Adduction":
            jointdirection = '22';
            break;
        case "Left Shoulder Rotation":
            jointdirection = '31';
            break;
        case "Right Shoulder Rotation":
            jointdirection = '32';
            break;
        case "Left Elbow Flexion / Extension":
            jointdirection = '41';
            break;
        case "Right Elbow Flexion / Extension":
            jointdirection = '42';
            break;
        case "Right Elbow Flexion / Extension":
            jointdirection = '51';
            break;
        case "Right Elbow Supination / Pronation":
            jointdirection = '52';
            break;
        case "Left Elbow Lateral Rotaion":
          jointdirection = '61';
          break;
        case "Right Elbow Lateral Rotaion":
          jointdirection = '62';
          break;
        case "Left Hip Flexion / Extension":
            jointdirection = '71';
            break;
        case "Right Hip Flexion / Extension":
            jointdirection = '72';
            break;
        case "Left Hip Rotation":
            jointdirection = '81';
            break;
        case "Right Hip Rotation":
            jointdirection = '82';
            break;
        case "Left Neck Rotation":
            jointdirection = '91';
            break;
        case "Right Neck Rotation":
            jointdirection = '92';
            break;
        case "Neck Extension":
            jointdirection = '101';
            break;
        case "Neck Flexion":
            jointdirection = '102';
            break;
        case "Left Neck Lateral Flexion":
            jointdirection = '111';
            break;
        case "Right Neck Lateral Flexion":
            jointdirection = '112';
            break;
        case "Posture":
            jointdirection = '201';
            break;
		    case "Side Posture":
            jointdirection = '300';
            break;
        case "Moiré":
            jointdirection = '400';
            break;
        case "Push Up":
            jointdirection = '500';
            break;
        case "Squat":
            jointdirection = '510';
            break;
        case "Hip Extension":
            jointdirection = '520';
            break;
        case "Opposite Arm & Leg Extension":
            jointdirection = '530';
            break;
        case "Side Lunge":
            jointdirection = '540';
            break;
        case "Cat Pose Yoga":
            jointdirection = '550';
            break;
        case "Downward Facing Dog":
            jointdirection = '560';
            break;
        case "Slopes Towards":
            jointdirection = '570';
            break;
        case "Hands To Feet Yoga":
            jointdirection = '580';
            break;
        case "Windmills":
            jointdirection = '590';
            break;
        default:
    }
    return jointdirection;
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
          jointdirection = 'Opposite Arm & Leg Extension';
          break;
        case "540":
          jointdirection = 'Side Lunge';
          break;
        case "550":
          jointdirection = 'Cat Pose Yoga';
          break;
        case "560":
          jointdirection = 'Downward Facing Dog';
          break;
        case "570":
          jointdirection = 'Slopes Towards';
          break;
        case "580":
          jointdirection = 'Hands To Feet Yoga';
          break;
        case "590":
          jointdirection = 'Windmills';
        default:
    }
    return jointdirection;
}
