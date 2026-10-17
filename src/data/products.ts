// Product list, makes, packing sizes and purities follow Kanyaka Corporation's official PRODUCT LIST.
// Chemical identifiers (formula, CAS, UN) and applications are standard public reference data.
// The manufacturer's batch COA is always final.

export interface ProductSpec {
  parameter: string;
  value: string;
}

export interface ProductApplication {
  industry: string;
  application: string;
}

export type ProductCategory = "Chlor-Alkali" | "Alkalis & Carbonates" | "Inorganic Salts" | "Acids & Reagents";

export interface Product {
  id: string;
  slug: string;
  name: string;
  synonyms: string[];
  manufacturer: string;
  brandTier: string;
  category: ProductCategory;
  grade: string;
  purity: string;
  chemicalFormula: string;
  casNumber: string;
  unNumber: string;
  physicalAppearance: string;
  packagingOptions: string[];
  minOrderQuantity: string;
  deliveryLeadTime: string;
  shortDescription: string;
  detailedDescription: string;
  isGrasimAuthorized: boolean;
  isFeatured: boolean;
  /** Stocked at the Pashamylaram godown. */
  fromGodown: boolean;
  keySpecs: ProductSpec[];
  applications: ProductApplication[];
  handlingStorage: string[];
  industriesServed: string[];
}

const GODOWN_SUPPLY = "Supplied from our godown stock at Pashamylaram";
const ORDER_SUPPLY = "Availability and dispatch confirmed when you enquire";
const NO_PURITY = "As per manufacturer's specification";

type Def = {
  slug: string;
  name: string;
  /** Make(s) exactly as on the official product list */
  make: string;
  category: ProductCategory;
  /** Packing size from the official product list */
  packing: string;
  /** Purity from the official product list; omit when the list leaves it blank */
  purity?: string;
  /** What the purity figure is measured as, e.g. "as SO₂" */
  purityBasis?: string;
  grade: string;
  formula: string;
  cas: string;
  un: string;
  appearance: string;
  synonyms?: string[];
  short: string;
  detailed: string;
  applications: ProductApplication[];
  handling: string[];
  industries: string[];
  featured?: boolean;
  godown?: boolean;
};

function product(d: Def): Product {
  const purity = d.purity ? `${d.purity}${d.purityBasis ? ` (${d.purityBasis})` : ""}` : NO_PURITY;
  return {
    id: d.slug,
    slug: d.slug,
    name: d.name,
    synonyms: d.synonyms ?? [],
    manufacturer: d.make,
    brandTier: d.make,
    category: d.category,
    grade: d.grade,
    purity,
    chemicalFormula: d.formula,
    casNumber: d.cas,
    unNumber: d.un,
    physicalAppearance: d.appearance,
    packagingOptions: [d.packing],
    minOrderQuantity: "On enquiry",
    deliveryLeadTime: d.godown ? GODOWN_SUPPLY : ORDER_SUPPLY,
    shortDescription: d.short,
    detailedDescription: d.detailed,
    isGrasimAuthorized: /grasim/i.test(d.make),
    isFeatured: d.featured ?? false,
    fromGodown: d.godown ?? false,
    keySpecs: [
      { parameter: "Purity", value: purity },
      { parameter: "Make", value: d.make },
      { parameter: "Packing", value: d.packing },
      { parameter: "Grade / form", value: d.grade },
    ],
    applications: d.applications,
    handlingStorage: d.handling,
    industriesServed: d.industries,
  };
}

const CORROSIVE_SOLID = [
  "Corrosive — wear goggles, face shield, gloves and apron.",
  "Keep bags tightly closed in a dry, covered store, away from acids and moisture.",
  "Always add slowly to water while stirring — never add water to the solid.",
];
const DRY_SALT = ["Store in a dry, covered place in closed bags.", "Use a dust mask and gloves during bulk handling."];

