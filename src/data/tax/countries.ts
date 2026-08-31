import type { CountryTaxProfile } from './types';
import { usProfile } from './countries/us';
import { caProfile } from './countries/ca';
import { ukProfile } from './countries/uk';
import { auProfile } from './countries/au';
import { deProfile } from './countries/de';
import { frProfile } from './countries/fr';
import { esProfile } from './countries/es';
import { itProfile } from './countries/it';
import { nlProfile } from './countries/nl';
import { ieProfile } from './countries/ie';
import { ptProfile } from './countries/pt';
import { chProfile } from './countries/ch';
import { beProfile } from './countries/be';
import { atProfile } from './countries/at';
import { seProfile } from './countries/se';
import { noProfile } from './countries/no';
import { dkProfile } from './countries/dk';
import { fiProfile } from './countries/fi';
import { plProfile } from './countries/pl';
import { sgProfile } from './countries/sg';
import { jpProfile } from './countries/jp';
import { krProfile } from './countries/kr';
import { nzProfile } from './countries/nz';
import { mxProfile } from './countries/mx';

export const allCountryTaxProfiles: CountryTaxProfile[] = [
  usProfile,
  caProfile,
  ukProfile,
  auProfile,
  deProfile,
  frProfile,
  esProfile,
  itProfile,
  nlProfile,
  ieProfile,
  ptProfile,
  chProfile,
  beProfile,
  atProfile,
  seProfile,
  noProfile,
  dkProfile,
  fiProfile,
  plProfile,
  sgProfile,
  jpProfile,
  krProfile,
  nzProfile,
  mxProfile,
];

export const countryTaxProfilesMap: Record<string, CountryTaxProfile> = allCountryTaxProfiles.reduce(
  (acc, profile) => {
    acc[profile.id] = profile;
    return acc;
  },
  {} as Record<string, CountryTaxProfile>
);

export function getCountryTaxProfile(countryId: string): CountryTaxProfile | undefined {
  return countryTaxProfilesMap[countryId];
}

export function getAllTaxCountries(): { id: string; name: string; flagEmoji: string; currency: string; path: string }[] {
  return allCountryTaxProfiles.map((p) => ({
    id: p.id,
    name: p.name,
    flagEmoji: p.flagEmoji,
    currency: p.defaultCurrency,
    path: `/${p.id}-income-tax-calculator/`,
  }));
}
