$(document).ready(function()
{
	$('[data-trigger]').on('click', function()
	{
		var target = $(this).attr('data-trigger');

		target = $('#'+target).offset().top - 50;

		$('html, body').animate({scrollTop : target});
	});
});