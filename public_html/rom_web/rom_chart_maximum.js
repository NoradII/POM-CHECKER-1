"use strict";

var table;
var ip = localStorage.getItem("IP");

jQuery(document).bind("keyup keydown", function(e) {
    if (e.ctrlKey && e.keyCode == 80) {
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
            for (var i = 0; i < data.length; i++) {
                var patientName = data[i].name;
                patientList.push(patientName);
            }

            $("#drop1").select2({
                data: patientList
            });
            $('#drop1-wrapper > span').css("width", "111px");
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
    getPatientName();
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
                scaleLabel: {
                    display: true,
                    labelString: '각도'
                },
                ticks: {
                    suggestedMin: 0,
                    suggestedMax: 180,
                    stepSize: 10
                }
            }]
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
        }, {
            label: 'Pelvic balance',
            borderColor: 'rgb(20, 179, 0)',
            pointRadius: 4,
            pointHitRadius: 10,
            data: [],
            fill: false,
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
                scaleLabel: {
                    display: true,
                    labelString: '각도'
                },
                ticks: {
                    suggestedMin: -10,
                    suggestedMax: 10,
                    stepSize: 10
                }
            }]
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

function addData(chart, label, data, data2) {
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(data); // 환자
    chart.data.datasets[1].data.push(data2); // 정상범위
    chart.update();
}

function removeData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function getPatientName() {
    var select_name = document.getElementById('drop1');
    var selected_name = select_name.options[select_name.selectedIndex].text;
    getPatientInfo(selected_name);
    var post_data = "name=" + selected_name;
    console.log("patient_name=누구: " + post_data);
    var jointdirection_list = [];
    if (selected_name == " -- Patient ID -- ") {
        alert("환자를 선택해주세요.");
    } else {
        $.ajax({
            url: 'http://' + ip + '/php/rom_web_php/get_jointdirection_list.php',
            type: 'POST',
            data: post_data,
            dataType: 'json',
            success: function(data) {
                //console.log("asdfasdfasdf:"+data);
                var jointdirection_container = document.getElementById('drop2');
                $("#drop2 option:gt(0)").remove();
                $("#drop3 option:gt(0)").remove();

                $('#drop2-wrapper > select').css("height", "38px");

                for (var i = 0; i < data.length; i++) {
                    var jointdirection = data[i].jointdirection;
                    var select_tag = document.getElementById("drop2");
                    var new_jointdirection = document.createElement("option");
                    new_jointdirection.setAttribute('value', jointdirection);

                    jointdirection = setNamingforJointdirection(jointdirection);
                    new_jointdirection.innerHTML = jointdirection;
                    select_tag.appendChild(new_jointdirection);
                }


                setJointDirection();

            },
            error: function(request, status, error) {
                console.log(request, status, error);
            },
        });
    }
}

