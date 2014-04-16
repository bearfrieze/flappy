utilities = {
	setCookie: function(name, value, days) {
		var date = new Date();
		date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
		var expires = 'expires=' + date.toGMTString();
		document.cookie = name + '=' + value + '; ' + expires;
	},
	getCookie: function(name) {
		name = name + '=';
		var cookies = document.cookie.split(';');
		for(var i = 0; i < cookies.length; i++) {
			var cookie = cookies[i].trim();
			if (cookie.indexOf(name) == 0)
				return cookie.substring(name.length, cookie.length);
		}
		return '';
	},
	sinusRandom: function() {
		return 1 - Math.sin(Math.PI / 2 + Math.random() * (Math.PI / 2));
	}
}