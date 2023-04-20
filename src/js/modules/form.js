export default class Form {
	constructor(forms) {
		this.forms = document.querySelectorAll(forms);
		this.inputs = document.querySelectorAll('input');
		this.message = {
			loading: 'Загрузка...',
			success: 'Спасибо! Скоро мы с вами свяжемся!',
			failure: 'Что-то пошло не так...',
		};
		this.path = 'asset/question.php';
	}

	clearInputs() {
		this.inputs.forEach((input) => {
			input.value = '';
		});
	}

	checkMailInputs() {
		const mailInputs = document.querySelectorAll('[type="email"]');

		mailInputs.forEach((input) => {
			input.addEventListener('keypress', function (e) {
				if (e.key.match(/[^a-z 0-9 @ \.]/gi)) {
					e.preventDefault();
				}
			});
		});
	}

	initMask() {
		let setCursosPosition = (pos, element) => {
			element.focus();

			if (element.setSelectionRange) {
				element.setSelectionRange(pos, pos);
			} else if (element.createTextRange) {
				let range = element.createTextRange();

				range.collapse(true);
				range.moveEnd('character', pos);
				range.moveStart('character', pos);
				range.select();
			}
		};

		function createMask(event) {
			let matrix = '+1 (___) ___-____',
				i = 0,
				def = matrix.replace(/\D/g, ''),
				value = this.value.replace(/\D/g, '');

			if (def.length >= value.length) {
				value = def;
			}

			this.value = matrix.replace(/./g, function (symb) {
				return /[_\d]/.test(symb) && i < value.length
					? value.charAt(i++)
					: i >= value.length
					? ''
					: symb;
			});

			if (event.type === 'blur') {
				if (this.value.length == 2) {
					this.value = '';
				}
			} else {
				setCursosPosition(this.value.length, this);
			}
		}

		let inputs = document.querySelectorAll('[name="phone"]');

		inputs.forEach((input) => {
			input.addEventListener('input', createMask);
			input.addEventListener('focus', createMask);
			input.addEventListener('blur', createMask);
		});
	}

	async postData(url, data) {
		let res = await fetch(url, {
			method: 'POST',
			body: data,
		});

		return await res.text();
	}

	init() {
		this.checkMailInputs();
		this.initMask();

		this.forms.forEach((form) => {
			form.addEventListener('submit', (e) => {
				e.preventDefault();

				let statusMessage = document.createElement('div');
				statusMessage.style.cssText = `
					margin-top: 15px;
					font-size: 18px;
					color: grey;
				`;
				form.parentNode.appendChild(statusMessage);

				statusMessage.textContent = this.message.loading;

				const formData = new FormData(form);

				this.postData(this.path, formData)
					.then((res) => {
						console.log(res);
						statusMessage.textContent = this.message.success;
					})
					.catch(() => {
						statusMessage.textContent = this.message.failure;
					})
					.finally(() => {
						this.clearInputs();
						setTimeout(() => {
							statusMessage.remove();
						}, 6000);
					});
			});
		});
	}
}
