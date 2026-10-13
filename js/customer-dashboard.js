/* Fixora - customer dashboard */
(function () {
  'use strict';
  var Fixora = window.Fixora;

  var user, bookings;
  var currentSection = 'overview';

  function applianceOptions(preset) {
    return Fixora.get('fixora_services', []).map(function (s) {
      return '<option value="' + Fixora.esc(s.name) + '"' + (s.name === preset ? ' selected' : '') + '>' + Fixora.esc(s.name) + ' (from ' + Fixora.money(s.price) + ')</option>';
    }).join('');
  }

  function dateOptions() {
    return Fixora.bookings.nextDates(8).map(function (d) {
      return '<option value="' + d + '">' + Fixora.weekdayLabel(d) + '</option>';
    }).join('');
  }

  function slotOptions() {
    return Fixora.SLOTS.map(function (s) { return '<option value="' + Fixora.esc(s) + '">' + Fixora.esc(s) + '</option>'; }).join('');
  }

  function statCard(icon, label, value, accent) {
    return '<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">' +
      '<div class="flex items-center gap-3"><span class="flex h-11 w-11 items-center justify-center rounded-xl ' + accent + '"><i data-lucide="' + icon + '" class="h-5 w-5"></i></span>' +
      '<div><p class="text-2xl font-extrabold text-slate-900 dark:text-white">' + value + '</p><p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">' + label + '</p></div></div></div>';
  }

  function bookingMini(b) {
    var c = Fixora.STATUS[b.status] || Fixora.STATUS.Requested;
    return '<div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">' +
      '<div class="flex flex-wrap items-center justify-between gap-2"><div class="flex items-center gap-3">' +
      '<span class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"><i data-lucide="wrench" class="h-4 w-4"></i></span>' +
      '<div><p class="text-sm font-bold text-slate-900 dark:text-white">' + Fixora.esc(b.appliance) + '</p>' +
      '<p class="text-xs text-slate-500 dark:text-slate-400">' + b.ref + ' · ' + Fixora.formatDate(b.date) + ', ' + Fixora.esc(b.time) + '</p></div></div>' +
      '<span class="text-xs font-bold rounded-full px-2.5 py-1 ' + c.cls + '">' + Fixora.esc(b.status) + '</span></div>' +
      '<div class="mt-3 flex flex-wrap gap-2"><button class="fx-bk-detail text-xs font-bold text-blue-700 dark:text-blue-300" data-id="' + b.id + '">View details</button>' +
      (Fixora.bookings.canCancel(b) ? '<button class="fx-bk-cancel text-xs font-bold text-rose-600 dark:text-rose-400" data-id="' + b.id + '">Cancel</button>' : '') +
      (Fixora.bookings.canReschedule(b) ? '<button class="fx-bk-resched text-xs font-bold text-amber-600 dark:text-amber-400" data-id="' + b.id + '">Reschedule</button>' : '') +
      (b.status !== 'Completed' && b.status !== 'Cancelled' ? '<button class="fx-bk-track text-xs font-bold text-teal-600 dark:text-teal-400" data-id="' + b.id + '">Track technician</button>' : '') +
      '</div></div>';
  }

  /* ================= sections ================= */
  function renderOverview() {
    var mine = bookings;
    var counts = Fixora.bookings.statusCounts(mine);
    var upcoming = mine.filter(function (b) { return b.status !== 'Completed' && b.status !== 'Cancelled'; });
    var next = upcoming.sort(function (a, b2) { return a.date.localeCompare(b2.date); })[0];
    var completed = counts.Completed;
    var recent = mine.slice(0, 3);

    var nextCard = next
      ? '<div class="rounded-2xl border border-blue-200 bg-blue-50 p-5 dark:border-blue-700/50 dark:bg-blue-500/10">' +
        '<div class="flex items-center gap-2 text-sm font-bold text-blue-700 dark:text-blue-300"><i data-lucide="calendar-check" class="h-4 w-4"></i>Next appointment</div>' +
        '<p class="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(next.appliance) + '</p>' +
        '<p class="mt-1 text-sm text-slate-600 dark:text-slate-300">' + Fixora.weekdayLabel(next.date) + ' · ' + Fixora.esc(next.time) + '</p>' +
        '<p class="text-sm text-slate-600 dark:text-slate-300">Ref ' + next.ref + '</p>' +
        '<div class="mt-4 flex flex-wrap gap-2">' +
        '<button class="fx-bk-track rounded-lg bg-blue-700 px-3 py-2 text-xs font-bold text-white" data-id="' + next.id + '">Track technician</button>' +
        '<button class="fx-section-go rounded-lg border border-blue-300 px-3 py-2 text-xs font-bold text-blue-700 dark:border-blue-600" data-go="book">Book another</button></div></div>'
      : '<div class="rounded-2xl border border-dashed border-slate-300 p-5 text-center dark:border-slate-700">' +
        '<p class="text-sm font-semibold text-slate-600 dark:text-slate-300">No upcoming appointments</p>' +
        '<button class="fx-section-go mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white" data-go="book"><i data-lucide="calendar-check" class="h-4 w-4"></i>Book a repair</button></div>';

    return '<div class="grid gap-6">' +
      '  <div class="rounded-2xl bg-gradient-to-br from-blue-700 to-teal-600 p-6 text-white shadow-lg md:p-8">' +
      '    <p class="text-sm font-semibold text-blue-100">Welcome back</p>' +
      '    <h1 class="mt-1 text-2xl font-extrabold tracking-tight md:text-3xl">' + Fixora.esc(user.name) + '</h1>' +
      '    <p class="mt-2 max-w-2xl text-sm leading-relaxed text-blue-50">Need a repair? Book in under a minute — our technicians arrive with the right tools and a transparent quote.</p>' +
      '    <div class="mt-5 flex flex-wrap gap-3">' +
      '      <button class="fx-section-go inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-blue-800 shadow" data-go="book"><i data-lucide="calendar-check" class="h-4 w-4"></i>Book a Repair</button>' +
      '      <button class="fx-section-go inline-flex items-center gap-2 rounded-xl bg-blue-800/40 px-5 py-2.5 text-sm font-bold text-white ring-1 ring-white/30" data-go="track"><i data-lucide="truck" class="h-4 w-4"></i>Track Technician</button>' +
      '    </div></div>' +
      '  <div class="fx-stats-grid">' +
      statCard('layers', 'Total bookings', mine.length, 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300') +
      statCard('calendar-clock', 'Upcoming visits', upcoming.length, 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300') +
      statCard('circle-check', 'Completed repairs', completed, 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300') +
      statCard('bell', 'Notifications', Fixora.get('fixora_notifications', []).filter(function (n) { return n.userId === user.id && !n.read; }).length, 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300') +
      '  </div>' +
      '  <div class="grid gap-6 lg:grid-cols-3">' +
      '    <div class="lg:col-span-1">' + nextCard + '</div>' +
      '    <div class="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900">' +
      '      <div class="flex items-center justify-between"><h2 class="text-base font-extrabold text-slate-900 dark:text-white">Recent bookings</h2>' +
      '        <button class="fx-section-go text-sm font-bold text-blue-700 dark:text-blue-300" data-go="bookings">View all</button></div>' +
      '      <div class="mt-3 grid gap-3">' + (recent.map(bookingMini).join('') || '<p class="text-sm text-slate-500 dark:text-slate-400">No bookings yet — book your first repair.</p>') + '</div></div>' +
      '  </div></div>';
  }

  function renderBook(pageAppliance) {
    var u = Fixora.currentUser();
    var preset = pageAppliance || '';
    var dateVals = Fixora.bookings.nextDates(8);
    return '<div class="mx-auto max-w-3xl">' +
      '  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">' +
      '    <h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Book a Repair</h2>' +
      '    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Share the appliance problem, pick a slot, and our team will confirm with a reference number.</p>' +
      '    <form id="fxBookForm" class="mt-6 grid gap-4 sm:grid-cols-2" novalidate>' +
      '      <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Appliance *</label>' +
      '        <select id="bkAppliance" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + applianceOptions(preset) + '</select><p data-field-error class="hidden"></p></div>' +
      '      <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Preferred date *</label>' +
      '        <select id="bkDate" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + dateOptions() + '</select><p data-field-error class="hidden"></p></div>' +
      '      <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Preferred time *</label>' +
      '        <select id="bkTime" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + slotOptions() + '</select><p data-field-error class="hidden"></p></div>' +
      '      <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Service address *</label>' +
      '        <input id="bkAddress" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" value="' + Fixora.esc(u.address || '') + '" placeholder="Flat / street / city"><p data-field-error class="hidden"></p></div>' +
      '      <div class="sm:col-span-2" data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Issue description *</label>' +
      '        <textarea id="bkIssue" rows="3" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="e.g. Not cooling, making loud noise"></textarea><p data-field-error class="hidden"></p></div>' +
      '      <div class="sm:col-span-2"><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Additional notes</label>' +
      '        <input id="bkNotes" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="Brand, model, error code (optional)"></div>' +
      '      <div class="sm:col-span-2"><button type="submit" class="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-blue-800"><i data-lucide="calendar-check" class="h-4 w-4"></i>Confirm Booking Request</button></div>' +
      '    </form></div>' +
      '  <div id="fxSlotHelp" class="mt-4 rounded-xl bg-teal-50 p-4 text-sm text-teal-800 dark:bg-teal-500/10 dark:text-teal-300">' +
      '    <p class="font-bold">Sample appointment slots</p>' +
      '    <p class="mt-1">' + dateVals.slice(0, 5).map(function (d) { return Fixora.weekdayLabel(d); }).join(' · ') + '</p>' +
      '    <p class="mt-1">' + Fixora.SLOTS.join(' · ') + '</p>' +
      '    <p class="mt-1 text-xs opacity-80">Slots shown are illustrative examples, not live availability.</p></div>' +
      '  <div class="mt-6 flex items-center gap-3 rounded-xl border border-slate-200 p-4 text-sm text-slate-600 dark:border-slate-700 dark:text-slate-300">' +
      '    <i data-lucide="shield-check" class="h-5 w-5 shrink-0 text-teal-600 dark:text-teal-400"></i>' +
      '    <span>Fixora never shares your details. The technician carries an ID card, and a confirmed quote is shared before any repair work starts.</span></div>' +
      '</div>';
  }

  function renderBookings() {
    var mine = bookings;
    var html = mine.map(function (b) {
      var c = Fixora.STATUS[b.status] || Fixora.STATUS.Requested;
      return '<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">' +
        '<div class="flex flex-wrap items-start justify-between gap-3">' +
        '  <div class="min-w-0"><div class="flex flex-wrap items-center gap-2">' +
        '    <span class="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"><i data-lucide="wrench" class="h-4 w-4"></i></span>' +
        '    <div><p class="font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(b.appliance) + ' repair</p>' +
        '    <p class="text-sm text-slate-500 dark:text-slate-400">' + b.ref + '</p></div></div></div>' +
        '  <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ' + c.cls + '"><span class="h-1.5 w-1.5 rounded-full ' + c.dot + '"></span>' + Fixora.esc(b.status) + '</span></div>' +
        '  <div class="mt-4 grid gap-3 text-sm sm:grid-cols-2">' +
        '    <p class="flex items-center gap-2 text-slate-600 dark:text-slate-300"><i data-lucide="calendar" class="h-4 w-4 text-slate-400"></i>' + Fixora.formatDate(b.date) + ', ' + Fixora.esc(b.time) + '</p>' +
        '    <p class="flex items-center gap-2 text-slate-600 dark:text-slate-300"><i data-lucide="map-pin" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(b.address) + '</p>' +
        '    <p class="flex items-center gap-2 text-slate-600 dark:text-slate-300"><i data-lucide="alert-circle" class="h-4 w-4 text-slate-400"></i>' + Fixora.esc(b.issue) + '</p>' +
        '    <p class="flex items-center gap-2 text-slate-600 dark:text-slate-300"><i data-lucide="user-round" class="h-4 w-4 text-slate-400"></i>' + (b.technician ? Fixora.esc(b.technician) : 'Technician to be assigned') + '</p></div>' +
        '  <div class="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">' +
        '    <button class="fx-bk-detail inline-flex items-center gap-1.5 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200"><i data-lucide="eye" class="h-3.5 w-3.5"></i>Details</button>' +
        (b.status !== 'Completed' && b.status !== 'Cancelled' ? '<button class="fx-bk-track inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-2 text-xs font-bold text-teal-700 dark:bg-teal-500/10 dark:text-teal-300"><i data-lucide="truck" class="h-3.5 w-3.5"></i>Track</button>' : '') +
        (Fixora.bookings.canReschedule(b) ? '<button class="fx-bk-resched inline-flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-xs font-bold text-amber-700 dark:bg-amber-500/10 dark:text-amber-300"><i data-lucide="calendar-clock" class="h-3.5 w-3.5"></i>Reschedule</button>' : '') +
        (Fixora.bookings.canCancel(b) ? '<button class="fx-bk-cancel inline-flex items-center gap-1.5 rounded-lg bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"><i data-lucide="x-circle" class="h-3.5 w-3.5"></i>Cancel</button>' : '') +
        (b.status === 'Completed' ? '<button class="fx-bk-receipt inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><i data-lucide="receipt" class="h-3.5 w-3.5"></i>Receipt</button>' : '') +
        '</div></div>';
    }).join('');
    return '<div class="grid gap-4">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">My Bookings</h2>' +
      '    <p class="text-sm text-slate-500 dark:text-slate-400">' + mine.length + ' booking' + (mine.length === 1 ? '' : 's') + ' found</p></div>' +
      '    <button class="fx-section-go inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white" data-go="book"><i data-lucide="plus" class="h-4 w-4"></i>New Booking</button></div>' +
      (html || '<div class="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No bookings yet. Book your first repair.</div>') +
      '</div>';
  }

  function renderTrack() {
    var active = bookings.filter(function (b) { return b.status !== 'Completed' && b.status !== 'Cancelled'; });
    if (!active.length) {
      return '<div class="rounded-2xl border border-dashed border-slate-300 p-10 text-center dark:border-slate-700">' +
        '<span class="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-slate-800"><i data-lucide="truck" class="h-6 w-6"></i></span>' +
        '<p class="mt-4 font-bold text-slate-900 dark:text-white">No active repairs</p>' +
        '<p class="mt-1 text-sm text-slate-500 dark:text-slate-400">You can track technicians once a repair is booked.</p>' +
        '<button class="fx-section-go mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white" data-go="book"><i data-lucide="calendar-check" class="h-4 w-4"></i>Book a repair</button></div>';
    }
    var select = '<select id="fxTrackSel" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' +
      active.map(function (b) { return '<option value="' + b.id + '">' + Fixora.esc(b.appliance) + ' · ' + b.ref + ' · ' + Fixora.esc(b.status) + '</option>'; }).join('') + '</select>';

    var trackable = active.filter(function (b) { return b.status !== 'Requested'; });
    return '<div class="grid gap-6">' +
      '  <div class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900">' +
      '    <div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Track Technician</h2>' +
      '      <p class="text-sm text-slate-500 dark:text-slate-400">Status shown is updated by the demo flow — this is not real GPS tracking.</p></div>' +
      '      <button id="fxSimAdvance" class="inline-flex items-center gap-2 rounded-xl border border-dashed border-blue-400 px-4 py-2 text-sm font-bold text-blue-700 dark:text-blue-300"><i data-lucide="refresh-cw" class="h-4 w-4 rtl-flip"></i>Simulate next status</button></div>' +
      '    <div class="mt-4"><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Active booking</label><div class="mt-1">' + select + '</div></div>' +
      '    <div id="fxTrackDetail" class="mt-5"></div>' +
      '  </div>' +
      '  <div class="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-500/10 dark:text-amber-300">' +
      '    <p class="flex items-center gap-2 font-bold"><i data-lucide="info" class="h-4 w-4"></i>About tracking</p>' +
      '    <p class="mt-1">This dashboard simulates technician status updates for demonstration. It does not use real GPS, SMS or live location services.</p></div>' +
      '</div>';
  }

  function trackDetail(b) {
    var idx = Fixora.BOOKING_STATUSES.indexOf(b.status);
    var steps = Fixora.BOOKING_STATUSES.filter(function (s) { return s !== 'Cancelled'; }).map(function (s, i) {
      var done = i <= idx;
      var cur = i === idx;
      return '<div class="flex flex-col items-center text-center">' +
        '<div class="flex h-9 w-9 items-center justify-center rounded-full text-white ' + (done ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700') + (cur ? ' ring-4 ring-emerald-200 dark:ring-emerald-500/20' : '') + '">' +
        '<i data-lucide="' + (done ? 'check' : 'circle') + '" class="h-4 w-4"></i></div>' +
        '<p class="mt-2 max-w-[90px] text-[11px] font-semibold leading-tight ' + (cur ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400') + '">' + s + '</p></div>';
    }).join('<div class="h-px w-6 self-center bg-slate-200 dark:bg-slate-700 md:w-10"></div>');
    var techCard = b.technicianId || b.technician
      ? '<div class="flex items-center gap-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">' +
        '<span class="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-teal-600 text-base font-extrabold text-white">' + Fixora.esc(b.technician.split(' ').map(function (w) { return w[0]; }).join('')) + '</span>' +
        '<div class="min-w-0"><p class="font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(b.technician) + '</p>' +
        '<div class="flex items-center gap-1 text-amber-500"><i data-lucide="star" class="h-3.5 w-3.5 fill-current"></i><span class="text-xs font-semibold text-slate-500 dark:text-slate-400">' + Fixora.esc((b.techRating || 'Rated technician')) + '</span></div>' +
        '<p class="mt-1 text-xs text-slate-400">Contact placeholder: <a class="font-semibold text-blue-700 dark:text-blue-300" href="tel:+919000000000">+91 90000 00000</a></p></div>' +
        '<span class="ms-auto hidden sm:flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"><i data-lucide="phone-call" class="h-4 w-4"></i></span></div>'
      : '<div class="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">A technician is being assigned. You will get a notification once scheduled.</div>';
    return '<div class="mt-2"><div class="flex items-start justify-between gap-2"><div>' +
      '<h3 class="font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(b.appliance) + ' repair</h3>' +
      '<p class="text-xs text-slate-500 dark:text-slate-400">' + b.ref + ' · ' + Fixora.formatDate(b.date) + ', ' + Fixora.esc(b.time) + '</p></div>' +
      Fixora.statusBadge(b.status) + '</div>' +
      '<div class="mt-5 flex items-stretch overflow-x-auto pb-2">' + steps + '</div>' +
      '<div class="mt-6">' + techCard + '</div></div>';
  }

  function renderHistory() {
    var done = bookings.filter(function (b) { return b.status === 'Completed' || b.status === 'Cancelled'; });
    var rows = done.map(function (b) {
      return '<tr class="border-t border-slate-200 dark:border-slate-700">' +
        '<td class="px-3 py-3 text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(b.appliance) + '</td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.formatDate(b.date) + '</td>' +
        '<td class="max-w-[220px] px-3 py-3 text-sm text-slate-600 dark:text-slate-300"><span class="line-clamp-2">' + Fixora.esc(b.issue) + '</span></td>' +
        '<td class="px-3 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100">' + (b.cost != null ? Fixora.money(b.cost) : '—') + '</td>' +
        '<td class="px-3 py-3">' + Fixora.statusBadge(b.status) + '</td>' +
        '<td class="px-3 py-3 text-end">' + (b.status === 'Completed' ? '<button class="fx-bk-receipt text-sm font-bold text-emerald-600 dark:text-emerald-400" data-id="' + b.id + '">Receipt</button>' : '<span class="text-sm text-slate-400">—</span>') + '</td></tr>';
    }).join('');
    return '<div><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Service History</h2>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">Completed and cancelled repairs for your account.</p></div>' +
      '<div class="mt-4 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700">' +
      '<div class="overflow-x-auto"><table class="w-full min-w-[640px] text-start">' +
      '<thead class="bg-slate-50 dark:bg-slate-800/60"><tr>' +
      '<th class="px-3 py-3 text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Appliance</th>' +
      '<th class="px-3 py-3 text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Date</th>' +
      '<th class="px-3 py-3 text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Issue</th>' +
      '<th class="px-3 py-3 text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Cost</th>' +
      '<th class="px-3 py-3 text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</th>' +
      '<th class="px-3 py-3 text-end text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Action</th></tr></thead>' +
      '<tbody>' + (rows || '<tr><td colspan="6" class="px-3 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No history yet.</td></tr>') + '</tbody></table></div></div></div>';
  }

  function renderPayments() {
    var completed = bookings.filter(function (b) { return b.status === 'Completed' && b.cost != null; });
    var paidTotal = completed.reduce(function (s, b) { return s + (b.cost || 0); }, 0);
    var rows = completed.map(function (b) {
      return '<div class="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 dark:border-slate-700">' +
        '<div class="flex items-center gap-3"><span class="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300"><i data-lucide="receipt" class="h-4 w-4"></i></span>' +
        '<div><p class="text-sm font-bold text-slate-900 dark:text-white">' + Fixora.esc(b.appliance) + ' · ' + b.ref + '</p>' +
        '<p class="text-xs text-slate-500 dark:text-slate-400">' + Fixora.formatDate(b.date) + ' · cash / UPI (demo)</p></div></div>' +
        '<div class="flex items-center gap-3"><span class="text-sm font-extrabold text-slate-900 dark:text-white">' + Fixora.money(b.cost) + '</span>' +
        '<button class="fx-bk-receipt rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-200" data-id="' + b.id + '">View receipt</button></div></div>';
    }).join('');
    return '<div class="grid gap-4"><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Payments & Receipts</h2>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">Sample receipts for completed repairs. No real payments are processed on this demo site.</p></div>' +
      '<div class="fx-stats-grid">' +
      statCard('credit-card', 'Paid (demo)', Fixora.money(paidTotal), 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300') +
      statCard('receipt', 'Receipts', completed.length, 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300') + '</div>' +
      '<div class="grid gap-3">' + (rows || '<div class="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">Completed repairs with receipts will appear here.</div>') + '</div></div>';
  }

  function renderNotifications() {
    var list = Fixora.get('fixora_notifications', []).filter(function (n) { return n.userId === user.id; }).slice(0, 30);
    var unread = list.filter(function (n) { return !n.read; }).length;
    var items = list.map(function (n) {
      return '<div class="rounded-xl border border-slate-200 p-4 ' + (n.read ? 'opacity-70 dark:border-slate-700' : 'border-blue-200 bg-blue-50/50 dark:border-blue-700/50 dark:bg-blue-500/5') + '">' +
        '<div class="flex items-start gap-3"><span class="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ' + (n.read ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300') + '"><i data-lucide="' + (n.read ? 'bell' : 'bell-ring') + '" class="h-4 w-4"></i></span>' +
        '<div class="min-w-0"><div class="flex flex-wrap items-center justify-between gap-2"><p class="text-sm font-bold text-slate-900 dark:text-white">' + Fixora.esc(n.title) + '</p>' +
        '<span class="text-[11px] text-slate-400">' + Fixora.timeAgo(n.createdAt) + '</span></div>' +
        '<p class="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">' + Fixora.esc(n.message) + '</p></div></div></div>';
    }).join('');
    return '<div class="grid gap-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Notifications</h2>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">' + unread + ' unread</p></div>' +
      (unread ? '<button id="fxMarkAllRead" class="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"><i data-lucide="check-check" class="h-4 w-4"></i>Mark all read</button>' : '') + '</div>' +
      '<div class="grid gap-3">' + (items || '<div class="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">No notifications yet.</div>') + '</div></div>';
  }

  function renderProfile() {
    var u2 = Fixora.currentUser();
    return '<div class="mx-auto max-w-2xl">' +
      '  <div class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-900 md:p-8">' +
      '    <div class="flex items-center gap-4"><span class="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-teal-600 text-xl font-extrabold text-white">' + Fixora.esc((u2.name || 'U').split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('').toUpperCase()) + '</span>' +
      '      <div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(u2.name) + '</h2>' +
      '      <p class="text-sm text-slate-500 dark:text-slate-400">' + Fixora.esc(u2.email) + ' · ' + Fixora.esc(u2.phone) + '</p>' +
      '      <p class="text-xs text-teal-600 dark:text-teal-400">Member since ' + Fixora.formatDate(u2.joined || Fixora.today()) + '</p></div></div>' +
      '    <form id="fxProfileForm" class="mt-6 grid gap-4">' +
      '      <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full name *</label>' +
      '        <input id="pfName" value="' + Fixora.esc(u2.name) + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><p data-field-error class="hidden"></p></div>' +
      '      <div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email</label>' +
      '        <input value="' + Fixora.esc(u2.email) + '" disabled class="mt-1 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-400 dark:border-slate-700 dark:bg-slate-800/60"><p class="mt-1 text-xs text-slate-400">Email is your login ID and cannot be changed.</p></div>' +
      '      <div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone *</label>' +
      '        <input id="pfPhone" value="' + Fixora.esc(u2.phone) + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"></div>' +
      '      <div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Default service address</label>' +
      '        <input id="pfAddress" value="' + Fixora.esc(u2.address || '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="Flat / street / city"><p data-field-error class="hidden"></p></div>' +
      '      <div class="flex flex-wrap gap-3"><button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800"><i data-lucide="check" class="h-4 w-4"></i>Save changes</button>' +
      '      <button id="fxLogoutBtn2" class="inline-flex items-center gap-2 rounded-xl border border-rose-300 px-5 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10"><i data-lucide="log-out" class="h-4 w-4 rtl-flip"></i>Logout</button></div>' +
      '    </form>' +
      '    <p class="mt-6 rounded-xl bg-slate-50 p-4 text-xs leading-relaxed text-slate-500 dark:bg-slate-800 dark:text-slate-400">Demo account: sign-in is simulated with data stored only on this device. No real passwords are transmitted, and this is not production-grade authentication.</p>' +
      '  </div></div>';
  }

  /* ================= wiring ================= */
  function setSection(section, params) {
    currentSection = section;
    document.querySelectorAll('.fx-sb-item').forEach(function (it) {
      var active = it.getAttribute('data-section') === section;
      var base = 'fx-sb-item';
      it.classList.remove('fx-sb-item-active');
      it.classList.add(base);
      it.classList.toggle('bg-blue-50','text-blue-700');
      it.classList.toggle('dark:bg-blue-500/10','dark:text-blue-300');
      it.classList.toggle('bg-transparent','text-slate-600');
      it.classList.toggle('dark:text-slate-200',!active);
      void base;
      if (active) { it.classList.add('fx-sb-item-active', 'bg-blue-50', 'text-blue-700', 'dark:bg-blue-500/10', 'dark:text-blue-300'); }
    });
    var titles = { overview: 'Overview', book: 'Book a Repair', bookings: 'My Bookings', track: 'Track Technician', history: 'Service History', payments: 'Payments & Receipts', notifications: 'Notifications', profile: 'Profile' };
    document.getElementById('fxPageTitle').textContent = titles[section] || 'Dashboard';
    var main = document.getElementById('fxMain');
    if (section === 'overview') main.innerHTML = renderOverview();
    else if (section === 'book') main.innerHTML = renderBook(params);
    else if (section === 'bookings') main.innerHTML = renderBookings();
    else if (section === 'track') main.innerHTML = renderTrack();
    else if (section === 'history') main.innerHTML = renderHistory();
    else if (section === 'payments') main.innerHTML = renderPayments();
    else if (section === 'notifications') main.innerHTML = renderNotifications();
    else if (section === 'profile') main.innerHTML = renderProfile();
    main.scrollTop = 0;
    window.scrollTo(0, 0);
    afterRender(section);
    if (window.lucide) lucide.createIcons();
  }

  function afterRender(section) {
    document.querySelectorAll('.fx-section-go').forEach(function (btn) {
      btn.addEventListener('click', function () { setSection(btn.getAttribute('data-go')); });
    });
    document.querySelectorAll('.fx-bk-detail').forEach(function (btn) {
      btn.addEventListener('click', function () { openBookingModal(btn.getAttribute('data-id')); });
    });
    document.querySelectorAll('.fx-bk-cancel').forEach(function (btn) {
      btn.addEventListener('click', function () { cancelBooking(btn.getAttribute('data-id')); });
    });
    document.querySelectorAll('.fx-bk-resched').forEach(function (btn) {
      btn.addEventListener('click', function () { openReschedModal(btn.getAttribute('data-id')); });
    });
    document.querySelectorAll('.fx-bk-track').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var id = btn.getAttribute('data-id');
        setSection('track');
        var sel = document.getElementById('fxTrackSel');
        if (sel) { sel.value = id; renderTrackDetail(); }
      });
    });
    document.querySelectorAll('.fx-bk-receipt').forEach(function (btn) {
      btn.addEventListener('click', function () { openReceiptModal(btn.getAttribute('data-id')); });
    });

    if (section === 'book') bindBookForm();
    if (section === 'track') bindTrack();
    if (section === 'notifications') bindNotifications();
    if (section === 'profile') bindProfile();
  }

  function bindBookForm() {
    var form = document.getElementById('fxBookForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = { bkAppliance: 'appliance', bkDate: 'date', bkTime: 'time', bkAddress: 'address', bkIssue: 'issue' };
      var valid = true;
      Fixora.clearFieldErrors(form);
      Object.keys(fields).forEach(function (k) {
        var el = document.getElementById(k);
        if (!el.value.trim()) { Fixora.setFieldError(el, 'Required.'); valid = false; }
      });
      if (!valid) { Fixora.toast('Please complete the required fields.', 'error'); return; }
      var booking = Fixora.bookings.create({
        appliance: document.getElementById('bkAppliance').value,
        date: document.getElementById('bkDate').value,
        time: document.getElementById('bkTime').value,
        address: document.getElementById('bkAddress').value.trim(),
        issue: document.getElementById('bkIssue').value.trim(),
        notes: document.getElementById('bkNotes').value.trim()
      });
      openConfirmModal(booking);
      form.reset();
    });
  }

  function bindTrack() {
    var sel = document.getElementById('fxTrackSel');
    if (sel) {
      sel.addEventListener('change', renderTrackDetail);
      renderTrackDetail();
    }
    var adv = document.getElementById('fxSimAdvance');
    if (adv) adv.addEventListener('click', simulateAdvance);
  }

  function currentActiveBooking() {
    var sel = document.getElementById('fxTrackSel');
    var id = sel && sel.value;
    return bookings.find(function (b) { return b.id === id; }) || bookings.find(function (b) { return b.status !== 'Completed' && b.status !== 'Cancelled'; });
  }

  function renderTrackDetail() {
    var b = currentActiveBooking();
    var el = document.getElementById('fxTrackDetail');
    if (el) el.innerHTML = b ? trackDetail(b) : '<p class="text-sm text-slate-500 dark:text-slate-400">Select an active booking above.</p>';
    if (window.lucide) lucide.createIcons();
  }

  function simulateAdvance() {
    var b = currentActiveBooking();
    if (!b) { Fixora.toast('No active booking to advance.', 'info'); return; }
    var order = ['Requested', 'Confirmed', 'Technician Assigned', 'On the Way', 'In Progress', 'Completed'];
    var idx = order.indexOf(b.status);
    if (idx < 0 || idx >= order.length - 1) { Fixora.toast('This booking has reached its final status.', 'info'); return; }
    var next = order[idx + 1];
    Fixora.bookings.setStatus(b.id, next);
    if (next === 'Technician Assigned' && !b.technicianId) {
      var techs = Fixora.get('fixora_technicians', []);
      var fallback = techs[Math.floor(Math.random() * techs.length)];
      if (fallback) Fixora.bookings.assignTechnician(b.id, fallback.id);
    }
    Fixora.toast('Simulated update: booking is now "' + next + '".', 'success');
    refreshState();
    setSection('track');
  }

  function cancelBooking(id) {
    var b = Fixora.bookings.get(id);
    Fixora.confirm({
      title: 'Cancel booking ' + (b ? b.ref : '') + '?',
      message: 'This action cannot be undone. If the technician already started, please contact support instead.',
      confirmText: 'Cancel booking',
      variant: 'danger'
    }).then(function (ok) {
      if (!ok) return;
      var r = Fixora.bookings.cancel(id, 'Cancelled by customer');
      if (!r.ok) { Fixora.toast(r.error, 'error'); return; }
      Fixora.toast('Booking ' + b.ref + ' has been cancelled.', 'success');
      setSection('bookings');
    });
  }

  function openReschedModal(id) {
    var b = Fixora.bookings.get(id);
    if (!b) return;
    var body = document.getElementById('rsBody');
    body.innerHTML =
      '<p class="text-sm text-slate-600 dark:text-slate-300">Choose a new slot for <strong>' + Fixora.esc(b.appliance) + ' (' + b.ref + ')</strong>.</p>' +
      '<div class="mt-4 grid gap-4 sm:grid-cols-2" data-field>' +
      '  <div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">New date *</label>' +
      '    <select id="rsDate" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + dateOptions() + '</select><p data-field-error class="hidden"></p></div>' +
      '  <div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">New time *</label>' +
      '    <select id="rsTime" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + slotOptions() + '</select><p data-field-error class="hidden"></p></div></div>';
    document.getElementById('rsDate').value = b.date;
    document.getElementById('rsTime').value = b.time;
    document.getElementById('rsConfirm').onclick = function () {
      var r = Fixora.bookings.reschedule(id, document.getElementById('rsDate').value, document.getElementById('rsTime').value);
      if (!r.ok) { Fixora.toast(r.error, 'error'); return; }
      Fixora.closeModal('fxReschedModal');
      Fixora.toast('Booking ' + b.ref + ' rescheduled.', 'success');
      setSection('bookings');
    };
    Fixora.openModal('fxReschedModal');
  }

  function openBookingModal(statusOrBooking) {
    var b = typeof statusOrBooking === 'string' ? Fixora.bookings.get(statusOrBooking) : statusOrBooking;
    if (!b) return;
    var tech = b.technician ? '<div class="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800"><span class="flex h-10 w-10 items-center justify-center rounded-full bg-blue-700 text-sm font-bold text-white">' + Fixora.esc(b.technician.split(' ').map(function (w) { return w[0]; }).join('')) + '</span><div><p class="text-sm font-bold text-slate-900 dark:text-white">' + Fixora.esc(b.technician) + '</p><p class="text-xs text-slate-400">Contact placeholder · +91 90000 00000</p></div></div>' : '';
    var timeline = (b.history || []).map(function (s, i) {
      return '<div class="flex items-start gap-3"><span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full ' + (Fixora.STATUS[s] ? Fixora.STATUS[s].dot : 'bg-slate-300') + '"></span><div><p class="text-sm font-semibold text-slate-800 dark:text-slate-100">' + Fixora.esc(s) + '</p><p class="text-xs text-slate-400">Update #' + (i + 1) + '</p></div></div>';
    }).join('');
    var costRow = b.cost != null ? '<div class="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900 dark:border-slate-700 dark:text-white"><span>Charged (demo)</span><span>' + Fixora.money(b.cost) + '</span></div>' : '<div class="flex justify-between border-t border-slate-200 pt-2 text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400"><span>Estimate</span><span>' + Fixora.money((fixoraBaseCost(b.appliance) || 650)) + '</span></div>';

    var body = document.getElementById('bkBody');
    body.innerHTML =
      '<div class="flex flex-wrap items-center justify-between gap-2"><p class="text-xs font-bold uppercase tracking-wider text-slate-400">' + b.ref + '</p>' + Fixora.statusBadge(b.status) + '</div>' +
      '<h3 class="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(b.appliance) + ' repair</h3>' +
      '<div class="mt-4 grid gap-3 text-sm text-slate-600 dark:text-slate-300">' +
      '<p class="flex gap-2"><i data-lucide="calendar" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.formatDate(b.date) + ', ' + Fixora.esc(b.time) + '</p>' +
      '<p class="flex gap-2"><i data-lucide="map-pin" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(b.address) + '</p>' +
      '<p class="flex gap-2"><i data-lucide="alert-circle" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(b.issue) + '</p>' +
      (b.notes ? '<p class="flex gap-2"><i data-lucide="sticky-note" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(b.notes) + '</p>' : '') +
      '<p class="flex gap-2"><i data-lucide="user-round" class="h-4 w-4 shrink-0 text-slate-400"></i>' + (b.technician ? Fixora.esc(b.technician) : 'Not assigned yet') + ' · ' + Fixora.esc(b.phone) + '</p></div>' +
      tech +
      '<div class="mt-4 rounded-xl bg-slate-50 p-4 dark:bg-slate-800">' +
      '<p class="text-xs font-bold uppercase tracking-wider text-slate-400">Status history</p><div class="mt-2 grid gap-2.5">' + timeline + '</div></div>' +
      '<div class="mt-4 grid gap-1.5 text-sm text-slate-600 dark:text-slate-300">' +
      '<div class="flex justify-between"><span>Inspection & diagnosis</span><span class="font-semibold text-slate-800 dark:text-slate-100">Free on approval</span></div>' + costRow + '</div>';
    Fixora.openModal('fxBookingModal');
  }

  function fixoraBaseCost(app) {
    return { 'Refrigerator': 750, 'Washing Machine': 650, 'Air Conditioner': 900, 'Television': 700, 'Microwave Oven': 450, 'Dishwasher': 700, 'Water Heater': 550, 'Kitchen Appliance': 450 }[app];
  }

  function openConfirmModal(b) {
    var body = document.getElementById('cfmBody');
    body.innerHTML =
      '<div class="text-center"><span class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-300"><i data-lucide="check-check" class="h-8 w-8"></i></span>' +
      '<h3 class="mt-4 text-xl font-extrabold text-slate-900 dark:text-white">Booking Requested!</h3>' +
      '<p class="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300">Your <strong>' + Fixora.esc(b.appliance) + '</strong> repair has been submitted. Keep your reference number handy.</p>' +
      '<div class="mt-4 rounded-xl border-2 border-dashed border-blue-300 bg-blue-50 py-3 dark:border-blue-700 dark:bg-blue-500/10"><p class="text-xs font-bold uppercase tracking-wider text-slate-400">Reference number</p>' +
      '<p class="text-lg font-extrabold tracking-widest text-blue-700 dark:text-blue-300">' + b.ref + '</p></div>' +
      '<p class="mt-3 text-sm text-slate-500 dark:text-slate-400">' + Fixora.weekdayLabel(b.date) + ' · ' + Fixora.esc(b.time) + '</p>' +
      '<p class="mt-1 text-xs text-slate-400">Demo confirmation — no real booking was sent to any company.</p></div>';
    var btns = document.getElementById('cfmBtns');
    btns.innerHTML =
      '<button class="fx-cfm-ok flex-1 rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-800">View my bookings</button>' +
      '<button class="fx-cfm-track flex-1 rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-teal-700">Track status</button>';
    btns.querySelector('.fx-cfm-ok').onclick = function () { Fixora.closeModal('fxConfirmModal'); setSection('bookings'); };
    btns.querySelector('.fx-cfm-track').onclick = function () { Fixora.closeModal('fxConfirmModal'); setSection('track'); };
    Fixora.openModal('fxConfirmModal');
  }

  function openReceiptModal(id) {
    var b = Fixora.bookings.get(id);
    if (!b) return;
    var parts = b.cost != null ? Math.round(b.cost * 0.3) : 0;
    var labor = (b.cost || 0) - parts;
    var body = document.getElementById('recBody');
    body.innerHTML =
      '<div class="border-b border-dashed border-slate-200 pb-4 text-center dark:border-slate-700">' +
      '<span class="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-teal-600 text-white"><i data-lucide="receipt" class="h-5 w-5"></i></span>' +
      '<h3 class="mt-2 text-lg font-extrabold text-slate-900 dark:text-white">Fixora Service Receipt</h3>' +
      '<p class="text-xs text-slate-400">' + b.ref + ' · ' + Fixora.formatDate(b.date) + '</p></div>' +
      '<div class="space-y-1.5 py-4 text-sm text-slate-600 dark:text-slate-300">' +
      '<div class="flex justify-between"><span>Customer</span><span class="font-semibold text-slate-800 dark:text-slate-100">' + Fixora.esc(b.name) + '</span></div>' +
      '<div class="flex justify-between"><span>Appliance</span><span class="font-semibold text-slate-800 dark:text-slate-100">' + Fixora.esc(b.appliance) + '</span></div>' +
      '<div class="flex justify-between"><span>Technician</span><span class="font-semibold text-slate-800 dark:text-slate-100">' + Fixora.esc(b.technician || '—') + '</span></div>' +
      '<div class="mt-3 flex justify-between border-t border-slate-200 pt-3 dark:border-slate-700"><span>Inspection & diagnosis</span><span class="font-semibold text-teal-600 dark:text-teal-400">Free on approval</span></div>' +
      '<div class="flex justify-between"><span>Repair charges</span><span>' + Fixora.money(labor) + '</span></div>' +
      '<div class="flex justify-between"><span>Spare parts</span><span>' + Fixora.money(parts) + '</span></div>' +
      '<div class="mt-3 flex justify-between border-t-2 border-slate-300 pt-3 text-base font-extrabold text-slate-900 dark:border-slate-600 dark:text-white"><span>Total (demo)</span><span>' + Fixora.money(b.cost || 0) + '</span></div>' +
      '<div class="flex justify-between text-xs text-slate-400"><span>Payment method</span><span>Demonstration — no payment taken</span></div>' +
      '<div class="mt-4 rounded-lg bg-emerald-50 p-3 text-center text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><i data-lucide="shield-check" class="me-1 inline h-3.5 w-3.5"></i>Covered by Fixora workmanship warranty</div></div>';
    Fixora.openModal('fxReceiptModal');
  }

  function bindNotifications() {
    var mark = document.getElementById('fxMarkAllRead');
    if (mark) mark.addEventListener('click', function () {
      var list = Fixora.get('fixora_notifications', []);
      list.forEach(function (n) { if (n.userId === user.id) n.read = true; });
      Fixora.set('fixora_notifications', list);
      Fixora.toast('All notifications marked as read.', 'success');
      setSection('notifications');
      updateBadges();
    });
  }

  function bindProfile() {
    var form = document.getElementById('fxProfileForm');
    if (form) form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('pfName').value.trim();
      var phone = document.getElementById('pfPhone').value.trim();
      var address = document.getElementById('pfAddress').value.trim();
      var ok = true;
      if (name.length < 2) { Fixora.setFieldError(document.getElementById('pfName'), 'Enter your full name.'); ok = false; }
      if (!/^[+\d][\d\s\-]{8,14}$/.test(phone)) { Fixora.setFieldError(document.getElementById('pfPhone'), 'Enter a valid phone.'); ok = false; }
      if (!ok) return;
      var users = Fixora.get('fixora_users', []);
      var stored = users.find(function (x) { return x.id === user.id; });
      if (stored) { stored.name = name; stored.phone = phone; stored.address = address; Fixora.set('fixora_users', users); }
      var session = Fixora.currentUser();
      session.name = name; session.phone = phone; session.address = address;
      Fixora.setCurrentUser(session);
      Fixora.toast('Profile updated.', 'success');
      setSection('profile');
    });
    var lo = document.getElementById('fxLogoutBtn2');
    if (lo) lo.addEventListener('click', function () { doLogout(); });
  }

  function updateBadges() {
    var unread = Fixora.get('fixora_notifications', []).filter(function (n) { return n.userId === user.id && !n.read; }).length;
    var badges = document.querySelectorAll('.fx-sb-badge');
    badges.forEach(function (b2) {
      b2.textContent = unread;
      b2.classList.toggle('hidden', unread === 0);
    });
  }

  /* ---------- logout ---------- */
  function doLogout() {
    Fixora.auth.logout();
    Fixora.toast('Logged out. See you soon!', 'info');
    setTimeout(function () { location.href = 'index.html'; }, 500);
  }

  /* ---------- state ---------- */
  function refreshState() {
    var u = Fixora.currentUser();
    if (!u) { location.href = 'login.html?next=dashboard.html'; return; }
    user = u;
    bookings = Fixora.bookings.forUser(u.id);
  }
  Fixora.customerRefresh = refreshState;

  /* ---------- boot ---------- */
  function boot() {
    refreshState();
    if (!user) return;

    var themeBtn = document.getElementById('fxThemeBtn2');
    if (themeBtn) themeBtn.addEventListener('click', function () { Fixora.toggleTheme(); });
    var dirBtn = document.getElementById('fxDirBtn2');
    if (dirBtn) dirBtn.addEventListener('click', function () { Fixora.toggleDirection(); });

    document.querySelectorAll('.fx-sb-item').forEach(function (it) {
      var sec = it.getAttribute('data-section');
      if (sec === 'logout') {
        it.addEventListener('click', function (e) {
          e.preventDefault();
          Fixora.confirm({ title: 'Log out of Fixora?', message: 'You will need to login again to access your dashboard.', confirmText: 'Logout', variant: 'danger' }).then(function (ok) { if (ok) doLogout(); });
        });
      } else if (sec) {
        it.addEventListener('click', function () { setSection(sec); closeDrawer(); });
      }
    });

    var openBtn = document.getElementById('fxMenuBtn2');
    if (openBtn) openBtn.addEventListener('click', openDrawer);
    var closeBtn = document.getElementById('fxSidebarClose');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    var backdrop = document.getElementById('fxSidebarBackdrop');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    var query = new URLSearchParams(location.search);
    var bookParam = query.get('book');
    var initial = query.get('section') || (bookParam ? 'book' : 'overview');
    setSection(initial, bookParam);
    updateBadges();
    // clean query string
    if (query.has('book') || query.has('section')) {
      history.replaceState({}, '', location.pathname);
    }
  }

  function openDrawer() {
    var sb = document.getElementById('fxSidebar');
    var bd = document.getElementById('fxSidebarBackdrop');
    if (sb) sb.classList.add('fx-sb-open');
    if (bd) bd.classList.add('fx-sb-backdrop-open');
  }
  function closeDrawer() {
    var sb = document.getElementById('fxSidebar');
    var bd = document.getElementById('fxSidebarBackdrop');
    if (sb) sb.classList.remove('fx-sb-open');
    if (bd) bd.classList.remove('fx-sb-backdrop-open');
  }

  if (Fixora.bootReady) boot();
  else document.addEventListener('fx:ready', boot, { once: true });
})();