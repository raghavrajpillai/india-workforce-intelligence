// State-level workforce & AI risk estimates
// Source: PLFS 2023-24 state tables (NSO/MoSPI) — modelled distributions ±30%
// AI risk profile derived from state sectoral composition
// NOT from state-by-occupation microdata — clearly marked as estimates

export interface StateData {
  code: string;
  name: string;
  workforce_million: number;
  high_risk_million: number;
  medium_risk_million: number;
  low_risk_million: number;
  high_risk_pct: number;
  medium_risk_pct: number;
  low_risk_pct: number;
  direct_tax_million: number;
  fiscal_exposure_pct: number;
  economic_profile: string;
  dominant_divisions: string[];
}

export const STATES: StateData[] = [
  {
    code: 'DL', name: 'Delhi',
    workforce_million: 8.0,
    high_risk_million: 2.8, medium_risk_million: 2.4, low_risk_million: 2.8,
    high_risk_pct: 35.0, medium_risk_pct: 30.0, low_risk_pct: 35.0,
    direct_tax_million: 1.5, fiscal_exposure_pct: 18.8,
    economic_profile: 'Admin & Financial Hub',
    dominant_divisions: ['1','2','3','4'],
  },
  {
    code: 'KA', name: 'Karnataka',
    workforce_million: 30.0,
    high_risk_million: 4.5, medium_risk_million: 7.5, low_risk_million: 18.0,
    high_risk_pct: 15.0, medium_risk_pct: 25.0, low_risk_pct: 60.0,
    direct_tax_million: 3.1, fiscal_exposure_pct: 10.3,
    economic_profile: 'IT & Tech Hub',
    dominant_divisions: ['2','3','4'],
  },
  {
    code: 'TG', name: 'Telangana',
    workforce_million: 18.0,
    high_risk_million: 2.7, medium_risk_million: 4.1, low_risk_million: 11.2,
    high_risk_pct: 15.0, medium_risk_pct: 22.8, low_risk_pct: 62.2,
    direct_tax_million: 1.8, fiscal_exposure_pct: 10.0,
    economic_profile: 'IT & Pharma Hub',
    dominant_divisions: ['2','3','4'],
  },
  {
    code: 'KL', name: 'Kerala',
    workforce_million: 13.0,
    high_risk_million: 2.3, medium_risk_million: 3.5, low_risk_million: 7.2,
    high_risk_pct: 17.7, medium_risk_pct: 26.9, low_risk_pct: 55.4,
    direct_tax_million: 1.5, fiscal_exposure_pct: 11.5,
    economic_profile: 'Remittance & Services',
    dominant_divisions: ['2','3','5'],
  },
  {
    code: 'MH', name: 'Maharashtra',
    workforce_million: 56.0,
    high_risk_million: 7.3, medium_risk_million: 12.3, low_risk_million: 36.4,
    high_risk_pct: 13.0, medium_risk_pct: 22.0, low_risk_pct: 65.0,
    direct_tax_million: 5.1, fiscal_exposure_pct: 9.1,
    economic_profile: 'Finance & Industry',
    dominant_divisions: ['1','2','3','7'],
  },
  {
    code: 'TN', name: 'Tamil Nadu',
    workforce_million: 32.0,
    high_risk_million: 3.8, medium_risk_million: 9.0, low_risk_million: 19.2,
    high_risk_pct: 11.9, medium_risk_pct: 28.1, low_risk_pct: 60.0,
    direct_tax_million: 2.8, fiscal_exposure_pct: 8.75,
    economic_profile: 'Industry & Services',
    dominant_divisions: ['2','7','8'],
  },
  {
    code: 'HR', name: 'Haryana',
    workforce_million: 14.0,
    high_risk_million: 1.5, medium_risk_million: 3.5, low_risk_million: 9.0,
    high_risk_pct: 10.7, medium_risk_pct: 25.0, low_risk_pct: 64.3,
    direct_tax_million: 1.0, fiscal_exposure_pct: 7.1,
    economic_profile: 'Agriculture & Industry',
    dominant_divisions: ['2','6','8'],
  },
  {
    code: 'UK', name: 'Uttarakhand',
    workforce_million: 5.0,
    high_risk_million: 0.55, medium_risk_million: 1.15, low_risk_million: 3.3,
    high_risk_pct: 11.0, medium_risk_pct: 23.0, low_risk_pct: 66.0,
    direct_tax_million: 0.35, fiscal_exposure_pct: 7.0,
    economic_profile: 'Tourism & Industry',
    dominant_divisions: ['2','5','6'],
  },
  {
    code: 'GJ', name: 'Gujarat',
    workforce_million: 28.0,
    high_risk_million: 2.5, medium_risk_million: 7.8, low_risk_million: 17.7,
    high_risk_pct: 8.9, medium_risk_pct: 27.9, low_risk_pct: 63.2,
    direct_tax_million: 1.9, fiscal_exposure_pct: 6.8,
    economic_profile: 'Trade & Manufacturing',
    dominant_divisions: ['5','7','8'],
  },
  {
    code: 'AP', name: 'Andhra Pradesh',
    workforce_million: 27.0,
    high_risk_million: 2.4, medium_risk_million: 5.4, low_risk_million: 19.2,
    high_risk_pct: 8.9, medium_risk_pct: 20.0, low_risk_pct: 71.1,
    direct_tax_million: 1.6, fiscal_exposure_pct: 5.9,
    economic_profile: 'Agriculture & Services',
    dominant_divisions: ['6','5','2'],
  },
  {
    code: 'PB', name: 'Punjab',
    workforce_million: 13.0,
    high_risk_million: 1.2, medium_risk_million: 2.9, low_risk_million: 8.9,
    high_risk_pct: 9.2, medium_risk_pct: 22.3, low_risk_pct: 68.5,
    direct_tax_million: 0.8, fiscal_exposure_pct: 6.2,
    economic_profile: 'Agriculture & Trade',
    dominant_divisions: ['6','5','7'],
  },
  {
    code: 'WB', name: 'West Bengal',
    workforce_million: 42.0,
    high_risk_million: 2.9, medium_risk_million: 7.6, low_risk_million: 31.5,
    high_risk_pct: 6.9, medium_risk_pct: 18.1, low_risk_pct: 75.0,
    direct_tax_million: 1.9, fiscal_exposure_pct: 4.5,
    economic_profile: 'Agriculture & Trade',
    dominant_divisions: ['6','5','9'],
  },
  {
    code: 'RJ', name: 'Rajasthan',
    workforce_million: 38.0,
    high_risk_million: 2.3, medium_risk_million: 6.5, low_risk_million: 29.2,
    high_risk_pct: 6.1, medium_risk_pct: 17.1, low_risk_pct: 76.8,
    direct_tax_million: 1.5, fiscal_exposure_pct: 3.9,
    economic_profile: 'Agriculture & Tourism',
    dominant_divisions: ['6','9','5'],
  },
  {
    code: 'UP', name: 'Uttar Pradesh',
    workforce_million: 82.0,
    high_risk_million: 4.9, medium_risk_million: 13.1, low_risk_million: 64.0,
    high_risk_pct: 6.0, medium_risk_pct: 16.0, low_risk_pct: 78.0,
    direct_tax_million: 3.0, fiscal_exposure_pct: 3.7,
    economic_profile: 'Agriculture & Trade',
    dominant_divisions: ['6','9','5'],
  },
  {
    code: 'OD', name: 'Odisha',
    workforce_million: 22.0,
    high_risk_million: 1.3, medium_risk_million: 3.7, low_risk_million: 17.0,
    high_risk_pct: 5.9, medium_risk_pct: 16.8, low_risk_pct: 77.3,
    direct_tax_million: 0.8, fiscal_exposure_pct: 3.6,
    economic_profile: 'Agriculture & Mining',
    dominant_divisions: ['6','9','8'],
  },
  {
    code: 'MP', name: 'Madhya Pradesh',
    workforce_million: 36.0,
    high_risk_million: 1.8, medium_risk_million: 5.8, low_risk_million: 28.4,
    high_risk_pct: 5.0, medium_risk_pct: 16.1, low_risk_pct: 78.9,
    direct_tax_million: 1.1, fiscal_exposure_pct: 3.1,
    economic_profile: 'Agriculture & Forestry',
    dominant_divisions: ['6','9','5'],
  },
  {
    code: 'AS', name: 'Assam',
    workforce_million: 16.0,
    high_risk_million: 0.96, medium_risk_million: 2.4, low_risk_million: 12.64,
    high_risk_pct: 6.0, medium_risk_pct: 15.0, low_risk_pct: 79.0,
    direct_tax_million: 0.6, fiscal_exposure_pct: 3.75,
    economic_profile: 'Agriculture & Tea',
    dominant_divisions: ['6','9'],
  },
  {
    code: 'JH', name: 'Jharkhand',
    workforce_million: 15.0,
    high_risk_million: 0.75, medium_risk_million: 2.7, low_risk_million: 11.55,
    high_risk_pct: 5.0, medium_risk_pct: 18.0, low_risk_pct: 77.0,
    direct_tax_million: 0.5, fiscal_exposure_pct: 3.3,
    economic_profile: 'Mining & Agriculture',
    dominant_divisions: ['6','8','9'],
  },
  {
    code: 'CG', name: 'Chhattisgarh',
    workforce_million: 13.0,
    high_risk_million: 0.65, medium_risk_million: 2.1, low_risk_million: 10.25,
    high_risk_pct: 5.0, medium_risk_pct: 16.2, low_risk_pct: 78.8,
    direct_tax_million: 0.4, fiscal_exposure_pct: 3.1,
    economic_profile: 'Agriculture & Minerals',
    dominant_divisions: ['6','8','9'],
  },
  {
    code: 'BR', name: 'Bihar',
    workforce_million: 48.0,
    high_risk_million: 1.9, medium_risk_million: 6.2, low_risk_million: 39.9,
    high_risk_pct: 4.0, medium_risk_pct: 12.9, low_risk_pct: 83.1,
    direct_tax_million: 1.0, fiscal_exposure_pct: 2.1,
    economic_profile: 'Agriculture & Labour',
    dominant_divisions: ['6','9'],
  },
];
