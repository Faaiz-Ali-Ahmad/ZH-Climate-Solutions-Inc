// ZH Climate Solutions — site content. Edit here, then run `npm run build`.

export const company = {
  name: 'ZH Climate Solutions Inc.',
  short: 'ZH Climate',
  phone: '647-614-4019',
  tel: '+16476144019',
  email: 'zhclimatesolutions@gmail.com',
  site: 'https://www.zhclimatesolutions.ca',
  base: 'Brampton, Ontario',
  slogan: 'Comfort. Safety. Power.'
};

// Promises taken from ZH's own flyers & vehicle wrap
export const trust = [
  { icon: 'shield', title: 'Licensed & insured', text: 'Qualified, insured technicians on every job.' },
  { icon: 'clock', title: '24/7 emergency service', text: 'No heat, a burst pipe or a power fault? Call any time.' },
  { icon: 'tag', title: 'Free estimates', text: 'Clear, upfront quotes before any installation work.' },
  { icon: 'home', title: 'Residential & commercial', text: 'Homes, rentals, offices, restaurants and retail.' }
];

export const services = [
  {
    slug: 'heating', name: 'Heating', nav: 'Furnaces & Heating', icon: 'flame', tone: 'hot',
    title: 'Furnace & Heating Services',
    meta: 'Furnace installation, repair and maintenance, boilers and thermostats in Brampton, the GTA and across Ontario. 24/7 emergency heating service.',
    lede: 'Furnace installation, repair and maintenance that keeps your home warm and safe through an Ontario winter.',
    intro: [
      'Your furnace is the hardest-working system in your home from October to April. When it short-cycles, blows cold air or stops altogether, you need someone who can diagnose the problem quickly and fix it properly.',
      'ZH Climate installs, repairs and maintains gas and electric furnaces, boilers and the thermostats that control them. We size new equipment to your home, explain your options in plain language and leave the system safe, clean and running efficiently.'
    ],
    offerings: [
      { t: 'Furnace installation & replacement', d: 'High-efficiency gas and electric furnaces sized for your home, with proper venting, gas connections and a full start-up check.' },
      { t: 'Furnace repair', d: 'Ignition and flame sensor faults, blower motors, control boards, pressure switches, strange noises and no-heat calls — including nights and weekends.' },
      { t: 'Furnace maintenance & tune-ups', d: 'Seasonal inspection, cleaning, burner and heat-exchanger checks, filter replacement and safety testing before the cold arrives.' },
      { t: 'Boilers & hydronic heating', d: 'Service and repair for boiler systems, circulator pumps and radiant floor heating.' },
      { t: 'Thermostats & smart controls', d: 'Programmable and Wi-Fi thermostat installation, wiring and setup so you can control comfort from your phone.' },
      { t: 'Ductwork & airflow', d: 'Duct repairs, sealing and modifications to fix cold rooms and uneven heating.' }
    ],
    signs: ['Furnace runs but the house stays cold', 'Short cycling, or turning on and off often', 'Banging, squealing or rattling noises', 'Higher gas bills with no change in use', 'Yellow burner flame or a smell of gas (call immediately)', 'System is 15+ years old and needs frequent repairs'],
    faqs: [
      { q: 'How often should my furnace be serviced?', a: 'Once a year, ideally in early fall before heavy use. Regular maintenance helps catch worn parts early and keeps the system running safely and efficiently.' },
      { q: 'Repair or replace — how do I decide?', a: 'Age, repair cost, efficiency and safety all matter. We will give you an honest assessment and a free estimate for replacement so you can compare.' },
      { q: 'What if my heat goes out at night?', a: 'Call 647-614-4019. We offer 24/7 emergency service for no-heat situations.' }
    ]
  },
  {
    slug: 'cooling', name: 'Cooling', nav: 'Air Conditioning', icon: 'snow', tone: 'ice',
    title: 'Air Conditioning Services',
    meta: 'Central air conditioning and ductless mini-split installation, AC repair and maintenance in Brampton, the GTA and Ontario.',
    lede: 'Central air, ductless mini-splits and AC repairs that keep you cool through the hottest days of summer.',
    intro: [
      'A reliable air conditioner makes summer bearable — and an inefficient one shows up on every hydro bill. Whether your AC is blowing warm air, freezing up or simply getting old, we can help.',
      'We install and service central air conditioners and ductless systems for homes and businesses, matched to the size and layout of your space.'
    ],
    offerings: [
      { t: 'Central AC installation', d: 'New and replacement central air systems, sized to your home and connected to your existing furnace and ductwork.' },
      { t: 'Ductless mini-splits', d: 'Wall-mounted systems for additions, basements, garages and homes without ducts — with zoned control room by room.' },
      { t: 'AC repair', d: 'Warm air, refrigerant leaks, frozen coils, failed capacitors and compressors, tripped breakers and noisy outdoor units.' },
      { t: 'AC maintenance & tune-ups', d: 'Coil cleaning, refrigerant and electrical checks, condensate drain clearing and performance testing before summer.' },
      { t: 'Commercial cooling', d: 'Rooftop and split system maintenance for offices, restaurants and retail spaces.' }
    ],
    signs: ['Blowing warm or weak air', 'Ice on the lines or indoor coil', 'Water pooling near the furnace', 'Loud buzzing or clanking outside', 'Rooms that never cool down', 'Hydro bills climbing every summer'],
    faqs: [
      { q: 'When should I book an AC tune-up?', a: 'Spring is best — before the first heatwave, when demand is highest.' },
      { q: 'Is a ductless mini-split right for me?', a: 'They are ideal for spaces without ductwork, additions, basements and rooms that are always too hot. We can assess your home and recommend the right setup.' },
      { q: 'Do you service all brands?', a: 'We service most makes and models of central and ductless air conditioners. Tell us your brand when you book.' }
    ]
  },
  {
    slug: 'heat-pumps', name: 'Heat Pumps', nav: 'Heat Pumps', icon: 'fan', tone: 'ice',
    title: 'Heat Pump Installation & Service',
    meta: 'Cold-climate and ductless heat pump installation, repair and maintenance in Brampton, the GTA and Ontario.',
    lede: 'Efficient heating and cooling from one system — including cold-climate and ductless heat pumps built for Ontario.',
    intro: [
      'A heat pump moves heat instead of making it, so one system heats your home in winter and cools it in summer. Modern cold-climate models keep working well below freezing and can pair with your existing furnace as a backup.',
      'We help you choose between ducted, ductless and hybrid (dual-fuel) setups, install the system cleanly and keep it maintained.'
    ],
    offerings: [
      { t: 'Ducted heat pumps', d: 'Replace your central AC with a heat pump that also heats, using your existing ducts.' },
      { t: 'Ductless & multi-zone systems', d: 'Mini-split heat pumps for homes without ducts, or for zoned control of individual rooms.' },
      { t: 'Hybrid / dual-fuel systems', d: 'Pair a heat pump with a gas furnace so the most efficient source runs automatically.' },
      { t: 'Heat pump repair & maintenance', d: 'Defrost issues, refrigerant leaks, reversing valves, sensors and seasonal maintenance.' },
      { t: 'Rebate guidance', d: 'Ask us about current energy-efficiency rebate programs that may apply to your upgrade.' }
    ],
    signs: ['Your AC is near the end of its life', 'You want lower heating costs', 'You heat with electric baseboards', 'Some rooms are always too hot or too cold', 'You are planning an addition or basement finish'],
    faqs: [
      { q: 'Do heat pumps work in Ontario winters?', a: 'Yes. Cold-climate heat pumps are designed to heat efficiently in sub-zero temperatures, and a hybrid setup adds a furnace for the coldest days.' },
      { q: 'Can I keep my furnace?', a: 'Often, yes. A dual-fuel system uses your heat pump most of the year and your furnace as a backup.' },
      { q: 'Are there rebates?', a: 'Programs change throughout the year. We can help you check what is currently available for your home.' }
    ]
  },
  {
    slug: 'ventilation-air-quality', name: 'Ventilation & Air Quality', nav: 'Ventilation & Air Quality', icon: 'wind', tone: 'ice',
    title: 'Ventilation & Indoor Air Quality',
    meta: 'Ductwork, range hood and exhaust installation, HRV/ERV, humidifiers, dehumidifiers, air filtration and purification in Brampton and Ontario.',
    lede: 'Ductwork, exhaust, humidity control and filtration for cleaner, healthier air in every room.',
    intro: [
      'Good comfort is not just temperature. Dry winter air, damp basements, cooking smoke, dust and allergens all affect how your home feels — and how healthy it is.',
      'We design, install and maintain the ventilation and air-quality equipment that keeps air moving, filtered and at the right humidity.'
    ],
    offerings: [
      { t: 'Range hood installation', d: 'Kitchen range hoods properly ducted to the outside, sized for your cooktop.' },
      { t: 'Exhaust systems', d: 'Installation and maintenance of bathroom, kitchen and commercial exhaust systems.' },
      { t: 'Ductwork', d: 'New duct runs, modifications, repairs and sealing to balance airflow throughout your home.' },
      { t: 'Humidifiers & dehumidifiers', d: 'Whole-home humidifiers for dry winters and dehumidifiers for damp basements.' },
      { t: 'Air filtration & purification', d: 'High-efficiency and HEPA filtration, air purifiers and UV air treatment to reduce dust, allergens and odours.' },
      { t: 'HRV / ERV systems', d: 'Heat and energy recovery ventilators that bring in fresh air without wasting heat.' }
    ],
    signs: ['Static shocks, dry skin or cracked wood in winter', 'Musty smells or condensation on windows', 'Lingering cooking odours', 'Excess dust or allergy symptoms indoors', 'Rooms that feel stuffy'],
    faqs: [
      { q: 'What humidity should my home be?', a: 'Generally around 30–50% depending on the season. We can recommend and install the right equipment to keep it in range.' },
      { q: 'Do I need an HRV?', a: 'Newer, tightly sealed homes often benefit from one. We can assess your home and explain the options.' },
      { q: 'How often should filters be changed?', a: 'Typically every 1–3 months, depending on the filter type, pets and household use.' }
    ]
  },
  {
    slug: 'water-heaters', name: 'Water Heaters', nav: 'Water Heaters', icon: 'tank', tone: 'water',
    title: 'Water Heater Services',
    meta: 'Tank and tankless water heater installation, repair and maintenance in Brampton, the GTA and Ontario.',
    lede: 'Tank and tankless water heater installation and repair — so the hot water never runs out.',
    intro: [
      'No hot water, rusty water or a puddle under the tank? Water heater problems tend to show up at the worst time. We diagnose and repair them quickly, or help you choose a replacement that suits your household.',
      'We install and service conventional tank and on-demand tankless water heaters.'
    ],
    offerings: [
      { t: 'Water heater installation', d: 'Gas and electric tank water heaters, sized for your household, with proper venting and safety valves.' },
      { t: 'Tankless water heaters', d: 'On-demand hot water that saves space and never runs out, installed with the right gas and venting.' },
      { t: 'Water heater repair', d: 'Pilot and ignition problems, thermostats, elements, valves, leaks and not-enough-hot-water issues.' },
      { t: 'Maintenance & flushing', d: 'Sediment flushing, anode checks and descaling to extend the life of your system.' }
    ],
    signs: ['Hot water runs out quickly', 'Rusty or discoloured hot water', 'Rumbling or popping from the tank', 'Leaks or moisture around the base', 'Tank is 10+ years old'],
    faqs: [
      { q: 'Tank or tankless?', a: 'Tankless units save space and provide continuous hot water; tanks have a lower upfront cost. We will help you compare for your home.' },
      { q: 'How long does a water heater last?', a: 'Tank models commonly last around 8–12 years, depending on water quality and maintenance.' },
      { q: 'My tank is leaking — what do I do?', a: 'Turn off the water supply to the tank and the power or gas if it is safe to do so, then call us right away.' }
    ]
  },
  {
    slug: 'water-treatment', name: 'Water Treatment', nav: 'Water Treatment', icon: 'drop', tone: 'water',
    title: 'Water Softeners & Purification',
    meta: 'Water softener, reverse osmosis, whole-home filtration and UV water treatment installation in Brampton and Ontario.',
    lede: 'Softer, cleaner, better-tasting water from every tap in your home.',
    intro: [
      'Hard water leaves scale on fixtures, shortens the life of appliances and dries out skin and hair. Taste and odour issues make tap water less appealing to drink.',
      'We install and service water treatment equipment matched to your water and your household.'
    ],
    offerings: [
      { t: 'Water softeners', d: 'Reduce scale build-up on fixtures, water heaters and appliances.' },
      { t: 'Reverse osmosis drinking water', d: 'Under-sink systems for clean, great-tasting drinking water.' },
      { t: 'Whole-home filtration', d: 'Filters that reduce chlorine, sediment and odours at every tap.' },
      { t: 'UV disinfection', d: 'Ultraviolet treatment, especially for homes and cottages on well water.' }
    ],
    signs: ['White scale on taps and shower heads', 'Spots on dishes and glassware', 'Chlorine taste or smell', 'Dry skin and hair after showering', 'Well water you want treated'],
    faqs: [
      { q: 'How do I know if I have hard water?', a: 'Scale on fixtures and spotty dishes are common signs. We can help you choose the right system for your water.' },
      { q: 'Does a softener need maintenance?', a: 'Yes — periodic salt top-ups and an occasional service check keep it working properly.' },
      { q: 'Can you install RO under my sink?', a: 'Yes, most kitchens can accommodate an under-sink reverse osmosis system with a dedicated faucet.' }
    ]
  },
  {
    slug: 'plumbing', name: 'Plumbing', nav: 'Plumbing', icon: 'faucet', tone: 'water',
    title: 'Plumbing Services',
    meta: 'Plumbing repairs and installation: leaks, pipes, drains, faucets, toilets, sinks and water heaters in Brampton, the GTA and Ontario. 24/7 emergency plumbing.',
    lede: 'Leaks, drains, fixtures and pipes — repaired properly and installed right the first time.',
    intro: [
      'Small leaks become big problems fast. From a dripping tap to a burst pipe, we handle residential and commercial plumbing repairs and installations with care for your home.',
      'Call us 24/7 for plumbing emergencies like major leaks, burst pipes or sewer back-ups.'
    ],
    offerings: [
      { t: 'Leak & pipe repair', d: 'Locate and fix leaking pipes, joints, valves and fittings — including frozen and burst pipes.' },
      { t: 'Drain cleaning', d: 'Clear slow and blocked kitchen, bathroom and floor drains.' },
      { t: 'Faucets & fixtures', d: 'Repair and install faucets, shower valves, toilets and fixtures.' },
      { t: 'Sink installation', d: 'Kitchen, bathroom and laundry sinks with new supply lines and drains.' },
      { t: 'Toilet repair', d: 'Running, leaking, clogged or rocking toilets fixed or replaced.' },
      { t: 'Shut-off valves', d: 'Replace seized or leaking shut-off valves so you can control water in an emergency.' },
      { t: 'Commercial plumbing', d: 'Plumbing service for restaurants, offices, retail and multi-unit properties.' }
    ],
    signs: ['Dripping taps or running toilets', 'Slow drains or gurgling sounds', 'Water stains on ceilings or walls', 'Low water pressure', 'Unexplained increase in water bill'],
    faqs: [
      { q: 'Do you handle emergency plumbing?', a: 'Yes. Call 647-614-4019 any time for burst pipes, major leaks or flooding.' },
      { q: 'What should I do during a major leak?', a: 'Turn off your main water shut-off valve, switch off electricity in the affected area if safe, and call us.' },
      { q: 'Can you install fixtures I bought myself?', a: 'Usually, yes. Let us know the model when you book so we can bring the right parts.' }
    ]
  },
  {
    slug: 'electrical', name: 'Electrical', nav: 'Electrical', icon: 'bolt', tone: 'volt',
    title: 'Electrical Services',
    meta: 'Electrical repairs and troubleshooting, panels and wiring, lighting and outlets, EV chargers and generators in Brampton, the GTA and Ontario.',
    lede: 'Safe, reliable, professional electrical work — from a dead outlet to a full panel upgrade.',
    intro: [
      'Electrical problems are a safety issue first. Flickering lights, warm outlets and tripping breakers are signs something needs attention.',
      'We handle residential and commercial electrical repairs, upgrades and installations, done to code and explained clearly.'
    ],
    offerings: [
      { t: 'Repairs & troubleshooting', d: 'Find and fix faults, tripping breakers, dead circuits and flickering lights.' },
      { t: 'Panels & wiring', d: 'Panel upgrades and replacements, new circuits and rewiring for renovations.' },
      { t: 'Lighting & outlets', d: 'Pot lights, fixtures, dimmers, GFCI and USB outlets, indoors and outside.' },
      { t: 'EV chargers', d: 'Level 2 home charger installation with a dedicated circuit.' },
      { t: 'Standby generators', d: 'Backup power so your heat, sump pump and fridge keep running in an outage.' },
      { t: 'Electrical installations', d: 'Wiring for new appliances, HVAC equipment, renovations and commercial fit-outs.' }
    ],
    signs: ['Breakers trip often', 'Flickering or dimming lights', 'Outlets that are warm or buzz', 'Burning smell (call immediately)', 'Older panel or not enough circuits'],
    faqs: [
      { q: 'Can you install an EV charger?', a: 'Yes. We assess your panel capacity and install a Level 2 charger on a dedicated circuit.' },
      { q: 'Do I need a panel upgrade?', a: 'If you are adding major loads like an EV charger, heat pump or renovation, your panel may need more capacity. We can check.' },
      { q: 'Is electrical work urgent?', a: 'Burning smells, sparks or hot outlets should be treated as emergencies — call us right away.' }
    ]
  },
  {
    slug: 'commercial', name: 'Commercial', nav: 'Commercial Services', icon: 'building', tone: 'navy',
    title: 'Commercial Services',
    meta: 'Commercial HVAC, exhaust, plumbing, electrical and appliance maintenance for businesses in Brampton, the GTA and Ontario.',
    lede: 'One contractor for the systems your business depends on — HVAC, exhaust, plumbing, electrical and building maintenance.',
    intro: [
      'Downtime costs money. We help offices, restaurants, retail stores and property managers keep their buildings comfortable, safe and running.',
      'Book one-off repairs or set up a recurring maintenance schedule for your property.'
    ],
    offerings: [
      { t: 'Commercial HVAC maintenance', d: 'Rooftop units, split systems, heaters and ventilation maintained on a schedule that suits your business.' },
      { t: 'Commercial exhaust systems', d: 'Kitchen and industrial exhaust installation and maintenance.' },
      { t: 'Commercial appliance maintenance', d: 'Service for commercial appliances and equipment.' },
      { t: 'Commercial plumbing', d: 'Washrooms, kitchens, water heaters and drains for businesses.' },
      { t: 'Commercial electrical', d: 'Lighting, circuits, panels and fit-out wiring.' },
      { t: 'Building maintenance', d: 'Ongoing maintenance support for property managers and building owners.' }
    ],
    signs: ['Uneven temperatures across your space', 'Kitchen exhaust not keeping up', 'Rising utility costs', 'Frequent breakdowns', 'No preventive maintenance schedule'],
    faqs: [
      { q: 'Do you offer maintenance contracts?', a: 'Yes — we can set up scheduled maintenance for your property. Contact us to discuss your equipment and needs.' },
      { q: 'Can you work outside business hours?', a: 'We can discuss scheduling that minimises disruption to your business, and emergency service is available 24/7.' },
      { q: 'Which properties do you serve?', a: 'Offices, restaurants, retail, plazas, multi-unit residential and more.' }
    ]
  },
  {
    slug: 'maintenance-plans', name: 'Maintenance', nav: 'Maintenance & Tune-ups', icon: 'wrench', tone: 'navy',
    title: 'Maintenance & Seasonal Tune-ups',
    meta: 'Furnace, AC, heat pump, water heater and plumbing maintenance and seasonal tune-ups in Brampton, the GTA and Ontario.',
    lede: 'Regular care that prevents breakdowns, protects your equipment and keeps energy bills in check.',
    intro: [
      'Most breakdowns start as small problems that a technician could have caught. A seasonal tune-up keeps your equipment clean, safe and efficient — and helps it last longer.',
      'Book a one-time tune-up, or ask us about a recurring maintenance schedule for your home or business.'
    ],
    offerings: [
      { t: 'Fall furnace tune-up', d: 'Cleaning, safety checks, burner and ignition inspection and filter change before winter.' },
      { t: 'Spring AC tune-up', d: 'Coil cleaning, refrigerant and electrical checks and drain clearing before summer.' },
      { t: 'Heat pump maintenance', d: 'Twice-a-year service for year-round systems.' },
      { t: 'Water heater flush', d: 'Sediment removal and safety valve checks.' },
      { t: 'Plumbing & electrical inspections', d: 'Spot leaks, worn valves and electrical hazards before they become emergencies.' }
    ],
    signs: ['No service in the last 12 months', 'Rising energy bills', 'Noisy equipment', 'Moving into a new home', 'Preparing for winter or summer'],
    faqs: [
      { q: 'How often should I book maintenance?', a: 'Once a year for furnaces and AC, twice a year for heat pumps that run all year.' },
      { q: 'What is included in a tune-up?', a: 'Inspection, cleaning, safety and performance checks, and a report on anything that needs attention.' },
      { q: 'Can you set up reminders?', a: 'Ask us about a recurring maintenance schedule when you book.' }
    ]
  }
];

