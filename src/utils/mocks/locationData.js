const locationData = {
  countries: [
    { name: 'Ukraine', iso2: 'UA' },
    { name: 'United States', iso2: 'US' },
    { name: 'United Kingdom', iso2: 'GB' },
    { name: 'Germany', iso2: 'DE' },
    { name: 'Poland', iso2: 'PL' }
  ],

  statesByCountry: {
    UA: [
      { name: 'Kyiv Oblast', iso2: '32' },
      { name: 'Lviv Oblast', iso2: '46' },
      { name: 'Odesa Oblast', iso2: '51' },
      { name: 'Kharkiv Oblast', iso2: '63' }
    ],
    US: [
      { name: 'California', iso2: 'CA' },
      { name: 'New York', iso2: 'NY' },
      { name: 'Texas', iso2: 'TX' },
      { name: 'Florida', iso2: 'FL' }
    ],
    GB: [
      { name: 'England', iso2: 'ENG' },
      { name: 'Scotland', iso2: 'SCT' }
    ],
    DE: [
      { name: 'Bavaria', iso2: 'BY' },
      { name: 'Berlin', iso2: 'BE' }
    ],
    PL: [
      { name: 'Masovian', iso2: '14' },
      { name: 'Lesser Poland', iso2: '12' }
    ]
  },

  citiesByState: {
    // --- UKRAINE ---
    '32': [{ name: 'Kyiv' }, { name: 'Bila Tserkva' }, { name: 'Brovary' }, { name: 'Boryspil' }, { name: 'Irpin' }, { name: 'Fastiv' }, { name: 'Vyshhorod' }],
    '46': [{ name: 'Lviv' }, { name: 'Drohobych' }, { name: 'Stryi' }, { name: 'Truskavets' }, { name: 'Sambir' }, { name: 'Chervonohrad' }, { name: 'Zolochiv' }],
    '51': [{ name: 'Odesa' }, { name: 'Chornomorsk' }, { name: 'Izmail' }, { name: 'Bilhorod-Dnistrovskyi' }, { name: 'Podilsk' }, { name: 'Yuzhne' }],
    '63': [{ name: 'Kharkiv' }, { name: 'Izium' }, { name: 'Lozova' }, { name: 'Chuhuiv' }, { name: 'Kupiansk' }, { name: 'Liubotyn' }],

    // --- USA ---
    'CA': [{ name: 'Los Angeles' }, { name: 'San Francisco' }, { name: 'San Diego' }, { name: 'San Jose' }, { name: 'Sacramento' }, { name: 'Fresno' }, { name: 'Oakland' }, { name: 'Long Beach' }],
    'NY': [{ name: 'New York City' }, { name: 'Buffalo' }, { name: 'Rochester' }, { name: 'Yonkers' }, { name: 'Syracuse' }, { name: 'Albany' }, { name: 'New Rochelle' }],
    'TX': [{ name: 'Houston' }, { name: 'San Antonio' }, { name: 'Dallas' }, { name: 'Austin' }, { name: 'Fort Worth' }, { name: 'El Paso' }, { name: 'Arlington' }],
    'FL': [{ name: 'Miami' }, { name: 'Tampa' }, { name: 'Orlando' }, { name: 'Jacksonville' }, { name: 'St. Petersburg' }, { name: 'Hialeah' }],

    // --- UNITED KINGDOM ---
    'ENG': [{ name: 'London' }, { name: 'Birmingham' }, { name: 'Manchester' }, { name: 'Liverpool' }, { name: 'Leeds' }, { name: 'Sheffield' }, { name: 'Bristol' }, { name: 'Leicester' }, { name: 'Coventry' }, { name: 'Hull' }],
    'SCT': [{ name: 'Glasgow' }, { name: 'Edinburgh' }, { name: 'Aberdeen' }, { name: 'Dundee' }, { name: 'Inverness' }, { name: 'Perth' }],

    // --- GERMANY ---
    'BY': [{ name: 'Munich' }, { name: 'Nuremberg' }, { name: 'Augsburg' }, { name: 'Regensburg' }, { name: 'Ingolstadt' }, { name: 'Wurzburg' }, { name: 'Furth' }],
    'BE': [{ name: 'Berlin' }, { name: 'Spandau' }, { name: 'Pankow' }, { name: 'Steglitz' }, { name: 'Charlottenburg' }],

    // --- POLAND ---
    '14': [{ name: 'Warsaw' }, { name: 'Radom' }, { name: 'Płock' }, { name: 'Siedlce' }, { name: 'Pruszków' }, { name: 'Legionowo' }, { name: 'Ostrołęka' }],
    '12': [{ name: 'Kraków' }, { name: 'Tarnów' }, { name: 'Nowy Sącz' }, { name: 'Oświęcim' }, { name: 'Chrzanów' }, { name: 'Olkusz' }, { name: 'Wieliczka' }]
  }
}

module.exports = locationData