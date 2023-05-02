import axios from 'axios'

function getCookie(name) {
  return (document.cookie.match('(?:^|;)\\s*' + name.trim() + '\\s*=\\s*([^;]*?)\\s*(?:;|$)') || [])[1];
}

const http = axios.create({
  withCredentials: true
})

http.interceptors.request.use(function (config) {
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(config.method.toUpperCase())) {
    const csrf_token = getCookie('csrf_access_token')
    if (csrf_token) config.headers['X-CSRF-Token'] = csrf_token
  }
  return config;
});

export default http