// Customer reviews. While `sample` is true, every card is tagged "Sample review" and a note explains they are placeholders.
// Before launch: replace the items with real customer reviews (e.g. from Google) and set sample: false.
export const reviews = {
  sample: true,
  items: [
    { name: 'Faaiz', city: 'Brampton', service: 'Furnace repair', text: 'Our furnace stopped working on a freezing night. They answered right away, came out the same evening and had the heat back on within the hour. Clear explanation, fair price.' },
    { name: 'Hasnain', city: 'Mississauga', service: 'Heat pump installation', text: 'They walked us through ducted versus hybrid options without any pressure, installed the system in a day and left everything spotless. The house has never been this comfortable.' },
    { name: 'Adeeb', city: 'Brampton', service: 'Water heater replacement', text: 'Booked online in the morning and got a call back within the hour. The new tankless unit was installed the next day. Professional from start to finish.' }
  ]
};

// Equipment brands ZH installs and services (names as text — no logos used)
export const brands = [
  ['Trane', 'Furnaces & AC'], ['Carrier', 'Furnaces & AC'], ['Lennox', 'Furnaces & AC'], ['Gree', 'Heat pumps & ductless'],
  ['Midea', 'Heat pumps & ductless'], ['GE Appliances', 'Appliances & HVAC'], ['RunTru', 'Furnaces & AC'], ['Excalibur', 'Water heaters'],
  ['Bradford White', 'Water heaters'], ['A.O. Smith', 'Water heaters'], ['Rinnai', 'Tankless water heaters'], ['Navien', 'Tankless & boilers'],
  ['Noritz', 'Tankless water heaters'], ['Aprilaire', 'Humidifiers & air quality'], ['ecobee', 'Smart thermostats'], ['Kohler', 'Fixtures & generators']
];

