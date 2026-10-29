/* Fixora - bookings module (shared by customer & admin) */
(function () {
  'use strict';
  var Fixora = window.Fixora;

  var BASE_COST = { 'Refrigerator': 750, 'Washing Machine': 650, 'Air Conditioner': 900, 'Television': 700, 'Microwave Oven': 450, 'Oven': 800, 'Dishwasher': 700, 'Water Heater': 550, 'Kitchen Appliance': 450 };

  function baseCost(appliance) {
    if (!appliance) return 0;
    return BASE_COST[appliance] || BASE_COST[String(appliance).replace(/ Repair$/, '')] || 0;
  }

  Fixora.bookings = {
    all: function () { return Fixora.get('fixora_bookings', []); },
    save: function (list) { Fixora.set('fixora_bookings', list); },
    get: function (id) { return Fixora.bookings.all().find(function (b) { return b.id === id; }); },
    ref: function (id) { var b = Fixora.bookings.get(id); return b ? b.ref : ''; },

    forUser: function (userId) {
      return Fixora.bookings.all().filter(function (b) { return b.userId === userId; })
        .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    },

    statusCounts: function (list) {
      var c = {};
      Fixora.BOOKING_STATUSES.forEach(function (s) { c[s] = 0; });
      (list || Fixora.bookings.all()).forEach(function (b) { if (c[b.status] != null) c[b.status]++; });
      return c;
    },

    create: function (data) {
      var u = Fixora.currentUser();
      var ref = 'FRX-' + Math.random().toString(36).slice(2, 8).toUpperCase();
      var booking = {
        id: 'b' + Fixora.uid().toLowerCase(),
        ref: ref,
        userId: u ? u.id : (data.userId || ''),
        name: (data.name || (u && u.name)) || '',
        email: (data.email || (u && u.email)) || '',
        phone: (data.phone || (u && u.phone)) || '',
        appliance: data.appliance,
        issue: data.issue,
        address: data.address,
        date: data.date,
        time: data.time,
        notes: data.notes || '',
        status: 'Requested',
        technicianId: null,
        technician: null,
        createdAt: new Date().toISOString(),
        cost: null,
        history: ['Requested']
      };
      var list = Fixora.bookings.all();
      list.unshift(booking);
      Fixora.bookings.save(list);
      if (booking.userId) {
        Fixora.pushNotification({
          userId: booking.userId,
          title: 'Booking requested',
          message: 'Your ' + booking.appliance + ' repair (' + ref + ') has been submitted. Our team will confirm shortly.'
        });
      }
      return booking;
    },

    setStatus: function (id, status, opts) {
      opts = opts || {};
      var list = Fixora.bookings.all();
      var b = list.find(function (x) { return x.id === id; });
      if (!b) return null;
      if (status === 'Cancelled' && b.status === 'Cancelled') return b;
      var prev = b.status;
      b.status = status;
      if (!b.history || b.history[b.history.length - 1] !== status) b.history = (b.history || []).concat(status);
      if (status === 'Completed') {
        var base = baseCost(b.appliance) || 600;
        var parts = Math.random() < 0.5 ? Math.round(Math.random() * 3) * 100 + 200 : 0;
        b.cost = base + parts + (opts.cost != null ? opts.cost : 0);
      } else if (status !== 'Completed' && b.cost == null && prev === 'Completed') {
        b.cost = null;
      }
      Fixora.bookings.save(list);
      if (b.userId && prev !== status) {
        Fixora.pushNotification({
          userId: b.userId,
          title: 'Booking status updated',
          message: 'Your ' + b.appliance + ' repair (' + b.ref + ') is now "' + status + '".'
        });
      }
      return b;
    },

    assignTechnician: function (id, techId) {
      var techs = Fixora.get('fixora_technicians', []);
      var tech = techs.find(function (t) { return t.id === techId; });
      var list = Fixora.bookings.all();
      var b = list.find(function (x) { return x.id === id; });
      if (!b) return null;
      if (tech) {
        b.technicianId = tech.id;
        b.technician = tech.name;
      } else {
        b.technicianId = null;
        b.technician = null;
      }
      if (['Requested', 'Confirmed', 'Technician Assigned'].indexOf(b.status) > -1) {
        b.status = 'Technician Assigned';
        if (b.history[b.history.length - 1] !== 'Technician Assigned') b.history.push('Technician Assigned');
      }
      Fixora.bookings.save(list);
      if (b.userId) {
        Fixora.pushNotification({ userId: b.userId, title: 'Technician assigned', message: (tech ? tech.name : 'A technician') + ' has been assigned to ' + b.ref + '. They will contact you before the visit.' });
      }
      return b;
    },

    canCancel: function (b) { return b && ['Requested', 'Confirmed'].indexOf(b.status) > -1; },
    canReschedule: function (b) { return b && ['Requested', 'Confirmed'].indexOf(b.status) > -1; },

    cancel: function (id, reason) {
      var b = Fixora.bookings.get(id);
      if (!b || !Fixora.bookings.canCancel(b)) return { ok: false, error: 'This booking can no longer be cancelled. Please contact support.' };
      Fixora.bookings.setStatus(id, 'Cancelled');
      b = Fixora.bookings.get(id);
      b.cancelReason = reason || '';
      var list = Fixora.bookings.all();
      Fixora.bookings.save(list);
      if (b.userId) Fixora.pushNotification({ userId: b.userId, title: 'Booking cancelled', message: 'Your booking ' + b.ref + ' was cancelled.' });
      return { ok: true };
    },

    reschedule: function (id, date, time) {
      var b = Fixora.bookings.get(id);
      if (!b || !Fixora.bookings.canReschedule(b)) return { ok: false, error: 'Only Requested or Confirmed bookings can be rescheduled.' };
      if (!date || !time) return { ok: false, error: 'Pick a new date and time slot.' };
      b.date = date;
      b.time = time;
      var list = Fixora.bookings.all();
      Fixora.bookings.save(list);
      if (b.userId) Fixora.pushNotification({ userId: b.userId, title: 'Booking rescheduled', message: 'Your booking ' + b.ref + ' is now scheduled for ' + Fixora.formatDate(date) + ', ' + time + '.' });
      return { ok: true, booking: b };
    },

    nextDates: function (n) {
      n = n || 7;
      var out = [];
      for (var i = 1; i <= n; i++) out.push(Fixora.daysFromToday(i));
      return out;
    }
  };
})();