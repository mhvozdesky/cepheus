window.addEventListener("load", function() {
(function($) {
	function getCookie(name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}

	$('.send-email-btn').on('click', function(event) {
		var data = $(this).data();
		var url = window.location.origin + '/accounts/send-email/';
		$.ajaxSetup({
			headers: {'X-CSRFToken': getCookie('csrftoken')}
		});
		$.post(url, data).always(function() { window.location.reload(); });
	});
})(django.jQuery);
})
