/* Fixora - pricing page (sample pricing guide) */
(function () {
  'use strict';
  var Fixora = window.Fixora;

  function moneyRange(range) {
    return Fixora.money(range[0]) + ' – ' + Fixora.money(range[1]);
  }

  function visitLabel(row) {
    return Fixora.money(row.visitFee != null ? row.visitFee : 249);
  }

  function repairLabel(row) {
    if (row.repairRange) return moneyRange(row.repairRange);
    if (row.id === 'p-diag') return 'Diagnosis only';
    return 'After inspection';
  }

  function repairNote(row) {
    if (row.repairRange) return 'parts + labour';
    if (row.id === 'p-diag') return 'visit only';
    return 'confirmed later';
  }

  function pricingCard(row) {
    var included = (row.included || []).map(function (x) {
      return '<li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><i data-lucide="circle-check" class="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400"></i>' + Fixora.esc(x) + '</li>';
    }).join('');
    var additional = (row.additional || []).map(function (x) {
      return '<li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><i data-lucide="alert-circle" class="mt-0.5 h-4 w-4 shrink-0 text-amber-500"></i>' + Fixora.esc(x) + '</li>';
    }).join('');
    return '' +
      '<article id="' + Fixora.esc(row.id) + '" class="fx-price-card flex flex-col rounded-2xl border border-brand-200 bg-[#fffdf8] p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">' +
      '  <div class="flex min-w-0 items-start gap-3">' +
      '    <span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-stone-800 dark:text-brand-300"><i data-lucide="' + (row.icon || 'wrench') + '" class="h-5 w-5"></i></span>' +
      '    <div class="min-w-0"><h3 class="text-base font-extrabold leading-5 text-stone-900 dark:text-white">' + Fixora.esc(row.service) + '</h3><p class="mt-1 text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Service from ' + Fixora.money(row.startingPrice) + '</p></div>' +
      '  </div>' +
      '  <div class="mt-4 grid grid-cols-2 gap-2 text-xs">' +
      '    <div class="rounded-xl bg-brand-50 px-3 py-2.5 dark:bg-stone-800"><p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Visit charge</p><p class="mt-0.5 text-sm font-extrabold text-brand-800 dark:text-brand-200">' + visitLabel(row) + '</p><p class="text-[10px] text-stone-500 dark:text-stone-400">waived on approval</p></div>' +
      '    <div class="rounded-xl border border-brand-100 px-3 py-2.5 dark:border-stone-700"><p class="text-[10px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Typical repair</p><p class="mt-0.5 text-sm font-extrabold text-stone-900 dark:text-white">' + repairLabel(row) + '</p><p class="text-[10px] text-stone-500 dark:text-stone-400">' + repairNote(row) + '</p></div>' +
      '  </div>' +
      '  <div class="mt-4 rounded-xl bg-brand-50 p-4 dark:bg-stone-800"><h4 class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-800 dark:text-brand-200"><i data-lucide="circle-check" class="h-4 w-4"></i>What is included</h4><ul class="mt-3 space-y-2">' + included + '</ul></div>' +
      '  <div class="mt-3 rounded-xl border border-brand-100 p-4 dark:border-stone-700"><h4 class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-300"><i data-lucide="plus-circle" class="h-4 w-4 text-brand-600 dark:text-brand-300"></i>Possible additional charges</h4><ul class="mt-3 space-y-2">' + additional + '</ul></div>' +
      '  <div class="mt-auto pt-4"><button class="fx-book-appliance inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-800" data-appliance="' + Fixora.esc(row.book || bookingAppliance(row.service)) + '"><i data-lucide="calendar-check" class="h-4 w-4"></i>Book Service</button></div>' +
      '</article>';
  }

  function bookingAppliance(service) {
    var map = {
      'Inspection & Diagnostic Visit': 'Refrigerator',
      'Refrigerator Repair': 'Refrigerator',
      'Washing Machine Repair': 'Washing Machine',
      'AC Repair & Servicing': 'Air Conditioner',
      'Television Repair': 'Television',
      'Microwave Oven Repair': 'Microwave Oven',
      'Dishwasher Repair': 'Dishwasher',
      'Water Heater Repair': 'Water Heater',
      'Oven Repair': 'Oven',
      'Spare Parts & Replacement': 'Refrigerator'
    };
    return map[service] || service.replace(/ Repair$/, '');
  }

  function comparisonRow(row) {
    var included = (row.included || []).map(function (item) { return Fixora.esc(item); }).join('<br>');
    var additional = (row.additional || []).map(function (item) { return Fixora.esc(item); }).join('<br>');
    return '<tr class="align-top text-stone-700 dark:text-stone-300">' +
      '<th scope="row" class="px-4 py-4 text-start font-bold text-stone-900 dark:text-white md:px-5">' + Fixora.esc(row.service) + '</th>' +
      '<td class="whitespace-nowrap px-4 py-4 font-extrabold text-stone-900 dark:text-white md:px-5">' + visitLabel(row) + '</td>' +
      '<td class="whitespace-nowrap px-4 py-4 font-extrabold text-brand-700 dark:text-brand-300 md:px-5">' + repairLabel(row) + '</td>' +
      '<td class="hidden px-4 py-4 text-xs leading-5 lg:table-cell lg:px-5">' + included + '</td>' +
      '<td class="hidden px-4 py-4 text-xs leading-5 lg:table-cell lg:px-5">' + additional + '</td>' +
      '<td class="px-4 py-4 md:px-5"><button class="fx-book-appliance whitespace-nowrap rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-800" data-appliance="' + Fixora.esc(row.book || bookingAppliance(row.service)) + '">Book service</button></td>' +
      '</tr>';
  }

  function estimatesBlock(row) {
    if (!row.estimates || !row.estimates.length) return '';
    var items = row.estimates.map(function (e) {
      return '<li class="flex items-center justify-between gap-3 py-2.5 text-sm"><span class="text-stone-600 dark:text-stone-300">' + Fixora.esc(e.job) + '</span><span class="shrink-0 font-extrabold text-brand-800 dark:text-brand-200">' + moneyRange(e.price) + '</span></li>';
    }).join('');
    return '<article class="rounded-2xl border border-brand-200 bg-white p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">' +
      '<div class="flex items-center gap-3 border-b border-brand-100 pb-3 dark:border-stone-700">' +
      '<span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-stone-800 dark:text-brand-300"><i data-lucide="' + (row.icon || 'wrench') + '" class="h-5 w-5"></i></span>' +
      '<div class="min-w-0"><h3 class="text-sm font-extrabold text-stone-900 dark:text-white">' + Fixora.esc(row.service) + '</h3><p class="text-[11px] font-semibold text-stone-500 dark:text-stone-400">Visit ' + visitLabel(row) + ' · Typical total ' + repairLabel(row) + '</p></div>' +
      '</div>' +
      '<ul class="mt-2 divide-y divide-brand-100 dark:divide-stone-800">' + items + '</ul>' +
      '</article>';
  }

  function scrollToHash() {
    if (!location.hash) return;
    var target = document.getElementById(location.hash.slice(1));
    if (!target) return;
    setTimeout(function () {
      var top = target.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top: top < 0 ? 0 : top, behavior: 'smooth' });
    }, 160);
  }

  function renderPricing() {
    var list = Fixora.get('fixora_pricing', []);
    var wrap = document.getElementById('fxPricingGrid');
    if (!wrap) return;
    wrap.innerHTML = list.map(pricingCard).join('');
    var compare = document.getElementById('fxPricingCompare');
    if (compare) compare.innerHTML = list.map(comparisonRow).join('');
    var estimates = document.getElementById('fxRepairEstimates');
    if (estimates) estimates.innerHTML = list.filter(function (row) { return row.estimates && row.estimates.length; }).map(estimatesBlock).join('');
    document.querySelectorAll('.fx-book-appliance').forEach(function (btn) {
      btn.addEventListener('click', function () { Fixora.bookService(btn.getAttribute('data-appliance')); });
    });
    if (window.lucide) lucide.createIcons();
    scrollToHash();
  }

  function boot() { renderPricing(); }

  if (Fixora.bootReady) boot();
  else document.addEventListener('fx:ready', boot, { once: true });
})();
