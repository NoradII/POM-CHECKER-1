"use strict";

var table;
var ip = localStorage.getItem("IP");

jQuery(document).bind("keyup keydown", function(e) {
    if (e.ctrlKey && e.keyCode === 80) {
        return false;
    }
});

window.onload = function() {
    $('input[type="text"]').keydown(function() {
        if (event.keyCode === 13) {
            event.preventDefault();
            checkAuthcode();
        }
    });
    
    var patientid = getParameterByName('patientid');
    var hospitalid = getParameterByName('hospitalid');
    var jointdirection = getParameterByName('jointdirection'); 
 
    console.log("patientid : "+patientid+",hospitalid : "+hospitalid+",jointdirection : "+jointdirection);
    var data = "patientid=" + patientid + "&hospitalid=" + hospitalid;
    $.ajax({
        url: 'https://elysium.azurewebsites.net/php/rom_admin_php/get_patient_name_alimtalk.php',
        type: 'POST',
        data : data,
        dataType: 'json',
        success: function(data) {
            //data[0] : hospitalname , data[1] : patientname
            var patientname = document.getElementById('patientid');
            patientname.innerHTML = data[1].name;
            patientname.setAttribute("value", patientid);
            var hospitalname = document.getElementById('hospitalid');
            hospitalname.innerHTML = data[0].name;
            hospitalname.setAttribute("value", hospitalid);
            var jointdirectionname = document.getElementById('jointdirection');
            jointdirectionname.innerHTML = setNamingforJointdirection(jointdirection);
            if(jointdirection === '500'){
                jointdirectionname.innerHTML = 'Exercise';
            }            
            getPatientJonintDirection();
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
    
};


function checkAuthcode(){
        var InputAuthcode = document.getElementById('InputAuthcode').value;
        var patientid = getParameterByName('patientid');
        var data ="patientid=" + patientid + "&authcode=" + InputAuthcode;
        $.ajax({
            url: 'https://elysium.azurewebsites.net/php/rom_admin_php/check_input_authcode.php',
            type: 'POST',
            data : data,
            dataType: 'json',
            success: function(data) {
              if(data[0].authcode === InputAuthcode){
                  alert('인증 성공');
                  document.getElementById('authcode-container').style.display = 'none';
                  document.getElementById('view-container').style.display = 'block';
              }
              else{
                  alert('인증 실패');
              }
            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

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
        maintainAspectRatio: false,
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
        maintainAspectRatio: false,
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
        maintainAspectRatio: false,
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
    var select_name = document.getElementById('patientid');
    var selected_name = select_name.innerHTML;
    var selected_patientid = select_name.getAttribute("value");
    getPatientInfo(selected_name.split('(')[0], selected_patientid);
    var post_data = "name=" + selected_name.split('(')[0] + "&patientid=" + selected_patientid;
    console.log(post_data);
    calendar_status++;
    setJointDirection();
}

function getPatientInfo(post_data_name, post_data_patientid) {

    var post_data = "name=" + post_data_name + "&patientid=" + post_data_patientid;
    $.ajax({
        url: 'https://elysium.azurewebsites.net/php/rom_web_php/get_patient_info.php',
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
    table.clear().draw();
    for (var i = 0; i < data_count; i++) {
        removeData(chart);
        removeData(chartForPosture);
        removeData(chartForSidePosture);
    }

    var select_name = document.getElementById('patientid');
    var selected_name = select_name.innerHTML;

    var select_jointdirection = document.getElementById('jointdirection');
    var selected_jointdirection = select_jointdirection.innerHTML;
    selected_jointdirection = setNumberingforJointdirection(selected_jointdirection);
    var post_data = "name=" + selected_name.split('(')[0] + "&jointdirection=" + selected_jointdirection;

    var info = "";
    var label = [];
    var data2 = [];

    //moire
    if(selected_jointdirection === '400'){
        $("#rom-data-chart").hide();
        $("#rom-data-table").hide();
    }
    //yoga
    else if(parseInt((parseInt(selected_jointdirection)/100)) === 7){
        $("#rom-data-chart").hide();
        $("#rom-data-table").hide();
    }
    else{
        $("#rom-data-chart").show();
        $("#rom-data-table").show();
        
        document.getElementById("rom-data-chart").setAttribute("class", "col-md-6 col-sm-12 col-xs-12");
        document.getElementById('calendar').style.display = 'none';
        document.getElementById('minicalendar').style.display = 'none';
        //document.getElementById('rom-data-table').style.height = '650px';

        //exercise calendar
        if (parseInt((parseInt(selected_jointdirection) / 100)) === 5) {
            $("#rom-data-table").hide();
            document.getElementById('chartcontainer').style.display = 'none';
            document.getElementById('calendar').style.display = 'block';
            document.getElementById('minicalendar').style.display = 'block';
            document.getElementById('minicalendar').style.height = '400px';
            document.getElementById('rom-data-chart').style.height = '900px';
            const mediaquery = window.matchMedia("(max-width: 768px)");
            if (mediaquery.matches) {
                document.getElementById('rom-data-chart').style.height = '680px';
                document.getElementById('calendar').style.display = 'none';
                document.getElementById('minicalendar').style.height = '370px';        
            }
            
            if (calendar_status !== 0) {
                $('#calendar').calendar();
                $('#minicalendar').calendar();
            }
        
            $('.calendar-month-row td div').empty();
            document.getElementById("rom-data-chart").setAttribute("class", "col-md-12 col-sm-12 col-xs-12");
        }

        $.ajax({
            url: 'https://elysium.azurewebsites.net/php/rom_web_php/get_result_table.php',
            type: 'POST',
            dataType: 'json',
            data: post_data,
            success: function(data) {
                var jointdirection = selected_jointdirection;
                if (parseInt((parseInt(jointdirection) / 100)) === 5) {
                    const mediaquery = window.matchMedia("(max-width: 768px)");
                    if (mediaquery.matches) {
                         document.getElementById('mobile-activity-log').style.display = 'block';
                        $("#minicalendar .calendar-month-row").on("click", "td", function() {
                            $('#mobile-activity-log').empty();
                            $(".calendar-month-row td").css("border", "none");
                            $(this).css("border", "2px solid #232f39");
                            $('#minicalendar .calendar-month-row').animate({height: "45px"}, "slow");
                            document.getElementById("minicalendar").style["border-bottom"] = "1px solid #cccccc";
                            
                            var clickdate = $(this).context.id;
                            clickdate = clickdate.replace("mobile", "");
                            
                           mobileActivityLog(data, clickdate);
                           document.getElementById("mobile-activity-log-date").innerHTML = clickdate.substring(2, 4) + "월 " + clickdate.substring(4,6) + "일";
                        });
                    }
                }
                   
                for (var i = 0; i < data.length; i++) {
                    
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
                        img_icon.setAttribute("src", "https://elysium.azurewebsites.net/image/exercise/"+setNamingforJointdirection(data[i].jointdirection).replace(/ /g,"")+".png");
                        img_icon.setAttribute("style", "margin : 0 2px 2px 0;")
                        
                        var span_name = document.createElement("span");
                        span_name.innerHTML = setNamingforJointdirection(data[i].jointdirection);
                        
                        var span_count = document.createElement("span");
                        span_count.innerHTML += data[i].count;                        
                        span_count.style["float"] = "right";
                        span_count.style["line-height"] = "27px";

                        div_container.appendChild(img_icon);
                        div_container.appendChild(span_name);
                        div_container.appendChild(span_count);
                        
                        
                        $("#calendar #"+id).append(div_container);
                        $("#minicalendar #"+id).parent().css("background-color", "#00cafb");
                        $("#minicalendar #"+id).parent().css("color", "#fff");
                    }

                    else {
                        document.getElementById('rom-table-thead-angle').innerHTML = "Angle";
                        document.getElementById('rom-table-thead-variation').innerHTML = "Variation";
                        data[i].maxangle *= 1;
                        angle = parseInt(data[i].maxangle) + " °";
                        if (i >= 1) {
                            data[i - 1].maxangle *= 1;
                            rate = Math.floor(data[i].maxangle.toFixed(2) - data[i - 1].maxangle.toFixed(2));
                        }
                    }

                    var nrs = "<span style='font-size: 10px; border-radius: 3px' data-status='create' data-toggle='modal' data-target='#NRSModal' data-id='"+data[i].checkdateid+"'> - </span>";
                    if(data[i].nrs !== null){
                      nrs = "<span class='setNRSclick' data-status='modify' data-toggle='modal' data-target='#NRSModal' data-id='"+data[i].checkdateid+"' style='width:"+$('.setNRSclick').parent().width()+"px;' >"+data[i].nrs+"</span>";
                    }

                    table.row.add([
                        info + data[i].datetime.split(" ")[0],
                        info + angle,
                        info + rate + " °",
                        info + nrs,
                    ]).draw(false);
                }


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

            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
    }

}

function mobileActivityLog(data, clickdate){
    var mobile_activity_log = document.getElementById('mobile-activity-log');
    var idCheckCount = 0;
    for (var i in data) {
        var datetime = data[i].datetime;
        var id = datetime.substring(2, 4) + datetime.substring(5, 7) + datetime.substring(8, 10);
        if(clickdate === id){
            idCheckCount++;
            var colorchart = ['#00cafb', '#ff5130', '#3841ee', '#ee3863', '#237100', '#ffa200', '#5338cb'];
            var colorIndex = parseInt(data[i].jointdirection) / 10 - 50;
                    
            var div_container = document.createElement('div');
            div_container.setAttribute("class", "activity-log");
            div_container.style['background-color'] = colorchart[colorIndex];
            div_container.style['height'] = '30px';
            div_container.style['margin-bottom'] = '3px';
        
            var img_icon = document.createElement("img");
            img_icon.setAttribute("src", "https://elysium.azurewebsites.net/image/exercise/" + setNamingforJointdirection(data[i].jointdirection).replace(/ /g, "") + ".png");
            img_icon.setAttribute("style", "margin : 0 10px 0px 10px;")
        
            var span_name = document.createElement("span");
            span_name.innerHTML = setNamingforJointdirection(data[i].jointdirection);
            span_name.style["line-height"] = "30px";
        
            var span_count = document.createElement("span");
            span_count.innerHTML += data[i].count;
            span_count.style["float"] = "right";
            span_count.style["line-height"] = "30px";
            span_count.style["margin-right"] = "10px";
        
            div_container.appendChild(img_icon);
            div_container.appendChild(span_name);
            div_container.appendChild(span_count);           
            
            mobile_activity_log.style["display"] = 'block';
            mobile_activity_log.style["align-items"] = 'inherit';
            mobile_activity_log.style["justify-content"] = 'inherit';
            mobile_activity_log.appendChild(div_container);
        }
    }

    if(idCheckCount === 0){
        var nohistory = document.createElement('p');
        nohistory.innerHTML = '이용내역 없음';
        nohistory.style["text-align"] = 'center';
        mobile_activity_log.style["display"] = 'flex';
        mobile_activity_log.style["align-items"] = 'center';
        mobile_activity_log.style["justify-content"] = 'center';
        mobile_activity_log.appendChild(nohistory);
        
    }
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
            td.setAttribute("id","mobile"+datetime.format('YYMMDD'));
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
                div.setAttribute("class", "calendar-exerciselog-box");
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
        $('#mobile-activity-log').empty();
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
        $('#mobile-activity-log').empty();
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
