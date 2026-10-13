/* Fixora - admin dashboard */
(function () {
  'use strict';
  var Fixora = window.Fixora;
  var bookings, technicians, services, pricing, areas, enquiries;
  var currentSection = 'overview';
  var filterStatus = 'All';
  var sortMode = 'newest';
  var searchQ = '';

  var ICONS = ['refrigerator', 'washing-machine', 'air-vent', 'tv', 'microwave', 'droplets', 'flame', 'chef-hat', 'snowflake', 'wrench', 'fan'];

  function statCard(icon, label, value, accent) {
    return '<div class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">' +
      '<div class="flex items-center gap-3"><span class="flex h-11 w-11 items-center justify-center rounded-xl ' + accent + '"><i data-lucide="' + icon + '" class="h-5 w-5"></i></span>' +
      '<div><p class="text-2xl font-extrabold text-slate-900 dark:text-white">' + value + '</p><p class="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">' + label + '</p></div></div></div>';
  }

  function badgeCell(x) { return '<span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">' + Fixora.esc(x) + '</span>'; }

  /* ================= overview ================= */
  function renderOverview() {
    var counts = Fixora.bookings.statusCounts(bookings);
    var active = bookings.length - counts.Completed - counts.Cancelled;
    var revenue = bookings.filter(function (b) { return b.status === 'Completed'; }).reduce(function (s, b) { return s + (b.cost || 0); }, 0);
    var recent = bookings.slice(0, 5);
    var rows = recent.map(function (b) {
      return '<tr class="border-t border-slate-200 dark:border-slate-700">' +
        '<td class="px-3 py-3"><p class="text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(b.appliance) + '</p><p class="text-xs text-slate-400">' + b.ref + '</p></td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.esc(b.customerName || b.name) + '</td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.formatDate(b.date) + '</td>' +
        '<td class="px-3 py-3">' + Fixora.statusBadge(b.status) + '</td>' +
        '<td class="px-3 py-3 text-end text-sm font-bold text-slate-800 dark:text-slate-100">' + (b.cost != null ? Fixora.money(b.cost) : '—') + '</td></tr>';
    }).join('');
    var dist = Object.keys(counts).map(function (s) {
      var w = bookings.length ? Math.round(counts[s] / bookings.length * 100) : 0;
      return '<div><div class="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400"><span>' + Fixora.esc(s) + '</span><span>' + counts[s] + '</span></div>' +
        '<div class="mt-1 h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800"><div class="h-2 rounded-full ' + (Fixora.STATUS[s] ? Fixora.STATUS[s].dot : 'bg-slate-400') + '" style="width:' + w + '%"></div></div></div>';
    }).join('');
    var topTech = technicians.slice().sort(function (a, b2) { return b2.tasks - a.tasks; }).slice(0, 3).map(function (t) {
      return '<div class="flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-3 dark:border-slate-700">' +
        '<div class="flex items-center gap-3"><span class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">' + Fixora.esc(t.name.split(' ').map(function (w) { return w[0]; }).join('')) + '</span>' +
        '<div><p class="text-sm font-bold text-slate-900 dark:text-white">' + Fixora.esc(t.name) + '</p><p class="text-xs text-slate-400">' + Fixora.esc(t.specialty) + '</p></div></div>' +
        '<span class="flex items-center gap-1 text-xs font-bold text-amber-500"><i data-lucide="star" class="h-3.5 w-3.5 fill-current"></i>' + t.rating + '</span></div>';
    }).join('');
    return '<div class="grid gap-6">' +
      '  <div class="rounded-2xl bg-gradient-to-br from-blue-700 to-teal-600 p-6 text-white shadow-lg md:p-8">' +
      '    <p class="text-sm font-semibold text-blue-100">Admin overview</p>' +
      '    <h1 class="mt-1 text-2xl font-extrabold md:text-3xl">Welcome back, ' + Fixora.esc(user.name.split(' ')[0]) + '</h1>' +
      '    <p class="mt-2 text-sm text-blue-50">Manage bookings, technicians, services and pricing — all demo data is stored in this browser.</p></div>' +
      '  <div class="fx-stats-grid">' +
      statCard('layers', 'Total bookings', bookings.length, 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300') +
      statCard('timer', 'Active', active, 'bg-teal-50 text-teal-700 dark:bg-teal-500/10 dark:text-teal-300') +
      statCard('circle-check', 'Completed', counts.Completed, 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300') +
      statCard('receipt', 'Revenue (demo)', Fixora.money(revenue), 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300') +
      statCard('users', 'Customers', Fixora.auth.users().filter(function (u2) { return u2.role === 'customer'; }).length, 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300') +
      statCard('user-round', 'Technicians', technicians.length, 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300') +
      '  </div>' +
      '  <div class="grid gap-6 lg:grid-cols-3">' +
      '    <div class="rounded-2xl border border-slate-200 bg-white p-5 lg:col-span-2 dark:border-slate-700 dark:bg-slate-900">' +
      '      <div class="flex items-center justify-between"><h2 class="text-base font-extrabold text-slate-900 dark:text-white">Recent bookings</h2>' +
      '        <button class="fx-section-go text-sm font-bold text-blue-700 dark:text-blue-300" data-go="bookings">Manage all</button></div>' +
      '      <div class="mt-3 overflow-x-auto"><table class="w-full min-w-[520px]"><thead><tr class="text-start text-xs font-bold uppercase tracking-wider text-slate-400">' +
      '<th class="px-3 py-2 text-start">Job</th><th class="px-3 py-2 text-start">Customer</th><th class="px-3 py-2 text-start">Date</th><th class="px-3 py-2 text-start">Status</th><th class="px-3 py-2 text-end">Amount</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div>' +
      '    <div class="grid gap-6">' +
      '      <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><h2 class="text-base font-extrabold text-slate-900 dark:text-white">Status distribution</h2><div class="mt-4 grid gap-3">' + dist + '</div></div>' +
      '      <div class="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-700 dark:bg-slate-900"><h2 class="text-base font-extrabold text-slate-900 dark:text-white">Top technicians</h2><div class="mt-3 grid gap-3">' + topTech + '</div></div>' +
      '    </div></div></div>';
  }

  /* ================= bookings ================= */
  function filteredBookings() {
    var q = searchQ.toLowerCase().trim();
    var list = bookings.slice();
    if (filterStatus !== 'All') list = list.filter(function (b) { return b.status === filterStatus; });
    if (q) list = list.filter(function (b) {
      return [b.ref, b.appliance, b.customerName || b.name, b.phone, b.technician].some(function (v) { return v && String(v).toLowerCase().indexOf(q) > -1; });
    });
    if (sortMode === 'newest') list.sort(function (a, b2) { return new Date(b2.createdAt) - new Date(a.createdAt); });
    else if (sortMode === 'oldest') list.sort(function (a, b2) { return new Date(a.createdAt) - new Date(b2.createdAt); });
    else if (sortMode === 'date') list.sort(function (a, b2) { return a.date.localeCompare(b2.date); });
    else if (sortMode === 'appliance') list.sort(function (a, b2) { return a.appliance.localeCompare(b2.appliance); });
    return list;
  }

  function renderBookings() {
    var list = filteredBookings();
    var filterTabs = ['All'].concat(Fixora.BOOKING_STATUSES).map(function (s) {
      return '<button class="fx-flt-tab rounded-full px-3 py-1.5 text-xs font-bold transition ' + (s === filterStatus ? 'fx-tab-active' : 'bg-white text-slate-600 border border-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600') + '" data-status="' + s + '">' + s + '</button>';
    }).join('');
    var rows = list.map(function (b) {
      return '<tr class="border-t border-slate-200 transition hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40">' +
        '<td class="px-3 py-3"><p class="text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(b.appliance) + '</p><p class="text-xs font-semibold text-blue-600 dark:text-blue-400">' + b.ref + '</p></td>' +
        '<td class="px-3 py-3"><p class="text-sm font-semibold text-slate-700 dark:text-slate-200">' + Fixora.esc(b.customerName || b.name) + '</p><p class="text-xs text-slate-400">' + Fixora.esc(b.phone) + '</p></td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.formatDate(b.date) + '<p class="text-xs text-slate-400">' + Fixora.esc(b.time) + '</p></td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + (b.technician || '<span class="text-slate-400">Unassigned</span>') + '</td>' +
        '<td class="px-3 py-3">' + Fixora.statusBadge(b.status) + '</td>' +
        '<td class="px-3 py-3 text-end text-sm font-bold text-slate-800 dark:text-slate-100">' + (b.cost != null ? Fixora.money(b.cost) : '—') + '</td>' +
        '<td class="px-3 py-3 text-end"><button class="fx-bk-open inline-flex items-center gap-1 rounded-lg bg-blue-700 px-3 py-1.5 text-xs font-bold text-white" data-id="' + b.id + '"><i data-lucide="eye" class="h-3.5 w-3.5"></i>Manage</button></td></tr>';
    }).join('');
    return '<div class="grid gap-4">' +
      '  <div class="flex flex-wrap items-center justify-between gap-3">' +
      '    <div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">All Bookings</h2><p class="text-sm text-slate-500 dark:text-slate-400">' + list.length + ' of ' + bookings.length + ' bookings</p></div>' +
      '    <div class="flex items-center gap-2"><div class="relative"><i data-lucide="search" class="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 rtl-flip"></i>' +
      '      <input id="fxBookSearch" value="' + Fixora.esc(searchQ) + '" placeholder="Search ref, name, appliance…" class="w-56 rounded-lg border border-slate-300 bg-white py-2 ps-9 pe-3 text-sm focus:ring-2 focus:ring-blue-200 focus:outline-none dark:border-slate-600 dark:bg-slate-800 dark:text-white"></div>' +
      '      <select id="fxBookSort" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><option value="newest"' + (sortMode === 'newest' ? ' selected' : '') + '>Newest</option><option value="oldest"' + (sortMode === 'oldest' ? ' selected' : '') + '>Oldest</option><option value="date"' + (sortMode === 'date' ? ' selected' : '') + '>Visit date</option><option value="appliance"' + (sortMode === 'appliance' ? ' selected' : '') + '>Appliance A-Z</option></select></div></div>' +
      '  <div class="flex flex-wrap gap-1.5" id="fxFilterTabs">' + filterTabs + '</div>' +
      '  <div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"><div class="overflow-x-auto"><table class="w-full min-w-[820px]">' +
      '    <thead class="bg-slate-50 dark:bg-slate-800/60"><tr class="text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">' +
      '      <th class="px-3 py-3 text-start">Job</th><th class="px-3 py-3 text-start">Customer</th><th class="px-3 py-3 text-start">Visit</th><th class="px-3 py-3 text-start">Technician</th><th class="px-3 py-3 text-start">Status</th><th class="px-3 py-3 text-end">Amount</th><th class="px-3 py-3 text-end">Action</th></tr></thead>' +
      '    <tbody>' + (rows || '<tr><td colspan="7" class="px-3 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No bookings match your filters.</td></tr>') + '</tbody></table></div></div>' +
      '  <div class="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-500/10 dark:text-amber-300"><i data-lucide="info" class="h-4 w-4 shrink-0"></i><span>Status changes and technician assignments are simulated for this demo and affect only your browser’s stored data.</span></div>' +
      '</div>';
  }

  function openBookingManage(id) {
    var b = Fixora.bookings.get(id);
    if (!b) return;
    var techOptions = '<option value="">— Unassigned —</option>' + technicians.map(function (t) {
      return '<option value="' + t.id + '"' + (b.technicianId === t.id ? ' selected' : '') + '>' + Fixora.esc(t.name) + ' · ' + Fixora.esc(t.specialty) + '</option>';
    }).join('');
    var statusOptions = Fixora.BOOKING_STATUSES.map(function (s) {
      return '<option value="' + s + '"' + (b.status === s ? ' selected' : '') + '>' + s + '</option>';
    }).join('');
    var body = document.getElementById('admBkBody');
    body.innerHTML =
      '<div class="flex flex-wrap items-center justify-between gap-2"><p class="text-xs font-bold uppercase tracking-wider text-slate-400">' + b.ref + '</p>' + Fixora.statusBadge(b.status) + '</div>' +
      '<h3 class="mt-1 text-xl font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(b.appliance) + ' repair</h3>' +
      '<div class="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">' +
      '<p class="flex gap-2"><i data-lucide="user-round" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(b.customerName || b.name) + ' · ' + Fixora.esc(b.phone) + '</p>' +
      '<p class="flex gap-2"><i data-lucide="mail" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(b.email || '—') + '</p>' +
      '<p class="flex gap-2"><i data-lucide="calendar" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.formatDate(b.date) + ', ' + Fixora.esc(b.time) + '</p>' +
      '<p class="flex gap-2"><i data-lucide="clock" class="h-4 w-4 shrink-0 text-slate-400"></i>Booked ' + Fixora.timeAgo(b.createdAt) + '</p>' +
      '<p class="flex gap-2 sm:col-span-2"><i data-lucide="map-pin" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(b.address) + '</p>' +
      '<p class="flex gap-2 sm:col-span-2"><i data-lucide="alert-circle" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(b.issue) + '</p>' +
      (b.notes ? '<p class="flex gap-2 sm:col-span-2"><i data-lucide="sticky-note" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(b.notes) + '</p>' : '') +
      (b.cost != null ? '<p class="flex gap-2 sm:col-span-2 font-bold text-slate-800 dark:text-slate-100"><i data-lucide="receipt" class="h-4 w-4 shrink-0 text-slate-400"></i>Charged (demo): ' + Fixora.money(b.cost) + '</p>' : '') +
      '</div>' +
      '<div class="mt-5 grid gap-4 border-t border-slate-200 pt-5 sm:grid-cols-2 dark:border-slate-700">' +
      '  <div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Assign technician</label>' +
      '  <select id="admTechSel" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + techOptions + '</select></div>' +
      '  <div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Update status</label>' +
      '  <select id="admStatusSel" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + statusOptions + '</select></div></div>';
    document.getElementById('admTechSel').addEventListener('change', function () {
      var tid = this.value;
      var res = Fixora.bookings.assignTechnician(id, tid);
      if (res) { Fixora.toast('Technician assigned: ' + (res.technician || 'none') + '.', 'success'); Fixora.confirmSaved = true; }
      refreshAll(); setSection('bookings');
    });
    document.getElementById('admStatusSel').addEventListener('change', function () {
      var st = this.value;
      var prev = b.status;
      if (st === 'Cancelled') {
        Fixora.confirm({ title: 'Cancel this booking?', message: 'The customer will be notified that booking ' + b.ref + ' was cancelled.', confirmText: 'Cancel booking', variant: 'danger' }).then(function (ok) {
          if (ok) { Fixora.bookings.setStatus(id, 'Cancelled'); Fixora.toast('Booking cancelled.', 'success'); refreshAll(); setSection('bookings'); }
          else refreshAll(); setSection('bookings');
        });
      } else {
        var after = Fixora.bookings.setStatus(id, st);
        if (after && st === 'Completed') Fixora.toast('Marked completed. Demo charge generated: ' + Fixora.money(after.cost) + '.', 'success');
        else Fixora.toast('Status updated to "' + st + '".', 'success');
        void prev;
        refreshAll(); setSection('bookings');
      }
    });
    Fixora.openModal('fxAdmBookingModal');
  }

  /* ================= customers ================= */
  function renderCustomers() {
    var q = searchQ.toLowerCase().trim();
    var customers = Fixora.auth.users().filter(function (u2) { return u2.role === 'customer'; })
      .filter(function (u2) { return !q || (u2.name + u2.email + u2.phone).toLowerCase().indexOf(q) > -1; });
    var rows = customers.map(function (c) {
      var cBookings = bookings.filter(function (b) { return b.userId === c.id; });
      var done = cBookings.filter(function (b) { return b.status === 'Completed'; }).length;
      var spent = cBookings.filter(function (b) { return b.status === 'Completed'; }).reduce(function (s, b) { return s + (b.cost || 0); }, 0);
      return '<tr class="border-t border-slate-200 dark:border-slate-700">' +
        '<td class="px-3 py-3"><div class="flex items-center gap-2.5"><span class="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-teal-600 text-xs font-bold text-white">' + Fixora.esc(c.name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('')) + '</span>' +
        '<div><p class="text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(c.name) + '</p><p class="text-xs text-slate-400">Member since ' + Fixora.formatDate(c.joined) + '</p></div></div></td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.esc(c.email) + '<p class="text-xs text-slate-400">' + Fixora.esc(c.phone) + '</p></td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + cBookings.length + '</td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + done + '</td>' +
        '<td class="px-3 py-3 text-end text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.money(spent) + '</td>' +
        '<td class="px-3 py-3 text-end"><button class="fx-cust-view rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800" data-id="' + c.id + '">View</button></td></tr>';
    }).join('');
    return '<div class="grid gap-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Customers</h2>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">' + customers.length + ' registered customers (demo)</p></div>' +
      '<div class="relative"><i data-lucide="search" class="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 rtl-flip"></i>' +
      '<input id="fxCustSearch" value="' + Fixora.esc(searchQ) + '" placeholder="Search customers…" class="w-64 rounded-lg border border-slate-300 bg-white py-2 ps-9 pe-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"></div></div>' +
      '<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"><div class="overflow-x-auto"><table class="w-full min-w-[760px]"><thead class="bg-slate-50 dark:bg-slate-800/60"><tr class="text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">' +
      '<th class="px-3 py-3 text-start">Customer</th><th class="px-3 py-3 text-start">Contact</th><th class="px-3 py-3 text-start">Bookings</th><th class="px-3 py-3 text-start">Completed</th><th class="px-3 py-3 text-end">Spent</th><th class="px-3 py-3 text-end">Action</th></tr></thead>' +
      '<tbody>' + (rows || '<tr><td colspan="6" class="px-3 py-10 text-center">No customers found.</td></tr>') + '</tbody></table></div></div></div>';
  }

  function openCustomerView(cId) {
    var c = Fixora.auth.users().find(function (u2) { return u2.id === cId; });
    if (!c) return;
    var cBookings = bookings.filter(function (b) { return b.userId === cId; });
    var rows = cBookings.map(function (b) {
      return '<tr class="border-t border-slate-200 dark:border-slate-700"><td class="px-3 py-2.5 text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(b.appliance) + '</td>' +
        '<td class="px-3 py-2.5 text-xs text-slate-500 dark:text-slate-400">' + b.ref + '</td>' +
        '<td class="px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300">' + Fixora.formatDate(b.date) + '</td>' +
        '<td class="px-3 py-2.5">' + Fixora.statusBadge(b.status) + '</td></tr>';
    }).join('');
    document.getElementById('fxAdmCustBody').innerHTML =
      '<div class="flex items-center gap-3"><span class="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-teal-600 text-base font-extrabold text-white">' + Fixora.esc(c.name.split(' ').map(function (w) { return w[0]; }).slice(0, 2).join('')) + '</span>' +
      '<div><h3 class="text-lg font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(c.name) + '</h3>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">' + Fixora.esc(c.email) + ' · ' + Fixora.esc(c.phone) + '</p></div></div>' +
      '<div class="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">' +
      '<p class="flex justify-between"><span>Registered</span><span class="font-semibold">' + Fixora.formatDate(c.joined) + '</span></p>' +
      '<p class="mt-1 flex justify-between"><span>Default address</span><span class="max-w-[55%] text-end font-semibold">' + Fixora.esc(c.address || '—') + '</span></p></div>' +
      '<div class="mt-5"><h4 class="text-sm font-extrabold text-slate-900 dark:text-white">Bookings (' + cBookings.length + ')</h4>' +
      '<div class="mt-2 overflow-x-auto"><table class="w-full min-w-[420px]"><thead><tr class="text-start text-xs font-bold uppercase tracking-wider text-slate-400">' +
      '<th class="px-3 py-2 text-start">Appliance</th><th class="px-3 py-2 text-start">Ref</th><th class="px-3 py-2 text-start">Date</th><th class="px-3 py-2 text-start">Status</th></tr></thead>' +
      '<tbody>' + (rows || '<tr><td colspan="4" class="px-3 py-6 text-center text-sm text-slate-500">No bookings yet.</td></tr>') + '</tbody></table></div></div>';
    Fixora.openModal('fxAdmCustModal');
  }

  /* ================= technicians ================= */
  function renderTechnicians() {
    var rows = technicians.map(function (t) {
      var assigned = bookings.filter(function (b) { return b.technicianId === t.id && b.status !== 'Completed' && b.status !== 'Cancelled'; }).length;
      return '<tr class="border-t border-slate-200 dark:border-slate-700">' +
        '<td class="px-3 py-3"><div class="flex items-center gap-2.5"><span class="flex h-9 w-9 items-center justify-center rounded-full bg-blue-700 text-xs font-bold text-white">' + Fixora.esc(t.name.split(' ').map(function (w) { return w[0]; }).join('')) + '</span>' +
        '<div><p class="text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(t.name) + ' <span class="ms-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">' + (t.active ? 'Active' : 'Inactive') + '</span></p>' +
        '<p class="text-xs text-slate-400">' + Fixora.esc(t.phone) + '</p></div></div></td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.esc(t.specialty) + '</td>' +
        '<td class="px-3 py-3"><span class="flex items-center gap-1 text-sm font-bold text-amber-500"><i data-lucide="star" class="h-3.5 w-3.5 fill-current"></i>' + t.rating + '</span></td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + t.tasks + ' jobs</td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + assigned + ' active</td>' +
        '<td class="px-3 py-3 text-end space-x-1"><button class="fx-tech-edit rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800" data-id="' + t.id + '">Edit</button>' +
        '<button class="fx-tech-del rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10" data-id="' + t.id + '">Delete</button></td></tr>';
    }).join('');
    return '<div class="grid gap-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Technicians</h2>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">' + technicians.length + ' sample technicians</p></div>' +
      '<button id="fxTechAdd" class="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"><i data-lucide="plus" class="h-4 w-4"></i>Add technician</button></div>' +
      '<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"><div class="overflow-x-auto"><table class="w-full min-w-[760px]"><thead class="bg-slate-50 dark:bg-slate-800/60"><tr class="text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">' +
      '<th class="px-3 py-3 text-start">Technician</th><th class="px-3 py-3 text-start">Specialty</th><th class="px-3 py-3 text-start">Rating</th><th class="px-3 py-3 text-start">Completed</th><th class="px-3 py-3 text-start">Active jobs</th><th class="px-3 py-3 text-end">Actions</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div></div>';
  }

  function openTechModal(id) {
    var t = id ? technicians.find(function (x) { return x.id === id; }) : null;
    var title = t ? 'Edit technician' : 'Add technician';
    document.getElementById('admTechTitle').textContent = title;
    var body = document.getElementById('admTechForm');
    body.innerHTML =
      '<div class="grid gap-4"><div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full name *</label>' +
      '<input id="tmName" value="' + Fixora.esc(t ? t.name : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><p data-field-error class="hidden"></p></div>' +
      '<div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone *</label>' +
      '<input id="tmPhone" value="' + Fixora.esc(t ? t.phone : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><p data-field-error class="hidden"></p></div>' +
      '<div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Specialty</label>' +
      '<input id="tmSpec" value="' + Fixora.esc(t ? t.specialty : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><p data-field-error class="hidden"></p></div>' +
      '<div class="grid grid-cols-2 gap-4"><div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rating</label>' +
      '<input id="tmRating" type="number" step="0.1" min="0" max="5" value="' + (t ? t.rating : 4.5) + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"></div>' +
      '<div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Completed jobs</label>' +
      '<input id="tmTasks" type="number" min="0" value="' + (t ? t.tasks : 0) + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"></div></div>' +
      '<label class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"><input id="tmActive" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-blue-600" ' + (!t || t.active ? 'checked' : '') + '> Active (available for assignments)</label>' +
      '</div>';
    var save = document.getElementById('admTechSave');
    save.onclick = function () {
      var name = document.getElementById('tmName').value.trim();
      var phone = document.getElementById('tmPhone').value.trim();
      var spec = document.getElementById('tmSpec').value.trim();
      var ok = true;
      Fixora.clearFieldErrors(body);
      if (name.length < 2) { Fixora.setFieldError(document.getElementById('tmName'), 'Required.'); ok = false; }
      if (!/^[+\d][\d\s\-]{8,14}$/.test(phone)) { Fixora.setFieldError(document.getElementById('tmPhone'), 'Valid phone required.'); ok = false; }
      if (!ok) return;
      var techs = technicians.slice();
      if (t) {
        var rec = techs.find(function (x) { return x.id === t.id; });
        rec.name = name; rec.phone = phone; rec.specialty = spec || 'General';
        rec.rating = Math.min(5, Math.max(1, Number(document.getElementById('tmRating').value) || 4.5));
        rec.tasks = Math.max(0, Number(document.getElementById('tmTasks').value) || 0);
        rec.active = document.getElementById('tmActive').checked;
        Fixora.toast('Technician updated.', 'success');
      } else {
        techs.push({ id: 't' + Fixora.uid().toLowerCase(), name: name, phone: phone, specialty: spec || 'General', rating: Math.min(5, Math.max(1, Number(document.getElementById('tmRating').value) || 4.5)), tasks: Math.max(0, Number(document.getElementById('tmTasks').value) || 0), active: document.getElementById('tmActive').checked });
        Fixora.toast('Technician added.', 'success');
      }
      Fixora.set('fixora_technicians', techs);
      Fixora.closeModal('fxTechModal');
      refreshAll(); setSection('technicians');
    };
    Fixora.openModal('fxTechModal');
  }

  function deleteTechnician(id) {
    var t = technicians.find(function (x) { return x.id === id; });
    Fixora.confirm({ title: 'Delete ' + (t ? t.name : 'this technician') + '?', message: 'Bookings will keep their current assignment history, but the technician will no longer be available for new assignments.', confirmText: 'Delete technician', variant: 'danger' }).then(function (ok) {
      if (!ok) return;
      Fixora.set('fixora_technicians', technicians.filter(function (x) { return x.id !== id; }));
      Fixora.toast('Technician removed.', 'success');
      refreshAll(); setSection('technicians');
    });
  }

  /* ================= services ================= */
  function renderServices() {
    var rows = services.map(function (s) {
      return '<tr class="border-t border-slate-200 dark:border-slate-700">' +
        '<td class="px-3 py-3"><div class="flex items-center gap-2.5"><span class="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300"><i data-lucide="' + Fixora.esc(s.icon || 'wrench') + '" class="h-4 w-4"></i></span>' +
        '<div><p class="text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(s.name) + '</p><p class="text-xs text-slate-400">' + (s.problems ? s.problems.length : 0) + ' common problems</p></div></div></td>' +
        '<td class="px-3 py-3 text-sm font-semibold text-slate-800 dark:text-slate-100">' + Fixora.money(s.price) + '</td>' +
        '<td class="px-3 py-3">' + (s.active ? '<span class="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">Active</span>' : '<span class="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500 dark:bg-slate-800 dark:text-slate-400">Hidden</span>') + '</td>' +
        '<td class="px-3 py-3"><img src="' + (s.image || Fixora.emptyImg) + '" alt="' + Fixora.esc(s.name) + '" class="h-10 w-16 rounded-lg object-cover"></td>' +
        '<td class="px-3 py-3 text-end space-x-1"><button class="fx-svc-edit rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800" data-id="' + s.id + '">Edit</button>' +
        '<button class="fx-svc-del rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10" data-id="' + s.id + '">Delete</button></td></tr>';
    }).join('');
    return '<div class="grid gap-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Appliance Services</h2>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">Service categories shown on the public site</p></div>' +
      '<button id="fxSvcAdd" class="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"><i data-lucide="plus" class="h-4 w-4"></i>Add service</button></div>' +
      '<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"><div class="overflow-x-auto"><table class="w-full min-w-[720px]"><thead class="bg-slate-50 dark:bg-slate-800/60"><tr class="text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">' +
      '<th class="px-3 py-3 text-start">Service</th><th class="px-3 py-3 text-start">Starting price</th><th class="px-3 py-3 text-start">Status</th><th class="px-3 py-3 text-start">Preview</th><th class="px-3 py-3 text-end">Actions</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div></div>';
  }

  function openSvcModal(id) {
    var s = id ? services.find(function (x) { return x.id === id; }) : null;
    document.getElementById('admSvcTitle').textContent = s ? 'Edit service' : 'Add service';
    var body = document.getElementById('admSvcForm');
    var iconOpts = ICONS.map(function (i) { return '<option value="' + i + '"' + (s && s.icon === i ? ' selected' : '') + '>' + i + '</option>'; }).join('');
    body.innerHTML =
      '<div class="grid gap-4"><div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Service name *</label>' +
      '<input id="smName" value="' + Fixora.esc(s ? s.name : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="e.g. Refrigerator Repair"><p data-field-error class="hidden"></p></div>' +
      '<div class="grid grid-cols-2 gap-4"><div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Starting price (₹) *</label>' +
      '<input id="smPrice" type="number" min="0" value="' + (s ? s.price : 399) + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><p data-field-error class="hidden"></p></div>' +
      '<div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Icon</label>' +
      '<select id="smIcon" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + iconOpts + '</select></div></div>' +
      '<div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Image URL (paste Unsplash/Pexels link)</label>' +
      '<input id="smImage" value="' + Fixora.esc(s ? s.image : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="https://…"><p data-field-error class="hidden"></p></div>' +
      '<div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Short description</label>' +
      '<textarea id="smDesc" rows="2" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + Fixora.esc(s ? s.desc : '') + '</textarea><p data-field-error class="hidden"></p></div>' +
      '<div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Common problems (one per line)</label>' +
      '<textarea id="smProblems" rows="3" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + Fixora.esc(s ? (s.problems || []).join('\n') : '') + '</textarea></div>' +
      '<div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Diagnosis note</label>' +
      '<textarea id="smDiag" rows="2" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + Fixora.esc(s ? s.diag : '') + '</textarea></div>' +
      '<label class="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200"><input id="smActive" type="checkbox" class="h-4 w-4 rounded" ' + (!s || s.active ? 'checked' : '') + '> Show this service on the website</label></div>';
    var save = document.getElementById('admSvcSave');
    save.onclick = function () {
      var name = document.getElementById('smName').value.trim();
      var price = Number(document.getElementById('smPrice').value);
      var ok = true;
      Fixora.clearFieldErrors(body);
      if (name.length < 3) { Fixora.setFieldError(document.getElementById('smName'), 'Required.'); ok = false; }
      if (!(price >= 0)) { Fixora.setFieldError(document.getElementById('smPrice'), 'Valid price required.'); ok = false; }
      if (!ok) return;
      var list = services.slice();
      var record = { id: s ? s.id : 'sv-' + Fixora.uid().toLowerCase(), name: name, price: price, icon: document.getElementById('smIcon').value, image: document.getElementById('smImage').value.trim() || Fixora.emptyImg, desc: document.getElementById('smDesc').value.trim(), problems: document.getElementById('smProblems').value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean), diag: document.getElementById('smDiag').value.trim(), active: document.getElementById('smActive').checked, process: s ? s.process : ['Share the issue on the booking form', 'Technician inspects the unit at home', 'Advice and transparent quote', 'Approved repairs completed'] };
      if (s) { list = list.map(function (x) { return x.id === s.id ? Object.assign({}, x, record) : x; }); }
      else { list.push(record); }
      Fixora.set('fixora_services', list);
      Fixora.toast('Service saved.', 'success');
      Fixora.closeModal('fxSvcModal');
      refreshAll(); setSection('services');
    };
    Fixora.openModal('fxSvcModal');
  }

  function deleteService(id) {
    var s = services.find(function (x) { return x.id === id; });
    Fixora.confirm({ title: 'Delete "' + (s ? s.name : 'this service') + '"?', message: 'The service will be removed from the website and dashboards. This cannot be undone.', confirmText: 'Delete service', variant: 'danger' }).then(function (ok) {
      if (!ok) return;
      Fixora.set('fixora_services', services.filter(function (x) { return x.id !== id; }));
      Fixora.toast('Service deleted.', 'success');
      refreshAll(); setSection('services');
    });
  }

  /* ================= pricing ================= */
  function renderPricing() {
    var rows = pricing.map(function (row) {
      return '<tr class="border-t border-slate-200 dark:border-slate-700">' +
        '<td class="px-3 py-3"><p class="text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(row.service) + '</p><p class="text-xs text-slate-400">' + (row.included ? row.included.length : 0) + ' included · ' + (row.additional ? row.additional.length : 0) + ' possible extras</p></td>' +
        '<td class="px-3 py-3 text-sm font-bold text-teal-600 dark:text-teal-400">' + Fixora.money(row.startingPrice) + '</td>' +
        '<td class="px-3 py-3 text-end space-x-1"><button class="fx-pc-edit rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800" data-id="' + row.id + '">Edit</button>' +
        '<button class="fx-pc-del rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10" data-id="' + row.id + '">Delete</button></td></tr>';
    }).join('');
    return '<div class="grid gap-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Pricing Management</h2>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">Sample pricing shown on the public pricing guide</p></div>' +
      '<button id="fxPcAdd" class="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"><i data-lucide="plus" class="h-4 w-4"></i>Add price row</button></div>' +
      '<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"><div class="overflow-x-auto"><table class="w-full min-w-[680px]"><thead class="bg-slate-50 dark:bg-slate-800/60"><tr class="text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">' +
      '<th class="px-3 py-3 text-start">Service</th><th class="px-3 py-3 text-start">Starts at</th><th class="px-3 py-3 text-end">Actions</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div>' +
      '<div class="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-500/10 dark:text-amber-300"><i data-lucide="info" class="me-1 inline h-4 w-4"></i>All prices shown are illustrative estimates. Final charges depend on inspection, model, parts and repair complexity.</div></div>';
  }

  function openPcModal(id) {
    var row = id ? pricing.find(function (x) { return x.id === id; }) : null;
    document.getElementById('admPcTitle').textContent = row ? 'Edit price row' : 'Add price row';
    var body = document.getElementById('admPcForm');
    body.innerHTML =
      '<div class="grid gap-4"><div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Service name *</label>' +
      '<input id="pmName" value="' + Fixora.esc(row ? row.service : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><p data-field-error class="hidden"></p></div>' +
      '<div class="grid grid-cols-2 gap-4"><div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Starting price (₹) *</label>' +
      '<input id="pmPrice" type="number" min="0" value="' + (row ? row.startingPrice : 399) + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><p data-field-error class="hidden"></p></div>' +
      '<div class="text-sm"><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Image URL</label>' +
      '<input id="pmImage" value="' + Fixora.esc(row && row.image ? row.image : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"></div></div>' +
      '<div class="grid grid-cols-2 gap-4"><div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">What is included (one per line)</label>' +
      '<textarea id="pmIncluded" rows="4" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + Fixora.esc(row ? (row.included || []).join('\n') : '') + '</textarea></div>' +
      '<div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Possible additional charges</label>' +
      '<textarea id="pmAdditional" rows="4" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white">' + Fixora.esc(row ? (row.additional || []).join('\n') : '') + '</textarea></div></div>' +
      '<div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Booking link (appliance)</label>' +
      '<input id="pmBook" value="' + Fixora.esc(row && row.book ? row.book : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white" placeholder="e.g. Refrigerator"></div>' +
      '</div>';
    var save = document.getElementById('admPcSave');
    save.onclick = function () {
      var name = document.getElementById('pmName').value.trim();
      var price = Number(document.getElementById('pmPrice').value);
      var ok = true;
      Fixora.clearFieldErrors(body);
      if (name.length < 3) { Fixora.setFieldError(document.getElementById('pmName'), 'Required.'); ok = false; }
      if (!(price >= 0)) { Fixora.setFieldError(document.getElementById('pmPrice'), 'Valid price required.'); ok = false; }
      if (!ok) return;
      var list = pricing.slice();
      var rec = {
        id: row ? row.id : 'p-' + Fixora.uid().toLowerCase(), service: name, startingPrice: price,
        included: document.getElementById('pmIncluded').value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean),
        additional: document.getElementById('pmAdditional').value.split('\n').map(function (l) { return l.trim(); }).filter(Boolean),
        image: document.getElementById('pmImage').value.trim(), book: document.getElementById('pmBook').value.trim()
      };
      if (row) list = list.map(function (x) { return x.id === row.id ? Object.assign({}, x, rec) : x; });
      else list.push(rec);
      Fixora.set('fixora_pricing', list);
      Fixora.toast('Price row saved.', 'success');
      Fixora.closeModal('fxPcModal');
      refreshAll(); setSection('pricing');
    };
    Fixora.openModal('fxPcModal');
  }

  function deletePricing(id) {
    var row = pricing.find(function (x) { return x.id === id; });
    Fixora.confirm({ title: 'Delete "' + (row ? row.service : 'this row') + '"?', message: 'This price row will be removed from the pricing guide.', confirmText: 'Delete', variant: 'danger' }).then(function (ok) {
      if (!ok) return;
      Fixora.set('fixora_pricing', pricing.filter(function (x) { return x.id !== id; }));
      Fixora.toast('Price row deleted.', 'success');
      refreshAll(); setSection('pricing');
    });
  }

  /* ================= areas ================= */
  function renderAreas() {
    var rows = areas.map(function (a) {
      return '<tr class="border-t border-slate-200 dark:border-slate-700">' +
        '<td class="px-3 py-3 text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(a.name) + '</td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.esc(a.city) + '</td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.esc(a.pincodes) + '</td>' +
        '<td class="px-3 py-3 text-end space-x-1"><button class="fx-area-edit rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800" data-id="' + a.id + '">Edit</button>' +
        '<button class="fx-area-del rounded-lg border border-rose-300 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10" data-id="' + a.id + '">Delete</button></td></tr>';
    }).join('');
    return '<div class="grid gap-4"><div class="flex flex-wrap items-center justify-between gap-3"><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Service Areas</h2>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">Areas where Fixora offers repair service</p></div>' +
      '<button id="fxAreaAdd" class="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white hover:bg-blue-800"><i data-lucide="plus" class="h-4 w-4"></i>Add area</button></div>' +
      '<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"><div class="overflow-x-auto"><table class="w-full min-w-[560px]"><thead class="bg-slate-50 dark:bg-slate-800/60"><tr class="text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">' +
      '<th class="px-3 py-3 text-start">Area</th><th class="px-3 py-3 text-start">City</th><th class="px-3 py-3 text-start">Pincodes</th><th class="px-3 py-3 text-end">Actions</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></div></div></div>';
  }

  function openAreaModal(id) {
    var a = id ? areas.find(function (x) { return x.id === id; }) : null;
    document.getElementById('admAreaTitle').textContent = a ? 'Edit area' : 'Add area';
    var body = document.getElementById('admAreaForm');
    body.innerHTML =
      '<div class="grid gap-4"><div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Area name *</label>' +
      '<input id="amName" value="' + Fixora.esc(a ? a.name : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><p data-field-error class="hidden"></p></div>' +
      '<div data-field><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">City *</label>' +
      '<input id="amCity" value="' + Fixora.esc(a ? a.city : 'Mumbai') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"><p data-field-error class="hidden"></p></div>' +
      '<div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Pincodes (comma separated)</label>' +
      '<input id="amPin" value="' + Fixora.esc(a ? a.pincodes : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"></div></div>';
    var save = document.getElementById('admAreaSave');
    save.onclick = function () {
      var name = document.getElementById('amName').value.trim();
      var city = document.getElementById('amCity').value.trim();
      var ok = name.length >= 2 && city.length >= 2;
      Fixora.clearFieldErrors(body);
      if (name.length < 2) { Fixora.setFieldError(document.getElementById('amName'), 'Required.'); ok = false; }
      if (city.length < 2) { Fixora.setFieldError(document.getElementById('amCity'), 'Required.'); ok = false; }
      if (!ok) return;
      var list = areas.slice();
      var rec = { id: a ? a.id : 'a' + Fixora.uid().toLowerCase(), name: name, city: city, pincodes: document.getElementById('amPin').value.trim() };
      if (a) list = list.map(function (x) { return x.id === a.id ? Object.assign({}, x, rec) : x; });
      else list.push(rec);
      Fixora.set('fixora_areas', list);
      Fixora.toast('Service area saved.', 'success');
      Fixora.closeModal('fxAreaModal');
      refreshAll(); setSection('areas');
    };
    Fixora.openModal('fxAreaModal');
  }

  function deleteArea(id) {
    var a = areas.find(function (x) { return x.id === id; });
    Fixora.confirm({ title: 'Delete "' + (a ? a.name : 'this area') + '"?', message: 'This service area will be removed from the list.', confirmText: 'Delete', variant: 'danger' }).then(function (ok) {
      if (!ok) return;
      Fixora.set('fixora_areas', areas.filter(function (x) { return x.id !== id; }));
      Fixora.toast('Service area removed.', 'success');
      refreshAll(); setSection('areas');
    });
  }

  /* ================= enquiries ================= */
  function renderEnquiries() {
    var rows = enquiries.map(function (enq) {
      return '<tr class="border-t border-slate-200 dark:border-slate-700">' +
        '<td class="px-3 py-3"><p class="text-sm font-bold text-slate-800 dark:text-slate-100">' + Fixora.esc(enq.name) + '</p><p class="text-xs text-slate-400">' + Fixora.esc(enq.phone) + ' · ' + Fixora.esc(enq.email) + '</p></td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.esc(enq.appliance) + '</td>' +
        '<td class="px-3 py-3 text-sm text-slate-600 dark:text-slate-300">' + Fixora.esc(enq.problem) + '</td>' +
        '<td class="px-3 py-3 text-xs text-slate-400">' + Fixora.timeAgo(enq.createdAt) + '</td>' +
        '<td class="px-3 py-3">' + (enq.status === 'Contacted' ? badgeCell('Contacted') : badgeCell('New')) + '</td>' +
        '<td class="px-3 py-3 text-end space-x-1"><button class="fx-enq-view rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800" data-id="' + enq.id + '">View</button>' +
        (enq.status !== 'Contacted' ? '<button class="fx-enq-done rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-bold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-700 dark:text-emerald-300 dark:hover:bg-emerald-500/10" data-id="' + enq.id + '">Mark contacted</button>' : '') + '</td></tr>';
    }).join('');
    return '<div class="grid gap-4"><div><h2 class="text-xl font-extrabold text-slate-900 dark:text-white">Enquiries</h2>' +
      '<p class="text-sm text-slate-500 dark:text-slate-400">Contact form submissions (stored locally, no real message sent)</p></div>' +
      '<div class="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700"><div class="overflow-x-auto"><table class="w-full min-w-[820px]"><thead class="bg-slate-50 dark:bg-slate-800/60"><tr class="text-start text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">' +
      '<th class="px-3 py-3 text-start">Customer</th><th class="px-3 py-3 text-start">Appliance</th><th class="px-3 py-3 text-start">Problem</th><th class="px-3 py-3 text-start">Received</th><th class="px-3 py-3 text-start">Status</th><th class="px-3 py-3 text-end">Actions</th></tr></thead>' +
      '<tbody>' + (rows || '<tr><td colspan="6" class="px-3 py-10 text-center text-sm text-slate-500 dark:text-slate-400">No enquiries yet.</td></tr>') + '</tbody></table></div></div></div>';
  }

  function openEnquiryView(id) {
    var enq = enquiries.find(function (x) { return x.id === id; });
    if (!enq) return;
    document.getElementById('fxEnqBody').innerHTML =
      '<div class="flex items-center justify-between"><h3 class="text-lg font-extrabold text-slate-900 dark:text-white">' + Fixora.esc(enq.name) + '</h3>' + badgeCell(enq.status) + '</div>' +
      '<div class="mt-4 grid gap-2 text-sm text-slate-600 dark:text-slate-300 sm:grid-cols-2">' +
      '<p class="flex gap-2"><i data-lucide="phone" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(enq.phone || '—') + '</p>' +
      '<p class="flex gap-2"><i data-lucide="mail" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(enq.email || '—') + '</p>' +
      '<p class="flex gap-2"><i data-lucide="wrench" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(enq.appliance || '—') + '</p>' +
      '<p class="flex gap-2"><i data-lucide="calendar" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(enq.date ? Fixora.formatDate(enq.date) : '—') + ' ' + Fixora.esc(enq.time || '') + '</p>' +
      '<p class="flex gap-2 sm:col-span-2"><i data-lucide="map-pin" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(enq.address || '—') + '</p>' +
      '<p class="flex gap-2 sm:col-span-2"><i data-lucide="message-square" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(enq.problem || '—') + '</p>' +
      (enq.notes ? '<p class="flex gap-2 sm:col-span-2"><i data-lucide="sticky-note" class="h-4 w-4 shrink-0 text-slate-400"></i>' + Fixora.esc(enq.notes) + '</p>' : '') +
      '</div>';
    Fixora.openModal('fxEnqModal');
  }

  function markEnquiryContacted(id) {
    var list = enquiries.slice();
    var enq = list.find(function (x) { return x.id === id; });
    if (enq) enq.status = 'Contacted';
    Fixora.set('fixora_enquiries', list);
    Fixora.toast('Enquiry marked as contacted.', 'success');
    refreshAll(); setSection('enquiries');
  }

  /* ================= settings ================= */
  function renderSettings() {
    var admins = Fixora.auth.users().filter(function (u2) { return u2.role === 'admin'; });
    var a = admins[0];
    return '<div class="mx-auto max-w-2xl grid gap-6">' +
      '  <div class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"><h2 class="text-lg font-extrabold text-slate-900 dark:text-white">Appearance</h2>' +
      '    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Settings are stored in this browser (localStorage) and apply across the site.</p>' +
      '    <div class="mt-5 grid gap-4 sm:grid-cols-2"><div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><p class="text-sm font-bold text-slate-800 dark:text-slate-100">Theme</p>' +
      '      <p class="text-xs text-slate-400">Dark or light mode</p><button id="fxSettingsTheme" class="mt-3 inline-flex items-center gap-2 rounded-xl bg-blue-700 px-4 py-2 text-sm font-bold text-white">' +
      '      <i data-lucide="' + (document.documentElement.classList.contains('dark') ? 'sun' : 'moon') + '" class="h-4 w-4"></i>Switch to ' + (document.documentElement.classList.contains('dark') ? 'Light' : 'Dark') + '</button></div>' +
      '      <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700"><p class="text-sm font-bold text-slate-800 dark:text-slate-100">Direction</p>' +
      '      <p class="text-xs text-slate-400">LTR or RTL layout</p><button id="fxSettingsDir" class="mt-3 inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-bold text-white">' +
      '      <i data-lucide="arrow-right-left" class="h-4 w-4"></i>Switch to ' + (document.documentElement.getAttribute('dir') === 'rtl' ? 'LTR' : 'RTL') + '</button></div></div></div>' +
      '  <div class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"><h2 class="text-lg font-extrabold text-slate-900 dark:text-white">Demo data</h2>' +
      '    <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">Reset all Fixora data stored in this browser to the original sample set. Logged-in sessions also clear.</p>' +
      '    <button id="fxResetData" class="mt-4 inline-flex items-center gap-2 rounded-xl border border-rose-300 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 dark:border-rose-700 dark:text-rose-400 dark:hover:bg-rose-500/10"><i data-lucide="rotate-ccw" class="h-4 w-4 rtl-flip"></i>Reset all demo data</button></div>' +
      '  <div class="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-900"><h2 class="text-lg font-extrabold text-slate-900 dark:text-white">Admin profile</h2>' +
      '    <form id="fxAdmProfileForm" class="mt-4 grid gap-4"><div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full name</label>' +
      '      <input id="admName" value="' + Fixora.esc(a ? a.name : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"></div>' +
      '      <div><label class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Phone</label>' +
      '      <input id="admPhone" value="' + Fixora.esc(a ? a.phone : '') + '" class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-white"></div>' +
      '      <div><button type="submit" class="inline-flex items-center gap-2 rounded-xl bg-blue-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800"><i data-lucide="check" class="h-4 w-4"></i>Save profile</button></div></form></div>' +
      '  <div class="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800 dark:border-amber-700/50 dark:bg-amber-500/10 dark:text-amber-300">' +
      '    <p class="font-bold"><i data-lucide="info" class="me-1 inline h-4 w-4"></i>Important demo note</p>' +
      '    <p class="mt-1 leading-relaxed">Fixora is a front-end demonstration only. There is no backend, database, real GPS tracking, SMS, email or payment processing. Passwords are stored only in this browser for the demo and must not be used for real accounts.</p></div>' +
      '</div>';
  }

  /* ================= wiring ================= */
  function setSection(section) {
    currentSection = section;
    document.querySelectorAll('.fx-sb-item').forEach(function (it) {
      var active = it.getAttribute('data-section') === section;
      it.classList.toggle('bg-blue-50', active);
      it.classList.toggle('text-blue-700', active);
      it.classList.toggle('dark:bg-blue-500/10', active);
      it.classList.toggle('dark:text-blue-300', active);
      it.classList.toggle('bg-transparent', !active);
      it.classList.toggle('text-slate-600', !active);
      it.classList.toggle('dark:text-slate-200', !active);
    });
    var titles = { overview: 'Overview', bookings: 'All Bookings', customers: 'Customers', technicians: 'Technicians', services: 'Appliance Services', pricing: 'Pricing Management', areas: 'Service Areas', enquiries: 'Enquiries', settings: 'Settings' };
    document.getElementById('fxPageTitle').textContent = titles[section] || 'Admin';
    var main = document.getElementById('fxMain');
    if (section === 'overview') main.innerHTML = renderOverview();
    else if (section === 'bookings') main.innerHTML = renderBookings();
    else if (section === 'customers') main.innerHTML = renderCustomers();
    else if (section === 'technicians') main.innerHTML = renderTechnicians();
    else if (section === 'services') main.innerHTML = renderServices();
    else if (section === 'pricing') main.innerHTML = renderPricing();
    else if (section === 'areas') main.innerHTML = renderAreas();
    else if (section === 'enquiries') main.innerHTML = renderEnquiries();
    else if (section === 'settings') main.innerHTML = renderSettings();
    window.scrollTo(0, 0);
    afterRender(section);
    if (window.lucide) lucide.createIcons();
  }

  function afterRender(section) {
    document.querySelectorAll('.fx-section-go').forEach(function (btn) {
      btn.addEventListener('click', function () { setSection(btn.getAttribute('data-go')); });
    });
    if (section === 'bookings') {
      document.querySelectorAll('.fx-flt-tab').forEach(function (tab) {
        tab.addEventListener('click', function () {
          filterStatus = tab.getAttribute('data-status');
          setSection('bookings');
        });
      });
      var search = document.getElementById('fxBookSearch');
      if (search) search.addEventListener('input', function () { searchQ = this.value; renderListOnly(); });
      var sort = document.getElementById('fxBookSort');
      if (sort) sort.addEventListener('change', function () { sortMode = this.value; renderListOnly(); });
      document.querySelectorAll('.fx-bk-open').forEach(function (btn) {
        btn.addEventListener('click', function () { openBookingManage(btn.getAttribute('data-id')); });
      });
    }
    if (section === 'customers') {
      var cs = document.getElementById('fxCustSearch');
      if (cs) cs.addEventListener('input', function () { searchQ = this.value; setSection('customers'); });
      document.querySelectorAll('.fx-cust-view').forEach(function (btn) {
        btn.addEventListener('click', function () { openCustomerView(btn.getAttribute('data-id')); });
      });
    }
    if (section === 'technicians') {
      document.getElementById('fxTechAdd').addEventListener('click', function () { openTechModal(null); });
      document.querySelectorAll('.fx-tech-edit').forEach(function (btn) { btn.addEventListener('click', function () { openTechModal(btn.getAttribute('data-id')); }); });
      document.querySelectorAll('.fx-tech-del').forEach(function (btn) { btn.addEventListener('click', function () { deleteTechnician(btn.getAttribute('data-id')); }); });
    }
    if (section === 'services') {
      document.getElementById('fxSvcAdd').addEventListener('click', function () { openSvcModal(null); });
      document.querySelectorAll('.fx-svc-edit').forEach(function (btn) { btn.addEventListener('click', function () { openSvcModal(btn.getAttribute('data-id')); }); });
      document.querySelectorAll('.fx-svc-del').forEach(function (btn) { btn.addEventListener('click', function () { deleteService(btn.getAttribute('data-id')); }); });
    }
    if (section === 'pricing') {
      document.getElementById('fxPcAdd').addEventListener('click', function () { openPcModal(null); });
      document.querySelectorAll('.fx-pc-edit').forEach(function (btn) { btn.addEventListener('click', function () { openPcModal(btn.getAttribute('data-id')); }); });
      document.querySelectorAll('.fx-pc-del').forEach(function (btn) { btn.addEventListener('click', function () { deletePricing(btn.getAttribute('data-id')); }); });
    }
    if (section === 'areas') {
      document.getElementById('fxAreaAdd').addEventListener('click', function () { openAreaModal(null); });
      document.querySelectorAll('.fx-area-edit').forEach(function (btn) { btn.addEventListener('click', function () { openAreaModal(btn.getAttribute('data-id')); }); });
      document.querySelectorAll('.fx-area-del').forEach(function (btn) { btn.addEventListener('click', function () { deleteArea(btn.getAttribute('data-id')); }); });
    }
    if (section === 'enquiries') {
      document.querySelectorAll('.fx-enq-view').forEach(function (btn) { btn.addEventListener('click', function () { openEnquiryView(btn.getAttribute('data-id')); }); });
      document.querySelectorAll('.fx-enq-done').forEach(function (btn) { btn.addEventListener('click', function () { markEnquiryContacted(btn.getAttribute('data-id')); }); });
    }
    if (section === 'settings') {
      var tBtn = document.getElementById('fxSettingsTheme');
      if (tBtn) tBtn.addEventListener('click', function () { Fixora.toggleTheme(); setSection('settings'); });
      var dBtn = document.getElementById('fxSettingsDir');
      if (dBtn) dBtn.addEventListener('click', function () { Fixora.toggleDirection(); setSection('settings'); });
      var reset = document.getElementById('fxResetData');
      if (reset) reset.addEventListener('click', function () {
        Fixora.confirm({ title: 'Reset all demo data?', message: 'This clears booked jobs, users, technicians, services, pricing, areas, enquiries and notifications stored in this browser. This cannot be undone.', confirmText: 'Reset data', variant: 'danger' }).then(function (ok) {
          if (!ok) return;
          ['fixora_users', 'fixora_current_user', 'fixora_bookings', 'fixora_technicians', 'fixora_services', 'fixora_pricing', 'fixora_areas', 'fixora_enquiries', 'fixora_notifications'].forEach(function (k) { Fixora.remove(k); });
          Fixora.seed();
          Fixora.toast('All demo data has been reset.', 'success');
          setTimeout(function () { location.reload(); }, 700);
        });
      });
      var pf = document.getElementById('fxAdmProfileForm');
      if (pf) pf.addEventListener('submit', function (e) {
        e.preventDefault();
        var name = document.getElementById('admName').value.trim();
        var phone = document.getElementById('admPhone').value.trim();
        var users = Fixora.get('fixora_users', []);
        var rec = users.find(function (x) { return x.role === 'admin'; });
        if (rec) { rec.name = name; rec.phone = phone; Fixora.set('fixora_users', users); }
        var session = Fixora.currentUser();
        if (session && session.role === 'admin') { session.name = name; session.phone = phone; Fixora.setCurrentUser(session); }
        Fixora.toast('Admin profile updated.', 'success');
        setSection('settings');
      });
    }
  }

  function renderListOnly() {
    var wrap = document.getElementById('fxMain');
    wrap.innerHTML = renderBookings();
    afterRender('bookings');
    if (window.lucide) lucide.createIcons();
  }

  /* ---------- sidebar / auth ---------- */
  function doLogout() {
    Fixora.auth.logout();
    Fixora.toast('Logged out of admin panel.', 'info');
    setTimeout(function () { location.href = 'index.html'; }, 500);
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

  function refreshAll() {
    bookings = Fixora.bookings.all();
    technicians = Fixora.get('fixora_technicians', []);
    services = Fixora.get('fixora_services', []);
    pricing = Fixora.get('fixora_pricing', []);
    areas = Fixora.get('fixora_areas', []);
    enquiries = Fixora.get('fixora_enquiries', []);
  }

  var user;

  function boot() {
    user = Fixora.auth.require('admin');
    if (!user) return;
    refreshAll();

    var themeBtn = document.getElementById('fxThemeBtn2');
    if (themeBtn) themeBtn.addEventListener('click', function () { Fixora.toggleTheme(); });
    var dirBtn = document.getElementById('fxDirBtn2');
    if (dirBtn) dirBtn.addEventListener('click', function () { Fixora.toggleDirection(); });

    document.querySelectorAll('.fx-sb-item').forEach(function (it) {
      var sec = it.getAttribute('data-section');
      if (sec === 'logout') {
        it.addEventListener('click', function (e) {
          e.preventDefault();
          Fixora.confirm({ title: 'Log out of admin panel?', message: 'You will need to log in as admin again to access this dashboard.', confirmText: 'Logout', variant: 'danger' }).then(function (ok) { if (ok) doLogout(); });
        });
      } else if (sec) {
        it.addEventListener('click', function () { setSection(sec); closeDrawer(); });
      }
    });

    document.getElementById('fxMenuBtn2').addEventListener('click', openDrawer);
    var closeBtn = document.getElementById('fxSidebarClose');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    var backdrop = document.getElementById('fxSidebarBackdrop');
    if (backdrop) backdrop.addEventListener('click', closeDrawer);

    var query = new URLSearchParams(location.search);
    setSection(query.get('section') || 'overview');
    if (query.has('section')) history.replaceState({}, '', location.pathname);
  }

  if (Fixora.bootReady) boot();
  else document.addEventListener('fx:ready', boot, { once: true });
})();