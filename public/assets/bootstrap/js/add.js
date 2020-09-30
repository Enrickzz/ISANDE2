

function opentab(tabname , thisbtn,page) {
    var i;
    var x = document.getElementsByClassName("card-body");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(tabname).style.display = "block";
    
    var z = document.getElementsByClassName("nav-link");
    for(i=0; i< z.length; i++){
      z[i].classList.remove("active");
    }
    y=document.getElementById(page);
    y.classList.add("active");
    thisbtn.classList.add("active");
  }
function activateNav(tabname){
  var x = document.getElementsByClassName("nav-link");

  var i;
  for(i=0; i < x.length;i++){
    x[i].classList.remove("active");
  }
  var active = document.getElementById(tabname);
  active.classList.add("active");


}
  

$( document ).ready(function() {
  $('.dropdown-menu li').on('click', function(event){
  //The event won't be propagated to the document NODE and 
  // therefore events delegated to document won't be fired
     event.stopPropagation();
   });
  
   $('.dropdown-menu li').on('click', function(event){
     //The event won't be propagated to the document NODE and 
     // therefore events delegated to document won't be fired
     event.stopPropagation();
   });
  
   $('.dropdown-menu > ul > li > a').on('click', function(event){
    event.stopPropagation();
    $(this).tab('show')
   });
  });
  