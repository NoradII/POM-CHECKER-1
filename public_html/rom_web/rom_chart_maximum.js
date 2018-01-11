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
            backgroundColor : 'rgb(58, 159, 85)',
            borderColor: 'rgb(58, 159, 85)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
        }, {
            label: '정상범위',
            backgroundColor : 'rgb(29, 150, 213)',
            borderColor: 'rgb(29, 150, 213)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
            yAxisID:'Left',
        },
        {
            label: 'NRS',
            backgroundColor : 'rgb(228, 0, 127)',
            borderColor: 'rgb(228, 0, 127)',
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
    chart.data.datasets[0].data.push(data); // 환자 , posture : sh_angle
    chart.data.datasets[1].data.push(data2); // 정상범위 , posture : hh_angle
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

var calendar_status;
function getPatientJonintDirection() {
    var select_name = document.getElementById('drop1');
    var selected_name = select_name.options[select_name.selectedIndex].text;
    var selected_patientid = select_name.options[select_name.selectedIndex].value;
    getPatientInfo(selected_name.split('(')[0], selected_patientid);
    var post_data = "name=" + selected_name.split('(')[0] + "&patientid=" + selected_patientid;
    console.log("patient_name=누구: " + post_data);
    calendar_status = 0;
    if (selected_name === "--- Patient --") {
    } else {
        var jointdirectionList = [];
        $.ajax({
            url: 'http://' + ip + '/php/rom_web_php/get_jointdirection_list.php',
            type: 'POST',
            data: post_data,
            dataType: 'json',
            success: function(data) {
                var count = 0;
              $.each(data, function (i, itemData) {
                  var patientJointdirection = itemData.jointdirection;
                  if(parseInt((parseInt(patientJointdirection)/100)) === 5){
                    if(count === 0){
                        patientJointdirection = 'Exercise';
                        var data = {"id" : patientJointdirection, "text" : patientJointdirection};
                        jointdirectionList.push(data);
                    }
                    count++;
                  }
                  else{
                    patientJointdirection = setNamingforJointdirection(patientJointdirection);
                    var data = {"id" : patientJointdirection, "text" : patientJointdirection};
                    jointdirectionList.push(data);
                }              
                 
              });
              $("#drop2 option:gt(0)").remove();
              $("#drop2").select2({
                  data: jointdirectionList
              });
              $('#drop2-wrapper > span').css("width", "100%");
              $('#drop2-wrapper > span').css("text-align", "center");
              $('#drop2-wrapper > select').css("height", "38px");

              calendar_status++;
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

    //moire
    if(selected_jointdirection === '400'){
        getScreenshot();
        getMovie();
        $("#rom-data-chart").hide();
        $("#rom-data-table").hide();
        $("#image-box").hide();
    }
    //yoga
    else if(parseInt((parseInt(selected_jointdirection)/100)) === 7){
        getScreenshot();
        getMovie();
        getImage();
        $("#image-box").show();
        $("#rom-data-chart").hide();
        $("#rom-data-table").hide();
    }
    else{
        $("#rom-data-chart").show();
        $("#rom-data-table").show();
        $("#image-box").show();
        
        document.getElementById("rom-data-chart").setAttribute("class", "col-md-6 col-sm-12 col-xs-12");
        document.getElementById('calendar').style.display = 'none';
        document.getElementById('minicalendar').style.display = 'none';
        document.getElementById('rom-data-table').style.height = '650px';

        //exercise calendar
        if(parseInt((parseInt(selected_jointdirection)/100)) === 5){
             $("#rom-data-table").hide();
             document.getElementById('calendar').style.display = 'block';
             document.getElementById('minicalendar').style.display = 'block';
              document.getElementById('minicalendar').style.height = '400px';
             document.getElementById('rom-data-chart').style.height = '900px';
             if(calendar_status !== 0){
                $('#calendar').calendar();
                $('#minicalendar').calendar();
             }

             $('.calendar-month-row td div').empty();
             document.getElementById("rom-data-chart").setAttribute("class", "col-md-12 col-sm-12 col-xs-12");
        }

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
                    //exercise calendar
                    else if(parseInt((parseInt(jointdirection)/100)) === 5){
                        var colorchart = ['#00cafb', '#ff5130', '#3841ee', '#ee3863', '#237100', '#ffa200', '#5338cb'];
                        var colorIndex = parseInt(data[i].jointdirection)/10 - 50;

                        var datetime = data[i].datetime;
                        var id = datetime.substring(2,4)+datetime.substring(5,7)+datetime.substring(8,10);

                        var div_container = document.createElement('div');
                        div_container.setAttribute("class", "activity-log");
                        div_container.style['background-color'] = colorchart[colorIndex];

                        var img_icon = document.createElement("img");
                        img_icon.setAttribute("src", "http://" + ip + "/image/exercise/"+setNamingforJointdirection(data[i].jointdirection)+".png");
                        img_icon.setAttribute("style", "margin : 0 2px 2px 0;")
                        
                        var span_name = document.createElement("span");
                        span_name.innerHTML = setNamingforJointdirection(data[i].jointdirection);
                        
                        var span_count = document.createElement("span");
                        span_count.innerHTML += data[i].count;                        
                        span_count.style["float"] = "right";

                        div_container.appendChild(img_icon);
                        div_container.appendChild(span_name);
                        div_container.appendChild(span_count);

                        $("#calendar #"+id).append(div_container);
                        $("#minicalendar #"+id).parent().css("background-color", "#00cafb");
                        $("#minicalendar #"+id).parent().css("color", "#fff");
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

                    var nrs = "<button class='btn' style='font-size: 10px; border-radius: 3px' onclick='setNRS(this)' data-status='create' data-toggle='modal' data-target='#NRSModal' data-id='"+data[i].checkdateid+"'> 평가하기 </button>";
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

                    else if(parseInt((parseInt(jointdirection)/100)) === 5){
                        document.getElementById('myChart').style.display = 'none';
                        document.getElementById('myChart2').style.display = 'none';
                        document.getElementById('myChart3').style.display = 'none';
                    }
 
                    else {
                        document.getElementById('myChart').style.display = 'block';
                        document.getElementById('myChart2').style.display = 'none';
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
                   makeScreenshotFolder(fileInfo, fileDate, data, file);
                }
                else{
                    var beforeFile = data[i-1];
                    var beforeFileInfo = beforeFile.split("_");
                    if(fileInfo[2]!=beforeFileInfo[2]){
                        makeScreenshotFolder(fileInfo, fileDate, data, file);
                    }
                }
            }
        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}

function makeScreenshotFolder(fileInfo, fileDate, data, file) {
    var screenshot_container = document.getElementById('screenshot_container');
    var div_container = document.createElement("div");
    var img_tag = document.createElement("img");
    var label_tag = document.createElement("label");
    var input_check = document.createElement("input");

    var span_tag = document.createElement("span");

    input_check.setAttribute("type", "checkbox");
    input_check.setAttribute("class", "screenshot_check");
    input_check.setAttribute("id", fileInfo[2]);

    label_tag.setAttribute("for", fileInfo[2]);

    img_tag.setAttribute("src", "../screenshot/"+file);
    img_tag.setAttribute("id", fileInfo[2]);
    img_tag.setAttribute("alt", "There is no image");
    img_tag.setAttribute("class", "img-responsive col-md-12 col-sm-12 col-xs-12");

    (function() {
        var filtered = data.filter(screenshotDateFilter, fileInfo[2]);
        var date = fileDate[2] + "년 " + fileDate[0] + "월 " + fileDate[1] + "일";

        input_check.setAttribute("data-filtered" , filtered);
        input_check.setAttribute("data-date", date);

    })();

    span_tag.setAttribute("class", "screenshot-date");
    span_tag.innerHTML = fileDate[2] + "-" + fileDate[0] + "-" + fileDate[1];

    div_container.setAttribute("class", "imgcheck col-md-3 col-sm-3 col-xs-3");

    screenshot_container.appendChild(div_container);
    div_container.appendChild(input_check);
    div_container.appendChild(label_tag);
    label_tag.appendChild(img_tag);
    div_container.appendChild(span_tag);
}

function screenshotDateFilter(value){
    value = value.split("_");
    var valueDate = value[2];
    return valueDate == this;
}

function screenshotCompare(){
    var count = document.querySelectorAll('.screenshot_check:checked').length;
    if(count > 2 || count === 0){
        alert("한 개 혹은 두 개의 폴더를 선택해주세요");
    }
    else if(count === 1){
        var check = document.querySelectorAll('.screenshot_check:checked')[0];
        var filtered = check.getAttribute("data-filtered").split(",");
        var date =  check.getAttribute("data-date");
        viewPaintModal(filtered,date);
    }
    else{
        var check1 = document.querySelectorAll('.screenshot_check:checked')[0];
        var check2 = document.querySelectorAll('.screenshot_check:checked')[1];
        var data = check1.getAttribute("data-filtered").split(",");
        var date = check1.getAttribute("data-date");
        var data2 = check2.getAttribute("data-filtered").split(",");
        var date2 = check2.getAttribute("data-date");
        viewPaintModalCompare(data,date,data2,date2);
    }
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
                p_tag.setAttribute("class", "");
                p_tag.innerHTML = '<span class="history-text">날짜  :&nbsp;&nbsp;</span>'+date[2] + '-' + date[0] + '-' + date[1];

                var p_tag2 = document.createElement("p");
                p_tag2.setAttribute("class", "");
                p_tag2.innerHTML = '<span class="history-text">시간  :&nbsp;&nbsp;</span>'+time[0] + ':' + time[1] + ':' + time[2].substr(0,2);

                li_tag.appendChild(p_tag);
                li_tag.appendChild(p_tag2);
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
  paintOnImage(0);
   $('#paintingModal').modal('show');
}

function viewPaintModalCompare(data, date, data2, date2){
  var select_tag = document.getElementById("paintingModalSelect1");
  $('#paintingModalSelect1').find('option').remove().end();
  document.getElementById("paintingModalTitle1").innerHTML = date;

  var select_tag2 = document.getElementById("paintingModalSelect2");
  $('#paintingModalSelect2').find('option').remove().end();
  document.getElementById("paintingModalTitle2").innerHTML = date2;

  //XUGTFTI_11_10-10-2017_16-20-01_normal.png
  for(var i in data){
    var option = document.createElement("option");
    var filename = data[i].split("_");
    var filetime = filename[3].split("-");
    option.text = filetime[0]+"시 "+filetime[1]+"분 "+filetime[2]+"초";
    option.setAttribute("id",data[i]);
    select_tag.add(option);
  }

  for(var i in data2){
    var option = document.createElement("option");
    var filename = data2[i].split("_");
    var filetime = filename[3].split("-");
    option.text = filetime[0]+"시 "+filetime[1]+"분 "+filetime[2]+"초";
    option.setAttribute("id",data2[i]);
    select_tag2.add(option);
  }
  paintOnImage(1);
  paintOnImage(2);
  $("#paintingCompareModal").modal('show');
}

function paintOnImage(type){
    var changeString = "";
    if(type === 1){
        changeString = "1";
    }
    else if(type === 2){
        changeString = "2";
    }

    var selectedImgId = $("#paintingModalSelect"+changeString+" option:selected").attr("id");
    var selectedImageSrc = "http://" + ip + "/screenshot/"+selectedImgId;
    var selectedImageHudSrc = selectedImageSrc.replace("normal","hud");
    var selectedImageSkeletonSrc = selectedImageSrc.replace("normal","");
    var canvas = document.getElementById('imageCanvas'+changeString);
    paper.setup(canvas);
    paper.install(window);

    var raster = new Raster("../screenshot/screenshot_modal_default.png");

    document.getElementById("hudImg"+changeString).setAttribute("src", selectedImageHudSrc);
    document.getElementById("normalImg"+changeString).setAttribute("src", selectedImageSrc);
    document.getElementById("skeletonImg"+changeString).setAttribute("src", selectedImageSkeletonSrc);
}

$("#paintingModalSelect").change(function(){
   paintOnImage(0);
});

$("#paintingModalSelect1").change(function(){
   paintOnImage(1);
});

$("#paintingModalSelect2").change(function(){
   paintOnImage(2);
});


$("#imageCanvas1").mousedown(function() {
    for (var i in paper.projects) {
        if (paper.projects[i]._view._id === "imageCanvas1") {
            paper.project = paper.projects[i];
        }
    }

});

$("#imageCanvas2").mousedown(function() {
    for (var i in paper.projects) {
        if (paper.projects[i]._view._id === "imageCanvas2") {
            paper.project = paper.projects[i];
        }
    }
});

function screenshotCanvasChange(type, item) {

    var changeString = "";

    if (type === 1) {   
        changeString = "1";        
    } else if (type === 2) {
        changeString = "2";
    } else{ //0

    }

    var canvas = document.getElementById('imageCanvas' + changeString);
    paper.install(window);
    paper.setup(canvas);

    var selectedtype = item.innerHTML;
    var selectedSrc = document.getElementById(selectedtype + "Img" + changeString).getAttribute("src");
    var selectedWidth = $("." + selectedtype + "Img").width();
    var selectedHeight = $("." + selectedtype + "Img").height();
    var raster = new Raster(selectedSrc);

    canvas.height = (canvas.width / 100) * 60;
    raster.width = canvas.width;
    raster.height = (raster.width * 651) / 1159;
    raster.position = view.center;

   
}

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
   var select_name = document.getElementById('drop1');
    var selected_name = select_name.options[select_name.selectedIndex].text;
    selected_name = selected_name.split('(')[0];
    var selected_patientid = select_name.options[select_name.selectedIndex].value;
    var select_jointdirection = document.getElementById('drop2');
    var selected_jointdirection = select_jointdirection.options[select_jointdirection.selectedIndex].value;
    var selected_jointdirection_id = setNumberingforJointdirection(selected_jointdirection);
    var select_hospital = document.getElementById('drop_hospital');
    var selected_hospitalid = select_hospital.options[select_hospital.selectedIndex].value;
    
    if(selected_patientid!=="" && selected_hospitalid!== "" && selected_jointdirection !==""){
       var url = "https://teamelysium.azurewebsites.net/rom_web/rom_chart_capture.html?patientid="+selected_patientid+"&hospitalid="+selected_hospitalid+"&jointdirection="+selected_jointdirection_id;
       var data = {longUrl: url}; 
          
        $.ajax({
           url: "https://teamelysium.azurewebsites.net/php/rom_admin_php/get_short_url_alimtalk.php",
           type: 'GET',
           data: data,
           contentType: "application/json; charset=utf-8",
           dataType: "json",
           success: function(data){
               console.log(data);
             var data = [
                {
                 "userId": "teamelysium",
                 "message_type": "at",
                 "phn": "821051358616",
                 "profile": "722b710c822a43cef05bf53fe67cbc62724bc11b",
                 "tmplId": "1",
                 "msg": "[팀엘리시움]\n"+selected_name+"님께서 요청하신 이미지를 보내드립니다.\n"+selected_jointdirection+"에 측정하신 이미지는 아래의 링크를 클릭하시면 보실 수 있습니다.\n\n▶이미지 링크 : "+data
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
           },
           error: function(request, status, error){
             console.log(request, status, error);
           },
       });
    }
    else{
        alert("병원, 환자, 측정 부위 모두 선택해주세요");
    }
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
        case "Side Lunge":
            jointdirection = '530';
            break;
        case "Slopes Towards":
            jointdirection = '540';
            break;
        case "Windmills":
            jointdirection = '550';
            break;
        case "Opposite Arm & Leg Extension":
            jointdirection = '560';
            break;
        case "Cat pos (Bidalasana)":
            jointdirection = '700';
            break;
        case "Downward dog":
            jointdirection = '710';
            break;
        case "Hands to feet (pada hastasana)":
            jointdirection = '720';
            break;
        case "Exercise":
            jointdirection = '500';
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

(function($){
  var Calendar = function (elem, options) {
    this.elem = elem;
    this.options = $.extend({}, Calendar.DEFAULTS, options);
    this.init();
  };
  
  Calendar.DEFAULTS = {
    datetime: undefined,
    dayFormat: 'DDD',
    weekFormat: 'DDD',
    monthFormat: 'MM/DD/YYYY',
    view: undefined,
  };

  Calendar.prototype.init = function () {
    if (! this.options.datetime || this.options.datetime == 'now') {
      this.options.datetime = moment();
    }
    if (! this.options.view) {
      this.options.view = 'month';
    }
    this.initScaffold()
        .initStyle()
        .render();
  }
  
  Calendar.prototype.initScaffold = function () {
    
    var $elem = $(this.elem),
        $view = $elem.find('.calendar-view'),
        $currentDate = $elem.find('.calendar-current-date');
    
    if (! $view.length) {
      this.view = document.createElement('div');
      this.view.className = 'calendar-view';
      this.elem.appendChild(this.view);
    } else {
      this.view = $view[0];
    }

    if ($currentDate.length > 0) {
      var dayFormat = $currentDate.data('day-format'),
          weekFormat = $currentDate.data('week-format'),
          monthFormat = $currentDate.data('month-format');
      this.currentDate = $currentDate[0];
      if (dayFormat) {
        this.options.dayFormat = dayFormat;
      }
      if (weekFormat) {
        this.options.weekFormat = weekFormat;
      }
      if (monthFormat) {
        this.options.monthFormat = monthFormat;
      }
    }
    return this;
  }
  
  Calendar.prototype.initStyle = function () {
    return this;
  }
  
  Calendar.prototype.render = function () {
    switch (this.options.view) {
      case 'day': this.renderDayView(); break;
      case 'week': this.renderWeekView(); break;
      case 'month': this.renderMonthView();break;
      befault: this.renderMonth();
    }
  }
  
  Calendar.prototype.renderMonthView = function () {

    var datetime = this.options.datetime.clone(),
        month = datetime.month();
    datetime.startOf('month').startOf('week');
    
    var today = moment().format('YYMMDD');
    var $view = $(this.view),
        table = document.createElement('table'),
        tbody = document.createElement('tbody');
    
    $view.html('');
    table.appendChild(tbody);
    table.className = 'table';

    
    var dayofweek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    var week = 0, i;
    while (week < 7) {
      var tr = document.createElement('tr');
      tr.className = 'calendar-month-row';

      for (i = 0; i < 7; i++) {
        var td = document.createElement('td');
        if(week === 0){
            tr.className = 'calendar-row';
            td.appendChild(document.createTextNode(dayofweek[i]));
            if(i==0){                
                td.className = 'calendar-sun calendar-day';
            }
            else if(i==6){
                td.className = 'calendar-sat calendar-day'
            }
            else{
                td.className = 'calendar-day';
            }  
        }
        else{
            var span_tag = document.createElement('span');
            span_tag.innerHTML = datetime.format('D');
            span_tag.className = 'calendar-date';
           td.appendChild(span_tag);
            

            if(i==0){
                td.className = 'calendar-sun';
            }
            else if(i==6){
                td.className = 'calendar-sat';
            }

            if (month !== datetime.month()) {
              td.className = 'calendar-prior-months-date';
            }
            else{
                var div = document.createElement('div');
                div.setAttribute("id",datetime.format('YYMMDD'));
                td.appendChild(div); 
            }

            if(datetime.format('YYMMDD') === today){
                td.className += 'calendar-today';
            }

            datetime.add(1, 'day');
        }                
        tr.appendChild(td);
        
      }
      tbody.appendChild(tr);
      week++;
    }
   
    $view[0].appendChild(table);
    
    if (this.currentDate) {
      $(this.currentDate).html(
        this.options.datetime.format(this.options.monthFormat)
      );
    }
    
  }
  
  Calendar.prototype.next = function () {
    switch (this.options.view) {
      case 'day':
        break;
      case 'week':
        break;
      case 'month':
        this.options.datetime.endOf('month').add(1, 'day');
        this.render();
        calendar_status = 0;
        setJointDirection();
        break;
      default:
        break;
    }
  }

  Calendar.prototype.prev = function () {
    switch (this.options.view) {
      case 'day':
        break;
      case 'week':
        break;
      case 'month':
        this.options.datetime.startOf('month').subtract(1, 'day');
        this.render();
        calendar_status = 0;
        setJointDirection();
        break;
      default:
        break;
    }
  }

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this),
          data  = $this.data('bs.calendar'),
          options = typeof option == 'object' && option;
      if (! data) {
        data = new Calendar(this, options);
        $this.data('bs.calendar', data);
      }
      
      switch (option) {
        case 'today':
          data.today();
          break;
        case 'prev':
          data.prev();
          break;
        case 'next':
          data.next();
          break;
        default:
          break;
      }
    });
  };

  var noConflict = $.fn.calendar;

  $.fn.calendar             = Plugin;
  $.fn.calendar.Constructor = Calendar;

  $.fn.calendar.noConflict = function () {
    $.fn.calendar = noConflict;
    return this;
  };

  // Public data API.
  $('[data-toggle="calendar"]').click(function(){
    var $this = $(this),
        $elem = $this.parents('.calendar'),
        action = $this.data('action');
    if (action) {
      $elem.calendar(action);
    }
  });

  
})(jQuery);
