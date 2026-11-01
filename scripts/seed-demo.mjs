#!/usr/bin/env node
/**
 * Fills an empty database with demo content so both frontends have something
 * to show: currency, owner, facilities, villas, activities, properties, blog
 * posts and the payment channels.
 *
 *   pnpm admin:create --email admin@lind.test --password Admin12345
 *   pnpm seed:demo --identifier admin@lind.test --password Admin12345
 *
 * Everything goes through the HTTP API, so the same validation an admin would
 * hit applies here, and photos are uploaded to whatever storage the API uses.
 * Re-running is safe: a record whose name already exists is skipped.
 *
 * Photos come from the guest site's sample images
 * (../frontend-user/public/images); override with --images <dir>.
 */

import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { API, login, request } from './lib/api.mjs';
import { parseArgs, readEnv } from './lib/env.mjs';

const env = readEnv();
const args = parseArgs(process.argv.slice(2));

const IMAGES_DIR =
  args.images ??
  join(
    dirname(fileURLToPath(import.meta.url)),
    '..',
    '..',
    'frontend-user',
    'public',
    'images',
  );

const identifier = args.identifier ?? env.ADMIN_IDENTIFIER;
const password = args.password ?? env.ADMIN_PASSWORD;

if (!identifier || !password) {
  console.error(
    'Usage: pnpm seed:demo --identifier <email> --password <password>',
  );
  process.exit(1);
}

// ------------------------------------------------------------------ helpers

const log = (message) => console.log(message);

/** Returns the first record whose `name` (or `field`) matches, else undefined. */
async function findByName(path, value, field = 'name') {
  const { data } = await request(
    'GET',
    `${path}?search=${encodeURIComponent(value)}&limit=100`,
  );
  const items = data?.data ?? data ?? [];

  return items.find((item) => item[field] === value);
}

/** Create unless a record with that name exists. Returns the record. */
async function ensure(label, path, payload, field = 'name') {
  const existing = await findByName(path, payload[field], field);

  if (existing) {
    // Older runs seeded map links the API could not resolve; keep them current.
    if (payload.mapLink && existing.mapLink !== payload.mapLink) {
      await request('PATCH', `${path}/${existing.id}`, {
        mapLink: payload.mapLink,
      });
      log(`  ~ ${label}: ${payload[field]} (map link updated)`);
    } else {
      log(`  = ${label}: ${payload[field]} (exists)`);
    }

    return existing;
  }

  const { data } = await request('POST', path, payload);
  log(`  + ${label}: ${payload[field]}`);

  return data;
}

const uploaded = new Map();

