const signUpSwitchBtn = document.querySelector('#sign-up-switch-btn');
const signInSwitchButton = document.querySelector('#sign-in-switch-btn');
const wrapper = document.querySelector('.wrapper');

signUpSwitchBtn.addEventListener('click', () => {
	wrapper.classList.add('right-panel-active');
});

signInSwitchButton.addEventListener('click', () => {
	wrapper.classList.remove('right-panel-active');
});
