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
      "Bulk drug and intermediate plants use caustic soda and potash as bases, aluminium chloride as a Friedel-Crafts catalyst, thionyl chloride for chlorination, sodium nitrite for diazotisation, Hyflow for filtration, and acids and salts for work-up and pH control.",
    keyChallenges: [
      "Consistent quality from batch to batch",
      "Genuine, traceable material from known manufacturers",
      "A dependable supplier for many different reagents",
    ],
    recommendedProductSlugs: ["caustic-soda-flakes", "aluminium-chloride-granules", "aluminium-chloride-powder", "thionyl-chloride", "sodium-nitrite", "potassium-carbonate", "hyflow", "sodium-acetate", "hydrochloric-acid"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, "Grasim aluminium chloride, 99.50% purity, in granules and powder", COMMON_BENEFITS.godown, COMMON_BENEFITS.oneSource],
  },
  {
    id: "agro",
    slug: "agro",
    name: "Agro",
    tagline: "Potassium and phosphate inputs for fertiliser and agro formulations",
    iconName: "Sprout",
    overview:
      "Agro formulators use caustic potash and potassium carbonate as potassium sources, ferrous sulphate as an iron micronutrient, ammonium chloride as a nitrogen source, and sulphuric acid and caustic soda for processing.",
    keyChallenges: [
      "Seasonal demand that needs stock on hand",
      "Correct alkalinity and solubility for liquid formulations",
    ],
    recommendedProductSlugs: ["caustic-potash-flakes", "potassium-carbonate", "ferrous-sulphate", "ammonium-chloride", "sulphuric-acid", "caustic-soda-flakes"],
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
    recommendedProductSlugs: ["aluminium-chloride-granules", "thionyl-chloride", "caustic-soda-flakes", "caustic-potash-flakes", "potassium-carbonate"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: ["Grasim aluminium chloride, 99.50% purity, in granules and powder", COMMON_BENEFITS.grasim, COMMON_BENEFITS.oneSource],
  },
  {
    id: "textiles",
    slug: "textiles",
    name: "Textiles",
    tagline: "Scouring, mercerising, bleaching and dyeing chemicals",
    iconName: "Shirt",
    overview:
      "Textile processing uses caustic soda for scouring and mercerising, sodium hypochlorite for bleaching, sodium thiosulphate and bisulphite as antichlors, and sodium sulphate, sodium chloride and soda ash in reactive dyeing.",
    keyChallenges: [
      "Uniform alkalinity for even mercerising and dye uptake",
      "Reliable bleaching agents that don't damage fibre",
    ],
    recommendedProductSlugs: ["caustic-soda-flakes", "sodium-hypochlorite", "sodium-sulphate-anhydrous", "sodium-chloride", "soda-ash-light", "sodium-thiosulphate", "sodium-bisulphite", "sodium-acetate"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, "Sodium hypochlorite supplied by tanker from Grasim and Andhra Sugars", COMMON_BENEFITS.oneSource],
  },
  {
    id: "leather",
    slug: "leather",
    name: "Leather",
    tagline: "Alkalis and salts for liming, deliming and neutralisation",
    iconName: "Shield",
    overview:
      "Tanneries use caustic soda and soda ash in beam-house operations, sodium chloride for curing, sodium bicarbonate for neutralisation after chrome tanning, bisulphite / metabisulphite as deliming aids, and oxalic acid for bleaching.",
    keyChallenges: [
      "Consistent chemical strength to protect grain quality",
      "Keeping powders dry and free-flowing in storage",
    ],
    recommendedProductSlugs: ["caustic-soda-flakes", "sodium-chloride", "sodium-bicarbonate", "sodium-metabisulphite", "sodium-bisulphite", "oxalic-acid", "ferrous-sulphate"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, COMMON_BENEFITS.oneSource],
  },
  {
    id: "printing-packaging",
    slug: "printing-packaging",
    name: "Printing & Packaging",
    tagline: "Pulping, bleaching and intermediate chemicals",
    iconName: "Printer",
    overview:
      "Paper, board and printing units use caustic soda for pulping and de-inking, sodium sulphite in pulp processing, sodium hypochlorite for bleaching, and sodium nitrite in dye and pigment intermediates.",
    keyChallenges: ["Steady supply of bulk alkalis", "Bleaching chemicals with dependable strength"],
    recommendedProductSlugs: ["caustic-soda-flakes", "sodium-sulphite", "sodium-hypochlorite", "sodium-nitrite"],
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
      "Dairies use caustic soda for clean-in-place (CIP) cycles, sodium hypochlorite for sanitation, calcium chloride in cheese-making and brine, refined sodium bicarbonate for pH adjustment, and Hyflow for filtration.",
    keyChallenges: ["Effective cleaning without residues", "Reliable sanitation chemicals"],
    recommendedProductSlugs: ["caustic-soda-flakes", "sodium-hypochlorite", "calcium-chloride-granules", "calcium-chloride-lumps", "sodium-bicarbonate-refined", "hyflow"],
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
      "Engineering and metal-finishing units use hydrochloric and sulphuric acid for pickling, caustic soda and soda ash for degreasing, oxalic acid for rust removal, ammonium chloride as a flux, sodium nitrite as a corrosion inhibitor, and calcium chloride in concrete and brine.",
    keyChallenges: ["Consistent bath chemistry for surface treatment", "Safe supply of corrosive chemicals"],
    recommendedProductSlugs: ["hydrochloric-acid", "sulphuric-acid", "caustic-soda-flakes", "soda-ash-light", "oxalic-acid", "ammonium-chloride", "sodium-nitrite", "calcium-chloride-lumps"],
    industrialClusters: REGIONS,
    benefitsWithKanyaka: [COMMON_BENEFITS.grasim, COMMON_BENEFITS.godown, COMMON_BENEFITS.oneSource],
  },
];
