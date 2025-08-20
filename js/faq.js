(function() {
	const container = document.querySelector('[data-faq]');
	if (!container) return;
	const items = Array.from(container.querySelectorAll('.faq__item'));
	if (!items.length) return;

	function closeAll(except) {
		items.forEach((item) => {
			if (item === except) return;
			item.removeAttribute('open');
			const btn = item.querySelector('.faq__button');
			if (btn) btn.setAttribute('aria-expanded', 'false');
		});
	}

	items.forEach((item) => {
		const button = item.querySelector('.faq__button');
		const panel = item.querySelector('.faq__panel');
		if (!button || !panel) return;

		button.addEventListener('click', () => {
			const isOpen = item.hasAttribute('open');
			if (isOpen) {
				item.removeAttribute('open');
				button.setAttribute('aria-expanded', 'false');
			} else {
				closeAll(item);
				item.setAttribute('open', '');
				button.setAttribute('aria-expanded', 'true');
			}
		});

		// Keyboard support: Enter/Space toggles
		button.addEventListener('keydown', (e) => {
			const isEnter = e.key === 'Enter';
			const isSpace = e.key === ' ' || e.key === 'Spacebar' || e.code === 'Space';
			if (isEnter || isSpace) {
				e.preventDefault();
				button.click();
			}
		});
	});
})();


