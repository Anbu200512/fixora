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
      '<article class="fx-price-card overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">' +
      (row.image ? '<div class="relative h-44"><img src="' + row.image + '" alt="' + Fixora.esc(row.service) + '" class="h-full w-full object-cover" loading="lazy">' +
        '<div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>' +
        '<span class="absolute bottom-3 start-3 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-sm font-extrabold text-slate-900">' + Fixora.money(row.startingPrice) + '</span></div>' : '') +
      '  <div class="p-5">' +
      '    <div class="flex items-center gap-2.5"><span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"><i data-lucide="' + (row.icon || 'wrench') + '" class="h-4 w-4"></i></span>' +
      '      <h3 class="text-base font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(row.service) + '</h3></div>' +
      '    <p class="mt-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Starts at <span class="text-teal-600 dark:text-teal-400">' + Fixora.money(row.startingPrice) + '</span></p>' +
      '    <div class="mt-4 grid gap-4 sm:grid-cols-2">' +
      '      <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">What is included</h4><ul class="mt-2 space-y-2">' + included + '</ul></div>' +
      '      <div><h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Possible additional charges</h4><ul class="mt-2 space-y-2">' + additional + '</ul></div>' +
      '    </div>' +
      '    <div class="mt-5"><button class="fx-book-appliance w-full inline-flex items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800" data-appliance="' + Fixora.esc(row.book || row.service.replace(/ Repair$/, '').replace('Inspection', 'Refrigerator')) + '"><i data-lucide="calendar-check" class="h-4 w-4"></i>Book Service</button></div>' +
      '  </div></article>';
  }

  function renderPricing() {
    var list = Fixora.get('fixora_pricing', []);
    var wrap = document.getElementById('fxPricingGrid');
    if (!wrap) return;
    wrap.innerHTML = list.map(pricingCard).join('');
    document.querySelectorAll('.fx-book-appliance').forEach(function (btn) {
      btn.addEventListener('click', function () { Fixora.bookService(btn.getAttribute('data-appliance')); });
    });
    if (window.lucide) lucide.createIcons();
  }

  function boot() { renderPricing(); }

  if (Fixora.bootReady) boot();
  else document.addEventListener('fx:ready', boot, { once: true });
})();