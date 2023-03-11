/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alert';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(
  'pk_test_51JUSXrSAVvF4YxNhcdpjojORGmpIzM508hKnHylWsGLO9c4GwUeZ1a4SRhh9iVa3Ir9U03CUrnrbx4qHQ1joLcQX000PsgXcVu'
);

// const stripe = Stripe(
//   'pk_test_51JUFepSJXrXaVcPCfneYKsWpsPDY01063IN5ggEfcckg1W56iXJr16XruMtrGLP0QNFZ0GWKjfL5auSBCbFczRJQ00pgDKfqBB'
// );
export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const stripe = await stripePromise;
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
