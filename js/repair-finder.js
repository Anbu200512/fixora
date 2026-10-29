(function () {
  'use strict';
  var Fixora = window.Fixora;

  var PRICING_IDS = {
    'sv-fridge': 'p-fridge',
    'sv-washing': 'p-washing',
    'sv-ac': 'p-ac',
    'sv-tv': 'p-tv',
    'sv-microwave': 'p-microwave',
    'sv-dishwasher': 'p-dishwasher',
    'sv-geyser': 'p-geyser',
    'sv-oven': 'p-oven'
  };

  var selectedId = '';
  var selectedIssue = '';
  var els = null;

  function services() {
    return Fixora.get('fixora_services', []).filter(function (service) {
      return service.active !== false;
    });
  }

  function current() {
    return services().find(function (service) { return service.id === selectedId; });
  }

  function label(service) {
    return service.name.replace(/ Repair$/, '');
  }

  function renderAppliances() {
    els.appliances.innerHTML = services().map(function (service) {
      var active = service.id === selectedId;
      var cls = active
        ? 'border-brand-700 bg-brand-700 text-white shadow-sm'
        : 'border-brand-100 bg-white text-stone-700 hover:border-brand-300 hover:bg-brand-50 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200 dark:hover:bg-stone-700';
      return '<button type="button" class="fx-finder-appliance flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-xl border px-2 py-2.5 text-[11px] font-bold transition ' + cls + '" data-id="' + Fixora.esc(service.id) + '" aria-pressed="' + (active ? 'true' : 'false') + '"><i data-lucide="' + Fixora.esc(service.icon || 'wrench') + '" class="h-4 w-4"></i><span class="leading-4">' + Fixora.esc(label(service)) + '</span></button>';
    }).join('');
  }

  function renderIssues() {
    var service = current();
    if (!service) return;
    var issues = (service.problems || []).slice(0, 5);
    if (issues.indexOf('Something else') === -1) issues.push('Something else');
    if (issues.indexOf(selectedIssue) === -1) selectedIssue = issues[0];
    els.issues.innerHTML = issues.map(function (issue) {
      var active = issue === selectedIssue;
      var cls = active
        ? 'border-brand-700 bg-brand-700 text-white shadow-sm'
        : 'border-brand-200 bg-white text-stone-600 hover:border-brand-400 hover:text-brand-800 dark:border-stone-600 dark:bg-stone-800 dark:text-stone-300 dark:hover:text-brand-200';
      return '<button type="button" class="fx-finder-issue rounded-full border px-3 py-1.5 text-xs font-bold transition ' + cls + '" data-issue="' + Fixora.esc(issue) + '" aria-pressed="' + (active ? 'true' : 'false') + '">' + Fixora.esc(issue) + '</button>';
    }).join('');
  }

  function renderResult() {
    var service = current();
    if (!service) return;
    var issueText = selectedIssue || 'the issue you described';
    var visit = Fixora.money(service.serviceCharge != null ? service.serviceCharge : 249);
    var range = service.repairRange && service.repairRange.length
      ? Fixora.money(service.repairRange[0]) + '–' + Fixora.money(service.repairRange[1])
      : 'After inspection';
    var time = service.time || '45–90 min';
    var pricingHref = PRICING_IDS[service.id] ? 'pricing.html#' + PRICING_IDS[service.id] : 'pricing.html';
    var bookHref = 'dashboard.html?book=' + encodeURIComponent(service.name);
    if (selectedIssue && selectedIssue !== 'Something else') {
      bookHref += '&amp;issue=' + encodeURIComponent(selectedIssue);
    }
    els.result.innerHTML =
      '<div class="rounded-2xl border border-brand-200 bg-brand-50/80 p-4 dark:border-stone-700 dark:bg-stone-800/70 sm:p-5">' +
      '  <div class="flex items-center gap-2 text-[10px] font-extrabold uppercase tracking-[.16em] text-brand-700 dark:text-brand-300"><span class="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-600 text-[11px] text-white">3</span>Your next step</div>' +
      '  <div class="mt-3 flex items-start gap-3">' +
      '    <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-brand-700 shadow-sm dark:bg-stone-900 dark:text-brand-300"><i data-lucide="' + Fixora.esc(service.icon || 'wrench') + '" class="h-5 w-5"></i></span>' +
      '    <div class="min-w-0"><p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Likely service</p><h3 class="text-lg font-extrabold leading-tight">' + Fixora.esc(service.name) + '</h3><p class="mt-1 text-xs leading-5 text-stone-600 dark:text-stone-300">For “<strong class="font-extrabold text-stone-800 dark:text-stone-100">' + Fixora.esc(issueText) + '</strong>”, start with an on-site diagnosis and a written quote before any repair.</p></div>' +
      '  </div>' +
      '  <div class="mt-4 grid grid-cols-3 gap-2 text-center">' +
      '    <div class="rounded-xl bg-white p-2.5 shadow-sm dark:bg-stone-900"><p class="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Visit fee</p><p class="mt-0.5 text-xs font-extrabold leading-tight text-brand-800 dark:text-brand-200">' + visit + '</p><p class="text-[9px] text-stone-500 dark:text-stone-400">waived on approval</p></div>' +
      '    <div class="rounded-xl bg-white p-2.5 shadow-sm dark:bg-stone-900"><p class="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Typical repair</p><p class="mt-0.5 text-xs font-extrabold leading-tight text-brand-800 dark:text-brand-200">' + range + '</p><p class="text-[9px] text-stone-500 dark:text-stone-400">parts + labour</p></div>' +
      '    <div class="rounded-xl bg-white p-2.5 shadow-sm dark:bg-stone-900"><p class="text-[9px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Visit time</p><p class="mt-0.5 text-xs font-extrabold leading-tight text-brand-800 dark:text-brand-200">' + Fixora.esc(time) + '</p><p class="text-[9px] text-stone-500 dark:text-stone-400">on-site diagnosis</p></div>' +
      '  </div>' +
      '  <div class="mt-4 flex flex-wrap items-center gap-2">' +
      '    <a href="' + bookHref + '" class="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-2.5 text-xs font-extrabold text-white shadow-sm transition hover:bg-brand-800 sm:flex-none sm:text-sm"><i data-lucide="calendar-check" class="h-4 w-4"></i>Book this repair<i data-lucide="arrow-right" class="h-4 w-4"></i></a>' +
      '    <a href="services.html#' + Fixora.esc(service.id) + '" class="inline-flex items-center justify-center rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-800 transition hover:bg-brand-100 dark:border-stone-600 dark:bg-stone-900 dark:text-brand-200 dark:hover:bg-stone-700">Service details</a>' +
      '    <a href="' + pricingHref + '" class="inline-flex items-center justify-center rounded-xl border border-brand-200 bg-white px-3 py-2.5 text-xs font-bold text-brand-800 transition hover:bg-brand-100 dark:border-stone-600 dark:bg-stone-900 dark:text-brand-200 dark:hover:bg-stone-700">Pricing</a>' +
      '  </div>' +
      '  <p class="mt-3 text-[11px] leading-5 text-stone-500 dark:text-stone-400">Final quote after inspection. Visit fee waived when you approve the repair.</p>' +
      '</div>';
  }

  function renderAll() {
    renderAppliances();
    renderIssues();
    renderResult();
    if (window.lucide) lucide.createIcons();
  }

  function selectService(id) {
    var service = services().find(function (item) { return item.id === id; });
    if (!service) return;
    selectedId = service.id;
    selectedIssue = (service.problems || [])[0] || 'Something else';
    renderAll();
  }

  function bind() {
    els.appliances.addEventListener('click', function (event) {
      var button = event.target.closest('.fx-finder-appliance');
      if (!button) return;
      selectService(button.getAttribute('data-id'));
    });
    els.issues.addEventListener('click', function (event) {
      var button = event.target.closest('.fx-finder-issue');
      if (!button) return;
      selectedIssue = button.getAttribute('data-issue');
      renderIssues();
      renderResult();
      if (window.lucide) lucide.createIcons();
    });
  }

  function boot() {
    els = {
      appliances: document.getElementById('fxFinderAppliances'),
      issues: document.getElementById('fxFinderIssues'),
      result: document.getElementById('fxFinderResult')
    };
    if (!els.appliances || !els.issues || !els.result) return;
    var list = services();
    if (!list.length) return;
    selectedId = list[0].id;
    selectedIssue = (list[0].problems || [])[0] || 'Something else';
    renderAll();
    bind();
  }

  if (Fixora.bootReady) boot();
  else document.addEventListener('fx:ready', boot, { once: true });
})();
