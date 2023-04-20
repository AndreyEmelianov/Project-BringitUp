export default class ShowInfo {
	constructor(triggersSelector) {
		this.btns = document.querySelectorAll(triggersSelector);
	}

	init() {
		this.btns.forEach((btn) => {
			btn.addEventListener('click', () => {
				const sibling = btn.closest('.module__info-show').nextElementSibling;

				sibling.classList.add('animated', 'fadeIn');
				sibling.classList.toggle('msg');
				sibling.style.marginTop = '20px';
			});
		});
	}
}
