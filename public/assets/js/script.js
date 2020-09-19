// remove any current navbar active classes
$(".navbar .nav-item.active").removeClass('active');
// add active class to proper navbar item that matches window.location
$('.navbar .nav-item a[href="' + location.pathname + '"]').closest('li').addClass('active');

$('nav a[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active'); //this makes icons active


// PASSWORD VALIDATION 
var password = document.getElementById("password");
var confirmPassword = document.getElementById("confirmpassword");

function validatePassword(){
  if(password.value != confirmPassword.value) {
    confirmPassword.setCustomValidity("Passwords Don't Match");
  } else {
    confirmPassword.setCustomValidity('');
  }
}
password.onchange = validatePassword;
confirmPassword.onkeyup = validatePassword;

    // // POST called for registration
    // $('#addUser').click(function() {
    //   // Get the data from the form
    //   var utype = $("#utype option:selected").val(); // Text of the selected value
    //   var fname = $('#fname').val();
    //   var lname = $('#lname').val();
    //   var mnum = $('#mnum').val();
    //   var email = $('#email').val();
    //   var pword = $('#pword').val();
    //   var branch = $('#branch').val();

    //   var newUser = {
    //     usertype: utype,
    //     first_name: fname,
    //     last_name: lname,
    //     mobileno: mnum,
    //     email: email,
    //     password: pword,
    //     branch: branch
    //   };

    //   $.post('/register', newUser, function(data, status) {
    //     console.log(data);

    //     if (data.success) {
    //       $('#msg').text(data.message);
    //       $('#msg').removeClass('fail');
    //       $('#msg').addClass('success');

    //       $('#utype').val('');
    //       $('#uname').val('');
    //       $('#fname').val('');
    //       $('#lname').val('');
    //       $('#email').val('');
    //       $('#pword').val('');
    //       alert("Successfully registered!");
    //     } else {
    //       $('#msg').text(data.message);
    //       $('#msg').removeClass('success');
    //       $('#msg').addClass('fail');
    //       //alert("Registration failed!");
    //     }

    //   });
    // });