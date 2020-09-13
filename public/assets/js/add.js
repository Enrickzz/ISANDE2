// remove any current navbar active classes
$(".navbar .nav-item.active").removeClass('active');
// add active class to proper navbar item that matches window.location
$('.navbar .nav-item a[href="' + location.pathname + '"]').closest('li').addClass('active');

$('nav a[href^="/' + location.pathname.split("/")[1] + '"]').addClass('active'); //this makes icons active