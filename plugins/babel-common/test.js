Object.keys(window.__coverage__).forEach(function (key) {
  window.__coverage__[key].dsn = 'http://collect.canyon-v2.fws.qa.nt.ctripcorp.com/coverage/client';
});
