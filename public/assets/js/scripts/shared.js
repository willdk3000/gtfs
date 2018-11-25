const API_URL = getHostURL();
const AUTH_URL = `${API_URL}/auth`

function getHostURL() {
    if (window.location.host.indexOf('localhost') != -1) {
      return 'http://localhost:8000';
    } else {
      return 'https://gtfscool.com';
    }
  }

function getUserFromForm() {
  const email = $('#email').val();
  const password = $('#password').val();

  const user = {
    email,
    password
  };

  return user;
}

function logout() {
  window.localStorage.removeItem('user_id');
  $.get(`${AUTH_URL}/logout`)
    .then(result => {
      window.location= '/login.html';
    })
}

function redirectIfLoggedIn() {
  if(window.localStorage.user_id) {
    window.location = `/user.html?id=${window.localStorage.user_id}`;
  }
}

function setIdRedirect (result) {
  window.localStorage.user_id = result.id;
  window.location = `/user.html?id=${result.id}`
}