export interface Peak {
  name: string
  welshName?: string
  heightMetres: number
  description: string
  infoNote: string
  gridRef: string
  difficultyNote: string
  /** Position of the marker on the range's terrain panel, in percent (0-100). */
  position: { x: number; y: number }
}

export interface SuggestedRoute {
  name: string
  summary: string
  distanceKm: number
  durationHours: string
}

export type ModelStyle =
  | 'broad-plateau'
  | 'jagged-ridge'
  | 'horseshoe-massif'
  | 'compact-rugged'
  | 'slate-pyramids'
  | 'broken-wild'
  | 'cliff-bowl'
  | 'long-ridge'
  | 'rolling-hills'

export interface MountainRange {
  id: string
  slug: string
  name: string
  welshName?: string
  region: string
  shortDescription: string
  longDescription: string
  difficulty: string
  terrainType: string
  /** Short label describing the character of the terrain, used on cards/detail headers. */
  terrainProfile: string
  bestFor: string[]
  keyPeaks: Peak[]
  /** All peaks, alias of keyPeaks kept for the spec's `peaks` field. */
  peaks: Peak[]
  peakCount: number
  highestPeak: Peak
  suggestedRoutes: SuggestedRoute[]
  warnings: string[]
  /** Path to a real-elevation 3D model viewer (iframe), or null if not yet built. */
  modelAsset: string | null
  /** Deterministic seed for the procedural terrain preview. */
  modelSeed: number
  /** Shape family used to generate the procedural terrain preview. */
  modelStyle: ModelStyle
  /** Placeholder geographic bounds for future real-map integration. */
  mapBounds: { north: number; south: number; east: number; west: number }
  /** Hero/card image path. TODO: replace generated placeholder with a real photo. */
  heroImage: string
  gradient: string
  accentColor: string
}

type RawRange = Omit<MountainRange, 'peaks' | 'peakCount' | 'highestPeak'>

