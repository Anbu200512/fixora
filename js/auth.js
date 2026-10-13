/* Fixora - demo authentication (localStorage only, front-end demo) */
(function () {
  'use strict';
  var Fixora = window.Fixora;

  function ready(fn) {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
    else fn();
    var handled = false;
    document.addEventListener('fx:ready', function () { if (!handled) { handled = true; fn(); } });
  }

  Fixora.auth = {
    users: function () { return Fixora.get('fixora_users', []); },

    login: function (identifier, password) {
      identifier = (identifier || '').toString().trim().toLowerCase();
      if (!identifier || !password) return { ok: false, error: 'Enter your email/phone and password.' };
      var users = Fixora.auth.users();
      var user = users.find(function (u) {
        return (u.email && u.email.toLowerCase() === identifier) || (u.phone && u.phone.replace(/[\s-]/g, '').toLowerCase() === identifier.replace(/[\s-]/g, '').toLowerCase());
      });
      if (!user) return { ok: false, error: 'No account found with those details. Please sign up first.' };
      if (user.password !== password) return { ok: false, error: 'Incorrect password. Try again.' };
      var session = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: user.role, joined: user.joined, address: user.address || '' };
      Fixora.setCurrentUser(session);
      return { ok: true, user: session };
    },

    signup: function (data) {
      var name = (data.name || '').trim();
      var email = (data.email || '').trim().toLowerCase();
      var phone = (data.phone || '').trim();
      var password = data.password || '';
      if (name.length < 2) return { ok: false, error: 'Please enter your full name.' };
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: 'Please enter a valid email address.' };
      if (!/^[+\d][\d\s\-]{8,14}$/.test(phone)) return { ok: false, error: 'Please enter a valid phone number.' };
      if (password.length < 6) return { ok: false, error: 'Password must be at least 6 characters.' };
      var users = Fixora.auth.users();
      if (users.some(function (u) { return u.email.toLowerCase() === email; })) return { ok: false, error: 'An account with this email already exists. Please login.' };
      var user = {
        id: 'u-' + Fixora.uid().toLowerCase(),
        name: name, email: email, phone: phone, password: password, role: 'customer',
        joined: Fixora.today(), address: data.address || ''
      };
      users.push(user);
      Fixora.set('fixora_users', users);
      Fixora.pushNotification({ userId: user.id, title: 'Welcome to Fixora', message: 'Your Fixora account was created. Book your first repair today.' });
      var session = { id: user.id, name: user.name, email: user.email, phone: user.phone, role: 'customer', joined: user.joined, address: user.address };
      Fixora.setCurrentUser(session);
      return { ok: true, user: session };
    },

    logout: function () {
      Fixora.setCurrentUser(null);
    },

    loggedIn: function () { return !!Fixora.currentUser(); },

    require: function (role) {
      var u = Fixora.currentUser();
      if (!u) { location.href = 'login.html'; return null; }
      if (role && u.role !== role) {
        location.href = u.role === 'admin' ? 'admin-dashboard.html' : 'dashboard.html';
        return null;
      }
      return u;
    }
  };

  /* ---------- password visibility toggle ---------- */
  Fixora.bindPasswordToggles = function (scope) {
    (scope || document).querySelectorAll('[data-pw-toggle]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var input = document.getElementById(btn.getAttribute('data-pw-toggle'));
        if (!input) return;
        var show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        var icon = btn.querySelector('[data-lucide]');
        if (icon) icon.setAttribute('data-lucide', show ? 'eye-off' : 'eye');
        if (window.lucide) lucide.createIcons();
        input.focus();
      });
    });
  };

  /* ---------- shared form error helper ---------- */
  Fixora.setFieldError = function (input, msg) {
    var wrap = input.closest('[data-field]');
    if (!wrap) return;
    var err = wrap.querySelector('[data-field-error]');
    var ok = !msg;
    wrap.classList.toggle('error', !ok);
    if (err) { err.textContent = msg || ''; err.classList.toggle('hidden', ok); }
    input.classList.toggle('border-rose-400', !ok);
    input.classList.toggle('focus:ring-rose-200', !ok);
  };

  Fixora.clearFieldErrors = function (scope) {
    (scope || document).querySelectorAll('[data-field]').forEach(function (f) {
      f.classList.remove('error');
      var err = f.querySelector('[data-field-error]');
      if (err) err.classList.add('hidden');
      var inp = f.querySelector('input,textarea,select');
      if (inp) { inp.classList.remove('border-rose-400'); inp.classList.add('border-slate-300', 'dark:border-slate-600'); }
    });
  };

  void ready;
})();