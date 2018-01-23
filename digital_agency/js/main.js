$(window).scroll(function(){
	if($('.navbar').offset().top > 50){
		$('.navbar-fixed-top').addClass('top-nav-collapse');
	} else {
		$('.navbar-fixed-top').removeClass('top-nav-collapse');
	}
});

$(function(){
	$('a.page-scroll').click(function(){
		var $anchor = $(this);
		$('html, body').animate({
			scrollTop: $($anchor.attr('href')).offset().top
		}, 1500, 'easeInOutCubic');
		event.preventDefault();
	});
});