function getPatientInfo(post_data) {

    post_data = "name=" + post_data;
    $.ajax({
        url: 'http://' + ip + '/php/rom_web_php/get_patient_info.php',
        type: 'POST',
        data: post_data,
        dataType: 'json',
        success: function(data) {
            for (var i = 0; i < data.length; i++) {
                document.getElementById('patient_name').innerHTML = data[i].name;
                document.getElementById('patient_number').innerHTML = "No." + data[i].number;
                document.getElementById('patient_id').innerHTML = data[i].patientid;
                console.log("gender: " + data[i].sex);
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
    $("#video_tag").empty();
    $("#video_select").empty();

    $("#drop3 option:gt(0)").remove();
    table.clear().draw();
    for (var i = 0; i < data_count; i++) {
        removeData(chart);
        removeData(chartForPosture);
    }

    var select_name = document.getElementById('drop1');
    var selected_name = select_name.options[select_name.selectedIndex].text;

    var select_jointdirection = document.getElementById('drop2');
    var selected_jointdirection = select_jointdirection.options[select_jointdirection.selectedIndex].value;

    var post_data = "name=" + selected_name + "&jointdirection=" + selected_jointdirection;
    console.log(post_data);

    var info = "";
    var label = [];
    var data2 = [];

    $.ajax({
        url: 'http://' + ip + '/php/rom_web_php/get_result_table.php',
        type: 'POST',
        dataType: 'json',
        data: post_data,
        success: function(data) {
            //console.log(data);
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
                        data2.push("135");
                        break;
                    case "62":
                        data2.push("135");
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
                    default:
                }

                var rate = 0;
                var angle = 0;

                if (i === 0) {
                    rate = 0;
                }

                console.log("LENGTH : " + data.length);

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

                } else {
                    document.getElementById('image-box').style.display = 'block';
                    document.getElementById('rom-table-thead-angle').innerHTML = "Max Angle";
                    data[i].maxangle *= 1;
                    angle = data[i].maxangle.toFixed(2) + " °";
                    if (i >= 1) {
                        data[i - 1].maxangle *= 1;
                        rate = Math.floor(data[i].maxangle.toFixed(2) - data[i - 1].maxangle.toFixed(2));
                    }
                }

                var nrs = "<button class='btn-primary' style='font-size: 10px; border-radius: 3px' onclick='setNRS(this)' data-status='create' data-toggle='modal' data-target='#NRSModal' data-id='"+data[i].checkdateid+"'> 평가하기 </button>";
                if(data[i].nrs !== null){
                  nrs = "<span onclick='setNRS(this)' data-status='modify' data-toggle='modal' data-target='#NRSModal' data-id='"+data[i].checkdateid+"'>"+data[i].nrs+"</span>";
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

            if ((data.length % 10) == 0) {
                size = data.length / 10;
            } else {
                size = (data.length / 10) + 1;
            }

            for (; j < data.length; j++) {
                if (j % 10 == 0 && j != 0) {
                    break;
                }

                if (jointdirection === "Posture") {
                    document.getElementById('myChart').style.display = 'none';
                    document.getElementById('myChart2').style.display = 'block';
                    data[j].sh_angle *= 1;
                    data[j].hh_angle *= 1;
                    addData(chartForPosture, data[j].datetime.substring(0, 10), data[j].sh_angle.toFixed(2), data[j].hh_angle.toFixed(2));
                } else {
                    document.getElementById('myChart2').style.display = 'none';
                    document.getElementById('myChart').style.display = 'block';
                    data[j].maxangle *= 1;
                    addData(chart, data[j].datetime.substring(0, 10), data[j].maxangle.toFixed(2), data2[j]);
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

function getImage() {
    var str = $('#patient_id').text();
    var patient_id = str.substring(0, 7);
    var patient_jointdirection = setNumberingforJointdirection($("#drop2").val());
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
                // images
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
    var str = $('#patient_id').text();
    var patient_id = str.substring(0, 7);
    var patient_jointdirection = setNumberingforJointdirection($("#drop2").val());
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
                // images
                var screenshot_container = document.getElementById('screenshot_container');
                var div_container = document.createElement("div");
                var img_tag = document.createElement("img");

                img_tag.setAttribute("class", "img-responsive col-md-12 col-sm-12 col-xs-12");
                img_tag.setAttribute("width", "100%");
                img_tag.setAttribute("onclick", "paintOnImage(this.id)");
                img_tag.setAttribute("src", "http://" + ip + "/screenshot/" + data[i]);
                img_tag.setAttribute("alt", "There is no image");
                img_tag.setAttribute("id", "img_" + (i + 2));

                div_container.setAttribute("class", "div_container col-md-3 col-sm-4 col-xs-3");

                screenshot_container.appendChild(div_container);
                div_container.appendChild(img_tag);
            }

        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}



function getMovie() {
    var video_height = $('#collapseMovie').height();
    $('#video_select').css("max-height", video_height);
    var str = $('#patient_id').text();
    var patient_id = str.substring(0, 7);
    var patient_jointdirection = setNumberingforJointdirection($("#drop2").val());
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
                var fileName = data[i].split('_');
                //0:uid 1:jointdirection(number) 2:date(mm-dd-yyyy) 3:time(hh-mm-ss)
                var date = fileName[2].split('-');
                //0:mm 1:dd 2:yyyy
                var time = fileName[3].split('-');
                //0:hh 1:mm 2:ss

                var video_select_container = document.getElementById('video_select');

                var li_tag = document.createElement("li");
                li_tag.setAttribute("class", "list-group-item video_list list-group-item-action");
                li_tag.setAttribute("data-filename", data[i]);

                var h5_tag = document.createElement("h5");
                h5_tag.setAttribute("class", "mb-1");
                h5_tag.innerHTML = setNamingforJointdirection(fileName[1]);

                var p_tag = document.createElement("p");
                p_tag.setAttribute("class", "mb-1");
                p_tag.innerHTML = date[2] + '년 ' + date[0] + '월 ' + date[1] + '일 ' + time[0] + '시 ' + time[1] + '분';

                li_tag.appendChild(h5_tag);
                li_tag.appendChild(p_tag);
                video_select_container.appendChild(li_tag);

            }

            $(".video_list").click(function() {
                $(".video_list").removeClass('active');
                var select_fileName = $(this).attr('data-filename');
                $(this).addClass('active');
                selectMovie(select_fileName, patient_id);
                videoMethods.hideVideoPlayButton();
            });

        },
        error: function(request, status, error) {
            console.log(request, status, error);
        },
    });
}


function selectMovie(filename, patient_id) {
    $("#video_tag").remove();
    var video_container = document.getElementById('video_container');
    var video_tag = document.createElement('video');
    video_tag.setAttribute("id", "video_tag");
    video_tag.setAttribute("width", "100%");
    video_tag.setAttribute("controls", "");

    var source_tag = document.createElement('source');
    source_tag.setAttribute("id", "source_tag");
    source_tag.setAttribute("type", "video/mp4");
    source_tag.setAttribute("src", "http://" + ip + "/movie/" + filename);

    video_tag.appendChild(source_tag);
    video_container.appendChild(video_tag);

    $('#video_tag').get(0).play()
}

var checkdateid;


function setNrsRange(target,index) {

    var sheet = document.createElement('style'),
        $rangeInput = $('.range input'),
        prefs = ['webkit-slider-runnable-track', 'moz-range-track', 'ms-track'];

    document.body.appendChild(sheet);

    var getTrackStyle = function(el) {
        var curVal = el.value,
            val = (curVal - 1) * 10,
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
    if(target == 'submit'){   
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

function setNRS(target){
    setNrsRange('modify', 0);
  checkdateid = target.getAttribute('data-id');
  var status = target.getAttribute('data-status');
  if(status == 'modify'){
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

function paintOnImage(selectedImageId){
  var selectedImageSrc = document.getElementById(selectedImageId).src;
  var selectedImageHeight = document.getElementById(selectedImageId).height;
  var selectedImageWidth = document.getElementById(selectedImageId).width;
  var canvas = document.getElementById('imageCanvas');

  var selectedImageHudSrc = selectedImageSrc.replace("normal","hud");
  var selectedImageSkeletonSrc = selectedImageSrc.replace("normal","skeleton");

  $(".hudImg").attr("src",selectedImageHudSrc);
  $(".normalImg").attr("src",selectedImageSrc);
  $(".skeletonImg").attr("src",selectedImageSkeletonSrc);

  paper.setup(canvas);
  paper.install(window);

  var raster = new Raster(selectedImageSrc);
  raster.width = 852;
  raster.height = (raster.width*selectedImageHeight)/selectedImageWidth;
  raster.position = view.center;

  $('#paintingModal').modal('show');
}

$(".paintImgbtn").click(function() {
  var canvas = document.getElementById('imageCanvas');
  paper.setup(canvas);
  paper.install(window);
  var selectedtype = $(this).text();
  var selectedSrc = $("."+selectedtype+"Img").attr("src");
  var selectedImageHeight = 231;
  var selectedImageWidth = 412;

  var raster = new Raster(selectedSrc);
  raster.width = 852;
  raster.height = (raster.width*selectedImageHeight)/selectedImageWidth;
  raster.position = view.center;

});

function savePaintedImage(){
  var canvas = document.getElementById('imageCanvas');

  html2canvas($("#imageCanvas"), {
    onrendered: function (canvas) {
      var url = canvas.toDataURL();
      $("<a>", {
        href: url,
        download: "fileName"
      })
      .on("click", function() {$(this).remove()})
      .appendTo("body")[0].click()
    }
  });

}

function romPrint() {
    document.getElementById('myChart').style.width = "95%";
    document.getElementById('myChart').style.height = "100%";
    document.getElementById('myChart2').style.width = "95%";
    document.getElementById('myChart2').style.height = "100%";

    window.print();
}

function takeScreenShot() {

    html2canvas(document.getElementsByClassName("profile_details"), {
        onrendered: function(canvas) {
            var extra_canvas = document.createElement("canvas");
            extra_canvas.setAttribute('width', $('.profile_details').width() - 150);
            extra_canvas.setAttribute('height', $('.profile_details').height() - 20);
            var ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0);
            var dataURL = extra_canvas.toDataURL();
            var img = $(document.createElement('img'));
            img.attr('src', dataURL);
            img.attr('id', 'profile_details_img');
            img.attr('width', '100%');
            $('#savePart').append(img);
        },
    });

    html2canvas(document.getElementById("rom-data-chart-panel"), {
        onrendered: function(canvas) {
            var extra_canvas = document.createElement("canvas");
            extra_canvas.setAttribute('width', $('#rom-data-chart').width());
            extra_canvas.setAttribute('height', $('#rom-data-chart-panel').height() - 100);
            var ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0);
            var dataURL = extra_canvas.toDataURL();
            var img = $(document.createElement('img'));
            img.attr('src', dataURL);
            img.attr('id', 'rom-data-chart_id');
            img.attr('width', '100%');
            img.attr('height', '95%');
            $('#savePart').append(img);
        },
    });

    html2canvas(document.getElementById("rom-data-table"), {
        onrendered: function(canvas) {
            var extra_canvas = document.createElement("canvas");
            extra_canvas.setAttribute('width', $('#rom-data-table').width());
            extra_canvas.setAttribute('height', $('#rom-data-table').height());
            var ctx = extra_canvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0);
            var dataURL = extra_canvas.toDataURL();
            var img = $(document.createElement('img'));
            img.attr('src', dataURL);
            img.attr('id', 'rom-data-table_id');
            img.attr('width', '100%');
            img.attr('height', '95%');
            $('#savePart').append(img);
        },
    });

    html2canvas(document.getElementById("savePart"), {
        onrendered: function(canvas) {
            var canvasData = canvas.toDataURL("image/png");
            var patient_name = $("#patient_name").text();
            var patient_birth = $("#patient_birth").text();
            var patient_jointdirection = $("#drop2").val();

            if (patient_name == " -- ") {
                alert("환자를 선택해주세요")
            } else {
                var data = {
                    canvasData: canvasData,
                    patient_name: patient_name,
                    patient_birth: patient_birth,
                    patient_jointdirection: patient_jointdirection
                };
                $.ajax({
                    url: "http://" + ip + "/php/rom_web_php/post_capture_data.php",
                    type: 'POST',
                    data: data,
                    dataType: 'html',
                    success: function(data) {
                        alert(data);
                        $('#savePart').empty();
                    },
                    error: function(request, status, error) {
                        console.log(request, status, error);
                    },
                });
            }
        },
    });
}

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
        case "Left Knee Flexion / Extension":
            jointdirection = '61';
            break;
        case "Right Knee Flexion / Extension":
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
            jointdirection = 'Left Shoulder Abduction / Addunction';
            break;
        case "22":
            jointdirection = 'Right Shoulder Abduction / Addunction';
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
            jointdirection = 'Left Knee Flexion / Extension';
            break;
        case "62":
            jointdirection = 'Right Knee Flexion / Extension';
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
        default:
    }
    return jointdirection;
}
