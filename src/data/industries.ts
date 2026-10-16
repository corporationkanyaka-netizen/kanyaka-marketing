// Industries follow the official site (https://www.kanyakacorporation.com):
// Agro, Engineering, Leather, Pesticides, Printing & Packaging, Pharmaceuticals, Dairy and Textiles.

export interface IndustrySector {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  iconName: string;
  overview: string;
  keyChallenges: string[];
  recommendedProductSlugs: string[];
  industrialClusters: string[];
  benefitsWithKanyaka: string[];
}

const REGIONS = ["Telangana", "Andhra Pradesh"];

const COMMON_BENEFITS = {
  grasim: "Grasim Industries products bought from an authorised dealer — genuine material, not open-market stock",
  godown: "Stock held at our own warehouse near Pashamylaram industrial estate",
  oneSource: "One supplier for alkalis, salts, acids and reagents",
};

export const industriesData: IndustrySector[] = [
  {
    id: "pharma",
    slug: "pharma",
    name: "Pharmaceuticals",
    tagline: "Alkalis, catalysts and reagents for bulk drug synthesis",
    iconName: "Pill",
    overview:
      "Bulk drug and intermediate plants use caustic soda and potash as bases, aluminium chloride as a Friedel-Crafts catalyst, thionyl chloride for chlorination, sodium nitrite for diazotisation, and a range of salts for work-up and drying.",
    keyChallenges: [
      "Consistent quality from batch to batch",
      "Genuine, traceable material from known manufacturers",
      "A dependable supplier for many different reagents",
    ],
    recommendedProductSlugs: [
      "caustic-soda-flakes",
      "caustic-soda-lye",
      "aluminium-chloride-anhydrous",
      "thionyl-chloride",
      "sodium-nitrite",
      "potassium-carbonate",
      "caustic-potash-flakes",
      "hydrogen-peroxide",
    ],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, "Aditya Birla aluminium chloride from an authorised dealer", COMMON_BENEFITS.godown, COMMON_BENEFITS.oneSource],
  },
  {
    id: "agro",
    slug: "agro",
    name: "Agro",
    tagline: "Potassium and phosphate inputs for fertiliser and agro formulations",
    iconName: "Sprout",
    overview:
      "Agro formulators use caustic potash and potassium carbonate as potassium sources, phosphoric acid as a phosphate source, and caustic soda for neutralisation in their formulations.",
    keyChallenges: [
      "Seasonal demand that needs stock on hand",
      "Correct alkalinity and solubility for liquid formulations",
    ],
    recommendedProductSlugs: ["caustic-potash-flakes", "potassium-carbonate", "phosphoric-acid", "caustic-soda-flakes"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.godown, COMMON_BENEFITS.oneSource],
  },
  {
    id: "pesticides",
    slug: "pesticides",
    name: "Pesticides",
    tagline: "Catalysts, chlorinating agents and bases for agro-chemical synthesis",
    iconName: "Bug",
    overview:
      "Pesticide and agro-chemical intermediate plants rely on aluminium chloride for Friedel-Crafts reactions, thionyl chloride for chlorination, and caustic soda, caustic potash and potassium carbonate as bases.",
    keyChallenges: [
      "Moisture-sensitive reagents that must arrive dry and sealed",
      "Consistent reagent quality for reproducible yields",
    ],
    recommendedProductSlugs: ["aluminium-chloride-anhydrous", "thionyl-chloride", "caustic-soda-flakes", "caustic-potash-flakes", "potassium-carbonate"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: ["Aditya Birla aluminium chloride from an authorised dealer", COMMON_BENEFITS.grasim, COMMON_BENEFITS.oneSource],
  },
  {
    id: "textiles",
    slug: "textiles",
    name: "Textiles",
    tagline: "Scouring, mercerising, bleaching and dyeing chemicals",
    iconName: "Shirt",
    overview:
      "Textile processing uses caustic soda for scouring and mercerising, hydrogen peroxide and bleaching powder for whitening, sodium sulphate and soda ash in reactive dyeing, and bisulphites as antichlors.",
    keyChallenges: [
      "Uniform alkalinity for even mercerising and dye uptake",
      "Reliable bleaching agents that don't damage fibre",
    ],
    recommendedProductSlugs: [
      "caustic-soda-flakes",
      "caustic-soda-lye",
      "hydrogen-peroxide",
      "stable-bleaching-powder",
      "sodium-sulphate-anhydrous",
      "soda-ash-dense-light",
      "sodium-bisulphite",
    ],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, "Imported hydrogen peroxide 50% in carboys and tankers", COMMON_BENEFITS.oneSource],
  },
  {
    id: "leather",
    slug: "leather",
    name: "Leather",
    tagline: "Alkalis and salts for liming, deliming and neutralisation",
    iconName: "Shield",
    overview:
      "Tanneries use caustic soda and soda ash in beam-house operations, sodium bicarbonate for neutralisation after chrome tanning, and bisulphite / metabisulphite as deliming and bleaching aids.",
    keyChallenges: [
      "Consistent chemical strength to protect grain quality",
      "Keeping powders dry and free-flowing in storage",
    ],
    recommendedProductSlugs: ["caustic-soda-flakes", "soda-ash-dense-light", "sodium-bicarbonate", "sodium-metabisulphite", "sodium-bisulphite", "sodium-sulphate-anhydrous"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, COMMON_BENEFITS.oneSource],
  },
  {
    id: "printing-packaging",
    slug: "printing-packaging",
    name: "Printing & Packaging",
    tagline: "Bleaching, pulping and intermediate chemicals",
    iconName: "Printer",
    overview:
      "Paper, board and printing units use caustic soda for pulping and de-inking, hydrogen peroxide and bleaching powder for brightening, and sodium nitrite in dye and pigment intermediates.",
    keyChallenges: ["Steady supply of bulk alkalis", "Bleaching chemicals with dependable strength"],
    recommendedProductSlugs: ["caustic-soda-flakes", "caustic-soda-lye", "hydrogen-peroxide", "stable-bleaching-powder", "sodium-nitrite"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, COMMON_BENEFITS.godown],
  },
  {
    id: "dairy",
    slug: "dairy",
    name: "Dairy",
    tagline: "Cleaning, sanitation and processing chemicals",
    iconName: "Milk",
    overview:
      "Dairies use caustic soda lye and phosphoric acid for clean-in-place (CIP) cycles, bleaching powder for sanitation, calcium chloride in cheese-making and sodium bicarbonate for pH adjustment.",
    keyChallenges: ["Effective cleaning without residues", "Reliable sanitation chemicals"],
    recommendedProductSlugs: ["caustic-soda-lye", "caustic-soda-flakes", "phosphoric-acid", "stable-bleaching-powder", "calcium-chloride", "sodium-bicarbonate"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, COMMON_BENEFITS.oneSource],
  },
  {
    id: "engineering",
    slug: "engineering",
    name: "Engineering",
    tagline: "Metal cleaning, phosphating and surface-treatment chemicals",
    iconName: "Wrench",
    overview:
      "Engineering and metal-finishing units use caustic soda and soda ash for degreasing, phosphoric acid for phosphating and rust removal, sodium nitrite as a corrosion inhibitor, and calcium chloride in concrete and brine systems.",
    keyChallenges: ["Consistent bath chemistry for surface treatment", "Safe supply of corrosive chemicals"],
    recommendedProductSlugs: ["caustic-soda-flakes", "phosphoric-acid", "soda-ash-dense-light", "sodium-nitrite", "calcium-chloride"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, COMMON_BENEFITS.godown, COMMON_BENEFITS.oneSource],
  },
];