export const productsData: Product[] = [
  // 1–2 Aluminium chloride
  product({
    slug: "aluminium-chloride-granules",
    name: "Aluminium Chloride Granules",
    make: "Grasim",
    category: "Chlor-Alkali",
    packing: "25 Kg",
    purity: "99.50%",
    grade: "Anhydrous — Granules",
    formula: "AlCl₃",
    cas: "7446-70-0",
    un: "UN 1726 (Class 8 Corrosive)",
    appearance: "Pale yellow to grey granules; fumes in moist air",
    synonyms: ["Anhydrous Aluminium Chloride", "AlCl₃ Granules"],
    short: "Grasim anhydrous aluminium chloride granules, 99.50% purity — the standard Friedel-Crafts catalyst.",
    detailed:
      "Anhydrous aluminium chloride is a strong Lewis-acid catalyst used for Friedel-Crafts alkylation and acylation in pharmaceutical, pesticide and dye-intermediate synthesis. Granules are easier to charge and generate less dust than powder.",
    applications: [
      { industry: "Pharmaceuticals", application: "Friedel-Crafts catalyst for API and intermediate synthesis." },
      { industry: "Pesticides", application: "Catalyst in agro-chemical intermediate manufacture." },
      { industry: "Dyes & pigments", application: "Catalyst for anthraquinone and dye intermediates." },
    ],
    handling: [
      "Reacts violently with water, releasing HCl fumes — keep containers sealed and dry.",
      "Open only in well-ventilated areas with respiratory protection.",
      "Store away from moisture, alcohols and bases.",
    ],
    industries: ["Pharmaceuticals", "Pesticides"],
    featured: true,
    godown: true,
  }),
  product({
    slug: "aluminium-chloride-powder",
    name: "Aluminium Chloride Powder",
    make: "Grasim",
    category: "Chlor-Alkali",
    packing: "25 Kg",
    purity: "99.50%",
    grade: "Anhydrous — Powder",
    formula: "AlCl₃",
    cas: "7446-70-0",
    un: "UN 1726 (Class 8 Corrosive)",
    appearance: "Pale yellow to grey powder; fumes in moist air",
    synonyms: ["Anhydrous Aluminium Chloride", "AlCl₃ Powder"],
    short: "Grasim anhydrous aluminium chloride powder, 99.50% purity, for fast-dissolving catalyst charges.",
    detailed:
      "Powdered anhydrous aluminium chloride offers a large surface area for quick reaction start-up in Friedel-Crafts and other Lewis-acid catalysed reactions in pharma and agro-chemical synthesis.",
    applications: [
      { industry: "Pharmaceuticals", application: "Lewis-acid catalyst for API synthesis." },
      { industry: "Pesticides", application: "Catalyst for agro-chemical intermediates." },
    ],
    handling: [
      "Reacts violently with water, releasing HCl fumes — keep containers sealed and dry.",
      "Avoid dust; use respiratory protection and handle in ventilated areas.",
    ],
    industries: ["Pharmaceuticals", "Pesticides"],
    godown: true,
  }),
  // 3 Ammonium chloride
  product({
    slug: "ammonium-chloride",
    name: "Ammonium Chloride",
    make: "Shalibadra SP Chem",
    category: "Inorganic Salts",
    packing: "25 Kg",
    purity: "99.04%",
    grade: "Technical",
    formula: "NH₄Cl",
    cas: "12125-02-9",
    un: "Not regulated for transport (harmful if swallowed)",
    appearance: "White crystalline powder",
    synonyms: ["Sal Ammoniac", "Nausadar"],
    short: "Ammonium chloride, 99.04% purity — flux, buffer and nitrogen source.",
    detailed:
      "Ammonium chloride is used as a flux in galvanising and soldering, a buffer and reagent in chemical and pharmaceutical processing, and a nitrogen source in agro formulations.",
    applications: [
      { industry: "Engineering", application: "Flux for galvanising, tinning and soldering." },
      { industry: "Pharmaceuticals", application: "Buffer and reagent in synthesis." },
      { industry: "Agro", application: "Nitrogen source in formulations." },
    ],
    handling: [...DRY_SALT, "Decomposes on strong heating, releasing ammonia and HCl."],
    industries: ["Engineering", "Pharmaceuticals", "Agro"],
  }),
  // 4–6 Calcium chloride
  product({
    slug: "calcium-chloride-granules",
    name: "Calcium Chloride Granules (94%)",
    make: "Grasim",
    category: "Chlor-Alkali",
    packing: "50 Kg",
    purity: "94.00%",
    grade: "Anhydrous granules — 94%",
    formula: "CaCl₂",
    cas: "10043-52-4",
    un: "Not regulated for transport (irritant)",
    appearance: "White granules",
    short: "Grasim calcium chloride granules, 94% — desiccant and calcium source.",
    detailed:
      "Anhydrous calcium chloride is a strong desiccant used to dry gases and solvents, and a calcium source for dairies, concrete acceleration and brine refrigeration.",
    applications: [
      { industry: "Pharmaceuticals", application: "Desiccant for drying gases and solvents." },
      { industry: "Dairy", application: "Calcium addition in cheese-making." },
      { industry: "Engineering", application: "Concrete accelerator and refrigeration brine." },
    ],
    handling: ["Very hygroscopic — keep bags sealed.", "Dissolving releases heat; add slowly to water.", "Irritant — wear goggles and gloves."],
    industries: ["Pharmaceuticals", "Dairy", "Engineering"],
    godown: true,
  }),
  product({
    slug: "calcium-chloride-powder",
    name: "Calcium Chloride Powder (94%)",
    make: "Kutch / Panoli Aqua",
    category: "Chlor-Alkali",
    packing: "50 Kg",
    purity: "94.00%",
    grade: "Anhydrous powder — 94%",
    formula: "CaCl₂",
    cas: "10043-52-4",
    un: "Not regulated for transport (irritant)",
    appearance: "White powder",
    short: "Calcium chloride powder, 94% — fast-dissolving desiccant and calcium source.",
    detailed:
      "Powdered anhydrous calcium chloride dissolves quickly, making it convenient for drying applications, brine preparation and process dosing.",
    applications: [
      { industry: "Pharmaceuticals", application: "Drying agent for solvents and gases." },
      { industry: "Engineering", application: "Brine preparation and concrete acceleration." },
    ],
    handling: ["Very hygroscopic — keep bags sealed.", "Dissolving releases heat; add slowly to water.", "Irritant — wear goggles and gloves."],
    industries: ["Pharmaceuticals", "Engineering"],
  }),
  product({
    slug: "calcium-chloride-lumps",
    name: "Calcium Chloride Lumps (70–75%)",
    make: "Grasim / Panoli Aqua",
    category: "Chlor-Alkali",
    packing: "50 Kg",
    purity: "75.00%",
    grade: "Fused lumps — 70–75%",
    formula: "CaCl₂·2H₂O",
    cas: "10035-04-8",
    un: "Not regulated for transport (irritant)",
    appearance: "White fused lumps / flakes",
    short: "Calcium chloride lumps, 70–75% — economical grade for brine, dust control and drying.",
    detailed:
      "Fused calcium chloride (dihydrate) is the economical grade for refrigeration brine, dust suppression, de-watering and general drying duties.",
    applications: [
      { industry: "Engineering", application: "Refrigeration brine and dust suppression." },
      { industry: "Dairy", application: "Cold-room brine systems." },
    ],
    handling: ["Hygroscopic — keep bags sealed.", "Irritant — wear goggles and gloves."],
    industries: ["Engineering", "Dairy"],
  }),
  // 7 Caustic soda
  product({
    slug: "caustic-soda-flakes",
    name: "Caustic Soda Flakes",
    make: "DCM / Grasim / TGV",
    category: "Chlor-Alkali",
    packing: "50 Kg",
    purity: "98.00%",
    grade: "Flakes",
    formula: "NaOH",
    cas: "1310-73-2",
    un: "UN 1823 (Class 8 Corrosive)",
    appearance: "White, free-flowing deliquescent flakes",
    synonyms: ["Sodium Hydroxide Flakes", "NaOH Flakes"],
    short: "Caustic soda flakes, 98% purity — from DCM, Grasim and TGV.",
    detailed:
      "Caustic soda is the workhorse alkali of process industry — used for neutralisation, saponification, mercerising, metal cleaning and as a reagent in pharmaceutical and agro-chemical synthesis.",
    applications: [
      { industry: "Pharmaceuticals", application: "Reagent for synthesis, hydrolysis and pH adjustment." },
      { industry: "Textiles", application: "Scouring, mercerising and dye-bath alkalinity." },
      { industry: "Engineering", application: "Degreasing and metal cleaning." },
      { industry: "Dairy", application: "Alkaline cleaning (CIP) of tanks and lines." },
    ],
    handling: CORROSIVE_SOLID,
    industries: ["Pharmaceuticals", "Textiles", "Agro", "Pesticides", "Engineering", "Leather", "Dairy"],
    featured: true,
    godown: true,
  }),
  // 8 Caustic potash
  product({
    slug: "caustic-potash-flakes",
    name: "Caustic Potash Flakes",
    make: "Andhra Sugars / TGV",
    category: "Alkalis & Carbonates",
    packing: "50 Kg",
    purity: "90.28%",
    grade: "Flakes",
    formula: "KOH",
    cas: "1310-58-3",
    un: "UN 1813 (Class 8 Corrosive)",
    appearance: "White deliquescent flakes",
    synonyms: ["Potassium Hydroxide Flakes"],
    short: "Caustic potash flakes, 90.28% — from Andhra Sugars and TGV.",
    detailed:
      "Potassium hydroxide is used where a potassium salt is needed instead of sodium — liquid fertilisers, potassium soaps, pharmaceutical synthesis and electrolytes.",
    applications: [
      { industry: "Pharmaceuticals", application: "Base for synthesis and potassium salt formation." },
      { industry: "Agro", application: "Liquid potassium fertilisers." },
      { industry: "Soaps", application: "Soft and liquid potassium soaps." },
    ],
    handling: CORROSIVE_SOLID,
    industries: ["Pharmaceuticals", "Agro", "Pesticides"],
    featured: true,
  }),
  // 9 Ferrous sulphate
  product({
    slug: "ferrous-sulphate",
    name: "Ferrous Sulphate",
    make: "Vinipul Chemicals",
    category: "Inorganic Salts",
    packing: "50 Kg",
    grade: "Technical",
    formula: "FeSO₄·7H₂O",
    cas: "7782-63-0",
    un: "Not regulated for transport (harmful if swallowed)",
    appearance: "Pale green crystals",
    synonyms: ["Iron(II) Sulphate", "Green Vitriol"],
    short: "Ferrous sulphate from Vinipul Chemicals — coagulant, reducing agent and iron source.",
    detailed:
      "Ferrous sulphate is used as a coagulant and reducing agent in effluent treatment (including chromium reduction), as an iron micronutrient in agriculture, and in pigment manufacture.",
    applications: [
      { industry: "Effluent treatment", application: "Coagulant and reduction of hexavalent chromium." },
      { industry: "Agro", application: "Iron micronutrient for soil and foliar use." },
      { industry: "Leather", application: "Effluent chrome reduction." },
    ],
    handling: ["Store dry and cool; oxidises (turns brown) in moist air.", "Harmful if swallowed — wear gloves and a dust mask."],
    industries: ["Agro", "Leather", "Engineering"],
  }),
  // 10 HCl
  product({
    slug: "hydrochloric-acid",
    name: "Hydrochloric Acid (HCl)",
    make: "Grasim / TGV / Andhra Sugars",
    category: "Acids & Reagents",
    packing: "Carboy / Drum / Tanker",
    grade: "Commercial",
    formula: "HCl",
    cas: "7647-01-0",
    un: "UN 1789 (Class 8 Corrosive)",
    appearance: "Clear, colourless to pale yellow fuming liquid",
    synonyms: ["Muriatic Acid", "Hydrochloric Acid"],
    short: "Hydrochloric acid in carboys, drums and tankers — from Grasim, TGV and Andhra Sugars.",
    detailed:
      "Hydrochloric acid is used for pickling and descaling steel, pH adjustment, regeneration of ion-exchange resins and as a reagent in pharmaceutical and chemical manufacture.",
    applications: [
      { industry: "Engineering", application: "Steel pickling, descaling and metal cleaning." },
      { industry: "Pharmaceuticals", application: "pH adjustment and salt formation." },
      { industry: "Textiles", application: "Neutralisation and souring." },
    ],
    handling: [
      "Corrosive, fuming acid — handle with face shield, acid-resistant gloves and apron.",
      "Store in HDPE / rubber-lined containers in a ventilated area, away from alkalis and metals.",
    ],
    industries: ["Engineering", "Pharmaceuticals", "Textiles"],
    featured: true,
  }),
  // 11 Hyflow
  product({
    slug: "hyflow",
    name: "Hyflow (Filter Aid)",
    make: "Amol Mine Chem",
    category: "Acids & Reagents",
    packing: "20 Kg",
    grade: "Flux-calcined diatomaceous earth",
    formula: "SiO₂",
    cas: "68855-54-9",
    un: "Not regulated for transport",
    appearance: "White to off-white fine powder",
    synonyms: ["Hyflo Super Cel", "Diatomaceous Earth Filter Aid", "Celite"],
    short: "Hyflow filter aid from Amol Mine Chem for clear, fast filtration.",
    detailed:
      "Hyflow is a flux-calcined diatomaceous earth filter aid. It forms a porous pre-coat on filter presses and nutsche filters, giving clear filtrates in pharmaceutical, chemical and food processing.",
    applications: [
      { industry: "Pharmaceuticals", application: "Pre-coat and body-feed filter aid for clarification." },
      { industry: "Dairy", application: "Filtration of liquids and syrups." },
    ],
    handling: ["Avoid breathing dust — use a dust mask (contains silica).", "Store dry in closed bags."],
    industries: ["Pharmaceuticals", "Dairy"],
  }),
  // 12 Potassium carbonate
  product({
    slug: "potassium-carbonate",
    name: "Potassium Carbonate Powder",
    make: "Andhra Sugars / TGV",
    category: "Alkalis & Carbonates",
    packing: "50 Kg",
    purity: "99.32%",
    grade: "Powder",
    formula: "K₂CO₃",
    cas: "584-08-7",
    un: "Not regulated for transport (irritant)",
    appearance: "White granular powder",
    synonyms: ["Potash", "Pearl Ash"],
    short: "Potassium carbonate powder, 99.32% — a mild base widely used in pharma synthesis.",
    detailed:
      "Potassium carbonate is a mild, easily handled base for alkylations and condensations in pharmaceutical and agro-chemical synthesis; also used in glass, detergents and food processing.",
    applications: [
      { industry: "Pharmaceuticals", application: "Mild base for alkylation and condensation reactions." },
      { industry: "Pesticides", application: "Base in agro-chemical synthesis." },
    ],
    handling: ["Hygroscopic — store in closed bags in a dry place.", "Irritant — use goggles, gloves and a dust mask."],
    industries: ["Pharmaceuticals", "Pesticides", "Agro"],
  }),
  // 13 Soda ash light
  product({
    slug: "soda-ash-light",
    name: "Soda Ash Light",
    make: "Nirma / Tata",
    category: "Alkalis & Carbonates",
    packing: "50 Kg",
    purity: "99.20%",
    grade: "Light",
    formula: "Na₂CO₃",
    cas: "497-19-8",
    un: "Not regulated for transport (irritant)",
    appearance: "Fine white powder",
    synonyms: ["Sodium Carbonate", "Washing Soda (anhydrous)"],
    short: "Soda ash light, 99.20% — from Nirma and Tata.",
    detailed:
      "Sodium carbonate is used as an alkali in textile dyeing and scouring, detergent manufacture, water softening and many chemical processes.",
    applications: [
      { industry: "Textiles", application: "Dye fixation (reactive dyes) and scouring." },
      { industry: "Engineering", application: "Metal cleaning and water softening." },
      { industry: "Detergents", application: "Alkali builder." },
    ],
    handling: ["Store dry in closed bags.", "Irritant to eyes — wear goggles and a dust mask."],
    industries: ["Textiles", "Engineering", "Leather"],
  }),
  // 14–15 Sodium bicarbonate
  product({
    slug: "sodium-bicarbonate",
    name: "Sodium Bicarbonate",
    make: "Nirma / Tata",
    category: "Alkalis & Carbonates",
    packing: "50 Kg",
    purity: "99.20%",
    grade: "Technical",
    formula: "NaHCO₃",
    cas: "144-55-8",
    un: "Not regulated for transport",
    appearance: "Fine white crystalline powder",
    synonyms: ["Baking Soda", "Sodium Hydrogen Carbonate"],
    short: "Sodium bicarbonate, 99.20% — from Nirma and Tata.",
    detailed: "Sodium bicarbonate is a mild alkali used to neutralise acids gently, buffer pH, and as a CO₂ source.",
    applications: [
      { industry: "Leather", application: "Neutralisation after chrome tanning." },
      { industry: "Pharmaceuticals", application: "Gentle neutralisation and buffering in work-ups." },
    ],
    handling: ["Store in a dry place in closed bags.", "Low hazard; avoid creating dust."],
    industries: ["Leather", "Pharmaceuticals"],
  }),
  product({
    slug: "sodium-bicarbonate-refined",
    name: "Sodium Bicarbonate (Refined)",
    make: "Tata",
    category: "Alkalis & Carbonates",
    packing: "50 Kg",
    purity: "99.96%",
    grade: "Refined",
    formula: "NaHCO₃",
    cas: "144-55-8",
    un: "Not regulated for transport",
    appearance: "Fine white crystalline powder",
    synonyms: ["Refined Baking Soda"],
    short: "Tata refined sodium bicarbonate, 99.96% — high-purity grade.",
    detailed:
      "Refined sodium bicarbonate is the high-purity grade for pharmaceutical, dairy and food-related processing where low impurities matter.",
    applications: [
      { industry: "Pharmaceuticals", application: "High-purity buffering and neutralisation." },
      { industry: "Dairy", application: "pH adjustment." },
    ],
    handling: ["Store in a dry place in closed bags.", "Low hazard; avoid creating dust."],
    industries: ["Pharmaceuticals", "Dairy"],
  }),
  // 16 Sodium sulphate
  product({
    slug: "sodium-sulphate-anhydrous",
    name: "Sodium Sulphate Anhydrous",
    make: "Deepak / Grasim",
    category: "Inorganic Salts",
    packing: "50 Kg",
    purity: "99.71%",
    grade: "Anhydrous",
    formula: "Na₂SO₄",
    cas: "7757-82-6",
    un: "Not regulated for transport",
    appearance: "White, odourless crystalline powder",
    synonyms: ["Salt Cake", "Glauber's Salt (anhydrous)"],
    short: "Sodium sulphate anhydrous, 99.71% — from Deepak and Grasim.",
    detailed:
      "Anhydrous sodium sulphate is used as an exhausting and levelling agent in reactive dyeing, a filler in detergents, and a drying agent for organic solvents in pharmaceutical work-ups.",
    applications: [
      { industry: "Textiles", application: "Exhausting and levelling agent in dyeing." },
      { industry: "Pharmaceuticals", application: "Drying agent for organic solvent layers." },
    ],
    handling: DRY_SALT,
    industries: ["Textiles", "Pharmaceuticals", "Leather"],
    godown: true,
  }),
  // 17–19 Sulphites
  product({
    slug: "sodium-metabisulphite",
    name: "Sodium Meta Bi Sulphite (SMBS)",
    make: "Shree Krishna / Shalin",
    category: "Inorganic Salts",
    packing: "50 Kg",
    purity: "64.32%",
    purityBasis: "as SO₂",
    grade: "Technical",
    formula: "Na₂S₂O₅",
    cas: "7681-57-4",
    un: "Not regulated for transport",
    appearance: "White crystalline powder with a sulphur dioxide odour",
    synonyms: ["SMBS", "Sodium Pyrosulphite"],
    short: "SMBS from Shree Krishna and Shalin — antioxidant, preservative and reducing agent.",
    detailed:
      "Sodium metabisulphite is used as an antioxidant and preservative, a dechlorinating agent, a reducing agent in pharmaceutical synthesis, and in leather and textile processing.",
    applications: [
      { industry: "Pharmaceuticals", application: "Antioxidant and reducing agent." },
      { industry: "Leather", application: "Bleaching and deliming aid." },
      { industry: "Textiles", application: "Antichlor and reducing agent." },
    ],
    handling: ["Releases SO₂ with acids or moisture — keep sealed, dry and away from acids.", "Use in ventilated areas."],
    industries: ["Pharmaceuticals", "Leather", "Textiles"],
  }),
  product({
    slug: "sodium-bisulphite",
    name: "Sodium Bi Sulphite (SBS)",
    make: "Shree Krishna / Shalin",
    category: "Inorganic Salts",
    packing: "50 Kg",
    purity: "62.40%",
    purityBasis: "as SO₂",
    grade: "Technical",
    formula: "NaHSO₃",
    cas: "7631-90-5",
    un: "Not regulated as solid",
    appearance: "White to off-white powder with a sulphur dioxide odour",
    synonyms: ["SBS", "Sodium Hydrogen Sulphite"],
    short: "SBS from Shree Krishna and Shalin — reducing agent and antichlor.",
    detailed:
      "Sodium bisulphite is a reducing agent used to remove residual chlorine (antichlor) after bleaching, in leather processing, as a preservative, and as a reagent in organic synthesis.",
    applications: [
      { industry: "Textiles", application: "Antichlor after bleaching; reducing agent." },
      { industry: "Leather", application: "Deliming and bleaching aid." },
      { industry: "Pharmaceuticals", application: "Reducing agent and bisulphite adduct formation." },
    ],
    handling: ["Releases SO₂ on contact with acids — store away from acids.", "Keep dry and in closed bags; use in ventilated areas."],
    industries: ["Textiles", "Leather", "Pharmaceuticals"],
  }),
  product({
    slug: "sodium-sulphite",
    name: "Sodium Sulphite",
    make: "Shree Krishna",
    category: "Inorganic Salts",
    packing: "50 Kg",
    purity: "96.14%",
    grade: "Anhydrous",
    formula: "Na₂SO₃",
    cas: "7757-83-7",
    un: "Not regulated for transport",
    appearance: "White powder",
    short: "Sodium sulphite, 96.14% — oxygen scavenger and reducing agent.",
    detailed:
      "Sodium sulphite is used as an oxygen scavenger in boiler water, a reducing agent in chemical processing, and in pulp, photographic and textile applications.",
    applications: [
      { industry: "Engineering", application: "Oxygen scavenger for boiler feed water." },
      { industry: "Textiles", application: "Reducing agent and antichlor." },
      { industry: "Printing & Packaging", application: "Pulp and paper processing." },
    ],
    handling: ["Releases SO₂ with acids — store away from acids.", ...DRY_SALT],
    industries: ["Engineering", "Textiles", "Printing & Packaging"],
  }),
  // 20 Sodium thiosulphate
  product({
    slug: "sodium-thiosulphate",
    name: "Sodium Thio Sulphate (STS)",
    make: "Shalibadra Chem / Shalibadra Dye Chem",
    category: "Inorganic Salts",
    packing: "50 Kg",
    purity: "98.40%",
    grade: "Pentahydrate crystals",
    formula: "Na₂S₂O₃·5H₂O",
    cas: "10102-17-7",
    un: "Not regulated for transport",
    appearance: "Colourless to white crystals",
    synonyms: ["STS", "Hypo"],
    short: "Sodium thiosulphate, 98.40% — dechlorinating and reducing agent.",
    detailed:
      "Sodium thiosulphate neutralises chlorine and is used as an antichlor in textile bleaching, a dechlorinating agent in water treatment, a reducing agent, and in leather and photographic processing.",
    applications: [
      { industry: "Textiles", application: "Antichlor after bleaching." },
      { industry: "Leather", application: "Reducing agent in processing." },
      { industry: "Pharmaceuticals", application: "Reagent and reducing agent." },
    ],
    handling: DRY_SALT,
    industries: ["Textiles", "Leather", "Pharmaceuticals"],
  }),
  // 21 Sodium nitrite
  product({
    slug: "sodium-nitrite",
    name: "Sodium Nitrite",
    make: "Kutch",
    category: "Inorganic Salts",
    packing: "50 Kg",
    purity: "99%",
    grade: "Technical",
    formula: "NaNO₂",
    cas: "7632-00-0",
    un: "UN 1500 (Class 5.1 Oxidizer, Subsidiary 6.1)",
    appearance: "White to slightly yellowish crystals or granules",
    short: "Sodium nitrite, 99% — for diazotisation, dyes and corrosion inhibition.",
    detailed:
      "Sodium nitrite is the key reagent for diazotisation in dye and pharmaceutical intermediate manufacture, and is also used as a corrosion inhibitor and in heat-treatment salts.",
    applications: [
      { industry: "Pharmaceuticals", application: "Diazotisation of aromatic amines." },
      { industry: "Printing & Packaging", application: "Dye and pigment intermediate manufacture." },
      { industry: "Engineering", application: "Corrosion inhibitor and heat-treatment salts." },
    ],
    handling: [
      "Oxidizer and toxic if swallowed — keep away from acids, ammonium salts and organics.",
      "Store cool and dry in closed bags; wear goggles, gloves and a dust mask.",
    ],
    industries: ["Pharmaceuticals", "Engineering", "Printing & Packaging"],
  }),
  // 22 Sodium acetate
  product({
    slug: "sodium-acetate",
    name: "Sodium Acetate",
    make: "Omkar Pharma",
    category: "Inorganic Salts",
    packing: "25 Kg",
    purity: "99.15%",
    grade: "Pharma / Technical",
    formula: "CH₃COONa",
    cas: "127-09-3",
    un: "Not regulated for transport",
    appearance: "White crystalline powder",
    short: "Sodium acetate from Omkar Pharma, 99.15% — buffer and reagent.",
    detailed:
      "Sodium acetate is used as a buffering agent in pharmaceutical and chemical processing, in textile dyeing to neutralise acid streams, and as a reagent in synthesis.",
    applications: [
      { industry: "Pharmaceuticals", application: "Buffer and reagent in synthesis." },
      { industry: "Textiles", application: "Buffering in dyeing and neutralisation." },
    ],
    handling: DRY_SALT,
    industries: ["Pharmaceuticals", "Textiles"],
  }),
  // 23 Sodium chloride
  product({
    slug: "sodium-chloride",
    name: "Sodium Chloride",
    make: "Terapanth / Ankur / Sungold",
    category: "Inorganic Salts",
    packing: "50 Kg",
    purity: "99.59%",
    grade: "Refined industrial",
    formula: "NaCl",
    cas: "7647-14-5",
    un: "Not regulated for transport",
    appearance: "White crystalline salt",
    synonyms: ["Common Salt", "Industrial Salt"],
    short: "Refined sodium chloride, 99.59% — from Terapanth, Ankur and Sungold.",
    detailed:
      "High-purity sodium chloride is used for water-softener regeneration, as an exhausting agent in textile dyeing, in leather curing, and as a raw material in chemical processes.",
    applications: [
      { industry: "Textiles", application: "Exhausting agent in reactive dyeing." },
      { industry: "Leather", application: "Hide curing and pickling." },
      { industry: "Engineering", application: "Water-softener regeneration." },
    ],
    handling: ["Store dry in closed bags.", "Low hazard."],
    industries: ["Textiles", "Leather", "Engineering"],
  }),
  // 24 Sodium hypochlorite
  product({
    slug: "sodium-hypochlorite",
    name: "Sodium Hypochlorite",
    make: "Grasim / Andhra Sugars",
    category: "Chlor-Alkali",
    packing: "Tanker",
    grade: "Solution",
    formula: "NaOCl",
    cas: "7681-52-9",
    un: "UN 1791 (Class 8 Corrosive)",
    appearance: "Pale greenish-yellow liquid with a chlorine odour",
    synonyms: ["Hypo", "Liquid Bleach"],
    short: "Sodium hypochlorite in tankers — from Grasim and Andhra Sugars.",
    detailed:
      "Sodium hypochlorite is used for disinfection of water, sanitation in dairy and food plants, and bleaching in textile processing.",
    applications: [
      { industry: "Dairy", application: "Sanitation and disinfection." },
      { industry: "Textiles", application: "Bleaching of cotton." },
      { industry: "Water", application: "Disinfection of drinking and process water." },
    ],
    handling: [
      "Corrosive — keep away from acids (releases chlorine gas) and ammonia.",
      "Store cool, out of sunlight, in vented HDPE tanks; strength reduces over time.",
    ],
    industries: ["Dairy", "Textiles"],
  }),
  // 25 Sulphuric acid
  product({
    slug: "sulphuric-acid",
    name: "Sulphuric Acid",
    make: "SRHH / Andhra Sugars",
    category: "Acids & Reagents",
    packing: "Tanker",
    grade: "Commercial",
    formula: "H₂SO₄",
    cas: "7664-93-9",
    un: "UN 1830 (Class 8 Corrosive)",
    appearance: "Clear, colourless oily liquid",
    synonyms: ["Oil of Vitriol"],
    short: "Sulphuric acid in tankers — from SRHH and Andhra Sugars.",
    detailed:
      "Sulphuric acid is used for pH control, metal pickling, fertiliser and chemical manufacture, and as a reagent and dehydrating agent in pharmaceutical synthesis.",
    applications: [
      { industry: "Pharmaceuticals", application: "Reagent, catalyst and pH control." },
      { industry: "Engineering", application: "Metal pickling and battery acid." },
      { industry: "Agro", application: "Fertiliser manufacture." },
    ],
    handling: [
      "Highly corrosive; reacts violently with water — always add acid to water, never water to acid.",
      "Full PPE: face shield, acid suit and gloves. Store in MS/SS tanks away from organics and alkalis.",
    ],
    industries: ["Pharmaceuticals", "Engineering", "Agro"],
  }),
  // 26 Thionyl chloride
  product({
    slug: "thionyl-chloride",
    name: "Thionyl Chloride",
    make: "Panoli / Kutch",
    category: "Acids & Reagents",
    packing: "300 Kg Drum",
    purity: "99.82%",
    grade: "Technical",
    formula: "SOCl₂",
    cas: "7719-09-7",
    un: "UN 1836 (Class 8 Corrosive)",
    appearance: "Colourless to pale yellow fuming liquid with a pungent odour",
    synonyms: ["Sulphurous Oxychloride"],
    short: "Thionyl chloride, 99.82% in 300 kg drums — the standard chlorinating agent for pharma and agro synthesis.",
    detailed:
      "Thionyl chloride converts carboxylic acids to acid chlorides and alcohols to alkyl chlorides, making it a staple reagent in API, pesticide and dye-intermediate manufacture.",
    applications: [
      { industry: "Pharmaceuticals", application: "Acid chloride and alkyl chloride formation in API synthesis." },
      { industry: "Pesticides", application: "Chlorinating agent for agro-chemical intermediates." },
    ],
    handling: [
      "Reacts violently with water, releasing HCl and SO₂ — keep drums sealed and dry.",
      "Handle only in closed systems or under a fume hood with full PPE and respiratory protection.",
    ],
    industries: ["Pharmaceuticals", "Pesticides"],
  }),
  // 27 Oxalic acid
  product({
    slug: "oxalic-acid",
    name: "Oxalic Acid",
    make: "Radiant Agro",
    category: "Acids & Reagents",
    packing: "50 Kg",
    purity: "98.5%",
    grade: "Technical",
    formula: "C₂H₂O₄·2H₂O",
    cas: "6153-56-6",
    un: "Not regulated for transport (harmful)",
    appearance: "Colourless to white crystals",
    short: "Oxalic acid, 98.5% — cleaning, bleaching and metal-treatment acid.",
    detailed:
      "Oxalic acid is used for rust and scale removal, metal surface treatment, bleaching in textile and leather processing, and as a reagent in chemical synthesis.",
    applications: [
      { industry: "Engineering", application: "Rust removal and metal surface treatment." },
      { industry: "Leather", application: "Bleaching and cleaning." },
      { industry: "Textiles", application: "Stain and rust removal." },
    ],
    handling: ["Harmful if swallowed or in contact with skin — wear gloves and goggles.", "Store dry, away from oxidisers and bases."],
    industries: ["Engineering", "Leather", "Textiles"],
  }),
];
