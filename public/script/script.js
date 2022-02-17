const signUpSwitchBtn = document.querySelector('#sign-up-switch-btn');
const signInSwitchButton = document.querySelector('#sign-in-switch-btn');
const wrapper = document.querySelector('.wrapper');

signUpSwitchBtn.addEventListener('click', () => {
	wrapper.classList.add('right-panel-active');
});

signInSwitchButton.addEventListener('click', () => {
	wrapper.classList.remove('right-panel-active');
});

const signUpBtn = document.querySelector('.signup-submit-btn');
const signInBtn = document.querySelector('.signin-submit-btn');

signUpBtn.onclick = signUp;
signInBtn.onclick = signIn;

async function signUp(e) {
	e.preventDefault();

	const formSignUp = document.querySelector('#signup');
	const errorsList = formSignUp.querySelector('.error-input-list');
	errorsList.innerHTML = '';

	let formData = new FormData(formSignUp);

	let Params = {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			firstName: formData.get('firstName'),
			lastName: formData.get('lastName'),
			gender: formData.get('gender'),
			telephone: formData.get('telephone'),
			email: formData.get('email'),
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword')
		}),
		method: "POST"
	};

	await fetch('/sign-up', Params)
		.then(response => response.json())
		.then(data => {
			if (data.ok){
				window.location.href = 'http://localhost:1604/success.html';
			} else {
				if (data.errors.length > 0) {
					data.errors.forEach((elem) => {
						let elementError = `<div class="error-item">*${elem.msg}</div>`;
						errorsList.innerHTML += elementError;
					})
				}
			}
		})
		.catch(error => console.log(error));
}

async function signIn(e) {
	// e.preventDefault();

	const formSignIn = document.querySelector('#signin');
	const errorsList = formSignIn.querySelector('.error-input-list');
	errorsList.innerHTML = '';

	let formData = new FormData(formSignIn);

	let Params = {
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			email: formData.get('email'),
			password: formData.get('password')
		}),
		method: "POST"
	};

	await fetch('/sign-in', Params)
		.then(response => response.json())
		.then(data => {
			console.log(data);
			if (data.ok){
				window.location.href = 'http://localhost:1604/success.html';
			} else {
				if (data.errors) {
					let elementError = `<div class="error-item">*${data.errors}</div>`;
					errorsList.innerHTML += elementError;
				}
			}
		})
		.catch(error => console.log(error));
}
