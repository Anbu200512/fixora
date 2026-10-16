/* Fixora - services page (filters, service sections, enquiry modal) */
(function () {
  'use strict';
  var Fixora = window.Fixora;

  var CATS = ['All'];
  function slug(id) { return id.replace('sv-', ''); }

  function serviceCard(s) {
    var problems = (s.problems || []).slice(0, 2).map(function (p) {
      return '<li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><i data-lucide="circle-check" class="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400"></i>' + Fixora.esc(p) + '</li>';
    }).join('');
    var process = (s.process || []).map(function (p, i) {
      return '<div class="flex gap-3"><span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">' + (i + 1) + '</span><p class="pt-0.5 text-sm text-slate-600 dark:text-slate-300">' + Fixora.esc(p) + '</p></div>';
    }).join('');
    return '' +
      '<article id="sv-' + slug(s.id) + '" class="fx-service-card group flex flex-col overflow-hidden rounded-3xl border border-brand-200 bg-[#fffdf8] shadow-sm dark:border-stone-700 dark:bg-stone-900" data-cat="' + Fixora.esc(s.name) + '">' +
      '  <div class="relative h-40 overflow-hidden bg-stone-200">' +
      '    <img src="' + s.image + '" alt="' + Fixora.esc(s.name) + ' service" class="h-full w-full object-cover transition duration-500 group-hover:scale-105" loading="lazy">' +
      '    <div class="absolute inset-0 bg-gradient-to-t from-stone-950/65 via-transparent to-transparent"></div>' +
      '    <span class="absolute bottom-4 start-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fffdf8] text-brand-700 shadow-lg"><i data-lucide="' + s.icon + '" class="h-5 w-5"></i></span>' +
      '    <span class="absolute end-4 top-4 rounded-full bg-[#fffdf8]/95 px-3 py-1.5 text-xs font-extrabold text-brand-800 shadow">From ' + Fixora.money(s.price) + '</span>' +
      '    <span class="absolute bottom-5 start-[4.25rem] text-xs font-bold uppercase tracking-wider text-white">' + Fixora.esc(s.name) + '</span>' +
      '  </div>' +
      '  <div class="flex flex-1 flex-col p-5 sm:p-6">' +
      '    <h3 class="text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">' + Fixora.esc(s.name) + '</h3>' +
      '    <p class="mt-2 line-clamp-2 text-sm leading-5 text-stone-600 dark:text-stone-300">' + Fixora.esc(s.desc) + '</p>' +
      '    <div class="mt-4 border-t border-brand-100 pt-3 dark:border-stone-700">' +
      '      <h4 class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-700 dark:text-brand-300"><i data-lucide="stethoscope" class="h-4 w-4"></i>Common fixes</h4>' +
      '      <ul class="mt-2 space-y-1.5">' + problems + '</ul>' +
      '    </div>' +
      '    <details class="group mt-3 rounded-xl border border-brand-200 dark:border-stone-700"><summary class="flex cursor-pointer items-center justify-between gap-3 px-3 py-2.5 text-xs font-bold text-stone-800 dark:text-stone-100">Diagnosis & repair steps<i data-lucide="chevron-down" class="h-4 w-4 shrink-0 transition group-open:rotate-180 rtl-flip"></i></summary>' +
      '      <div class="px-3 pb-3 pt-1"><p class="mb-3 text-xs leading-5 text-stone-600 dark:text-stone-300">' + Fixora.esc(s.diag) + '</p><div class="grid gap-2">' + process + '</div><p class="mt-3 text-[11px] font-semibold text-stone-500 dark:text-stone-400">Sample estimate; final quote after inspection.</p></div></details>' +
      '    <div class="mt-auto flex flex-wrap items-center gap-2 pt-4">' +
      '      <button class="fx-book-appliance inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 px-3 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-800" data-appliance="' + Fixora.esc(s.name) + '"><i data-lucide="calendar-check" class="h-4 w-4"></i>Book repair</button>' +
      '      <button class="fx-open-enquiry inline-flex items-center justify-center gap-2 rounded-xl border border-brand-200 px-3 py-2.5 text-sm font-bold text-stone-600 transition hover:bg-brand-50 hover:text-brand-800 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 dark:hover:text-brand-200" data-appliance="' + Fixora.esc(s.name) + '"><i data-lucide="message-square" class="h-4 w-4"></i><span class="hidden sm:inline">Ask</span></button>' +
      '    </div>' +
      '  </div>' +
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
    var q = 'dashboard.html?book=' + encodeURIComponent(appliance || '');
    location.href = q;
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
