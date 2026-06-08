# 🇮🇳 India Workforce Intelligence Visualizer

An interactive data visualization tool mapping **622 million Indian workers** across **116 occupation groups** — showing AI disruption risk, tax contribution tiers, and workforce size in a single treemap.

Built on official Government of India datasets. AI scores clearly marked as LLM-inferred estimates.

---

## 🔍 What It Shows

- **Workforce Size** — tile area = number of workers (PLFS 2023-24)
- **AI Exposure** — tile color = how exposed each occupation is to AI/automation
- **Tax Contributor Mapping** — who pays Direct Tax vs GST/Indirect vs Non-Contributor
- **Fiscal Danger Zone** — High AI Risk + Direct Tax = 14.3M workers at the intersection of disruption and revenue risk

---

## 📊 Data Sources

| Layer | Source | Type |
|-------|--------|------|
| Workforce size | PLFS 2023-24 (NSO/MoSPI) | Official GoI — hard data |
| Occupation taxonomy | NCO-2004 3-digit groups | Official GoI — hard data |
| Earnings estimates | PLFS 2023-24 sector aggregates | Official GoI — modelled ±25-35% |
| Tax contributor tiers | PLFS earnings + CBDT data | Inferred — not tax microdata |
| AI exposure scores | LLM-inferred (5 dimensions) | Estimates — clearly labelled |

> ⚠ Workforce counts are modelled distributions, not direct microdata extracts. AI scores are LLM-inferred estimates. Hard statistics from GoI sources only.

---

## 🗂 Occupation Coverage

- **622M** total workforce modelled
- **116** NCO-2004 3-digit occupation groups
- **9** major divisions (Agriculture → Services)
- **38.3M** Direct Tax contributors (6.2%)
- **262.6M** GST/Indirect contributors (42.2%)
- **320.9M** Non-contributors (51.6%)

---

## 🎛 Filters & Interactions

| Filter | What It Does |
|--------|-------------|
| **AI Risk** | High / Medium / Low exposure tiers |
| **Tax** | Direct Tax / GST-Indirect / Non-Contributor |
| **Division** | Filter by NCO major division (1–9) |
| **Formal/Informal** | Formal share above/below 50% |
| **Min Workforce** | Minimum group size slider |
| **Search** | Search by occupation name |
| **Color Metric** | Switch between 5 AI score dimensions |

Hover any tile for full occupation detail. Click to pin the card.

---

## 🏗 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript 5 |
| Visualization | D3.js 7 (squarify treemap) |
| Build | Vite 5 |
| Styling | CSS custom properties, dark theme |
| ETL | Python 3 (generates `src/data/data.json`) |
| Export | html2canvas + jsPDF |

---

## 🚀 Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

To regenerate the dataset:
```bash
cd etl
python build_dataset.py
```

---

## 📐 AI Scoring Dimensions

Each occupation is scored 0–10 across 5 dimensions:

| Dimension | What It Measures |
|-----------|-----------------|
| **AI Exposure** | Overall susceptibility to AI replacement |
| **Automation** | Routine task automation potential |
| **Human Dependency** | How much the job requires human judgment |
| **Physical Presence** | Need for on-site physical presence |
| **Future Demand** | Projected demand growth despite AI |

> All scores are LLM-inferred estimates — not from econometric models. Use for directional insight only.

---

## 📁 Project Structure

```
india-workforce-visualizer/
├── etl/
│   └── build_dataset.py        # Python ETL — generates data.json
├── src/
│   ├── data/
│   │   └── data.json           # 116 occupation groups (generated)
│   ├── components/
│   │   ├── Header.tsx          # KPI chips + fiscal bar
│   │   ├── Controls.tsx        # All filters
│   │   ├── TreemapChart.tsx    # D3 treemap
│   │   ├── HoverCard.tsx       # Occupation detail card
│   │   └── BottomBar.tsx       # Legend + export
│   ├── types/occupation.ts     # TypeScript interfaces
│   ├── utils/colorScale.ts     # Color mapping
│   ├── utils/format.ts         # Number formatters
│   └── App.tsx                 # State management
└── README.md
```

---

## 🔑 Key Insight

> **14.3 million workers** sit at the intersection of High AI Risk and Direct Tax contribution — the fiscal danger zone almost invisible in standard policy reporting.

If AI disrupts these occupations, India loses both the workers *and* the tax revenue they generate. This visualizer makes that overlap visible.

---

*Built for research and policy exploration. Not for investment or financial decisions.*
*Data: PLFS 2023-24 · NCO-2004 · CBDT Annual Reports*
