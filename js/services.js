/* Fixora - services page (filters, service sections, enquiry modal) */
(function () {
  'use strict';
  var Fixora = window.Fixora;

  var CATS = ['All'];
  function slug(id) { return id.replace('sv-', ''); }

  function serviceCard(s) {
    var problems = (s.problems || []).map(function (p) {
      return '<li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><i data-lucide="circle-check" class="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400"></i>' + Fixora.esc(p) + '</li>';
    }).join('');
    var process = (s.process || []).map(function (p, i) {
      return '<div class="flex gap-3"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">' + (i + 1) + '</span><p class="pt-0.5 text-sm text-slate-600 dark:text-slate-300">' + Fixora.esc(p) + '</p></div>';
    }).join('');
    return '' +
      '<article id="sv-' + slug(s.id) + '" class="fx-service-card rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900" data-cat="' + Fixora.esc(s.name) + '">' +
      '  <div class="grid md:grid-cols-2">' +
      '    <div class="relative min-h-[220px] md:min-h-[300px]"><img src="' + s.image + '" alt="' + Fixora.esc(s.name) + ' service" class="absolute inset-0 h-full w-full object-cover md:rounded-s-2xl" loading="lazy"></div>' +
      '    <div class="p-6 md:p-8">' +
      '      <div class="flex flex-wrap items-center justify-between gap-3">' +
      '        <span class="flex items-center gap-2.5">' +
      '          <span class="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-teal-600 text-white"><i data-lucide="' + s.icon + '" class="h-5 w-5"></i></span>' +
      '          <h3 class="text-xl font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(s.name) + '</h3></span>' +
      '        <span class="rounded-full bg-teal-50 px-3 py-1 text-sm font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300">From ' + Fixora.money(s.price) + '</span>' +
      '      </div>' +
      '      <p class="mt-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">' + Fixora.esc(s.desc) + '</p>' +
      '      <div class="mt-4 grid gap-6 md:grid-cols-2">' +
      '        <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Common problems</h4><ul class="mt-2 space-y-2">' + problems + '</ul></div>' +
      '        <div class="rounded-xl bg-slate-50 p-4 dark:bg-slate-800/60"><h4 class="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"><i data-lucide="search" class="h-3.5 w-3.5"></i>Inspection & diagnosis</h4>' +
      '          <p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">' + Fixora.esc(s.diag) + '</p>' +
      '          <p class="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"><i data-lucide="info" class="h-3.5 w-3.5"></i>Prices are sample estimates</p></div>' +
      '      </div>' +
      '      <details class="group mt-5 rounded-xl border border-slate-200 dark:border-slate-700"><summary class="flex cursor-pointer items-center justify-between px-4 py-3 text-sm font-bold text-slate-800 dark:text-slate-100">Our repair process<i data-lucide="chevron-down" class="h-4 w-4 transition group-open:rotate-180 rtl-flip"></i></summary>' +
      '        <div class="grid gap-3 px-4 pb-4 pt-1 sm:grid-cols-2">' + process + '</div></details>' +
      '      <div class="mt-6 flex flex-wrap gap-3">' +
      '        <button class="fx-book-appliance inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800" data-appliance="' + Fixora.esc(s.name) + '"><i data-lucide="calendar-check" class="h-4 w-4"></i>Book Repair</button>' +
      '        <button class="fx-open-enquiry inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800" data-appliance="' + Fixora.esc(s.name) + '"><i data-lucide="message-square" class="h-4 w-4"></i>Ask a Question</button>' +
      '      </div>' +
      '    </div></div>' +
      '</article>';
  }

  function renderServices() {
    var list = Fixora.get('fixora_services', []);
    var wrap = document.getElementById('fxServicesList');
    if (!wrap) return;
    list.forEach(function (s) { CATS.push(s.name); });
    CATS = Array.from(new Set(CATS));
    var tabs = CATS.map(function (c, i) {
      return '<button class="fx-cat-tab rounded-full px-4 py-2 text-sm font-bold transition ' + (i === 0 ? 'fx-tab-active' : 'bg-white text-slate-700 border border-slate-300 hover:border-blue-400 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600') + '" data-cat="' + Fixora.esc(c) + '">' + Fixora.esc(c) + '</button>';
    }).join('');
    var tabsEl = document.getElementById('fxServiceTabs');
    if (tabsEl) tabsEl.innerHTML = tabs;
    wrap.innerHTML = list.map(serviceCard).join('');
    bindTabs();
    if (window.lucide) lucide.createIcons();
  }

  function bindTabs() {
    document.querySelectorAll('.fx-cat-tab').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var cat = tab.getAttribute('data-cat');
        document.querySelectorAll('.fx-cat-tab').forEach(function (t) { t.classList.remove('fx-tab-active'); t.classList.add('bg-white','text-slate-700','border','border-slate-300','hover:border-blue-400'); });
        tab.classList.add('fx-tab-active');
        tab.classList.remove('bg-white','text-slate-700','border','border-slate-300','hover:border-blue-400');
        document.querySelectorAll('.fx-service-card').forEach(function (card) {
          var show = cat === 'All' || card.getAttribute('data-cat') === cat;
          card.style.display = show ? '' : 'none';
        });
        var first = document.querySelector('.fx-service-card');
        if (first && cat !== 'All') first.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ---------- enquiry modal ---------- */
  function renderEnquiryFields(sel) {
    var appliance = Fixora.get('fixora_services', []).map(function (s) { return s.name; });
    var opts = ['Select appliance type'].concat(appliance).map(function (a, i) {
      return '<option value="' + (i === 0 ? '' : Fixora.esc(a)) + '"' + (i === 0 ? ' disabled selected' : '') + '>' + Fixora.esc(i === 0 ? a : a) + '</option>';
    }).join('');
    var dateOptions = Fixora.bookings.nextDates(8).map(function (d) {
      return '<option value="' + d + '">' + Fixora.weekdayLabel(d) + '</option>';
    }).join('');
    var slotOptions = Fixora.SLOTS.map(function (s) { return '<option value="' + Fixora.esc(s) + '">' + Fixora.esc(s) + '</option>'; }).join('');
    sel.innerHTML =
      '<div class="grid gap-4 sm:grid-cols-2">' +
      '  <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name *</label><input id="enqName" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="Your name"><p data-field-error class="hidden"></p></div>' +
      '  <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone *</label><input id="enqPhone" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="+91 XXXXX XXXXX"><p data-field-error class="hidden"></p></div>' +
      '  <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email *</label><input id="enqEmail" type="email" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="you@example.com"><p data-field-error class="hidden"></p></div>' +
      '  <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Appliance Type *</label><select id="enqAppliance" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + opts + '</select><p data-field-error class="hidden"></p></div>' +
      '  <div class="sm:col-span-2" data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Problem Description *</label><textarea id="enqProblem" rows="3" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="What seems to be the problem?"></textarea><p data-field-error class="hidden"></p></div>' +
      '  <div class="sm:col-span-2" data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Service Address *</label><input id="enqAddress" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="Flat / street / city"><p data-field-error class="hidden"></p></div>' +
      '  <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Preferred Date *</label><select id="enqDate" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + dateOptions + '</select><p data-field-error class="hidden"></p></div>' +
      '  <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Preferred Time *</label><select id="enqTime" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + slotOptions + '</select><p data-field-error class="hidden"></p></div>' +
      '  <div class="sm:col-span-2" data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Additional Notes</label><input id="enqNotes" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="Optional brand / model details"><p data-field-error class="hidden"></p></div>' +
      '</div>';
  }

  function submitEnquiry(e) {
    e.preventDefault();
    var fields = { name: 'enqName', phone: 'enqPhone', email: 'enqEmail', appliance: 'enqAppliance', problem: 'enqProblem', address: 'enqAddress', date: 'enqDate', time: 'enqTime', notes: 'enqNotes' };
    var valid = true;
    Fixora.clearFieldErrors(document.getElementById('fxEnquiryModal'));
    Object.keys(fields).forEach(function (k) {
      var el = document.getElementById(fields[k]);
      if (!el) return;
      var v = el.value.trim();
      if (['name', 'phone', 'email', 'appliance', 'problem', 'address', 'date', 'time'].indexOf(k) > -1 && !v) {
        Fixora.setFieldError(el, 'This field is required.');
        valid = false;
      }
      if (k === 'email' && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { Fixora.setFieldError(el, 'Enter a valid email address.'); valid = false; }
      if (k === 'phone' && v && !/^[+\d][\d\s\-]{8,14}$/.test(v)) { Fixora.setFieldError(el, 'Enter a valid phone number.'); valid = false; }
    });
    if (!valid) { Fixora.toast('Please fix the highlighted fields.', 'error'); return; }
    var enquiry = {
      id: 'e' + Fixora.uid().toLowerCase(),
      name: document.getElementById('enqName').value.trim(),
      phone: document.getElementById('enqPhone').value.trim(),
      email: document.getElementById('enqEmail').value.trim(),
      appliance: document.getElementById('enqAppliance').value,
      problem: document.getElementById('enqProblem').value.trim(),
      address: document.getElementById('enqAddress').value.trim(),
      date: document.getElementById('enqDate').value,
      time: document.getElementById('enqTime').value,
      notes: document.getElementById('enqNotes').value.trim(),
      createdAt: new Date().toISOString(),
      status: 'New'
    };
    var list = Fixora.get('fixora_enquiries', []);
    list.unshift(enquiry);
    Fixora.set('fixora_enquiries', list);
    Fixora.closeModal('fxEnquiryModal');
    Fixora.toast('Thank you! Your enquiry has been noted. (Demo — no real message sent).', 'success');
    e.target.reset();
  }

  function bindOpenEnquiry(hint) {
    document.querySelectorAll('.fx-open-enquiry').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var wrapper = document.getElementById('fxEnquiryModal');
        renderEnquiryFields(wrapper.querySelector('#fxEnquiryFields'));
        var vl = document.getElementById('enqAppliance');
        if (btn.getAttribute('data-appliance') && vl) {
          var found = Array.prototype.find.call(vl.options, function (o) { return o.value === btn.getAttribute('data-appliance'); });
          if (found) vl.value = found.value;
        }
        Fixora.openModal('fxEnquiryModal');
      });
    });
  }

  Fixora.bookService = function (appliance) {
    var u = Fixora.currentUser();
    var q = 'dashboard.html?book=' + encodeURIComponent(appliance || '');
    if (u) location.href = q;
    else location.href = 'login.html?next=' + encodeURIComponent(q);
  };

  function bindBookButtons() {
    document.querySelectorAll('.fx-book-appliance').forEach(function (btn) {
      btn.addEventListener('click', function () {
        Fixora.bookService(btn.getAttribute('data-appliance'));
      });
    });
  }

  function boot() {
    renderServices();
    bindBookButtons();
    bindOpenEnquiry();
    var form = document.getElementById('fxEnquiryForm');
    if (form) form.addEventListener('submit', submitEnquiry);
  }

  if (Fixora.bootReady) boot();
  else document.addEventListener('fx:ready', boot, { once: true });
})();