/** Uploads sample images once and returns their public URLs. */
async function photos(folder, files) {
  const urls = [];

  for (const file of files) {
    // The API rejects photos over 10 MB; some of the sample art is larger.
    if (statSync(join(IMAGES_DIR, file)).size > 9.5 * 1024 * 1024) {
      log(`  ! skipped ${file} (over the upload limit)`);
      continue;
    }

    const cacheKey = `${folder}/${file}`;

    if (!uploaded.has(cacheKey)) {
      const form = new FormData();
      const type = file.endsWith('.png') ? 'image/png' : 'image/jpeg';

      form.append(
        'files',
        new Blob([readFileSync(join(IMAGES_DIR, file))], { type }),
        file,
      );
      form.append('key', folder);

      const response = await fetch(`${API}/storages/photos`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${await token()}` },
        body: form,
      });
      const body = await response.json();

      if (!response.ok) {
        throw new Error(`upload ${file} failed: ${JSON.stringify(body)}`);
      }

      uploaded.set(cacheKey, body.data.successFiles[0].url);
    }

    urls.push(uploaded.get(cacheKey));
  }

  return urls;
}

let cachedToken;
async function token() {
  if (!cachedToken) {
    const response = await request(
      'POST',
      '/auth/login',
      { identifier, password },
      false,
    );
    cachedToken = response.data.accessToken;
  }

  return cachedToken;
}

/** A bedroom and an outdoor area, reusing the listing's own photos. */
const rooms = (urls) => [
  {
    name: 'Master bedroom',
    type: 'bedrooms',
    description: 'King bed, ensuite bathroom and a private terrace.',
    photos: urls.slice(0, 2),
  },
  {
    name: 'Pool deck',
    type: 'outdoor_areas',
    description: 'Sun loungers and a shaded bale beside the pool.',
    photos: urls.slice(-2),
  },
];

/** Google Maps links the API can resolve to coordinates (they must carry lat,lng). */
const COORDINATES = {
  Ubud: [-8.5069, 115.2625],
  Canggu: [-8.6478, 115.1385],
  Uluwatu: [-8.8291, 115.0849],
  Tabanan: [-8.539, 115.125],
  Seminyak: [-8.6913, 115.1682],
};

const mapLink = (city) => {
  const [lat, lng] = COORDINATES[city];

  return `https://www.google.com/maps/@${lat},${lng},17z`;
};

// --------------------------------------------------------------------- seed

await login(identifier, password);
log(`Seeding ${API}`);

log('\nPayment channels');
for (const channel of [
  { code: 'BCA', name: 'BCA Virtual Account', type: 'virtual_account' },
  { code: 'BNI', name: 'BNI Virtual Account', type: 'virtual_account' },
  { code: 'BRI', name: 'BRI Virtual Account', type: 'virtual_account' },
  { code: 'MANDIRI', name: 'Mandiri Virtual Account', type: 'virtual_account' },
  { code: 'QRIS', name: 'QRIS', type: 'qris' },
  { code: 'OVO', name: 'OVO', type: 'e_wallet' },
  { code: 'DANA', name: 'DANA', type: 'e_wallet' },
  { code: 'SHOPEEPAY', name: 'ShopeePay', type: 'e_wallet' },
  { code: 'CARDS', name: 'Credit / Debit Card', type: 'card' },
]) {
  await ensure('channel', '/payment-channels', channel, 'code');
}

log('\nBasics');
const currency = await ensure('currency', '/currencies', {
  code: 'IDR',
  name: 'Indonesian Rupiah',
  symbol: 'Rp',
  allowDecimal: false,
  allowRound: true,
});

const owner = await ensure('owner', '/owners', {
  name: 'Made Wijaya',
  type: 'private',
  companyName: 'Wijaya Villas',
  email: 'made.wijaya@example.com',
  phoneCountryCode: '+62',
  phoneNumber: '81234567890',
  address: 'Jl. Raya Ubud No. 12, Bali',
  status: 'active',
});

const facilityNames = [
  'Private Pool',
  'Free Wi-Fi',
  'Air Conditioning',
  'Fully Equipped Kitchen',
  'Garden View',
  'Free Parking',
];
const facilities = [];
for (const name of facilityNames) {
  facilities.push(
    await ensure('facility', '/facilities', { name, type: 'main' }),
  );
}

const policyType = await ensure('policy type', '/villa-policy-types', {
  name: 'House Rules',
});
const policies = [
  {
    name: 'Check In Rules',
    description: 'Check-in from 14:00. Please bring a valid ID.',
  },
  {
    name: 'Check Out Rules',
    description: 'Check-out by 12:00. Leave keys with the villa manager.',
  },
  {
    name: 'Late Check Out Rules',
    description:
      'Late check-out is possible on request, subject to availability and a fee.',
  },
].map((policy) => ({ ...policy, typeId: policyType.id }));

log('\nVillas');
const villas = [
  {
    name: 'Villa Aranya',
    secondaryName: 'Jungle retreat with infinity pool',
    highlight:
      'Three bedrooms above the Ayung valley, a private infinity pool and a chef on request.',
    address: 'Jl. Raya Sayan, Ubud',
    city: 'Ubud',
    postalCode: '80571',
    dailyPrice: 3500000,
    lowSeasonDailyPrice: 3000000,
    highSeasonDailyPrice: 4200000,
    peakSeasonDailyPrice: 5200000,
    priceMonthly: 70000000,
    images: [
      'header-landing-page.png',
      'bedrooms.jpeg',
      'service-1.jpeg',
      'our-service-1.jpeg',
    ],
  },
  {
    name: 'Villa Segara',
    secondaryName: 'Beachside villa in Canggu',
    highlight:
      'Two minutes from the surf, with a rooftop lounge and a cooling plunge pool.',
    address: 'Jl. Pantai Batu Bolong, Canggu',
    city: 'Canggu',
    postalCode: '80361',
    dailyPrice: 2800000,
    lowSeasonDailyPrice: 2400000,
    highSeasonDailyPrice: 3300000,
    peakSeasonDailyPrice: 4100000,
    priceMonthly: 55000000,
    images: [
      'our-service-2.jpeg',
      'explore-1.png',
      'iconic-1.png',
      'our-service-3.jpeg',
    ],
  },
  {
    name: 'Villa Surya',
    secondaryName: 'Clifftop sunsets in Uluwatu',
    highlight:
      'Open-plan living on the cliff edge with an ocean-facing pool deck.',
    address: 'Jl. Labuan Sait, Uluwatu',
    city: 'Uluwatu',
    postalCode: '80361',
    dailyPrice: 4500000,
    lowSeasonDailyPrice: 3900000,
    highSeasonDailyPrice: 5400000,
    peakSeasonDailyPrice: 6800000,
    priceMonthly: 90000000,
    images: [
      'iconic-2.png',
      'explore-2.png',
      'content-about-1.jpeg',
      'dream-home.jpeg',
    ],
  },
];

for (const villa of villas) {
  const { images, ...rest } = villa;
  const villaPhotos = await photos('villas', images);

  await ensure('villa', '/villas', {
    ...rest,
    availability: { daily: true, monthly: true, yearly: false },
    country: 'Indonesia',
    state: 'Bali',
    mapLink: mapLink(villa.city),
    placeNearby: [
      { name: 'Local warung', distance: 300 },
      { name: 'Beach', distance: 1500 },
    ],
    checkInHour: '14:00',
    checkOutHour: '12:00',
    photos: villaPhotos,
    currencyId: currency.id,
    ownerId: owner.id,
    facilities: facilities.map((facility) => ({ id: facility.id })),
    additionals: rooms(villaPhotos),
    features: [
      {
        type: 'service',
        name: 'Daily breakfast',
        free: true,
        currencyId: currency.id,
      },
      {
        type: 'service',
        name: 'Airport transfer',
        free: false,
        price: 450000,
        currencyId: currency.id,
      },
    ],
    policies,
  });
}

log('\nActivities');
const wellness = await ensure('category', '/activity-categories', {
  name: 'Wellness',
});
const culture = await ensure('category', '/activity-categories', {
  name: 'Culture',
});

const activities = [
  {
    name: 'Sunrise Yoga & Breakfast',
    secondaryName: 'Start the day on the rice terraces',
    highlight:
      'A guided 90-minute flow above the paddies followed by a Balinese breakfast.',
    price: 450000,
    priceUnit: 'person',
    categoryId: wellness.id,
    openingHour: '05:30',
    closingHour: '09:00',
    dailyLimit: 12,
    city: 'Ubud',
    address: 'Jl. Subak Sok Wayah, Ubud',
    images: ['explore-tourist-1.jpeg', 'tourist-1.jpeg', 'tourist-2.jpeg'],
  },
  {
    name: 'Temple & Traditional Dance Evening',
    secondaryName: 'A guided cultural night',
    highlight:
      'Visit a hilltop temple at dusk, then watch a Kecak performance with a local storyteller.',
    price: 600000,
    priceUnit: 'person',
    categoryId: culture.id,
    openingHour: '16:00',
    closingHour: '21:00',
    dailyLimit: 20,
    city: 'Uluwatu',
    address: 'Pura Luhur Uluwatu',
    images: ['explore-tourist-2.jpeg', 'tourist-3.jpeg', 'tourist-4.jpeg'],
  },
];

for (const activity of activities) {
  const { images, city, ...rest } = activity;

  await ensure('activity', '/activities', {
    ...rest,
    duration: 'permanent',
    country: 'Indonesia',
    state: 'Bali',
    city,
    postalCode: '80571',
    mapLink: mapLink(city),
    placeNearby: [],
    startDate: new Date().toISOString(),
    endDate: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    photos: await photos('activities', images),
    currencyId: currency.id,
    ownerId: owner.id,
  });
}

log('\nProperties for sale');
const properties = [
  {
    name: 'Tanah Lot Hillside Estate',
    secondaryName: 'Leasehold land with sea views',
    highlight: 'A 12-are plot ready to build, 8 minutes from Tanah Lot.',
    price: 4800000000,
    ownershipType: 'leasehold',
    address: 'Jl. Tanah Lot, Tabanan',
    city: 'Tabanan',
    postalCode: '82121',
    images: ['explore-3.png', 'iconic-3.png', 'header-buy.jpeg'],
  },
  {
    name: 'Seminyak Garden Villa',
    secondaryName: 'Freehold villa near the beach',
    highlight:
      'Four-bedroom villa with a mature garden, in the heart of Seminyak.',
    price: 12500000000,
    ownershipType: 'freehold',
    address: 'Jl. Kayu Aya, Seminyak',
    city: 'Seminyak',
    postalCode: '80361',
    images: ['faq-buy.jpeg', 'dream-home.jpeg', 'service-1.jpeg'],
  },
];

for (const property of properties) {
  const { images, ...rest } = property;
  const propertyPhotos = await photos('properties', images);

  await ensure('property', '/properties', {
    ...rest,
    country: 'Indonesia',
    state: 'Bali',
    mapLink: mapLink(property.city),
    placeNearby: [],
    photos: propertyPhotos,
    soldStatus: false,
    currencyId: currency.id,
    ownerId: owner.id,
    facilities: facilities
      .slice(0, 3)
      .map((facility) => ({ facilityId: facility.id })),
    additionals: rooms(propertyPhotos),
    features: [
      {
        type: 'highlight',
        name: 'Sea view',
        free: true,
        currencyId: currency.id,
      },
      {
        type: 'highlight',
        name: 'Road access',
        free: true,
        currencyId: currency.id,
      },
    ],
  });
}

log('\nBlog');
const category = await ensure('category', '/blog-categories', {
  name: 'Travel Guide',
});

for (const post of [
  {
    title: 'Five slow mornings to try in Ubud',
    content:
      '<p>Ubud rewards the early riser. Start with yoga above the rice terraces, then walk the Campuhan Ridge before the heat sets in.</p><p>Finish at a local warung for nasi campur and fresh coconut.</p>',
  },
  {
    title: 'Choosing between Canggu and Uluwatu',
    content:
      '<p>Canggu is surf cafes and sunset bars; Uluwatu is cliffs and quiet. Pick Canggu for energy, Uluwatu for space.</p>',
  },
]) {
  await ensure('post', '/blogs', { ...post, categoryId: category.id }, 'title');
}

log('\nDone.');
