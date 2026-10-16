/* Fixora - pricing page (sample pricing guide) */
(function () {
  'use strict';
  var Fixora = window.Fixora;

  function pricingCard(row) {
    var included = (row.included || []).map(function (x) {
      return '<li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><i data-lucide="circle-check" class="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400"></i>' + Fixora.esc(x) + '</li>';
    }).join('');
    var additional = (row.additional || []).map(function (x) {
      return '<li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300"><i data-lucide="alert-circle" class="mt-0.5 h-4 w-4 shrink-0 text-amber-500"></i>' + Fixora.esc(x) + '</li>';
    }).join('');
    return '' +
      '<article class="fx-price-card flex flex-col rounded-2xl border border-brand-200 bg-[#fffdf8] p-5 shadow-sm dark:border-stone-700 dark:bg-stone-900">' +
      '  <div class="flex items-start justify-between gap-3">' +
      '    <div class="flex min-w-0 items-start gap-3"><span class="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-stone-800 dark:text-brand-300"><i data-lucide="' + (row.icon || 'wrench') + '" class="h-5 w-5"></i></span>' +
      '      <h3 class="pt-1 text-base font-extrabold leading-5 text-stone-900 dark:text-white">' + Fixora.esc(row.service) + '</h3></div>' +
      '    <span class="shrink-0 rounded-full bg-brand-100 px-3 py-1.5 text-sm font-extrabold text-brand-800 dark:bg-stone-800 dark:text-brand-200">' + Fixora.money(row.startingPrice) + '</span>' +
      '  </div>' +
      '  <p class="mt-2 ps-[3.25rem] text-xs font-semibold text-stone-500 dark:text-stone-400">Starting price</p>' +
      '  <div class="mt-5 rounded-xl bg-brand-50 p-4 dark:bg-stone-800"><h4 class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-brand-800 dark:text-brand-200"><i data-lucide="circle-check" class="h-4 w-4"></i>What is included</h4><ul class="mt-3 space-y-2">' + included + '</ul></div>' +
      '  <div class="mt-3 rounded-xl border border-brand-100 p-4 dark:border-stone-700"><h4 class="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-stone-600 dark:text-stone-300"><i data-lucide="plus-circle" class="h-4 w-4 text-brand-600 dark:text-brand-300"></i>Possible additional charges</h4><ul class="mt-3 space-y-2">' + additional + '</ul></div>' +
      '  <button class="fx-book-appliance mt-auto inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-700 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-800" data-appliance="' + Fixora.esc(row.book || bookingAppliance(row.service)) + '"><i data-lucide="calendar-check" class="h-4 w-4"></i>Book Service</button>' +
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
      'Spare Parts & Replacement': 'Refrigerator'
    };
    return map[service] || service.replace(/ Repair$/, '');
  }

  function comparisonRow(row) {
    var included = (row.included || []).map(function (item) { return Fixora.esc(item); }).join('<br>');
    var additional = (row.additional || []).map(function (item) { return Fixora.esc(item); }).join('<br>');
    return '<tr class="align-top text-stone-700 dark:text-stone-300">' +
      '<th scope="row" class="px-4 py-4 text-start font-bold text-stone-900 dark:text-white md:px-5">' + Fixora.esc(row.service) + '</th>' +
      '<td class="whitespace-nowrap px-4 py-4 font-extrabold text-brand-700 dark:text-brand-300 md:px-5">' + Fixora.money(row.startingPrice) + '</td>' +
      '<td class="hidden px-4 py-4 text-xs leading-5 md:table-cell md:px-5">' + included + '</td>' +
      '<td class="hidden px-4 py-4 text-xs leading-5 md:table-cell md:px-5">' + additional + '</td>' +
      '<td class="px-4 py-4 md:px-5"><button class="fx-book-appliance whitespace-nowrap rounded-lg bg-brand-700 px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-800" data-appliance="' + Fixora.esc(row.book || bookingAppliance(row.service)) + '">Book service</button></td>' +
      '</tr>';
  }

  function renderPricing() {
    var list = Fixora.get('fixora_pricing', []);
    var wrap = document.getElementById('fxPricingGrid');
    if (!wrap) return;
    wrap.innerHTML = list.map(pricingCard).join('');
    var compare = document.getElementById('fxPricingCompare');
    if (compare) compare.innerHTML = list.map(comparisonRow).join('');
    document.querySelectorAll('.fx-book-appliance').forEach(function (btn) {
      btn.addEventListener('click', function () { Fixora.bookService(btn.getAttribute('data-appliance')); });
    });
    if (window.lucide) lucide.createIcons();
  }

  function boot() { renderPricing(); }

  if (Fixora.bootReady) boot();
  else document.addEventListener('fx:ready', boot, { once: true });
})();