// Bookable options (homepage booking widget)
export const bookServices = [
  ['Heating', 'flame'], ['Cooling', 'snow'], ['Heat pump', 'fan'], ['Water heater', 'tank'],
  ['Plumbing', 'faucet'], ['Electrical', 'bolt'], ['Air & ventilation', 'wind'], ['Water treatment', 'drop'],
  ['Commercial', 'building'], ['Not sure', 'help']
];

export const areas = [
  ['Peel Region', ['Brampton', 'Mississauga']],
  ['Toronto', ['Toronto', 'Etobicoke', 'North York', 'Scarborough']],
  ['York Region', ['Vaughan', 'Markham', 'Richmond Hill', 'Aurora', 'Newmarket', 'King City']],
  ['Halton Region', ['Oakville', 'Burlington', 'Milton', 'Halton Hills', 'Georgetown']],
  ['Durham Region', ['Ajax', 'Whitby', 'Oshawa', 'Durham']],
  ['Simcoe & Georgian Bay', ['Barrie', 'Innisfil', 'Bradford', 'Alliston', 'Georgian Bay']],
  ['Hamilton & Niagara', ['Hamilton', 'Binbrook', 'Caledonia', 'Dunnville', 'St. Catharines', 'Niagara']],
  ['Waterloo & Wellington', ['Kitchener', 'Waterloo', 'Cambridge', 'Guelph', 'Elmira', 'Fergus', 'Mount Forest', 'Ayr']],
  ['Southwestern Ontario', ['London', 'Brantford', 'Woodstock', 'Delhi', 'Strathroy', 'Sarnia', 'Chatham-Kent', 'Windsor']],
  ['Eastern & Northern Ontario', ['Ottawa', 'Kingston', 'Peterborough', 'Sudbury']]
];

