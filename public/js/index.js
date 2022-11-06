/* eslint-disable */
import '@babel/polyfill';
import { displayMap } from './mapbox';
import { login, signout } from './login';
import { updateSettings } from './updateSettings';
import { signup } from './signup';
import { bookTour } from './stripe';
import { forgotPassword } from './forgot-password';
import { resetPassword } from './reset-password';

// DOM ELEMENTS
const mapBox = document.getElementById('map');
const forgotPasswordForm = document.querySelector('.forgot-password--login');
const resetPasswordForm = document.querySelector('.reset-password--login');
const loginForm = document.querySelector('.form--login');
const signupForm = document.querySelector('.form--signup');
const logoutButton = document.querySelector('.nav__el--logout');
const userDataForm = document.querySelector('.form-user-data');
const userPasswordForm = document.querySelector('.form-user-password');
const bookBtn = document.getElementById('book-tour');

if (mapBox) {
  const locations = JSON.parse(document.getElementById('map').dataset.locations);
  displayMap(locations);
}

if (loginForm)
  loginForm.addEventListener('submit', e => {
    e.preventDefault();

    document.querySelector('#btn-login').textContent = 'Please wait...';
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    login(email, password);
    document.querySelector('#btn-login').textContent = 'Login';
  });

if (forgotPasswordForm) {
  forgotPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('#forgot-password').textContent = 'Sending email...';
    const email = document.getElementById('email').value;

    forgotPassword(email);
    document.querySelector('#forgot-password').textContent = 'Send me an email';
  });
}
if (resetPasswordForm) {
  resetPasswordForm.addEventListener('submit', e => {
    e.preventDefault();
    const token = document.querySelector('.reset-password--login').dataset.tokenId;

    document.querySelector('#btn-reset-password').textContent = 'Updating...';
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('passwordConfirm').value;

    resetPassword(password, passwordConfirm, token);
    document.getElementById('password').value = '';
    document.getElementById('passwordConfirm').value = '';
    document.querySelector('#btn-reset-password').textContent = 'Reset Password';
  });
}

if (signupForm)
  signupForm.addEventListener('submit', e => {
    e.preventDefault();
    document.querySelector('#btn-signup').textContent = 'Please wait...';

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;

    signup(name, email, password, passwordConfirm);
    document.querySelector('#btn-signup').textContent = 'Signup';
  });
if (logoutButton) {
  logoutButton.addEventListener('click', signout);
}

if (userDataForm)
  userDataForm.addEventListener('submit', e => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', document.getElementById('name').value);
    form.append('email', document.getElementById('email').value);
    form.append('photo', document.getElementById('photo').files[0]);

    updateSettings(form, 'data');
  });

if (userPasswordForm)
  userPasswordForm.addEventListener('submit', async e => {
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent = 'Updating...';

    const passwordCurrent = document.getElementById('password-current').value;
    const password = document.getElementById('password').value;
    const passwordConfirm = document.getElementById('password-confirm').value;
    await updateSettings({ passwordCurrent, password, passwordConfirm }, 'password');

    document.querySelector('.btn--save-password').textContent = 'Save password';
    document.getElementById('password-current').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-confirm').value = '';
  });

if (bookBtn)
  bookBtn.addEventListener('click', e => {
    e.target.textContent = 'Processing...';
    const { tourId } = e.target.dataset;
    bookTour(tourId);
  });
