/* Fixora - shared core (theme, direction, storage, navbar, footer, UI helpers) */
(function () {
  'use strict';

  var Fixora = window.Fixora || {};

  /* ---------- Images ---------- */
  function u(id, w) {
    return 'https://images.unsplash.com/photo-' + id + '?auto=format&fit=crop&w=' + (w || 900) + '&q=80';
  }
  function p(id, w) {
    return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=' + (w || 900);
  }

  Fixora.IMG = {
    heroTech:      p(37492290, 1400),
    heroTech2:     p(37492288, 1400),
    techKitchen:   p(37492288, 1000),
    tvTech:        p(37492292, 1000),
    washersBig:    p(8774370, 1000),
    fridge:        u('1484154218962-a197022b5858', 1200),
    washerDryer:   u('1632923565835-6582b54f2105', 1000),
    washers:       u('1604349779478-ed111effa081', 1000),
    laundry:       u('1696546761269-a8f9d2b80512', 1000),
    laundromat:    u('1775210727386-4c798dfae209', 1000),
    acSplit:       u('1604636559893-a748bfecfa0e', 1000),
    acBeige:       u('1603366591683-a5abc153411f', 1000),
    acFix:         u('1558382689-c1c29cc9b37e', 1000),
    tvModern:      u('1766556273549-258012c80951', 1000),
    tvLiving:      u('1724100688082-6350797a66ef', 1000),
    micro1:        u('1630699293875-e56c25151c4b', 1000),
    micro2:        u('1610527003928-47afd5f470c6', 1000),
    dish1:         u('1721395288351-07aeff0b157f', 1000),
    dish2:         u('1721743170667-9c64a404d4ab', 1000),
    heaterPipe:    u('1507336641158-886006775dd0', 1000),
    pipeFix:       u('1760571327612-8ab776dcd462', 1000),
    stoveOven:     u('1677727852911-74e9d5269003', 1000),
    stoveSteel:    u('1723902500132-7de6112d5627', 1000),
  };

  Fixora.emptyImg =
    'data:image/svg+xml;utf8,' + encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500" viewBox="0 0 800 500">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">' +
      '<stop offset="0" stop-color="#883923"/><stop offset="1" stop-color="#c45c3a"/></linearGradient></defs>' +
      '<rect width="800" height="500" fill="url(#g)"/>' +
      '<g fill="#ffffff" opacity="0.9"><circle cx="400" cy="240" r="46" fill="none" stroke="#fff" stroke-width="10"/>' +
      '<rect x="390" y="272" width="20" height="70" rx="6"/><path d="M398 320 l-34 70" stroke="#fff" stroke-width="12" stroke-linecap="round"/>' +
      '<path d="M448 280 l70 34" stroke="#fff" stroke-width="10" stroke-linecap="round"/>' +
      '<text x="400" y="420" font-family="Arial, sans-serif" font-size="26" fill="#fff" text-anchor="middle">Fixora Technician</text></g></svg>'
    );

  /* ---------- storage ---------- */
  Fixora.get = function (key, fallback) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? fallback : JSON.parse(raw);
    } catch (e) { return fallback; }
  };
  Fixora.set = function (key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* ignore */ }
  };
  Fixora.remove = function (key) {
    try { localStorage.removeItem(key); } catch (e) { /* ignore */ }
  };

  /* ---------- helpers ---------- */
  Fixora.esc = function (str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  };
  Fixora.newId = function () {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  };
  Fixora.uid = function () {
    return 'FX' + Math.random().toString(36).slice(2, 6).toUpperCase();
  };
  Fixora.money = function (n) {
    return '\u20B9' + Number(n || 0).toLocaleString('en-IN');
  };
  Fixora.formatDate = function (d) {
    if (!d) return '—';
    var dt = new Date(d + (typeof d === 'string' && d.length === 10 ? 'T00:00:00' : ''));
    if (isNaN(dt.getTime())) return d;
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  Fixora.fmtDateTime = function (iso) {
    if (!iso) return '—';
    var dt = new Date(iso);
    if (isNaN(dt.getTime())) return iso;
    return dt.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) + ', ' +
      dt.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
  };
  Fixora.daysFromToday = function (n) {
    var d = new Date();
    d.setDate(d.getDate() + n);
    return d.toISOString().slice(0, 10);
  };
  Fixora.today = function () { return Fixora.daysFromToday(0); };
  Fixora.weekdayLabel = function (d) {
    var dt = new Date(d + 'T00:00:00');
    var today = new Date(); today.setHours(0, 0, 0, 0);
    var diff = Math.round((dt - today) / 86400000);
    if (diff === 0) return 'Today';
    if (diff === 1) return 'Tomorrow';
    return dt.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
  };
  Fixora.timeAgo = function (iso) {
    if (!iso) return '—';
    var s = Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / 1000));
    if (s < 60) return s + 's ago';
    var m = Math.floor(s / 60); if (m < 60) return m + 'm ago';
    var h = Math.floor(m / 60); if (h < 24) return h + 'h ago';
    var d = Math.floor(h / 24); return d + 'd ago';
  };

  /* ---------- statuses ---------- */
  Fixora.BOOKING_STATUSES = [
    'Requested', 'Confirmed', 'Technician Assigned', 'On the Way', 'In Progress', 'Completed', 'Cancelled'
  ];
  Fixora.STATUS = {
    'Requested':             { dot: 'bg-amber-500',     cls: 'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300', icon: 'clock' },
    'Confirmed':             { dot: 'bg-blue-500',      cls: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',  icon: 'check-circle' },
    'Technician Assigned':   { dot: 'bg-indigo-500',    cls: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/15 dark:text-indigo-300', icon: 'user-round' },
    'On the Way':            { dot: 'bg-purple-500',    cls: 'bg-purple-100 text-purple-800 dark:bg-purple-500/15 dark:text-purple-300', icon: 'truck' },
    'In Progress':           { dot: 'bg-orange-500',    cls: 'bg-orange-100 text-orange-800 dark:bg-orange-500/15 dark:text-orange-300', icon: 'wrench' },
    'Completed':             { dot: 'bg-emerald-500',   cls: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300', icon: 'check-circle' },
    'Cancelled':             { dot: 'bg-rose-500',      cls: 'bg-rose-100 text-rose-800 dark:bg-rose-500/15 dark:text-rose-300', icon: 'x-circle' }
  };
  Fixora.statusBadge = function (s) {
    var c = Fixora.STATUS[s] || Fixora.STATUS.Requested;
    return '<span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ' + c.cls + '"><span class="h-1.5 w-1.5 rounded-full ' + c.dot + '"></span>' + Fixora.esc(s) + '</span>';
  };
  Fixora.SLOTS = ['09:00 AM - 11:00 AM', '11:00 AM - 01:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM', '06:00 PM - 08:00 PM'];

  /* ---------- demo data seeding ---------- */
  function seed() {
    if (!Fixora.get('fixora_users')) {
      Fixora.set('fixora_users', [
        { id: 'u-admin', name: 'Sara Fernandes', email: 'admin@fixora.in', phone: '+91 98765 10000', password: 'admin123', role: 'admin', joined: '2024-11-02' },
        { id: 'u-demo', name: 'Rohan Mehta', email: 'rohan@example.com', phone: '+91 98765 43210', password: 'demo123', role: 'customer', joined: '2025-03-14', address: 'B-204, Palm Residency, Andheri West, Mumbai' }
      ]);
    }
    if (!Fixora.get('fixora_technicians')) {
      Fixora.set('fixora_technicians', [
        { id: 't1', name: 'Amit Sharma', phone: '+91 90000 00001', specialty: 'Refrigerator, AC', rating: 4.8, tasks: 96, active: true },
        { id: 't2', name: 'Vijay Kumar', phone: '+91 90000 00002', specialty: 'Washing Machine, Dishwasher', rating: 4.7, tasks: 84, active: true },
        { id: 't3', name: 'Priya Nair', phone: '+91 90000 00003', specialty: 'Microwave, Kitchen Appliances', rating: 4.9, tasks: 71, active: true },
        { id: 't4', name: 'Imran Khan', phone: '+91 90000 00004', specialty: 'TV, Electronics', rating: 4.6, tasks: 58, active: true },
        { id: 't5', name: 'Ravi Patel', phone: '+91 90000 00005', specialty: 'Water Heater, Plumbing', rating: 4.8, tasks: 77, active: true }
      ]);
    }
    if (!Fixora.get('fixora_services')) {
      Fixora.set('fixora_services', [
        { id: 'sv-fridge', name: 'Refrigerator Repair', icon: 'snowflake', price: 499, active: true, image: Fixora.IMG.fridge,
          problems: ['Not cooling', 'Water leaking from bottom', 'Excessive frost / ice build-up', 'Loud compressor / buzzing noise', 'Temperature keeps fluctuating'],
          desc: 'Complete diagnosis and repair for single and double door refrigerators — cooling issues, gas refilling, compressor faults, door gaskets, temperature control and water leakage.',
          process: ['Share the issue on the booking form', 'Technician inspects the unit at home', 'Advice on repairs and transparent quote', 'Approved repairs completed / parts fitted'],
          diag: 'The technician checks compressor health, gas pressure, thermostat and seals before confirming the fix. Most diagnoses are completed during the first visit.',
          image: Fixora.IMG.fridge },
        { id: 'sv-washing', name: 'Washing Machine Repair', icon: 'washing-machine', price: 399, active: true, image: Fixora.IMG.washers,
          problems: ['Machine not starting / no power', 'Not spinning or draining', 'Water leakage', 'Excessive vibration / noise', 'Door lock / error codes'],
          desc: 'Repairs for front-load and top-load washing machines — motor and drum issues, drainage and pump faults, suspension, belts, control boards and door locks.',
          process: ['Describe the error message on the form', 'Technician runs a diagnostic cycle', 'Quote shared before any repair', 'Repair done / replacement parts fitted'],
          diag: 'A diagnostic cycle checks motor load, pump, drum movement and sensors. If the board is faulty, the technician explains the options and costs first.',
          image: Fixora.IMG.washers },
        { id: 'sv-ac', name: 'Air Conditioner Repair', icon: 'air-vent', price: 499, active: true, image: Fixora.IMG.acSplit,
          problems: ['AC not cooling', 'Water dripping from indoor unit', 'Noisy operation', 'Bad smell / damp filter', 'Gas leak or low cooling', 'Not switching on'],
          desc: 'Split and window AC repair — no cooling fixes, gas refilling, filter and coil cleaning, drainage issues, thermostat and remote problems and PCB checks.',
          process: ['Book with AC model and issue', 'Technician inspects indoor and outdoor units', 'Cleaning or repair quote confirmed', 'Servicing or repair completed'],
          diag: 'The technician checks gas levels, filters, coils, fan and electricals. A standard service is suggested when the unit is cooling but performing poorly.',
          image: Fixora.IMG.acSplit },
        { id: 'sv-tv', name: 'Television Repair', icon: 'tv', price: 349, active: true, image: Fixora.IMG.tvModern,
          problems: ['No picture / blank screen', 'Power on but no display', 'Flickering or lines on screen', 'No sound', 'Wi-Fi / smart features not working', 'Broken LED panel'],
          desc: 'Repairs for LED, LCD and smart TVs — power supply, backlight, motherboard, display panel and sound issues diagnosed at your home.',
          process: ['Mention TV brand and screen size', 'Technician checks power, board and panel', 'Repair vs replacement explained clearly', 'Repair completed at premises / workshop'],
          diag: 'Panel related faults are visually screened on-site. Board repairs are often done at the workshop and the return timeline is communicated upfront.',
          image: Fixora.IMG.tvModern },
        { id: 'sv-microwave', name: 'Microwave Oven Repair', icon: 'microwave', price: 299, active: true, image: Fixora.IMG.micro1,
          problems: ['Not heating / no power', 'Spark inside cavity', 'Turntable not rotating', 'Buttons not responding', 'Door not closing properly'],
          desc: 'Solo and convection microwave repair — magnetron checks, door safety switches, wiring, control panel and turntable assembly fixes.',
          process: ['Select microwave issue in the form', 'Technician safety-checks the unit', 'Part-level quote confirmed', 'Repair completed and tested'],
          diag: 'A technician tests the magnetron, diode, capacitor and door interlocks. Safety-critical parts are always genuine replacements.',
          image: Fixora.IMG.micro1 },
        { id: 'sv-dishwasher', name: 'Dishwasher Repair', icon: 'droplets', price: 449, active: true, image: Fixora.IMG.dish1,
          problems: ['Not cleaning dishes properly', 'Water not draining', 'Leaking water', 'Bad odour inside', 'Error codes / not starting'],
          desc: 'Dishwasher repair — pump and drain issues, spray arm blockages, heating element, detergent dispenser and door seal problems resolved at home.',
          process: ['Book with dishwasher model', 'Technician tests wash and drain cycles', 'Blockage cleared / part quote shared', 'Unit tested with a short cycle'],
          diag: 'The technician checks the circulation pump, drain path, spray arms and the heating element during a test cycle to isolate the fault.',
          image: Fixora.IMG.dish1 },
        { id: 'sv-geyser', name: 'Water Heater Repair', icon: 'flame', price: 349, active: true, image: Fixora.IMG.pipeFix,
          problems: ['No hot water / takes too long', 'Water leaking', 'Heater trips the switch', 'Strange sound while heating', 'Water not hot enough'],
          desc: 'Storage and instant water heater repair — heating element, thermostat, pressure valve, anode rod and leakage fixes for gas and electric geysers.',
          process: ['Select heater type in the form', 'Technician checks element, thermostat & valve', 'Quote confirmed before repair', 'Repair / replacement completed'],
          diag: 'Element and thermostat testing, pressure valve checks and water leakage inspection are part of every visit.',
          image: Fixora.IMG.pipeFix },
        { id: 'sv-kitchen', name: 'Kitchen Appliance Repair', icon: 'chef-hat', price: 299, active: true, image: Fixora.IMG.stoveSteel,
          problems: ['Chimney / exhaust not working', 'Induction cooktop error codes', 'Oven not heating evenly', 'Mixer / grinder motor issues', 'Gas stove burner problems'],
          desc: 'Repairs for chimneys, induction cooktops, ovens, mixer grinders, kettles and other kitchen appliances with genuine spares where required.',
          process: ['Describe the appliance and fault', 'Technician inspects at your home', 'Repair vs replacement advice shared', 'Appliance repaired and tested'],
          diag: 'Electrical safety plus motor, coil and heating-element checks are performed based on the appliance type.',
          image: Fixora.IMG.stoveSteel }
      ]);
    }
    var seededServices = Fixora.get('fixora_services', []);
    if (!Fixora.get('fixora_migration_chimney_service', false)) {
      if (!seededServices.some(function (service) { return service.id === 'sv-chimney'; })) {
        seededServices.push({
          id: 'sv-chimney', name: 'Chimney & Hob Repair', icon: 'fan', price: 349, active: true, image: Fixora.IMG.stoveOven,
          problems: ['Chimney suction is weak', 'Filter needs deep cleaning', 'Hob burner will not ignite', 'Unusual noise or vibration'],
          desc: 'At-home help for kitchen chimneys and gas hobs, including filter cleaning, suction issues, ignition faults and routine safety checks.',
          process: ['Choose the appliance and describe the issue', 'Technician checks filters, motor or ignition', 'Review the estimate before work begins', 'Repair and test the appliance at home'],
          diag: 'We inspect the chimney filters, fan and controls, or check hob ignition and burner components based on the reported issue.'
        });
        Fixora.set('fixora_services', seededServices);
      }
      Fixora.set('fixora_migration_chimney_service', true);
    }
    if (!Fixora.get('fixora_pricing')) {
      Fixora.set('fixora_pricing', [
        { id: 'p-diag', service: 'Inspection & Diagnostic Visit', startingPrice: 249, included: ['Technician visit', 'Fault finding & diagnosis', 'Written estimate of repair cost'], additional: ['Fee waived if you approve repairs', 'Travel charge for remote locations'] },
        { id: 'p-fridge', service: 'Refrigerator Repair', startingPrice: 499, included: ['On-site diagnosis', 'Standard mechanical repair', 'Basic spares under ₹500', '30-day service warranty'], additional: ['Compressor replacement', 'Gas refilling', 'Door / gasket parts'], image: Fixora.IMG.fridge, icon: 'snowflake' },
        { id: 'p-washing', service: 'Washing Machine Repair', startingPrice: 399, included: ['On-site diagnosis', 'Motor, pump or drum repair', 'Basic spares under ₹500', '30-day service warranty'], additional: ['Control board replacement', 'Motor replacement', 'Door lock assembly'], image: Fixora.IMG.washers, icon: 'washing-machine' },
        { id: 'p-ac', service: 'AC Repair & Servicing', startingPrice: 499, included: ['AC service / gas check', 'Filter & coil cleaning', 'Basic electrical checks', '30-day service warranty'], additional: ['Gas refilling (per kg)', 'Compressor replacement', 'PCB repair'], image: Fixora.IMG.acFix, icon: 'air-vent' },
        { id: 'p-tv', service: 'Television Repair', startingPrice: 349, included: ['On-site diagnosis', 'Power / backlight repair', 'Software update help', '30-day service warranty'], additional: ['LED panel replacement', 'Motherboard repair', 'Wi-Fi / smart module'], image: Fixora.IMG.tvTech, icon: 'tv' },
        { id: 'p-microwave', service: 'Microwave Oven Repair', startingPrice: 299, included: ['On-site diagnosis', 'Safety switch / panel repair', 'Basic spares under ₹300', '30-day service warranty'], additional: ['Magnetron replacement', 'Capacitor & diode', 'Turntable motor'], image: Fixora.IMG.micro2, icon: 'microwave' },
        { id: 'p-dishwasher', service: 'Dishwasher Repair', startingPrice: 449, included: ['On-site diagnosis', 'Pump / drain repair', 'Spray arm clearing', '30-day service warranty'], additional: ['Heating element', 'Door seal', 'Dispenser assembly'], image: Fixora.IMG.dish2, icon: 'droplets' },
        { id: 'p-geyser', service: 'Water Heater Repair', startingPrice: 349, included: ['On-site diagnosis', 'Element / thermostat repair', 'Basic spares under ₹300', '30-day service warranty'], additional: ['Tank replacement', 'Pressure valve', 'Anode rod'], image: Fixora.IMG.pipeFix, icon: 'flame' },
        { id: 'p-parts', service: 'Spare Parts & Replacement', startingPrice: 300, included: ['Genuine / compatible parts', 'Fitting included in repair visit', 'Old part handed back'], additional: ['Parts quoted only after inspection', 'High-end OEM parts billed at actuals'], image: Fixora.IMG.techKitchen, icon: 'wrench' }
      ]);
    }

    var SERVICE_DETAILS = {
      'sv-fridge': {
        serviceCharge: 249, repairRange: [499, 4500], time: '45–90 min',
        brands: 'Samsung, LG, Whirlpool, Haier, Godrej, Bosch',
        includes: ['Full cooling and electrical diagnosis', 'Labour for standard repairs', 'Basic spares up to ₹500', '30-day workmanship warranty']
      },
      'sv-washing': {
        serviceCharge: 249, repairRange: [399, 3500], time: '45–90 min',
        brands: 'Samsung, LG, IFB, Bosch, Whirlpool, Haier',
        includes: ['Inlet, drain and spin test', 'Labour for pump and motor repairs', 'Basic spares up to ₹500', '30-day workmanship warranty']
      },
      'sv-ac': {
        serviceCharge: 249, repairRange: [499, 6500], time: '45–120 min',
        brands: 'Daikin, Voltas, LG, Samsung, Hitachi, Blue Star',
        includes: ['Indoor and outdoor unit inspection', 'Filter and coil cleaning', 'Gas pressure check', '30-day workmanship warranty']
      },
      'sv-tv': {
        serviceCharge: 249, repairRange: [349, 8000], time: '30–60 min diagnosis',
        brands: 'Samsung, LG, Sony, Panasonic, Mi, TCL',
        includes: ['Power and display diagnosis', 'Board-level repair assessment', 'Smart feature and software check', '30-day workmanship warranty']
      },
      'sv-microwave': {
        serviceCharge: 249, repairRange: [299, 3000], time: '30–60 min',
        brands: 'Samsung, LG, IFB, Bosch, Whirlpool',
        includes: ['Safety and door interlock check', 'Heating and turntable diagnosis', 'Basic spares up to ₹300', '30-day workmanship warranty']
      },
      'sv-dishwasher': {
        serviceCharge: 249, repairRange: [449, 3000], time: '45–90 min',
        brands: 'Bosch, Siemens, IFB, LG, Samsung, Whirlpool',
        includes: ['Wash and drain cycle test', 'Spray arm and filter cleaning', 'Labour for pump and drain repairs', '30-day workmanship warranty']
      },
      'sv-geyser': {
        serviceCharge: 249, repairRange: [349, 3500], time: '30–60 min',
        brands: 'AO Smith, Racold, Havells, Bajaj, V-Guard',
        includes: ['Element and thermostat test', 'Leak and pressure valve check', 'Basic spares up to ₹300', '30-day workmanship warranty']
      },
      'sv-kitchen': {
        serviceCharge: 249, repairRange: [299, 3000], time: '30–90 min',
        brands: 'Prestige, Philips, Butterfly, Bosch, Faber, Elica',
        includes: ['Appliance-specific safety check', 'Motor and heating diagnosis', 'Labour for standard repairs', '30-day workmanship warranty']
      },
      'sv-chimney': {
        serviceCharge: 249, repairRange: [349, 2500], time: '45–90 min',
        brands: 'Faber, Elica, Bosch, Hindware, Glen',
        includes: ['Filter and suction check', 'Ignition and burner diagnosis', 'Deep-cleaning option', '30-day workmanship warranty']
      },
      'sv-oven': {
        serviceCharge: 249, repairRange: [399, 6000], time: '60–120 min',
        brands: 'Bosch, Siemens, IFB, Samsung, LG, Faber',
        includes: ['Heating element and thermostat test', 'Door, hinge and fan inspection', 'Labour for standard repairs', '30-day workmanship warranty']
      }
    };

    var PRICING_DETAILS = {
      'p-diag': {
        visitFee: 249, repairRange: null,
        estimates: []
      },
      'p-fridge': {
        visitFee: 249, repairRange: [499, 4500],
        estimates: [{ job: 'Gas refilling', price: [1200, 2500] }, { job: 'Thermostat replacement', price: [700, 1500] }, { job: 'Door gasket replacement', price: [900, 1800] }, { job: 'Compressor replacement', price: [2800, 5500] }]
      },
      'p-washing': {
        visitFee: 249, repairRange: [399, 3500],
        estimates: [{ job: 'Drain pump replacement', price: [900, 1600] }, { job: 'Door lock assembly', price: [700, 1400] }, { job: 'Motor replacement', price: [2200, 3800] }, { job: 'Control board replacement', price: [2000, 4000] }]
      },
      'p-ac': {
        visitFee: 249, repairRange: [499, 6500],
        estimates: [{ job: 'Deep cleaning service', price: [600, 1200] }, { job: 'Gas refilling', price: [1800, 3500] }, { job: 'PCB repair', price: [2000, 4500] }, { job: 'Compressor replacement', price: [3500, 6500] }]
      },
      'p-tv': {
        visitFee: 249, repairRange: [349, 9000],
        estimates: [{ job: 'Power board repair', price: [1000, 2200] }, { job: 'Backlight replacement', price: [1200, 2500] }, { job: 'Motherboard repair', price: [2000, 4500] }, { job: 'LED panel replacement', price: [4000, 9000] }]
      },
      'p-microwave': {
        visitFee: 249, repairRange: [299, 3000],
        estimates: [{ job: 'Capacitor / diode replacement', price: [500, 1200] }, { job: 'Turntable motor', price: [600, 1200] }, { job: 'Control panel repair', price: [1000, 2200] }, { job: 'Magnetron replacement', price: [1200, 2500] }]
      },
      'p-dishwasher': {
        visitFee: 249, repairRange: [449, 3500],
        estimates: [{ job: 'Door seal replacement', price: [700, 1500] }, { job: 'Drain pump replacement', price: [1000, 1800] }, { job: 'Heating element', price: [1200, 2200] }, { job: 'Control board replacement', price: [1800, 3500] }]
      },
      'p-geyser': {
        visitFee: 249, repairRange: [349, 5000],
        estimates: [{ job: 'Pressure valve replacement', price: [600, 1200] }, { job: 'Thermostat replacement', price: [700, 1400] }, { job: 'Heating element', price: [800, 1600] }, { job: 'Tank replacement', price: [2500, 5000] }]
      },
      'p-oven': {
        visitFee: 249, repairRange: [399, 6000],
        estimates: [{ job: 'Door hinge / seal', price: [800, 2000] }, { job: 'Thermostat replacement', price: [900, 1800] }, { job: 'Heating element', price: [1200, 2200] }, { job: 'Control board repair', price: [2500, 5500] }]
      },
      'p-parts': {
        visitFee: 249, repairRange: null,
        estimates: []
      }
    };

    var serviceList = Fixora.get('fixora_services', []);
    var servicesChanged = false;
    if (!serviceList.some(function (s) { return s.id === 'sv-oven'; })) {
      serviceList.push({
        id: 'sv-oven', name: 'Oven Repair', icon: 'flame', price: 399, active: true, image: Fixora.IMG.stoveOven,
        problems: ['Oven not heating', 'Uneven baking or hot spots', 'Temperature dial inaccurate', 'Door not closing properly', 'Fan or rotisserie not working', 'Unit trips the power supply'],
        desc: 'Built-in, convection, OTG and oven-microwave combos — heating faults, thermostat errors, fan issues, door hinges and control panels repaired at home.',
        process: ['Share the oven type and fault', 'Technician safety-checks the unit', 'Heating and control tests on-site', 'Approved repair fitted and tested'],
        diag: 'The technician tests the heating elements, thermostat, fan and door interlocks, then confirms whether the repair is best done at home or in the workshop.'
      });
      servicesChanged = true;
    }
    serviceList.forEach(function (s) {
      var d = SERVICE_DETAILS[s.id];
      if (!d) return;
      Object.keys(d).forEach(function (k) {
        if (s[k] == null) { s[k] = d[k]; servicesChanged = true; }
      });
    });
    if (servicesChanged) Fixora.set('fixora_services', serviceList);

    var priceList = Fixora.get('fixora_pricing', []);
    var pricingChanged = false;
    if (!priceList.some(function (p) { return p.id === 'p-oven'; })) {
      priceList.push({
        id: 'p-oven', service: 'Oven Repair', startingPrice: 399, included: ['On-site diagnosis', 'Heating element and thermostat checks', 'Standard labour', '30-day service warranty'], additional: ['Heating element replacement', 'Door hinge or seal', 'Control board replacement'], image: Fixora.IMG.stoveOven, icon: 'flame'
      });
      pricingChanged = true;
    }
    priceList.forEach(function (p) {
      var d = PRICING_DETAILS[p.id];
      if (!d) return;
      Object.keys(d).forEach(function (k) {
        if (p[k] == null) { p[k] = d[k]; pricingChanged = true; }
      });
    });
    if (pricingChanged) Fixora.set('fixora_pricing', priceList);

    if (!Fixora.get('fixora_bookings')) {
      var b = [
        { id: 'b1', ref: 'FRX-7H4K2N', userId: 'u-demo', name: 'Rohan Mehta', email: 'rohan@example.com', phone: '+91 98765 43210', appliance: 'Washing Machine', issue: 'Not draining and showing error code', address: 'B-204, Palm Residency, Andheri West, Mumbai', date: Fixora.daysFromToday(-2), time: '11:00 AM - 01:00 PM', notes: 'Front load, 3 years old', status: 'Completed', technicianId: 't2', technician: 'Vijay Kumar', createdAt: new Date(Date.now() - 4 * 86400000).toISOString(), cost: 750, history: ['Requested', 'Confirmed', 'Technician Assigned', 'On the Way', 'In Progress', 'Completed'] },
        { id: 'b2', ref: 'FRX-9BQ3R8', userId: 'u-demo', name: 'Rohan Mehta', email: 'rohan@example.com', phone: '+91 98765 43210', appliance: 'Refrigerator', issue: 'Not cooling enough, food going bad', address: 'B-204, Palm Residency, Andheri West, Mumbai', date: Fixora.daysFromToday(0), time: '04:00 PM - 06:00 PM', notes: 'Double door 350L', status: 'Confirmed', technicianId: 't1', technician: 'Amit Sharma', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), cost: null, history: ['Requested', 'Confirmed'] },
        { id: 'b3', ref: 'FRX-2MD8T1', userId: 'u-demo', name: 'Rohan Mehta', email: 'rohan@example.com', phone: '+91 98765 43210', appliance: 'Air Conditioner', issue: 'AC not cooling, water dripping from indoor unit', address: 'B-204, Palm Residency, Andheri West, Mumbai', date: Fixora.daysFromToday(-6), time: '09:00 AM - 11:00 AM', notes: '1.5 ton split AC', status: 'Completed', technicianId: 't1', technician: 'Amit Sharma', createdAt: new Date(Date.now() - 9 * 86400000).toISOString(), cost: 1450, history: ['Requested', 'Confirmed', 'Technician Assigned', 'On the Way', 'In Progress', 'Completed'] },
        { id: 'b4', ref: 'FRX-6KX9P4', userId: 'u-guest', name: 'Meera Iyer', email: 'meera@example.com', phone: '+91 98200 11223', appliance: 'Microwave Oven', issue: 'Not heating food', address: 'Flat 12, Lake View, Powai, Mumbai', date: Fixora.daysFromToday(1), time: '02:00 PM - 04:00 PM', notes: '', status: 'Requested', technicianId: null, technician: null, createdAt: new Date(Date.now() - 3 * 3600000).toISOString(), cost: null, history: ['Requested'] },
        { id: 'b5', ref: 'FRX-5T3W7L', userId: 'u-guest', name: 'Karan Singh', email: 'karan@example.com', phone: '+91 98111 55667', appliance: 'Television', issue: 'Blank screen, sound works', address: 'House 4, Rose Lane, Malad East, Mumbai', date: Fixora.daysFromToday(2), time: '11:00 AM - 01:00 PM', notes: '55 inch smart TV', status: 'Technician Assigned', technicianId: 't4', technician: 'Imran Khan', createdAt: new Date(Date.now() - 1 * 86400000).toISOString(), cost: null, history: ['Requested', 'Confirmed', 'Technician Assigned'] },
        { id: 'b6', ref: 'FRX-1Z8Q6E', userId: 'u-guest', name: 'Anita Desai', email: 'anita@example.com', phone: '+91 90000 99887', appliance: 'Water Heater', issue: 'Water takes too long to heat', address: '601 Horizon Tower, Goregaon, Mumbai', date: Fixora.daysFromToday(3), time: '09:00 AM - 11:00 AM', notes: '', status: 'Requested', technicianId: null, technician: null, createdAt: new Date(Date.now() - 6 * 3600000).toISOString(), cost: null, history: ['Requested'] }
      ];
      Fixora.set('fixora_bookings', b);
    }
    if (!Fixora.get('fixora_enquiries')) {
      Fixora.set('fixora_enquiries', [
        { id: 'e1', name: 'Sneha Kapoor', phone: '+91 98100 22110', email: 'sneha@example.com', appliance: 'Dishwasher', problem: 'Dishwasher leaking from the bottom during wash', address: '12B, Sea Breeze, Bandra West, Mumbai', date: Fixora.daysFromToday(4), time: '02:00 PM - 04:00 PM', notes: 'Samsung 2022 model', createdAt: new Date(Date.now() - 26 * 3600000).toISOString(), status: 'New' },
        { id: 'e2', name: 'Farhan Ali', phone: '+91 90220 33445', email: 'farhan@example.com', appliance: 'Air Conditioner', problem: 'Need annual AC servicing for 2 units', address: 'A-11, Neelam Nagar, Mulund, Mumbai', date: Fixora.daysFromToday(6), time: '11:00 AM - 01:00 PM', notes: 'Both split units', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), status: 'Contacted' }
      ]);
    }
    if (!Fixora.get('fixora_areas')) {
      Fixora.set('fixora_areas', [
        { id: 'a1', name: 'Andheri', city: 'Mumbai', pincodes: '400053, 400058, 400059' },
        { id: 'a2', name: 'Powai', city: 'Mumbai', pincodes: '400076' },
        { id: 'a3', name: 'Goregaon', city: 'Mumbai', pincodes: '400062, 400063, 400065' },
        { id: 'a4', name: 'Bandra', city: 'Mumbai', pincodes: '400050, 400051' },
        { id: 'a5', name: 'Malad', city: 'Mumbai', pincodes: '400064, 400095' }
      ]);
    }
    if (!Fixora.get('fixora_notifications')) {
      Fixora.set('fixora_notifications', [
        { id: 'n1', userId: 'u-demo', title: 'Booking confirmed', message: 'Your Refrigerator repair (FRX-9BQ3R8) has been confirmed for today, 04:00 PM - 06:00 PM.', createdAt: new Date(Date.now() - 4 * 3600000).toISOString(), read: false },
        { id: 'n2', userId: 'u-demo', title: 'Technician assigned', message: 'Amit Sharma has been assigned to your Refrigerator repair. He will reach out before the visit.', createdAt: new Date(Date.now() - 20 * 3600000).toISOString(), read: false },
        { id: 'n3', userId: 'u-demo', title: 'Repair completed', message: 'Your Washing Machine repair (FRX-7H4K2N) was completed. Please share your feedback.', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), read: true }
      ]);
    }
    if (!Fixora.get('fixora_demo_note')) Fixora.set('fixora_demo_note', true);
  }

  Fixora.seed = seed;

  /* ---------- current user ---------- */
  Fixora.currentUser = function () {
    return Fixora.get('fixora_current_user', null);
  };
  Fixora.setCurrentUser = function (user) {
    if (user) { Fixora.set('fixora_current_user', user); } else { Fixora.remove('fixora_current_user'); }
    Fixora.refreshNavAuth && Fixora.refreshNavAuth();
  };

  /* ---------- notifications ---------- */
  Fixora.pushNotification = function (n) {
    if (!n || !n.userId) return;
    var list = Fixora.get('fixora_notifications', []);
    list.unshift({ id: Fixora.newId(), createdAt: new Date().toISOString(), read: false, title: n.title || 'Update', message: n.message || '', ...(n.userId ? { userId: n.userId } : {}) });
    Fixora.set('fixora_notifications', list);
  };

  /* ---------- theme ---------- */
  function applyTheme(t) {
    if (t === 'dark') document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
    var label = t === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    document.querySelectorAll('[data-fx-theme-icon]').forEach(function (icon) {
      icon.setAttribute('data-lucide', t === 'dark' ? 'sun' : 'moon');
    });
    document.querySelectorAll('[data-fx-theme-btn]').forEach(function (btn) {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
    if (window.lucide) lucide.createIcons();
  }
  Fixora.initTheme = function () {
    if (!Fixora.get('fixora_theme_v2')) {
      Fixora.remove('fixora_theme');
      Fixora.set('fixora_theme_v2', 1);
    }
    var theme = Fixora.get('fixora_theme', 'light');
    applyTheme(theme);
  };
  Fixora.toggleTheme = function () {
    var cur = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    var next = cur === 'dark' ? 'light' : 'dark';
    Fixora.set('fixora_theme', next);
    applyTheme(next);
    return next;
  };
  Fixora.refreshThemeIcons = function () { applyTheme(document.documentElement.classList.contains('dark') ? 'dark' : 'light'); };

  /* ---------- direction ---------- */
  function applyDirection(d) {
    document.documentElement.setAttribute('dir', d);
    document.documentElement.setAttribute('lang', d === 'rtl' ? 'ur' : 'en');
    var label = d === 'rtl' ? 'Switch to LTR' : 'Switch to RTL';
    document.querySelectorAll('[data-fx-dir-icon]').forEach(function (icon) {
      icon.setAttribute('data-lucide', 'arrow-left-right');
    });
    document.querySelectorAll('[data-fx-dir-btn]').forEach(function (btn) {
      btn.setAttribute('aria-label', label);
      btn.setAttribute('title', label);
    });
    if (window.lucide) lucide.createIcons();
  }
  Fixora.initDirection = function () {
    var d = Fixora.get('fixora_direction', 'ltr');
    applyDirection(d);
  };
  Fixora.toggleDirection = function () {
    var d = document.documentElement.getAttribute('dir') === 'rtl' ? 'ltr' : 'rtl';
    Fixora.set('fixora_direction', d);
    applyDirection(d);
    return d;
  };

  /* ---------- broken image fallback ---------- */
  document.addEventListener('error', function (e) {
    var t = e.target;
    if (t && t.tagName === 'IMG' && t.src && t.src.indexOf('data:') !== 0) {
      if (e.target.dataset.fxFallback !== '1') {
        t.dataset.fxFallback = '1';
        t.src = Fixora.emptyImg;
      }
    }
  }, true);

  /* ---------- toast ---------- */
  var toastWrap = null;
  function toast(msg, type) {
    type = type || 'success';
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.className = 'fixed z-[100] top-4 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 flex flex-col items-center gap-2 px-3';
      document.body.appendChild(toastWrap);
    }
    var cfg = {
      success: { icon: 'circle-check', cls: 'border-emerald-200 bg-white text-emerald-800 dark:border-emerald-700 dark:bg-slate-900 dark:text-emerald-300' },
      error: { icon: 'circle-x', cls: 'border-rose-200 bg-white text-rose-800 dark:border-rose-700 dark:bg-slate-900 dark:text-rose-300' },
      info: { icon: 'info', cls: 'border-blue-200 bg-white text-blue-800 dark:border-blue-700 dark:bg-slate-900 dark:text-blue-300' }
    };
    var c = cfg[type] || cfg.info;
    var el = document.createElement('div');
    el.className = 'pointer-events-auto flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg max-w-[92vw] animate-[fxToast_.3s_ease-out] ' + c.cls;
    el.innerHTML = '<i data-lucide="' + c.icon + '" class="h-5 w-5 shrink-0 rtl-flip"></i><div class="text-sm font-medium leading-snug">' + msg + '</div>';
    toastWrap.appendChild(el);
    if (window.lucide) lucide.createIcons();
    setTimeout(function () { el.style.opacity = '0'; el.style.transition = 'opacity .3s'; }, 3200);
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); if (toastWrap && !toastWrap.children.length) toastWrap.remove(); }, 3600);
  }
  Fixora.toast = toast;

  /* ---------- modal ---------- */
  Fixora.openModal = function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    el.classList.remove('hidden');
    el.classList.add('flex');
    document.body.classList.add('overflow-hidden');
    requestAnimationFrame(function () {
      var panel = el.querySelector('[data-modal-panel]');
      if (panel) panel.classList.remove('fx-modal-out');
      panel.classList.add('fx-modal-in');
    });
  };
  Fixora.closeModal = function (id) {
    var el = document.getElementById(id);
    if (!el) return;
    var panel = el.querySelector('[data-modal-panel]');
    if (panel) {
      panel.classList.remove('fx-modal-in');
      panel.classList.add('fx-modal-out');
    }
    setTimeout(function () {
      el.classList.add('hidden');
      el.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
    }, 180);
  };
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-close-modal]');
    if (b) Fixora.closeModal(b.getAttribute('data-close-modal'));
    var m = e.target.closest('[data-modal-backdrop]');
    if (m && e.target === m) {
      var mInner = m.querySelector('[data-modal-panel]');
      var preserved = mInner && mInner.getAttribute('data-x-no-dismiss');
      if (!preserved) m.id && Fixora.closeModal(m.id);
    }
  });

  /* ---------- confirm dialog ---------- */
  Fixora.confirm = function (opts) {
    opts = opts || {};
    return new Promise(function (resolve) {
      var wrap = document.createElement('div');
      wrap.id = 'fxConfirmWrap';
      wrap.className = 'fixed inset-0 z-[110] hidden items-center justify-center bg-slate-900/60 p-4';
      wrap.innerHTML =
        '<div data-modal-panel class="fx-modal-in w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900">' +
        '  <div class="flex items-start gap-4">' +
        '    <div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ' + (opts.variant === 'danger' ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/15 dark:text-rose-400' : 'bg-blue-100 text-blue-600 dark:bg-blue-500/15 dark:text-blue-400') + '">' +
        '      <i data-lucide="' + (opts.variant === 'danger' ? 'alert-triangle' : 'help-circle') + '" class="h-5 w-5"></i></div>' +
        '    <div class="min-w-0"><h3 class="text-base font-bold text-slate-900 dark:text-white">' + Fixora.esc(opts.title || 'Are you sure?') + '</h3>' +
        '      <p class="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">' + (opts.message || '') + '</p></div></div>' +
        '  <div class="mt-6 flex justify-end gap-3">' +
        '    <button class="fx-btn-cancel rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>' +
        '    <button class="fx-btn-ok rounded-lg px-4 py-2 text-sm font-semibold text-white ' + (opts.variant === 'danger' ? 'bg-rose-600 hover:bg-rose-700' : 'bg-blue-700 hover:bg-blue-800') + '">' + Fixora.esc(opts.confirmText || 'Confirm') + '</button>' +
        '  </div></div>';
      document.body.appendChild(wrap);
      requestAnimationFrame(function () { wrap.classList.remove('hidden'); wrap.classList.add('flex'); });
      function done(val) {
        wrap.classList.remove('flex'); wrap.classList.add('hidden');
        setTimeout(function () { if (wrap.parentNode) wrap.parentNode.removeChild(wrap); }, 150);
        resolve(val);
      }
      wrap.querySelector('.fx-btn-cancel').onclick = function () { done(false); };
      wrap.querySelector('.fx-btn-ok').onclick = function () { done(true); };
      wrap.addEventListener('click', function (e) { if (e.target === wrap) done(false); });
      if (window.lucide) lucide.createIcons();
    });
  };

  /* ---------- navbar ---------- */
  var PAGE_LABELS = {
    index: 'Home', home2: 'Home 2', services: 'Services', pricing: 'Pricing', login: 'Login', signup: 'Sign up',
    dashboard: 'Customer Dashboard', adminDashboard: 'Admin Dashboard', notfound: '404'
  };

  function navItem(active, href, label, extra, icon) {
    var cls = active
      ? 'text-blue-700 dark:text-blue-400'
      : 'text-slate-700 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-400';
    return '<a href="' + href + '" class="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ' + cls + '"' + (extra || '') + '>' +
      (icon ? '<i data-lucide="' + icon + '" class="h-4 w-4"></i>' : '') + label + '</a>';
  }

  Fixora.renderNavbar = function () {
    var holder = document.getElementById('fx-navbar');
    if (!holder) return;
    var page = document.body.getAttribute('data-page') || '';
    var active = { home: false, services: false, pricing: false, about: false, contact: false };
    if (page === 'index' || page === 'home2') active.home = true;
    if (page === 'services') active.services = true;
    if (page === 'pricing') active.pricing = true;
    if (page === 'about') active.about = true;
    if (page === 'contact') active.contact = true;

    var homeDropdown = [
      navItem(page === 'index', 'index.html', 'Home', '', 'home'),
      navItem(page === 'home2', 'home2.html', 'Home 2', '', 'layout-grid')
    ].join('');

    var dashDropdown =
      '<a href="dashboard.html" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"><i data-lucide="user-round" class="h-4 w-4"></i>Customer Dashboard</a>' +
      '<a href="admin-dashboard.html" class="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-blue-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"><i data-lucide="shield" class="h-4 w-4"></i>Admin Dashboard</a>';

    var homeMobile = homeDropdown
      .replace(/rounded-lg px-3/g, 'rounded-lg px-3 py-2.5')
      .replace(/\s*<i data-lucide="[^"]*" class="h-4 w-4"><\/i>/g, '');
    var dashMobile = dashDropdown
      .replace(/py-2/g, 'py-2.5')
      .replace(/\s*<i data-lucide="[^"]*" class="h-4 w-4"><\/i>/g, '');

    var authArea = '<a href="login.html" class="rounded-xl bg-brand-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700">Login</a>';

    holder.innerHTML =
      '<header class="relative border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">' +
      '  <div class="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">' +
      '    <div class="flex items-center gap-3">' +
      '      <a href="index.html" class="flex items-center gap-2.5">' +
      '        <span class="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-teal-600 text-white shadow-sm"><i data-lucide="wrench" class="h-5 w-5"></i></span>' +
      '        <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">Fixora<span class="text-teal-600 dark:text-teal-400">.</span></span>' +
      '      </a></div>' +
      '    <nav class="hidden lg:flex items-center gap-1" aria-label="Primary">' +
      '      <div class="fx-nav-drop relative">' +
      '        <button class="fx-nav-trigger flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold ' + (active.home ? 'text-blue-700 dark:text-blue-400' : 'text-slate-700 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-400') + '" aria-haspopup="true" aria-expanded="false">Home<i data-lucide="chevron-down" class="h-4 w-4 rtl-flip"></i></button>' +
      '        <div class="fx-nav-panel hidden absolute start-0 top-full mt-2 w-44 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">' + homeDropdown + '</div>' +
      '      </div>' +
      navItem(active.about, 'about.html', 'About') +
      navItem(active.services, 'services.html', 'Services') +
      navItem(active.pricing, 'pricing.html', 'Pricing') +
      navItem(active.contact, 'contact.html', 'Contact') +
      '      <div class="fx-nav-drop relative">' +
      '        <button class="fx-nav-trigger flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:text-blue-700 dark:text-slate-200 dark:hover:text-blue-400" aria-haspopup="true" aria-expanded="false">Dashboard<i data-lucide="chevron-down" class="h-4 w-4 rtl-flip"></i></button>' +
      '        <div class="fx-nav-panel hidden absolute end-0 top-full mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-700 dark:bg-slate-900">' + dashDropdown + '</div>' +
      '      </div></nav>' +
      '    <div class="flex items-center gap-1.5">' +
      '      <button data-fx-dir-btn class="hidden lg:inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" title="RTL/LTR" aria-label="Toggle direction"><i data-fx-dir-icon data-lucide="arrow-left" class="h-5 w-5"></i></button>' +
      '      <button data-fx-theme-btn class="hidden lg:inline-flex rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" title="Toggle theme" aria-label="Toggle theme"><i data-fx-theme-icon data-lucide="sun" class="h-5 w-5"></i></button>' +
      '      <span class="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 lg:block"></span>' +
      '      <div class="hidden lg:flex items-center gap-0.5">' + authArea + '</div>' +
      '      <span class="mx-1 hidden h-6 w-px bg-slate-200 dark:bg-slate-700 lg:block"></span>' +
      '      <button id="fxMenuBtn" class="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden" aria-label="Open menu" aria-expanded="false"><i data-lucide="menu" class="h-6 w-6"></i></button>' +
      '    </div>' +
      '  </div>' +
      '  <div id="fxMobileMenu" class="absolute inset-x-0 top-full z-50 mt-px hidden max-h-[80vh] overflow-y-auto overscroll-contain border-t border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 lg:hidden">' +
      '    <div class="px-4 py-3 space-y-1">' +
      '      <div class="fx-m-drop">' +
      '        <button type="button" class="fx-m-trigger flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-expanded="false">Home<i data-lucide="chevron-down" class="fx-m-chevron h-4 w-4 rtl-flip transition-transform"></i></button>' +
      '        <div class="fx-m-panel hidden ps-3">' + homeMobile + '</div>' +
      '      </div>' +
      navItem(active.about, 'about.html', 'About').replace('px-3', 'px-3 py-2.5') +
      navItem(active.services, 'services.html', 'Services').replace('px-3', 'px-3 py-2.5') +
      navItem(active.pricing, 'pricing.html', 'Pricing').replace('px-3', 'px-3 py-2.5') +
      navItem(active.contact, 'contact.html', 'Contact').replace('px-3', 'px-3 py-2.5') +
      '      <div class="fx-m-drop">' +
      '        <button type="button" class="fx-m-trigger flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800" aria-expanded="false">Dashboard<i data-lucide="chevron-down" class="fx-m-chevron h-4 w-4 rtl-flip transition-transform"></i></button>' +
      '        <div class="fx-m-panel hidden ps-3">' + dashMobile + '</div>' +
      '      </div>' +
      '      <div class="flex items-center justify-center gap-2">' +
      '        <button data-fx-theme-btn class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Toggle theme"><i data-fx-theme-icon data-lucide="sun" class="h-4 w-4"></i></button>' +
      '        <button data-fx-dir-btn class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" aria-label="Toggle direction"><i data-fx-dir-icon data-lucide="arrow-left" class="h-4 w-4"></i></button>' +
      '      </div>' +
      '      <a href="login.html" class="flex w-full items-center justify-center rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-700">Login</a>' +
      '    </div></div>' +
      '</header>';
    Fixora.refreshNavAuth();
    bindNav();
    if (window.lucide) lucide.createIcons();
  };

  Fixora.refreshNavAuth = function () {
    document.querySelectorAll('#fxLogoutBtn').forEach(function (btn) {
      if (btn.dataset.bound) return;
      btn.dataset.bound = '1';
      btn.addEventListener('click', function () {
        Fixora.setCurrentUser(null);
        Fixora.toast('You have been logged out.', 'info');
        setTimeout(function () { window.location.href = 'index.html'; }, 600);
      });
    });
  };

  function bindNav() {
    var menuBtn = document.getElementById('fxMenuBtn');
    var mobile = document.getElementById('fxMobileMenu');
    if (menuBtn && mobile) {
      menuBtn.addEventListener('click', function () {
        var open = mobile.classList.toggle('hidden') === false;
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
        menuBtn.innerHTML = '<i data-lucide="' + (open ? 'x' : 'menu') + '" class="h-6 w-6"></i>';
        if (window.lucide) lucide.createIcons();
      });
    }
    document.querySelectorAll('[data-fx-dir-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () { Fixora.toggleDirection(); Fixora.toast('Direction set to ' + (document.documentElement.getAttribute('dir') === 'rtl' ? 'RTL' : 'LTR'), 'info'); });
    });
    document.querySelectorAll('[data-fx-theme-btn]').forEach(function (btn) {
      btn.addEventListener('click', function () { Fixora.toggleTheme(); });
    });

    document.querySelectorAll('.fx-m-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var panel = trigger.nextElementSibling;
        var open = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', open ? 'false' : 'true');
        if (panel) panel.classList.toggle('hidden', open);
        var chev = trigger.querySelector('.fx-m-chevron');
        if (chev) chev.style.transform = open ? '' : 'rotate(180deg)';
      });
    });

    document.querySelectorAll('.fx-nav-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var wrap = trigger.closest('.fx-nav-drop');
        var currently = trigger.getAttribute('aria-expanded') === 'true';
        document.querySelectorAll('.fx-nav-drop').forEach(function (w) {
          w.querySelector('.fx-nav-trigger').setAttribute('aria-expanded', 'false');
          w.querySelector('.fx-nav-panel').classList.add('hidden');
        });
        if (!currently) {
          trigger.setAttribute('aria-expanded', 'true');
          wrap.querySelector('.fx-nav-panel').classList.remove('hidden');
        }
      });
    });
    document.addEventListener('click', function () {
      document.querySelectorAll('.fx-nav-drop').forEach(function (w) {
        w.querySelector('.fx-nav-trigger').setAttribute('aria-expanded', 'false');
        w.querySelector('.fx-nav-panel').classList.add('hidden');
      });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        document.querySelectorAll('.fx-nav-drop').forEach(function (w) {
          w.querySelector('.fx-nav-trigger').setAttribute('aria-expanded', 'false');
          w.querySelector('.fx-nav-panel').classList.add('hidden');
        });
      }
    });
  }

  /* ---------- footer ---------- */
  function renderFooter() {
    var holder = document.getElementById('fx-footer');
    if (!holder) return;
    var services = Fixora.get('fixora_services', []);
    var svcLinks = services.slice(0, 4).map(function (s) {
      return '<li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="services.html#sv-' + s.id.replace('sv-', '') + '">' + Fixora.esc(s.name) + '</a></li>';
    }).join('');
    var areas = Fixora.get('fixora_areas', []);
    var areaText = areas.slice(0, 5).map(function (a) { return a.name + ', ' + a.city; }).join(' · ');
    holder.innerHTML =
      '<footer class="border-t border-brand-200 bg-[#f2e9dc] text-stone-700 dark:border-stone-800 dark:bg-stone-950 dark:text-stone-300">' +
      '  <div class="mx-auto max-w-7xl px-4 pb-7 pt-10 sm:px-6 lg:px-8">' +
      '    <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_.8fr_.8fr_1fr]">' +
      '      <div><a href="index.html" class="flex items-center gap-2.5">' +
      '        <span class="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-700 to-teal-600 text-white shadow-sm"><i data-lucide="wrench" class="h-5 w-5"></i></span>' +
      '        <span class="text-xl font-extrabold tracking-tight text-stone-900 dark:text-white">Fixora<span class="text-brand-600 dark:text-brand-300">.</span></span></a>' +
      '        <p class="mt-4 max-w-xs text-sm leading-6 text-stone-600 dark:text-stone-400">Quick repairs. Trusted technicians. Thoughtful home appliance service with clear pricing and a 30-day workmanship warranty.</p>' +
      '        <div class="mt-4 flex flex-wrap gap-2 text-xs"><span class="rounded-full bg-brand-100 px-3 py-1 font-semibold text-brand-800 dark:bg-stone-800 dark:text-stone-200">Verified technicians</span><span class="rounded-full bg-brand-100 px-3 py-1 font-semibold text-brand-800 dark:bg-stone-800 dark:text-stone-200">30-day warranty</span></div>' +
      '      </div>' +
      '      <div><h4 class="text-xs font-extrabold uppercase tracking-[.16em] text-stone-900 dark:text-white">Explore</h4><ul class="mt-4 space-y-2.5">' +
      '        <li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="index.html">Home</a></li><li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="home2.html">Home 2</a></li>' +
      '        <li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="services.html">Services</a></li><li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="pricing.html">Pricing guide</a></li><li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="about.html">About Fixora</a></li><li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="contact.html">Contact</a></li></ul></div>' +
      '      <div><h4 class="text-xs font-extrabold uppercase tracking-[.16em] text-stone-900 dark:text-white">Your account</h4><ul class="mt-4 space-y-2.5"><li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="dashboard.html">Customer dashboard</a></li><li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="admin-dashboard.html">Admin dashboard</a></li><li><a class="text-sm text-stone-600 transition hover:text-brand-700 dark:text-stone-400 dark:hover:text-brand-300" href="login.html">Sign in</a></li></ul><h4 class="mt-6 text-xs font-extrabold uppercase tracking-[.16em] text-stone-900 dark:text-white">Popular services</h4><ul class="mt-3 space-y-2">' + svcLinks + '</ul></div>' +
      '      <div><h4 class="text-xs font-extrabold uppercase tracking-[.16em] text-stone-900 dark:text-white">We’re here to help</h4>' +
      '        <ul class="mt-4 space-y-3 text-sm text-stone-600 dark:text-stone-400">' +
      '        <li class="flex items-center gap-2.5"><i data-lucide="phone" class="h-4 w-4 text-brand-600 dark:text-brand-300"></i>+91 1800 123 4567</li>' +
      '        <li class="flex items-center gap-2.5"><i data-lucide="mail" class="h-4 w-4 text-brand-600 dark:text-brand-300"></i>support@fixora.in</li>' +
      '        <li class="flex items-center gap-2.5"><i data-lucide="clock" class="h-4 w-4 text-brand-600 dark:text-brand-300"></i>7:00 AM – 8:00 PM, daily</li>' +
      '        <li class="flex items-start gap-2.5"><i data-lucide="map-pin" class="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-300"></i><span>Mumbai & nearby areas<span class="mt-1 block text-xs text-stone-500 dark:text-stone-500">' + areaText + '</span></span></li></ul></div>' +
      '    </div>' +
      '    <div class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-brand-200 pt-5 text-center sm:flex-row sm:text-start dark:border-stone-800">' +
      '      <p class="text-xs text-stone-500 dark:text-stone-500">© 2026 Fixora Home Appliance Repair Service. Demo website — all data shown is fictional.</p>' +
      '      <p class="text-xs text-stone-500 dark:text-stone-500">No real bookings, payments or tracking are processed on this site.</p>' +
      '    </div>' +
      '  </div></footer>';
    if (window.lucide) lucide.createIcons();
  }
  Fixora.renderFooter = renderFooter;

  /* ---------- shared page layout helpers ---------- */
  Fixora.sectionHeading = function (over, title, sub) {
    var dark = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    void dark;
    return '<div class="mx-auto max-w-2xl text-center">' +
      '<span class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-500/10">' + over + '</span>' +
      '<h2 class="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">' + title + '</h2>' +
      (sub ? '<p class="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-300">' + sub + '</p>' : '') +
      '</div>';
  };

  /* ---------- shared styles ---------- */
  function injectStyles() {
    if (document.getElementById('fx-styles')) return;
    var style = document.createElement('style');
    style.id = 'fx-styles';
    style.textContent =
      '#fx-navbar{position:sticky;top:0;z-index:50}' +
      'html,body{overflow-x:clip;max-width:100%}' +
      'body{background-color:#f8f5ef!important}' +
      'html.dark body{background-color:#0c0a09!important}' +
      '[class~="bg-white"]{background-color:#fffdf8!important}' +
      '.dark [class~="dark:bg-white/10"],.dark [class~="dark:hover:bg-white/20"]:hover{background-color:rgba(255,255,255,.12)!important}' +
      '.dark [class~="dark:bg-white/15"]{background-color:rgba(255,255,255,.15)!important}' +
      '.dark [class~="dark:bg-white/20"]{background-color:rgba(255,255,255,.2)!important}' +
      '[class~="bg-slate-50"]{background-color:#f8f5ef!important}' +
      '[class~="bg-slate-100"]{background-color:#f2e9dc!important}' +
      '[class~="bg-slate-950"]{background-color:#291713!important}' +
      '.dark [class~="dark:bg-slate-800"]{background-color:#292524!important}' +
      '.dark [class~="dark:bg-slate-950"],.dark [class~="dark:bg-slate-950/90"]{background-color:#0c0a09!important}' +
      '.dark [class~="dark:bg-slate-900"],.dark [class~="dark:bg-slate-900/95"],.dark [class~="dark:bg-slate-900/60"]{background-color:#1c1917!important}' +
      '[class~="bg-blue-50"],[class~="bg-teal-50"]{background-color:#fff7f3!important}' +
      '[class~="bg-blue-100"],[class~="bg-teal-100"]{background-color:#fce8df!important}' +
      '[class~="bg-blue-200"],[class~="bg-teal-200"]{background-color:#f6cdbb!important}' +
      '[class~="bg-blue-500"],[class~="bg-teal-500"]{background-color:#c45c3a!important}' +
      '[class~="bg-blue-600"],[class~="bg-teal-600"]{background-color:#a9482d!important}' +
      '[class~="bg-blue-700"]{background-color:#883923!important}' +
      '[class~="bg-blue-800"]:hover,[class~="hover:bg-blue-800"]:hover,[class~="hover:bg-teal-700"]:hover{background-color:#682e21!important}' +
      '[class~="bg-blue-800/40"]{background-color:rgba(136,57,35,.45)!important}' +
      '[class~="hover:bg-blue-50"]:hover{background-color:#fff7f3!important}' +
      '[class~="hover:bg-blue-100"]:hover{background-color:#fce8df!important}' +
      '[class~="from-blue-50"]{--tw-gradient-from:#fff7f3 var(--tw-gradient-from-position);--tw-gradient-to:rgb(255 247 243 / 0) var(--tw-gradient-to-position)}' +
      '[class~="to-teal-50"]{--tw-gradient-to:#fce8df var(--tw-gradient-to-position)}' +
      '[class~="text-blue-50"],[class~="text-blue-100"],[class~="text-teal-50"],[class~="text-teal-100"]{color:#fce8df!important}' +
      '[class~="text-blue-200"],[class~="text-teal-200"]{color:#f6cdbb!important}' +
      '[class~="text-blue-300"],[class~="text-teal-300"]{color:#eba589!important}' +
      '[class~="text-blue-400"],[class~="text-teal-400"]{color:#db805f!important}' +
      '[class~="text-blue-500"],[class~="text-teal-500"]{color:#c45c3a!important}' +
      '[class~="text-blue-600"]{color:#a9482d!important}' +
      '[class~="text-blue-700"],[class~="text-teal-600"],[class~="text-teal-700"]{color:#883923!important}' +
      '[class~="text-blue-800"],[class~="text-teal-800"]{color:#682e21!important}' +
      '[class~="hover:text-blue-700"]:hover,[class~="hover:text-teal-400"]:hover{color:#a9482d!important}' +
      '.dark [class~="dark:text-blue-300"],.dark [class~="dark:text-teal-300"]{color:#eba589!important}' +
      '.dark [class~="dark:text-blue-400"],.dark [class~="dark:text-teal-400"]{color:#db805f!important}' +
      '.dark [class~="dark:bg-blue-500/5"],.dark [class~="dark:bg-teal-500/5"]{background-color:rgba(196,92,58,.08)!important}' +
      '.dark [class~="dark:bg-blue-500/10"],.dark [class~="dark:bg-teal-500/10"],.dark [class~="dark:bg-blue-500/15"]{background-color:rgba(196,92,58,.14)!important}' +
      '[class~="border-blue-100"],[class~="border-blue-200"],[class~="border-teal-100"],[class~="border-teal-200"]{border-color:#f6cdbb!important}' +
      '[class~="border-blue-300"],[class~="border-teal-300"],[class~="hover:border-blue-300"]:hover{border-color:#eba589!important}' +
      '[class~="border-blue-400"],[class~="hover:border-blue-400"]:hover{border-color:#db805f!important}' +
      '[class~="border-blue-600"],[class~="border-blue-700"],[class~="dark:border-blue-600"],[class~="dark:border-blue-700"]{border-color:#883923!important}' +
      '.dark [class~="dark:border-blue-700/50"]{border-color:rgba(136,57,35,.5)!important}' +
      '[class~="border-slate-200"]{border-color:#e7ddd2!important}' +
      '.dark [class~="dark:border-slate-700"],.dark [class~="dark:border-slate-800"]{border-color:#44403c!important}' +
      '[class~="focus:ring-blue-200"]{--tw-ring-color:#f6cdbb!important}' +
      '[class~="ring-blue-100"]{--tw-ring-color:#f6cdbb!important}' +
      '[class~="ring-blue-500/20"],[class~="dark:ring-blue-500/20"]{--tw-ring-color:rgba(196,92,58,.2)!important}' +
      '[class~="from-blue-700"]{--tw-gradient-from:#883923 var(--tw-gradient-from-position);--tw-gradient-to:rgb(136 57 35 / 0) var(--tw-gradient-to-position)}' +
      '[class~="from-blue-600"]{--tw-gradient-from:#a9482d var(--tw-gradient-from-position);--tw-gradient-to:rgb(169 72 45 / 0) var(--tw-gradient-to-position)}' +
      '[class~="from-teal-600"]{--tw-gradient-from:#a9482d var(--tw-gradient-from-position);--tw-gradient-to:rgb(169 72 45 / 0) var(--tw-gradient-to-position)}' +
      '[class~="from-brand-900"]{--tw-gradient-from:#48251d var(--tw-gradient-from-position);--tw-gradient-to:rgb(72 37 29 / 0) var(--tw-gradient-to-position)}' +
      '[class~="to-teal-600"]{--tw-gradient-to:#a9482d var(--tw-gradient-to-position)}' +
      '[class~="to-teal-500"]{--tw-gradient-to:#c45c3a var(--tw-gradient-to-position)}' +
      '[class~="to-teal-700"]{--tw-gradient-to:#883923 var(--tw-gradient-to-position)}' +
      '[class~="to-teal-800"]{--tw-gradient-to:#682e21 var(--tw-gradient-to-position)}' +
      '[class~="to-teal-900"]{--tw-gradient-to:#48251d var(--tw-gradient-to-position)}' +
      '[class~="via-brand-700"]{--tw-gradient-via:#883923 var(--tw-gradient-via-position)}' +
      '[dir="rtl"] .rtl-flip{transform:scaleX(-1)}' +
      '@keyframes fxToast{from{opacity:0;transform:translateY(-8px) scale(.97)}to{opacity:1;transform:none}}' +
      '@keyframes fxIn{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}' +
      '@keyframes fxFade{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:none}}' +
      '.fx-modal-in{animation:fxIn .2s ease-out}' +
      '.fx-modal-out{opacity:0;transform:translateY(8px) scale(.98);transition:all .18s ease-in}' +
      '.fx-fade-up{animation:fxFade .5s ease-out both}' +
      '.fx-sb{overflow-y:auto}' +
      '.fx-scroll-slim::-webkit-scrollbar{width:6px;height:6px}' +
      '.fx-scroll-slim::-webkit-scrollbar-thumb{background:rgba(100,116,139,.35);border-radius:9999px}' +
      '.error input,.error select,.error textarea{border-color:#fb7185!important}' +
      '[data-field-error]{font-size:12px;margin-top:4px;color:#e11d48}' +
      '@media (max-width:1023px){' +
      '  .fx-sb{position:fixed!important;top:0;bottom:0;z-index:60;width:16.5rem;transition:transform .25s ease;display:flex!important;flex-direction:column}' +
      '  [dir="ltr"] .fx-sb{left:0;transform:translateX(-110%)}' +
      '  [dir="rtl"] .fx-sb{right:0;transform:translateX(110%)}' +
      '  .fx-sb.fx-sb-open{transform:none!important;box-shadow:0 20px 50px rgba(2,6,23,.35)}' +
      '  .fx-sb-backdrop{position:fixed;inset:0;z-index:55;background:rgba(2,6,23,.55);opacity:0;pointer-events:none;transition:opacity .25s}' +
      '  .fx-sb-backdrop.fx-sb-backdrop-open{opacity:1;pointer-events:auto}' +
      '}' +
      '@media (min-width:1024px){' +
      '  .fx-sb{transform:none!important;position:sticky;top:0;height:100vh;width:16.5rem;flex:0 0 16.5rem;display:flex!important;flex-direction:column}' +
      '  .fx-sb-backdrop{display:none}' +
      '}' +
      '.fx-tab-active{background:#883923;color:#fff!important;box-shadow:0 4px 14px rgba(136,57,35,.25)}' +
      '.dark .fx-tab-active{background:#a9482d}' +
      '.fx-sb-item{border-inline-start:3px solid transparent}' +
      '.fx-sb-item-active{border-inline-start-color:#c45c3a;background:#fce8df!important;color:#682e21!important;box-shadow:0 3px 10px rgba(104,46,33,.06)}' +
      '.dark .fx-sb-item-active{background:rgba(196,92,58,.16)!important;color:#f6cdbb!important}' +
      '.fx-hover-card{transition:transform .2s ease,box-shadow .2s ease}' +
      '.fx-hover-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px -12px rgba(2,6,23,.22)}' +
      '.fx-stats-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(180px,1fr))}' +
      'img{background:linear-gradient(135deg,#e2e8f0,#f1f5f9)}' +
      '.dark img{background:linear-gradient(135deg,#0f172a,#1e293b)}';
    document.head.appendChild(style);
  }

  /* ---------- init sequence ---------- */
  function boot() {
    injectStyles();
    seed();
    Fixora.initTheme();
    Fixora.initDirection();
    Fixora.renderNavbar();
    Fixora.renderFooter();
    if (window.lucide) lucide.createIcons();
    Fixora.bootReady = true;
    document.dispatchEvent(new CustomEvent('fx:ready', { detail: { fixora: Fixora } }));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.Fixora = Fixora;
})();
