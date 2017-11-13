window.onload = function() {
  var ct_progress_bar = document.getElementById("ct-progress-bar");
  var mri_progress_bar = document.getElementById("mri-progress-bar");  
  move(ct_progress_bar, 20);
  move(mri_progress_bar, 80);

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

function move(elem, maxwidth) {
    var width = 0;
    var id = setInterval(frame, 10);
    function frame() {
        if (width >= maxwidth) {
            clearInterval(id);
        } else {
            width++; 
            elem.style.width = width * 1 + '%'; 
            elem.innerHTML = width * 1 + '%';
            elem.setAttribute("aria-valuenow", width * 1);
        }
    }
}

function fileOpen(){
  document.getElementById("btn-file").click();
}

function fileUpload(id){
  var ct_image = document.getElementById("ct-image");
  ct_image.setAttribute("src", "image/" + id.files[0].name);
   console.log(id.files[0].name);
}