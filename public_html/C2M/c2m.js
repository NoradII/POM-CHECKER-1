window.onload = function() {
  
  document.getElementById("ct-content").setAttribute("style", "height:"+parseInt(document.getElementById("ct-content").offsetWidth)*0.7 +"px");
  document.getElementById("mri-content").setAttribute("style", "height:"+document.getElementById("ct-content").style.height);
  document.getElementById("ct-image").style.height = document.getElementById("ct-image").offsetWidth;
  document.getElementById("generated-mri-image").style.height = document.getElementById("generated-mri-image").offsetWidth;

  var ctProgressbar = new ProgressBar.Circle('#ct-progress-bar', {
      color: '#EB5244',
      trailColor: '#151D23',
      duration: 1500,
      easing: 'easeInOut',
      strokeWidth: 20, //두께
      text: {
        className: 'progressbar_ct_label',
        autoStyleContainer: true
      },
      step: function(state, circle) {
        var value = Math.round(circle.value() * 100);
        if(value === 0) {
          circle.setText('');
        }else {
          circle.setText(value);
        }
      },
      warnings: false
  });
  
  var ctProgressBarContainer = document.getElementById('ct-progress-bar');
  var ctProgressBarText = document.createElement('div');
  ctProgressBarText.setAttribute("id", "ct-progress-bar-text");
  ctProgressBarText.innerHTML = "CT" //style 
  ctProgressBarContainer.appendChild(ctProgressBarText);
  
  ctProgressbar.text.style.fontSize= '2.6rem'; //숫자 폰트 크기
  ctProgressbar.text.style.marginTop = '17px';
  ctProgressbar.text.style.fontWeight = 'bold';
  var ctPercent = 80
  ctProgressbar.animate(ctPercent/100);

  var mrProgressbar = new ProgressBar.Circle('#mr-progress-bar', {
      color: '#EB5244',
      trailColor: '#151D23',
      duration: 1500,
      easing: 'easeInOut',
      strokeWidth: 20,
      text: {
        className: 'progressbar_mr_label',
        autoStyleContainer: true
      },
      step: function(state, circle) {
                
        var value = Math.round(circle.value() * 100);
        if(value === 0) {
          circle.setText('');
        }else {
          circle.setText(value);
        }
      },
      warnings: false,
      
  });
  
  var mrProgressBarContainer = document.getElementById('mr-progress-bar');
  var mrProgressBarText = document.createElement('div');
  mrProgressBarText.setAttribute("id", "mr-progress-bar-text");
  mrProgressBarText.innerHTML = "MRI"
  mrProgressBarContainer.appendChild(mrProgressBarText);
  
  var mrPercent = 40;
  mrProgressbar.text.style.fontSize= '2.6rem';
  mrProgressbar.text.style.fontWeight = 'bold';
  mrProgressbar.text.style.marginTop = '17px';
  mrProgressbar.animate(mrPercent/100);

}

function fileOpen(){
  document.getElementById("btn-file").click();
}

var ct_image_path;
function fileUpload(id){
  var ct_image = document.getElementById("ct-image");
  ct_image_path = "Image/" + id.files[0].name;
  ct_image.setAttribute("src", ct_image_path);
  ct_image_path = "./" + ct_image_path;
}

function fileGenerate(){
  if(ct_image_path == null){
    alert("Select Image");
  }
  else{
    var data = {ct_image_path : ct_image_path};
    document.getElementById("loadingImage").style.display = "block";

    $.ajax({
      url: "http://127.0.0.1/C2M/c2m.php",
      type: 'POST',
      data: data,
      dataType: 'html',
      success: function(data){
        document.getElementById("loadingImage").style.display = "none";

        var data_array = data.split("\n");
        var result_image_path = data_array[0];
        var processing_time = data_array[1];
        
        document.getElementById("processing-time").innerHTML = processing_time;
        
        var mri_image = document.getElementById("generated-mri-image");
        mri_image.setAttribute("src", result_image_path);
      },
      error: function(request, status, error){
        console.log("Error " + error);
      },
    });
  }
  
}