const RAW_RANGES: RawRange[] = [
  {
    id: 'carneddau',
    slug: 'carneddau',
    name: 'The Carneddau',
    welshName: 'Y Carneddau',
    region: 'Northern Snowdonia',
    shortDescription: 'Wales’ largest continuous high-mountain plateau, wild and remote.',
    longDescription:
      'The Carneddau form the single biggest area of high ground in Wales — a vast, rolling massif of grass and boulder summits north of the Ogwen Valley. Unlike the jagged drama of the Glyderau or Snowdon, the Carneddau are broad-backed and remote, with long ridge walks linking eight summits over 750m. Feral ponies roam the high plateau, and the sense of scale and isolation here is unmatched anywhere else in Wales.',
    difficulty: 'Moderate – Hard',
    terrainType: 'Broad grassy plateau, boulder fields, exposed ridgelines',
    terrainProfile: 'Vast rolling plateau with long connecting ridges',
    bestFor: ['Long ridge days', 'Solitude', 'Wild camping', 'Ponies & wildlife'],
    keyPeaks: [
      { name: 'Pen yr Ole Wen', heightMetres: 978, description: 'The steep southern gateway to the range, rising directly above Llyn Ogwen.', infoNote: 'Often climbed first via a relentless grassy/rocky direct ascent from Ogwen.', gridRef: 'TBC', difficultyNote: 'Hard – steep, unrelenting ascent', position: { x: 18, y: 70 } },
      { name: 'Carnedd Dafydd', heightMetres: 1044, description: 'A broad summit with dramatic views down the cliffs of Ysgolion Duon (the Black Ladders).', infoNote: 'The Black Ladders cliff face is one of the best winter climbing venues in Wales.', gridRef: 'TBC', difficultyNote: 'Moderate from the ridge, hard direct', position: { x: 28, y: 55 } },
      { name: 'Carnedd Llewelyn', heightMetres: 1064, description: 'The highest summit in the range and third-highest in Wales, a vast stony dome at the heart of the massif.', infoNote: 'A major path junction — five ridges converge here.', gridRef: 'TBC', difficultyNote: 'Moderate, but remote and exposed to weather', position: { x: 42, y: 42 } },
      { name: 'Yr Elen', heightMetres: 962, description: 'A shapely, narrow-ridged outlier reached by a short spur from Carnedd Llewelyn.', infoNote: 'Often skipped, but gives the best ridge views in the range.', gridRef: 'TBC', difficultyNote: 'Moderate, narrow ridge sections', position: { x: 32, y: 30 } },
      { name: 'Foel Grach', heightMetres: 976, description: 'A flat, boggy summit housing a small mountain refuge hut.', infoNote: 'Home to one of the few bothies in the Carneddau — useful in poor weather.', gridRef: 'TBC', difficultyNote: 'Easy walking, navigation tricky in mist', position: { x: 50, y: 28 } },
      { name: 'Foel-fras', heightMetres: 942, description: 'The northernmost major summit, marking the edge of the high plateau before it drops to the coast.', infoNote: 'On a clear day you can see the Isle of Man and the Lake District from here.', gridRef: 'TBC', difficultyNote: 'Easy, gentle grassy slopes', position: { x: 58, y: 16 } },
      { name: 'Pen Llithrig y Wrach', heightMetres: 799, description: 'A pyramidal peak above Llyn Cowlyd, isolated from the main ridge.', infoNote: 'Welsh for "Hill of the Slippery Witch" — steep grass can live up to the name when wet.', gridRef: 'TBC', difficultyNote: 'Moderate, steep grass slopes', position: { x: 70, y: 60 } },
      { name: 'Pen yr Helgi Du', heightMetres: 833, description: 'A narrow ridge peak connected to the main massif by the dramatic Bwlch Eryl Farchog.', infoNote: 'The connecting ridge to Carnedd Llewelyn is one of the finest scrambles in the range.', gridRef: 'TBC', difficultyNote: 'Hard – exposed ridge scrambling', position: { x: 56, y: 58 } },
    ],
    suggestedRoutes: [
      { name: 'The Welsh 3000s Northern Leg', summary: 'Pen yr Ole Wen → Carnedd Dafydd → Carnedd Llewelyn, the classic high traverse.', distanceKm: 11, durationHours: '5–6' },
      { name: 'Foel-fras Horseshoe', summary: 'A long northern loop taking in Foel Grach and Foel-fras via the old drovers’ paths.', distanceKm: 18, durationHours: '7–8' },
      { name: 'Pen yr Helgi Du Scramble', summary: 'A shorter outing focused on the exposed ridge from Bwlch Eryl Farchog.', distanceKm: 9, durationHours: '4–5' },
    ],
    warnings: [
      'The plateau is vast and featureless in mist — navigation skills are essential.',
      'Very few escape routes once committed to the high ridge; plan bail-out points in advance.',
      'Exposed to severe wind chill even in summer.',
    ],
    modelAsset: '/carneddau-map/index.html',
    modelSeed: 1,
    modelStyle: 'broad-plateau',
    mapBounds: { north: 53.18, south: 53.10, east: -3.95, west: -4.05 },
    heroImage: '/images/ranges/carneddau.jpg',
    gradient: 'from-[#2c2a26] via-[#3c4a30] to-[#0a0a0c]',
    accentColor: '#7a9a5a',
  },
  {
    id: 'glyderau',
    slug: 'glyderau',
    name: 'The Glyderau',
    welshName: 'Y Glyderau',
    region: 'Central Snowdonia',
    shortDescription: 'A jagged, rock-strewn ridge of shattered tors and one of Wales’ most iconic scrambles.',
    longDescription:
      'South of the Ogwen Valley, the Glyderau rise into a chaotic skyline of broken rock, scree and exposed ridges. This is the most distinctively "alpine" landscape in Wales — Tryfan’s spiky profile and the wind-carved boulder field on Glyder Fach (the Cantilever Stone and Castell y Gwynt) make this a range built for scramblers and rock-lovers as much as walkers.',
    difficulty: 'Hard – Severe',
    terrainType: 'Shattered rock, scree, boulder fields, scrambling ridges',
    terrainProfile: 'Jagged shattered rock spikes and broken ridgelines',
    bestFor: ['Scrambling', 'Iconic rock features', 'Photography', 'Classic ridge days'],
    keyPeaks: [
      { name: 'Tryfan', heightMetres: 917, description: 'The unmistakable three-pronged peak visible from across the valley, Wales’ best-loved scramble.', infoNote: 'The North Ridge scramble is a rite of passage; the summit "Adam and Eve" stones are a famous leap.', gridRef: 'TBC', difficultyNote: 'Severe via North Ridge, hard by tourist path', position: { x: 20, y: 65 } },
      { name: 'Glyder Fach', heightMetres: 994, description: 'A wild summit plateau of stacked rock slabs, home to the famous Cantilever Stone.', infoNote: 'The Cantilever Stone is a giant balanced slab — a popular (precarious) photo spot.', gridRef: 'TBC', difficultyNote: 'Hard, rough terrain underfoot', position: { x: 38, y: 50 } },
      { name: 'Glyder Fawr', heightMetres: 1001, description: 'The highest point of the range, a stony dome above the dramatic Devil’s Kitchen cliffs.', infoNote: 'Y Twll Du (Devil’s Kitchen) below is one of the most atmospheric cwms in Snowdonia.', gridRef: 'TBC', difficultyNote: 'Moderate from the ridge', position: { x: 48, y: 46 } },
      { name: 'Y Garn', heightMetres: 947, description: 'A pyramidal peak above Llyn Idwal with a fine corrie on its eastern face.', infoNote: 'Excellent views over Llyn Idwal and the Nant Ffrancon valley.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 60, y: 38 } },
      { name: 'Elidir Fawr', heightMetres: 924, description: 'The western outlier of the range, overlooking the Dinorwig slate quarries and pumped-storage scheme.', infoNote: 'Sits above the hidden Electric Mountain hydro plant inside the mountain.', gridRef: 'TBC', difficultyNote: 'Moderate, quarry paths add interest', position: { x: 72, y: 30 } },
      { name: 'Foel-goch', heightMetres: 805, description: 'A lesser-visited summit linking Elidir Fawr to the main Glyderau ridge.', infoNote: 'A quiet spot to escape the crowds on Tryfan and the Glyders proper.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 66, y: 24 } },
      { name: 'Mynydd Perfedd', heightMetres: 812, description: 'A broad, unassuming summit on the ridge between Y Garn and Foel-goch.', infoNote: 'Easily combined with neighbouring summits for a longer day.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 64, y: 18 } },
      { name: 'Castell y Gwynt', heightMetres: 973, description: 'The "Castle of the Winds" — a dramatic rock tor on the ridge between the two Glyders.', infoNote: 'A short, exposed scramble through wind-sculpted rock pinnacles.', gridRef: 'TBC', difficultyNote: 'Hard, exposed scrambling', position: { x: 43, y: 48 } },
    ],
    suggestedRoutes: [
      { name: 'Tryfan North Ridge to the Glyders', summary: 'Classic scramble up Tryfan, across Bristly Ridge to Glyder Fach and Fawr.', distanceKm: 10, durationHours: '6–7' },
      { name: 'Glyderau Horseshoe', summary: 'A full circuit from Ogwen taking in Y Garn, Elidir Fawr, Glyder Fawr and Glyder Fach.', distanceKm: 16, durationHours: '7–8' },
      { name: 'Devil’s Kitchen & Glyder Fawr', summary: 'A shorter route past Llyn Idwal and up through Twll Du to the summit plateau.', distanceKm: 8, durationHours: '4–5' },
    ],
    warnings: [
      'Bristly Ridge and Tryfan’s North Ridge are serious scrambles — not suitable in poor weather or for the inexperienced.',
      'Loose rock and scree are a constant hazard; helmets are advisable on the harder scrambles.',
      'The summit plateau boulder field is notoriously disorientating in cloud.',
    ],
    modelAsset: '/glyderau-map/index.html',
    modelSeed: 2,
    modelStyle: 'jagged-ridge',
    mapBounds: { north: 53.13, south: 53.08, east: -4.00, west: -4.10 },
    heroImage: '/images/ranges/glyderau.jpg',
    gradient: 'from-[#2a2118] via-[#6e7a3f] to-[#0a0a0c]',
    accentColor: '#9aa468',
  },
  {
    id: 'snowdon-massif',
    slug: 'snowdon',
    name: 'The Snowdon Massif',
    welshName: 'Yr Wyddfa',
    region: 'Central Snowdonia',
    shortDescription: 'Wales’ highest mountain and its surrounding horseshoe of dramatic ridges.',
    longDescription:
      'Yr Wyddfa (Snowdon) and its satellite ridges form the most famous mountain landscape in Wales. At its heart, the Snowdon Horseshoe links Crib Goch’s knife-edge arete, the summit of Yr Wyddfa itself, and the long ridge of Y Lliwedd around a spectacular glacial cwm. To the west, a quieter chain of lower summits — Moel Eilio, Foel Gron, Moel Cynghorion and Yr Aran — offers gentler walking with some of the best views of the high peaks.',
    difficulty: 'Moderate – Severe (route dependent)',
    terrainType: 'High rocky arêtes, glacial cwms, scree, exposed ridgelines',
    terrainProfile: 'Central summit ringed by a dramatic horseshoe ridge',
    bestFor: ['Bagging the highest summit in Wales', 'Classic scrambling', 'Sunrise hikes', 'Railway-assisted ascents'],
    keyPeaks: [
      { name: 'Yr Wyddfa', welshName: 'Snowdon', heightMetres: 1085, description: 'The highest peak in Wales, topped by the Hafod Eryri visitor centre and reachable by mountain railway.', infoNote: 'On a clear day the summit view reputedly stretches to Ireland, Scotland and England.', gridRef: 'TBC', difficultyNote: 'Moderate via Llanberis/Pyg, Severe via Crib Goch', position: { x: 48, y: 48 } },
      { name: 'Crib Goch', heightMetres: 923, description: 'A narrow, knife-edge ridge of red rock forming the start of the Snowdon Horseshoe.', infoNote: 'One of the most exposed scrambles in Britain — a fall here would be extremely serious.', gridRef: 'TBC', difficultyNote: 'Severe – sustained exposed scrambling', position: { x: 30, y: 38 } },
      { name: 'Crib y Ddysgl', welshName: 'Garnedd Ugain', heightMetres: 1065, description: 'The second-highest summit in Wales, linked to Crib Goch and Yr Wyddfa by the rocky Horseshoe ridge.', infoNote: 'Often overlooked despite being only 20m lower than Snowdon itself.', gridRef: 'TBC', difficultyNote: 'Hard, exposed ridge approach', position: { x: 38, y: 36 } },
      { name: 'Y Lliwedd', heightMetres: 898, description: 'A dark, cliff-faced ridge forming the dramatic southern wall of Cwm Dyli.', infoNote: 'Its north face is a historic training ground for early Everest mountaineers.', gridRef: 'TBC', difficultyNote: 'Hard, rocky ridge with steep drops', position: { x: 60, y: 56 } },
      { name: 'Moel Eilio', heightMetres: 726, description: 'A grassy whaleback ridge west of Llanberis, popular for an easier circuit with big views.', infoNote: 'A favourite warm-up walk for those training for the higher Snowdon routes.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 16, y: 60 } },
      { name: 'Foel Gron', heightMetres: 632, description: 'A minor summit on the Moel Eilio ridge, easily combined with its neighbours.', infoNote: 'Useful as a low-level alternative when the high peaks are in cloud.', gridRef: 'TBC', difficultyNote: 'Easy', position: { x: 22, y: 64 } },
      { name: 'Moel Cynghorion', heightMetres: 674, description: 'A rounded summit overlooking the Llanberis and Rhyd-Ddu paths up Snowdon.', infoNote: 'Good vantage point to watch walkers ascending the main Snowdon paths.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 30, y: 64 } },
      { name: 'Yr Aran', heightMetres: 747, description: 'A shapely pyramid south of Yr Wyddfa, a worthwhile detour from the Watkin Path.', infoNote: 'Gives one of the best front-on views of Snowdon’s south face.', gridRef: 'TBC', difficultyNote: 'Moderate, steep final pull', position: { x: 54, y: 70 } },
    ],
    suggestedRoutes: [
      { name: 'The Snowdon Horseshoe', summary: 'Crib Goch → Crib y Ddysgl → Yr Wyddfa → Y Lliwedd, the ultimate Snowdon scramble.', distanceKm: 12, durationHours: '6–7' },
      { name: 'Llanberis Path', summary: 'The longest but gentlest route to the summit, following the railway line.', distanceKm: 14, durationHours: '5–6' },
      { name: 'Moel Eilio Ridge', summary: 'A quieter circuit over Moel Eilio, Foel Gron and Moel Cynghorion with classic Snowdon views.', distanceKm: 13, durationHours: '5–6' },
    ],
    warnings: [
      'Crib Goch claims lives most years — only attempt in good weather with scrambling experience.',
      'Snowdon is the busiest mountain in Wales; the main paths can be extremely crowded in summer.',
      'Weather changes fast at altitude even when Llanberis below is clear and sunny.',
    ],
    modelAsset: '/snowdon-map/index.html',
    modelSeed: 3,
    modelStyle: 'horseshoe-massif',
    mapBounds: { north: 53.09, south: 53.03, east: -4.02, west: -4.12 },
    gradient: 'from-[#1c2433] via-[#3c5570] to-[#0a0a0c]',
    heroImage: '/images/ranges/yr-wyddfa.jpg',
    accentColor: '#5a82b0',
  },
  {
    id: 'moel-hebog',
    slug: 'moel-hebog',
    name: 'The Moel Hebog Range',
    welshName: 'Moel Hebog',
    region: 'Western Snowdonia',
    shortDescription: 'A quieter chain of rugged summits guarding the approach to Beddgelert.',
    longDescription:
      'West of the Snowdon massif, the Moel Hebog range offers some of the least-crowded walking in Snowdonia. Moel Hebog’s steep, craggy profile dominates the view from Beddgelert, while the connecting ridge north to Mynydd Drws-y-coed and Trum y Ddysgl gives a surprisingly narrow, exposed walk for relatively modest heights. Caves on Moel yr Ogof are said to have sheltered Owain Glyndŵr.',
    difficulty: 'Moderate – Hard',
    terrainType: 'Steep grass and crag, narrow connecting ridges, quiet valleys',
    terrainProfile: 'Steep, compact and rugged ridge chain',
    bestFor: ['Escaping the crowds', 'History (Glyndŵr’s cave)', 'Half-day ridge walks'],
    keyPeaks: [
      { name: 'Moel Hebog', heightMetres: 782, description: 'The dominant peak above Beddgelert, with a steep, craggy southern face.', infoNote: 'Welsh for "Hawk’s Hill" — the summit gives a superb panorama back to Snowdon.', gridRef: 'TBC', difficultyNote: 'Moderate, steep ascent', position: { x: 40, y: 70 } },
      { name: 'Moel yr Ogof', heightMetres: 655, description: 'A craggy summit just north of Moel Hebog, named for the cave on its flank.', infoNote: 'The cave is traditionally said to have hidden Owain Glyndŵr from English forces.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 36, y: 56 } },
      { name: 'Moel Lefn', heightMetres: 638, description: 'A smaller summit continuing the ridge north from Moel yr Ogof.', infoNote: 'A pleasant, easy link between the bigger summits either side.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 34, y: 46 } },
      { name: 'Trum y Ddysgl', heightMetres: 709, description: 'A narrow ridge summit with a striking, exposed crest.', infoNote: 'The ridge here is far narrower than the modest height would suggest.', gridRef: 'TBC', difficultyNote: 'Hard, narrow crest', position: { x: 40, y: 32 } },
      { name: 'Mynydd Drws-y-coed', heightMetres: 695, description: 'A rocky peak with one of the most dramatic profiles in this range, overlooking Nantlle.', infoNote: 'The Nantlle Ridge here rivals Crib Goch in exposure on a smaller scale.', gridRef: 'TBC', difficultyNote: 'Hard, exposed scrambling sections', position: { x: 46, y: 22 } },
      { name: 'Y Garn', heightMetres: 633, description: 'The northern end of the Nantlle Ridge, distinct from its namesake in the Glyderau.', infoNote: 'Marks a natural turning point for circuits back down into the Nantlle valley.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 52, y: 14 } },
    ],
    suggestedRoutes: [
      { name: 'Moel Hebog from Beddgelert', summary: 'A direct, steep there-and-back up the most prominent summit in the range.', distanceKm: 8, durationHours: '3–4' },
      { name: 'The Nantlle Ridge', summary: 'A spectacular, narrow traverse from Rhyd-Ddu over Y Garn, Drws-y-coed and Trum y Ddysgl.', distanceKm: 12, durationHours: '5–6' },
      { name: 'Glyndŵr’s Cave Loop', summary: 'A history-themed circuit linking Moel Hebog and Moel yr Ogof via the cave.', distanceKm: 9, durationHours: '4–5' },
    ],
    warnings: [
      'The Nantlle Ridge sections are narrower and more exposed than their modest heights suggest.',
      'Paths are less worn and harder to follow than on Snowdon — carry a map.',
      'Steep grass becomes treacherously slick after rain.',
    ],
    modelAsset: null,
    modelSeed: 4,
    modelStyle: 'compact-rugged',
    mapBounds: { north: 53.04, south: 52.98, east: -4.10, west: -4.20 },
    heroImage: '/images/ranges/moel-hebog.jpg',
    gradient: 'from-[#262321] via-[#4a4030] to-[#0a0a0c]',
    accentColor: '#a4854f',
  },
  {
    id: 'moelwynion',
    slug: 'moelwynion',
    name: 'The Moelwynion',
    welshName: 'Y Moelwynion',
    region: 'Southern Snowdonia',
    shortDescription: 'Slate-scarred hills around Blaenau Ffestiniog, topped by the iconic Cnicht.',
    longDescription:
      'The Moelwynion sit above the slate towns of Blaenau Ffestiniog and Tanygrisiau, a landscape where mining history and wild moorland collide. Cnicht’s pointed summit — nicknamed "the Welsh Matterhorn" — is the range’s most photographed peak, while Moel Siabod stands apart to the north as a dramatic outlier with one of the best ridge approaches in Snowdonia.',
    difficulty: 'Moderate',
    terrainType: 'Slate spoil, heather moorland, rocky knolls, old quarry tracks',
    terrainProfile: 'Sharper slate-ridged pyramidal summits',
    bestFor: ['Industrial history', 'Quieter rocky scrambles', 'Varied half-day walks'],
    keyPeaks: [
      { name: 'Moel Siabod', heightMetres: 872, description: 'A bold outlier north of the main group, with a fine rocky ridge approach via Daear Ddu.', infoNote: 'The Daear Ddu ridge is one of the best easy scrambles in Snowdonia.', gridRef: 'TBC', difficultyNote: 'Moderate – Hard via the ridge', position: { x: 70, y: 18 } },
      { name: 'Cnicht', heightMetres: 689, description: 'Famous for its sharply pointed profile when viewed from the west — "the Welsh Matterhorn".', infoNote: 'The pyramid shape is an illusion; the true summit ridge runs on much further than it appears.', gridRef: 'TBC', difficultyNote: 'Moderate, some scrambling near the top', position: { x: 28, y: 56 } },
      { name: 'Moelwyn Mawr', heightMetres: 770, description: 'The highest of the southern Moelwynion, with steep slate-scarred flanks.', infoNote: 'Views stretch from Cardigan Bay to the high peaks of central Snowdonia.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 38, y: 66 } },
      { name: 'Moelwyn Bach', heightMetres: 711, description: 'A smaller neighbour to Moelwyn Mawr, linked by a dramatic col.', infoNote: 'The col between the two Moelwyns is a striking, narrow saddle.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 32, y: 74 } },
      { name: 'Allt-fawr', heightMetres: 698, description: 'A rocky summit overlooking the Cwm Croesor slate workings.', infoNote: 'Old quarry inclines and ruined buildings dot the approach.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 46, y: 48 } },
      { name: 'Ysgafell Wen', heightMetres: 718, description: 'A remote, boggy summit in the heart of the range, rarely visited.', infoNote: 'One of the quietest summits in southern Snowdonia.', gridRef: 'TBC', difficultyNote: 'Moderate, pathless in places', position: { x: 54, y: 40 } },
      { name: 'Moel Druman', heightMetres: 676, description: 'A minor top linking Allt-fawr to the wider Moelwynion plateau.', infoNote: 'Mostly visited as part of a longer round rather than on its own.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 50, y: 34 } },
      { name: 'Manod Mawr', heightMetres: 661, description: 'A distinctive quarried hill above Blaenau Ffestiniog, hollowed out by historic slate mining.', infoNote: 'Secret wartime caverns inside the hill once stored National Gallery paintings.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 64, y: 56 } },
    ],
    suggestedRoutes: [
      { name: 'Cnicht & Croesor Round', summary: 'A loop from Croesor up Cnicht, returning via the old slate quarry tracks.', distanceKm: 11, durationHours: '4–5' },
      { name: 'Moel Siabod via Daear Ddu', summary: 'A classic rocky ridge ascent of the range’s northern outlier.', distanceKm: 8, durationHours: '4' },
      { name: 'The Moelwyns Traverse', summary: 'A full ridge day linking Moelwyn Mawr, Moelwyn Bach and Allt-fawr.', distanceKm: 14, durationHours: '6' },
    ],
    warnings: [
      'Old quarry workings have unmarked shafts and unstable ground — stay on paths near mining areas.',
      'Ysgafell Wen and the central plateau are pathless and boggy in poor visibility.',
      'Slate scree on Moelwyn Mawr’s flanks is loose and slippery.',
    ],
    modelAsset: null,
    modelSeed: 5,
    modelStyle: 'slate-pyramids',
    mapBounds: { north: 53.01, south: 52.93, east: -3.92, west: -4.05 },
    heroImage: '/images/ranges/moelwynion.jpg',
    gradient: 'from-[#252220] via-[#5a5240] to-[#0a0a0c]',
    accentColor: '#9a9272',
  },
  {
    id: 'rhinogydd',
    slug: 'rhinogydd',
    name: 'The Rhinogydd',
    welshName: 'Y Rhinogydd',
    region: 'Western Snowdonia',
    shortDescription: 'A wild, trackless tangle of heather and bare rock between the coast and Trawsfynydd.',
    longDescription:
      'The Rhinogydd are widely regarded as the toughest walking terrain in Wales — not because of height, but because of the sheer, unrelenting roughness underfoot. Tightly packed gritstone outcrops, deep heather and a near-total absence of paths make this range a serious proposition even for experienced hillwalkers, rewarding them with a sense of true wilderness rare anywhere else in Britain.',
    difficulty: 'Hard',
    terrainType: 'Bare gritstone outcrops, deep heather, pathless terrain',
    terrainProfile: 'Rough, broken and wild trackless terrain',
    bestFor: ['True wilderness', 'Navigation practice', 'Avoiding crowds entirely'],
    keyPeaks: [
      { name: 'Rhinog Fawr', heightMetres: 720, description: 'The most famous summit in the range, a rocky tower above Cwm Bychan.', infoNote: 'The approach through boulder-strewn heather is notoriously slow going.', gridRef: 'TBC', difficultyNote: 'Hard, rough pathless terrain', position: { x: 30, y: 38 } },
      { name: 'Rhinog Fach', heightMetres: 712, description: 'Rhinog Fawr’s smaller twin, separated by a dramatic, steep-sided col.', infoNote: 'The col between the two Rhinogs is one of the wildest spots in Wales.', gridRef: 'TBC', difficultyNote: 'Hard', position: { x: 34, y: 48 } },
      { name: 'Y Llethr', heightMetres: 756, description: 'The highest point of the range, with a surprisingly smooth grassy summit ridge.', infoNote: 'A welcome relief underfoot after the rock-strewn approach.', gridRef: 'TBC', difficultyNote: 'Moderate once gained, hard approach', position: { x: 44, y: 56 } },
      { name: 'Diffwys', heightMetres: 750, description: 'The southern anchor of the main ridge, overlooking the Mawddach estuary.', infoNote: 'Gives one of the best coastal panoramas of any Welsh summit.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 50, y: 68 } },
      { name: 'Clip', heightMetres: 629, description: 'A rocky knoll on the ridge north of Diffwys.', infoNote: 'A useful link point on the long southern traverse.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 46, y: 62 } },
      { name: 'Moelfre', heightMetres: 589, description: 'An outlying hill to the east, lower but equally rough underfoot.', infoNote: 'Good views of the main Rhinog ridge from a distance.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 62, y: 50 } },
      { name: 'Foel Penolau', heightMetres: 614, description: 'A minor northern summit guarding the approach from Cwm Bychan.', infoNote: 'Marks the gateway into the heart of the range from the north.', gridRef: 'TBC', difficultyNote: 'Moderate, pathless approach', position: { x: 22, y: 26 } },
      { name: 'Craig Wion', heightMetres: 498, description: 'A rocky outcrop on the northern fringes, often combined with Foel Penolau.', infoNote: 'A good lower-level taste of the Rhinogydd’s characteristic terrain.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 18, y: 18 } },
    ],
    suggestedRoutes: [
      { name: 'The Rhinog Twins', summary: 'A tough there-and-back over Rhinog Fawr and Rhinog Fach from Cwm Bychan.', distanceKm: 10, durationHours: '6–7' },
      { name: 'Y Llethr & Diffwys Ridge', summary: 'The smoother southern ridge, with the best reward-to-effort ratio in the range.', distanceKm: 13, durationHours: '6' },
      { name: 'Full Rhinogydd Traverse', summary: 'A serious full-length traverse of the range from north to south — for experienced parties only.', distanceKm: 22, durationHours: '10+' },
    ],
    warnings: [
      'There are almost no real paths — progress is far slower than distance alone suggests.',
      'Deep heather hides ankle-breaking rock; this terrain has a high injury rate.',
      'Mobile signal is poor to non-existent across most of the range.',
    ],
    modelAsset: null,
    modelSeed: 6,
    modelStyle: 'broken-wild',
    mapBounds: { north: 52.86, south: 52.76, east: -3.95, west: -4.08 },
    heroImage: '/images/ranges/rhinogydd.jpg',
    gradient: 'from-[#211f1c] via-[#46523a] to-[#0a0a0c]',
    accentColor: '#6a7a52',
  },
  {
    id: 'cadair-idris',
    slug: 'cadair-idris',
    name: 'Cadair Idris',
    welshName: 'Cadair Idris',
    region: 'Southern Snowdonia',
    shortDescription: 'A legendary horseshoe above Llyn Cau, steeped in myth and dramatic glacial scenery.',
    longDescription:
      'Cadair Idris — "the Chair of Idris" — rises dramatically above Dolgellau and the Mawddach estuary. Legend holds that anyone who sleeps on its summit wakes either a poet or a madman. The horseshoe ridge around the deep glacial cwm of Llyn Cau is one of the most complete and visually striking in Wales, combining accessible paths with a genuinely mountainous atmosphere.',
    difficulty: 'Moderate – Hard',
    terrainType: 'Glacial cwm, rocky ridge, steep scree paths',
    terrainProfile: 'Dramatic cliff-rimmed bowl around a glacial lake',
    bestFor: ['Mythology & legend', 'A complete horseshoe in a day', 'Dramatic lake views'],
    keyPeaks: [
      { name: 'Penygadair', heightMetres: 893, description: 'The highest point of Cadair Idris, with a small summit shelter and sweeping coastal views.', infoNote: 'Legend says a night alone on this summit makes you a poet or a madman by morning.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 46, y: 42 } },
      { name: 'Cyfrwy', heightMetres: 821, description: 'A dramatic, narrow-topped summit on the western arm of the horseshoe, named "the saddle".', infoNote: 'The arête leading to the top is one of the finer ridge walks in the range.', gridRef: 'TBC', difficultyNote: 'Hard, narrow ridge', position: { x: 30, y: 36 } },
      { name: 'Mynydd Moel', heightMetres: 863, description: 'The eastern horn of the horseshoe, with steep drops into Cwm Cau.', infoNote: 'Often quieter than Penygadair despite being almost as high.', gridRef: 'TBC', difficultyNote: 'Moderate – Hard', position: { x: 62, y: 38 } },
      { name: 'Gau Graig', heightMetres: 683, description: 'A lower spur extending the ridge east from Mynydd Moel.', infoNote: 'A worthwhile extension for those wanting a longer ridge day.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 74, y: 44 } },
      { name: 'Craig Cwm Amarch', heightMetres: 791, description: 'A rocky top on the southern rim above Llyn Cau, with vertiginous views down to the lake.', infoNote: 'The view straight down into Llyn Cau from here is one of the best in Wales.', gridRef: 'TBC', difficultyNote: 'Moderate – Hard', position: { x: 40, y: 58 } },
      { name: 'Tyrrau Mawr', heightMetres: 652, description: 'The westernmost summit of the wider Cadair Idris range, overlooking the Mawddach estuary.', infoNote: 'A quieter, grassier summit popular for sunset views over the coast.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 16, y: 50 } },
      { name: 'Mynydd Pencoed', heightMetres: 740, description: 'A connecting summit between Tyrrau Mawr and the main Cadair ridge.', infoNote: 'Provides a quieter alternative line of ascent away from the main paths.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 24, y: 44 } },
    ],
    suggestedRoutes: [
      { name: 'The Cadair Idris Horseshoe', summary: 'Minffordd Path up via Craig Cwm Amarch, over Penygadair and Mynydd Moel, back down past Llyn Cau.', distanceKm: 11, durationHours: '5–6' },
      { name: 'Pony Path', summary: 'The most direct and popular route to the summit from Ty Nant.', distanceKm: 10, durationHours: '4–5' },
      { name: 'Tyrrau Mawr Extension', summary: 'A longer traverse continuing west from the main horseshoe to Tyrrau Mawr.', distanceKm: 16, durationHours: '7' },
    ],
    warnings: [
      'The Minffordd Path’s initial ascent past Llyn Cau is steep and exposed in wet weather.',
      'Cyfrwy’s ridge has short scrambling sections that are best avoided in high wind.',
      'Cloud forms quickly over the cwm, obscuring the steep drops near the rim.',
    ],
    modelAsset: null,
    modelSeed: 7,
    modelStyle: 'cliff-bowl',
    mapBounds: { north: 52.73, south: 52.66, east: -3.85, west: -3.98 },
    heroImage: '/images/ranges/cadair-idris.jpg',
    gradient: 'from-[#1f1d1a] via-[#4a4a3a] to-[#0a0a0c]',
    accentColor: '#8a8866',
  },
  {
    id: 'aran-fawddwy',
    slug: 'aran-fawddwy',
    name: 'Aran Fawddwy',
    welshName: 'Aran Fawddwy',
    region: 'Southern Snowdonia',
    shortDescription: 'The highest ground south of Snowdon, a remote ridge above Llyn Tegid.',
    longDescription:
      'The Aran ridge holds the highest summit in Wales south of Snowdonia’s northern peaks, yet sees a fraction of the visitors. A long approach across rough moorland keeps the crowds away, leaving a genuinely remote ridge walk above the steep eastern corrie overlooking Llyn Tegid (Bala Lake). This is classic out-and-back ridge territory, prized by those seeking solitude over spectacle.',
    difficulty: 'Moderate – Hard',
    terrainType: 'Moorland approach, grassy ridge, steep eastern corrie',
    terrainProfile: 'Long, high and remote smooth-backed ridge',
    bestFor: ['Solitude', 'A genuine wilderness feel', 'Long approach walks'],
    keyPeaks: [
      { name: 'Aran Fawddwy', heightMetres: 905, description: 'The highest summit south of Snowdonia’s main peaks, with a steep drop to Creiglyn Dyfi.', infoNote: 'The highest point in Wales outside the Snowdon, Glyderau and Carneddau ranges.', gridRef: 'TBC', difficultyNote: 'Moderate – Hard, long approach', position: { x: 46, y: 44 } },
      { name: 'Aran Benllyn', heightMetres: 885, description: 'The northern twin of Aran Fawddwy, overlooking Llyn Tegid (Bala Lake).', infoNote: 'Superb views down to Bala Lake, the largest natural lake in Wales.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 44, y: 28 } },
      { name: 'Erw y Ddafad-ddu', heightMetres: 814, description: 'A connecting summit on the ridge between the two main Aran peaks.', infoNote: 'Welsh for "Acre of the Black Sheep" — a wild, lonely stretch of ridge.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 45, y: 36 } },
      { name: 'Glasgwm', heightMetres: 780, description: 'A remote outlier to the south-east, rarely visited even by Aran regulars.', infoNote: 'One of the quietest summits in southern Snowdonia.', gridRef: 'TBC', difficultyNote: 'Moderate, pathless approach', position: { x: 64, y: 56 } },
      { name: 'Gwaun y Llwyni', heightMetres: 643, description: 'A lower spur on the western flank, often used as part of the approach.', infoNote: 'Marks the start of the steeper climb onto the main ridge.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 30, y: 50 } },
      { name: 'Drysgol', heightMetres: 770, description: 'A broad shoulder linking the southern approach to the main Aran ridge.', infoNote: 'A useful, gentler line of ascent avoiding the steepest ground.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 54, y: 62 } },
      { name: 'Esgeiriau Gwynion', heightMetres: 689, description: 'A remote moorland top on the southern fringes of the range.', infoNote: 'Rarely visited — mostly crossed en route to bigger summits.', gridRef: 'TBC', difficultyNote: 'Moderate, pathless', position: { x: 62, y: 70 } },
    ],
    suggestedRoutes: [
      { name: 'Aran Ridge from Llanuwchllyn', summary: 'The classic out-and-back taking in both Aran Benllyn and Aran Fawddwy.', distanceKm: 16, durationHours: '6–7' },
      { name: 'Creiglyn Dyfi Approach', summary: 'A quieter approach via the source lake of the River Dyfi, climbing direct to Aran Fawddwy.', distanceKm: 13, durationHours: '5–6' },
      { name: 'Glasgwm Extension', summary: 'For those seeking maximum solitude, a long extension south to the remote Glasgwm.', distanceKm: 20, durationHours: '8' },
    ],
    warnings: [
      'The approach is long and largely pathless — allow extra time and daylight.',
      'The eastern corrie above Llyn Tegid has dangerous steep ground close to the ridge edge.',
      'Help is far away here; mobile coverage is unreliable across the whole range.',
    ],
    modelAsset: null,
    modelSeed: 8,
    modelStyle: 'long-ridge',
    mapBounds: { north: 52.82, south: 52.76, east: -3.65, west: -3.78 },
    heroImage: '/images/ranges/aran-fawddwy.jpg',
    gradient: 'from-[#201e1b] via-[#414a36] to-[#0a0a0c]',
    accentColor: '#6e7a58',
  },
  {
    id: 'dyfi-hills',
    slug: 'dyfi-hills',
    name: 'The Dyfi Hills',
    welshName: 'Bryniau Dyfi',
    region: 'Southern Snowdonia',
    shortDescription: 'Rolling, lesser-known summits above the Dyfi Valley, quiet and underrated.',
    longDescription:
      'South of Cadair Idris and the Arans, the Dyfi Hills form a quieter, more rounded landscape of grassy and heather summits overlooking the Dyfi Valley and the old mining village of Dylife. These hills rarely top 700m but reward visitors with wide-open views, genuine peace, and a strong sense of being well off the beaten track even by Snowdonia’s standards.',
    difficulty: 'Easy – Moderate',
    terrainType: 'Rolling grass and heather moorland, forestry tracks, old mine workings',
    terrainProfile: 'Soft, rolling high hills with gentle ridgelines',
    bestFor: ['Easier days out', 'Birdwatching (red kites)', 'Quiet exploration'],
    keyPeaks: [
      { name: 'Tarrenhendre', heightMetres: 678, description: 'A broad grassy summit at the northern end of the Dyfi Hills, with views to Cadair Idris.', infoNote: 'A good vantage point looking north to the Cadair Idris horseshoe.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 30, y: 20 } },
      { name: 'Tarren y Gesail', heightMetres: 677, description: 'A neighbouring summit linked to Tarrenhendre by a broad ridge.', infoNote: 'Often combined with Tarrenhendre for a satisfying half-day round.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 36, y: 28 } },
      { name: 'Maesglase', heightMetres: 675, description: 'A rugged little summit with a surprisingly craggy northern face for its modest height.', infoNote: 'The crags here are an unexpected highlight in an otherwise rounded landscape.', gridRef: 'TBC', difficultyNote: 'Moderate', position: { x: 48, y: 42 } },
      { name: 'Craig Portas', heightMetres: 619, description: 'A rocky outcrop summit south of Maesglase, overlooking the upper Dyfi Valley.', infoNote: 'A quiet spot with views down towards Machynlleth.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 54, y: 52 } },
      { name: 'Cribin Fawr', heightMetres: 614, description: 'A heather-clad summit in the central Dyfi Hills, rarely visited.', infoNote: 'One of the quietest summits in this already-quiet range.', gridRef: 'TBC', difficultyNote: 'Easy – Moderate', position: { x: 60, y: 60 } },
      { name: 'Waun-oer', heightMetres: 670, description: 'A broad, grassy plateau summit popular with red kites and other raptors.', infoNote: 'Excellent spot for watching red kites soaring over the open moor.', gridRef: 'TBC', difficultyNote: 'Easy', position: { x: 42, y: 36 } },
      { name: 'Mynydd Ceiswyn', heightMetres: 642, description: 'A rolling moorland summit at the southern edge of the range.', infoNote: 'Marks the transition from Snowdonia’s mountains into the gentler Cambrian hills.', gridRef: 'TBC', difficultyNote: 'Easy', position: { x: 66, y: 68 } },
    ],
    suggestedRoutes: [
      { name: 'Tarrens Round', summary: 'A loop linking Tarrenhendre and Tarren y Gesail above the Dyfi Valley.', distanceKm: 10, durationHours: '4' },
      { name: 'Waun-oer & Maesglase', summary: 'An open moorland walk combining the range’s best raptor-watching ground with its craggiest summit.', distanceKm: 12, durationHours: '5' },
      { name: 'Dyfi Hills Traverse', summary: 'A full west-to-east traverse of the range from Tarrenhendre to Mynydd Ceiswyn.', distanceKm: 19, durationHours: '7–8' },
    ],
    warnings: [
      'Forestry plantations can make navigation confusing — paths shift as forestry operations change.',
      'Far less waymarking than Snowdonia’s honeypot routes; a map is essential.',
      'Boggy ground is common after rain, even in summer.',
    ],
    modelAsset: null,
    modelSeed: 9,
    modelStyle: 'rolling-hills',
    mapBounds: { north: 52.66, south: 52.58, east: -3.68, west: -3.85 },
    heroImage: '/images/ranges/dyfi-hills.jpg',
    gradient: 'from-[#1d1c19] via-[#4a5238] to-[#0a0a0c]',
    accentColor: '#7e8a5c',
  },
]

export const RANGES: MountainRange[] = RAW_RANGES.map(r => ({
  ...r,
  peaks: r.keyPeaks,
  peakCount: r.keyPeaks.length,
  highestPeak: r.keyPeaks.reduce((a, b) => (b.heightMetres > a.heightMetres ? b : a), r.keyPeaks[0]),
}))

export function getRangeBySlug(slug: string): MountainRange | undefined {
  return RANGES.find(r => r.slug === slug)
}
