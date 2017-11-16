window.onload = function() {
  
  document.getElementById("ct-content").setAttribute("style", "height:"+parseInt(document.getElementById("ct-content").offsetWidth)*0.7 +"px");
  document.getElementById("mri-content").setAttribute("style", "height:"+parseInt(document.getElementById("ct-content").offsetWidth)*0.7 +"px");
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

  $.ajax({
    url: "http://127.0.0.1/php/c2m_php/c2m.php",
    dataType: 'html',
    success: function(data){
      console.log("Run Python \n" + data);
    },
    error: function(request, status, error){
      console.log(request, status, error);
    },
  });
}



function fileOpen(){
  document.getElementById("btn-file").click();
}

function fileUpload(id){
  var ct_image = document.getElementById("ct-image");
  ct_image.setAttribute("src", "image/" + id.files[0].name);
   console.log(id.files[0].name);
}