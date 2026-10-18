import { companyInfo } from "@/data/company";

type Location = (typeof companyInfo.locations)[number];

/** What Google Maps should look up: the business listing when there is one, otherwise the exact pin. */
export const mapTarget = (loc: Location) => encodeURIComponent(("mapsQuery" in loc && loc.mapsQuery) || `${loc.lat},${loc.lng}`);
