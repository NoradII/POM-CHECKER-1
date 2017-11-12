window.onload = function() {
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