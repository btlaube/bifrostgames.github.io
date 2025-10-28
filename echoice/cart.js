function checkout(stripeLink) {
  // Optional: store last product for thank-you page display
  localStorage.setItem('lastProduct', stripeLink);
  window.location.href = stripeLink;
}
