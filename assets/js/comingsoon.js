(function initComingSoon() {
	const days = document.getElementById('cs-days');
	const hours = document.getElementById('cs-hours');
	const mins = document.getElementById('cs-mins');
	const secs = document.getElementById('cs-secs');
	const countdown = document.querySelector('.cs-countdown');
	const msg = document.getElementById('cs-msg');
	const input = document.getElementById('cs-email');

	if (!days || !hours || !mins || !secs || !countdown) {
		return;
	}

	const launchDate = new Date('Dec 31, 2026 00:00:00').getTime();

	function updateCountdown() {
		const gap = launchDate - Date.now();

		if (gap <= 0) {
			countdown.innerHTML = '<p style="color:var(--clr-accent);font-size:22px;font-weight:700">We have launched!</p>';
			return;
		}

		const d = Math.floor(gap / (1000 * 60 * 60 * 24));
		const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
		const s = Math.floor((gap % (1000 * 60)) / 1000);

		days.textContent = String(d).padStart(2, '0');
		hours.textContent = String(h).padStart(2, '0');
		mins.textContent = String(m).padStart(2, '0');
		secs.textContent = String(s).padStart(2, '0');
	}

	window.handleNotify = function handleNotify(event) {
		event.preventDefault();
		if (!input || !msg) return;

		const email = input.value.trim();
		if (!email) {
			msg.textContent = 'Please enter a valid email address.';
			return;
		}

		msg.textContent = "Thanks. We'll notify you at " + email + '.';
		input.value = '';
	};

	updateCountdown();
	setInterval(updateCountdown, 1000);
})();
