// The Kids Waiting directory — a state-by-state list of adoption
// photolistings, state-agency intake pages, Heart Gallery chapters,
// and local orgs "in the fight." Sourced from
// public/data/state-orgs.json (Perplexity-generated, then hand-
// polished into the JSON file that lives at the repo root).

const BASE = import.meta.env.BASE_URL;

export type OrgType =
  | 'christian_ministry'
  | 'placement_agency'
  | 'casa_gal'
  | 'advocacy'
  | 'other'
  | string;

export interface Link {
  name: string;
  url: string;
}

export interface StateAgencyLink extends Link {
  pageName?: string | null;
}

export interface HeartGalleryLink extends Link {
  isRegionalFallback?: boolean;
}

export interface Org {
  name: string;
  url: string;
  type: OrgType;
  description: string;
}

export interface StateEntry {
  state: string;
  photolisting: Link | null;
  stateAgency: StateAgencyLink | null;
  heartGallery: HeartGalleryLink | null;
  orgs: Org[];
  notes?: string | null;
}

/** Top-level of state-orgs.json is a flat map of state-code → entry. */
export type StateOrgsFile = Record<string, StateEntry>;

export async function loadStateOrgs(): Promise<StateOrgsFile | null> {
  try {
    const res = await fetch(`${BASE}data/state-orgs.json`);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('json')) return null;
    return (await res.json()) as StateOrgsFile;
  } catch {
    return null;
  }
}

/** Friendly labels for org type chips. */
export const ORG_TYPE_LABELS: Record<string, string> = {
  christian_ministry: 'Christian ministry',
  placement_agency: 'Placement agency',
  casa_gal: 'CASA / GAL',
  advocacy: 'Advocacy',
  other: 'Support',
};
