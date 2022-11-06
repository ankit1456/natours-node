/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';

export const forgotPassword = async email => {
  try {
    const res = await axios({
      method: 'POST',
      url: '/api/v1/users/forgotPassword',
      data: {
        email
      }
    });

    if (res.data.status === 'success') {
      showAlert('success', 'We just sent you an password reset link on your email 🙂');
      // window.setTimeout(() => {
      //   location.assign('/');
      // }, 1000);
    }
  } catch (err) {
    showAlert('error', `${err.response.data.message} 😶`);
  }
};
