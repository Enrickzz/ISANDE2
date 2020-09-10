

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
