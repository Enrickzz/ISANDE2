

function opentab(tabname) {
    var i;
    var x = document.getElementsByClassName("card-body");
    for (i = 0; i < x.length; i++) {
      x[i].style.display = "none";
    }
    document.getElementById(tabname).style.display = "block";
  }