export const generalFaqs = [
  { q: 'How do I book an appointment?', a: 'Use the booking form on any page — choose your service, a preferred date and time window, and your details. Our team will contact you to confirm the appointment. For anything urgent, call 647-614-4019.' },
  { q: 'Do you offer 24/7 emergency service?', a: 'Yes. For no heat, no cooling in extreme weather, major leaks, burst pipes or electrical hazards, call us any time at 647-614-4019.' },
  { q: 'Are estimates free?', a: 'Yes, estimates for new installations and replacements are free. We explain your options and pricing before any work begins.' },
  { q: 'Are you licensed and insured?', a: 'Yes. ZH Climate Solutions Inc. is licensed and insured, and our technicians are trained for the work they perform.' },
  { q: 'Which areas do you serve?', a: 'We are based in Brampton and serve the GTA and communities across Ontario — see the full list on our Service Areas page. Share your postal code and we will confirm availability.' },
  { q: 'Which brands do you work with?', a: 'We install and service equipment from leading brands including Trane, Carrier, Lennox, Gree, Midea, GE Appliances, RunTru, Excalibur, Bradford White, A.O. Smith, Rinnai, Navien, Noritz, Aprilaire, ecobee and Kohler — and we service most other makes and models too.' },
  { q: 'Do you work on commercial properties?', a: 'Yes. We provide HVAC, exhaust, plumbing, electrical and maintenance services for offices, restaurants, retail and multi-unit buildings.' },
  { q: 'Is my online booking confirmed right away?', a: 'Online bookings are requests. A member of our team will call or email to confirm the date and time with you.' }
];
