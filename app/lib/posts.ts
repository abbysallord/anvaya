/** Studio notes. Facts only: every number here comes from the work described. Credited to the team. */
export type Post = { slug: string; title: string; date: string; kind: "News" | "Studio notes"; summary: string; body: string[] };

export const posts: Post[] = [
  {
    slug: "two-new-sample-homes", kind: "News", date: "2026-11-18",
    title: "Two new sample homes you can walk through",
    summary: "A 3BHK with a puja unit and tiled baths, and a city 2BHK fitted with space-saving carpentry, both live as 360° walkthroughs.",
    body: [
      "We have published two studio sample homes. Both were designed from floor plans and are live as walkthroughs you can open on any phone or laptop.",
      "The 3BHK Residence has twelve rooms. Its living room has a made-to-measure puja unit with a framed painting and a lit brass lamp, and a fluted TV wall. Sheer curtains separate the open living, dining and drawing areas, and the baths are tiled with clear-glass showers.",
      "The City 2BHK shows what custom carpentry does for a small flat: a wall bed with a fold-down study, a hydraulic storage bed, a sliding mirror wardrobe, a tilt-out shoe cabinet and a fluted TV wall, each built to the exact size of its wall.",
      "Both are studio samples, not client projects. Client work appears on this site only with written permission.",
    ],
  },
  {
    slug: "floor-plan-to-walkthrough", kind: "Studio notes", date: "2026-11-18",
    title: "From a floor plan to a walkthrough",
    summary: "How a 2D plan becomes a room-by-room 360° tour: layout checks, finishes, lighting, and one panorama per room.",
    body: [
      "Every walkthrough starts with the floor plan. We transcribe it to scale, then place furniture and check the layout the way a site engineer would: nothing blocks a door's swing, storage keeps 0.9 m of clear space in front, and every room has the pieces it needs.",
      "Finishes come from a library of photo-scanned materials at their real-world size, so a 1.2 m marble slab renders at 1.2 m. Ceilings and lights are planned per room, with the number of downlights set by the room's size and use.",
      "We render one 4K panorama per room from a standing eye height. The tour picks where each camera stands, away from furniture and ceiling fans, and which way it first faces, towards the room's best feature.",
      "The result is a link. It opens instantly on a phone, needs no app, and shows a live floor plan of where you are.",
    ],
  },
  {
    slug: "carpentry-to-the-millimetre", kind: "Studio notes", date: "2026-11-18",
    title: "Space-saving carpentry, to the millimetre",
    summary: "Why made-to-measure units matter in small homes, and the joinery rules our generator follows.",
    body: [
      "In most homes the wardrobe, kitchen and TV wall are built on site to fit the wall exactly. Catalogue furniture never fits, which is why walkthroughs that use it often look wrong.",
      "Our carpentry generator builds each unit from the trade's own rules: an 18 mm plywood carcass, an 8 mm back, 3 mm gaps around shutters, doors no wider than 600 mm, lofts above 2.1 m and kitchen counters at 860 mm.",
      "It makes twelve kinds of unit, including space-savers for small flats: wall beds, fold-down desks and dining tables, hydraulic storage beds and tilt-out shoe cabinets. Each comes in modern, classic or futuristic detailing and nine shutter finishes.",
    ],
  },
  {
    slug: "fast-on-every-phone", kind: "Studio notes", date: "2026-11-18",
    title: "Fast and accessible on every phone",
    summary: "How the walkthrough viewer adapts to each device, and what we changed so everyone can use it.",
    body: [
      "Buyers open walkthroughs on whatever phone they have, often on mobile data. The viewer now picks image quality from the device's graphics, memory and connection, and steps up from a fast preview to full 4K only when the device can take it.",
      "Panoramas are now served as WebP, which roughly halves the download. On slower devices the picture drops resolution while you drag and recovers when you stop, so movement stays smooth.",
      "We also checked accessibility. The viewer passes an automated accessibility audit with no issues, works fully with a keyboard, describes each view for screen readers and offers a high-contrast mode.",
    ],
  },
];

export const postBySlug = (slug: string) => posts.find(p => p.slug === slug);
