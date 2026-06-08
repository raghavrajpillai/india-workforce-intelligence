# 🇮🇳 India Workforce Intelligence Visualizer

> **An interactive policy research tool mapping AI disruption risk, tax contribution tiers, and workforce size across India's 622 million workers.**

### 🔗 [View Live → raghavrajpillai.github.io/india-workforce-intelligence](https://raghavrajpillai.github.io/india-workforce-intelligence/)

Built by [Raghavendra Chandrasekar](https://www.linkedin.com/in/raghavendrachandrasekar/) · Data: PLFS 2023-24 · NCO-2004 · CBDT Annual Reports

---

## Why This Exists

Every conversation about AI and jobs focuses on *which jobs will be lost*.

Nobody asks: **what happens to government revenue when those jobs disappear?**

This tool maps India's entire workforce against AI exposure risk — and overlays it with tax contribution data. The result reveals a structural vulnerability hiding in plain sight:

> *The workers most exposed to AI disruption are the same workers who fund the Indian state.*

---

## What You Can See

### The Treemap
Every tile is an **NCO-2004 occupation group** (116 groups total).
- **Tile size** = workforce count (larger tile = more workers)
- **Tile colour** = AI exposure score (red = high risk, green = resilient)
- **Hover** any tile to see full occupation detail
- **Click** to pin the detail card

### The Fiscal Layer
Three tax contribution tiers, filterable and visible at a glance:

| Tier | Workers | Who They Are |
|------|---------|-------------|
| 🔵 Direct Tax | 38.3M (6.2%) | Salaried professionals, corporates — pay income tax (TDS/ITR) |
| 🟡 GST/Indirect | 262.6M (42.2%) | Semi-formal workers — contribute through GST, EPFO, professional tax |
| ⚫ Non-Contributor | 320.9M (51.6%) | Informal/subsistence workers — largely outside the fiscal system |

### The State Risk Panel
20 major states ranked by AI exposure. Expands/collapses from the left edge. When a filter is active, states auto-sort by relevance — impacted states float to the top.

---

## The Numbers That Matter

| Insight | Number |
|---------|--------|
| Total workforce mapped | **622M** |
| NCO-2004 occupation groups | **116** |
| Workers at HIGH AI risk | **37.8M** |
| Workers at MEDIUM AI risk | **108M** |
| Total at medium-to-high AI risk | **~146M (1 in 4 Indians)** |
| Direct tax contributors at HIGH AI risk | **14.3M** |
| % of India's direct tax base facing high AI risk | **37.3%** |
| % of India's direct tax base at medium-to-high AI risk | **90.9%** |
| Workers at high AI risk who are outside the fiscal system | **0** |

---

## The Fiscal Danger Zone

**14.3 million workers** sit at the exact intersection of:
- ✅ High AI disruption risk
- ✅ Direct tax contributors

These are India's computing professionals, finance analysts, legal professionals, architects, and engineers. If AI displaces them:
- India loses the jobs
- India loses the tax revenue simultaneously
- The informal 320M (who are largely safe from AI) cannot replace that fiscal base

> *This overlap is almost invisible in standard policy reporting. This tool makes it visible in one click.*

---

## Filters & Interactions

| Filter | What It Does |
|--------|-------------|
| **AI Risk** | High / Medium / Low — filter by exposure tier |
| **Tax** | Direct Tax / GST-Indirect / Non-Contributor |
| **Division** | Filter by NCO major division (0–9) |
| **Formal/Informal** | Formal share above or below 50% |
| **Min Workforce** | Minimum group size slider |
| **Search** | Search by occupation name |
| **Color Metric** | Switch between 5 AI score dimensions |
| **State Panel** | Click any state to filter treemap to that state's dominant sectors |

**Keyboard:** Press `Escape` to dismiss a pinned detail card.

---

## Data Sources & Methodology

| Data Layer | Source | Classification |
|-----------|--------|----------------|
| Workforce size | PLFS 2023-24 (NSO/MoSPI) | Official GoI — hard data |
| Occupation taxonomy | NCO-2004 3-digit groups | Official GoI — hard data |
| Earnings estimates | PLFS 2023-24 sector aggregates | Official GoI — modelled ±25-35% |
| Tax contributor tiers | PLFS earnings + CBDT data | Inferred — not from tax microdata |
| AI exposure scores | LLM-inferred, 5 dimensions | Estimates — clearly labelled |
| State risk data | PLFS 2023-24 state tables | Official GoI — modelled ±30% |

> ⚠ **Important:** Workforce counts at the 3-digit group level are modelled distributions, not direct microdata extracts. AI scores are LLM-inferred estimates. All hard statistics are from official GoI sources only. This tool is for research and directional insight — not for investment or policy decisions without further validation.

---

## AI Scoring Dimensions

Each of the 116 occupation groups is scored 0–10 across five dimensions:

| Dimension | What It Measures |
|-----------|-----------------|
| **AI Exposure** | Overall susceptibility to AI replacement |
| **Automation** | Potential for routine task automation |
| **Human Dependency** | Degree of irreplaceable human judgment required |
| **Physical Presence** | Need for on-site physical presence |
| **Future Demand** | Projected demand growth despite AI |

Switch between dimensions using the **Color** dropdown in the filter bar.

---

## State Risk Rankings (20 States)

States are ranked by AI risk exposure based on their dominant economic sectors:

- **Highest risk:** Delhi (IT/Finance/Services), Karnataka (IT & Tech), Maharashtra (Finance & Industry), Telangana (IT & Pharma)
- **Lowest risk:** Bihar (Agriculture & Labour), Chhattisgarh (Agriculture & Minerals), Madhya Pradesh (Agriculture & Forestry)

When you apply a filter (e.g., Direct Tax), the panel auto-reorders — impacted states rise to the top, less-affected states dim and move below.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript 5 |
| Visualization | D3.js 7 (squarify treemap layout) |
| Build tool | Vite 5 |
| Styling | CSS custom properties, dark theme |
| ETL | Python 3 (`etl/build_dataset.py`) |
| Export | html2canvas + jsPDF |
| Hosting | GitHub Pages (auto-deploy via GitHub Actions) |

---

## Run Locally

```bash
# Clone the repo
git clone https://github.com/raghavrajpillai/india-workforce-intelligence.git
cd india-workforce-intelligence

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

**To regenerate the dataset:**
```bash
cd etl
python build_dataset.py
```
This outputs `src/data/data.json` with all 116 occupation groups, scores, and fiscal tiers.

---

## Project Structure

```
india-workforce-intelligence/
├── etl/
│   └── build_dataset.py         # Python ETL — generates data.json
├── src/
│   ├── data/
│   │   └── data.json            # 116 occupation groups (generated)
│   ├── components/
│   │   ├── Header.tsx           # KPI chips + fiscal bar + export buttons
│   │   ├── Controls.tsx         # All filter controls
│   │   ├── TreemapChart.tsx     # D3.js treemap rendering
│   │   ├── HoverCard.tsx        # Occupation detail card
│   │   ├── StatePanel.tsx       # State risk ranking panel
│   │   └── BottomBar.tsx        # Legend + author credit
│   ├── data/
│   │   └── statesData.ts        # 20 state profiles with risk metrics
│   ├── types/occupation.ts      # TypeScript interfaces
│   ├── utils/colorScale.ts      # Color mapping functions
│   ├── utils/format.ts          # Number formatters
│   └── App.tsx                  # State management + filter logic
└── README.md
```

---

## Key Policy Insights

1. **91% of India's direct taxpayers work in medium-to-high AI risk occupations.** Only 3.5M out of 38.3M direct tax contributors are in the "safe" low-risk zone.

2. **Zero non-contributors face high AI risk.** Every single high-risk worker is a taxpayer — AI is targeting India's fiscal base, not its informal economy.

3. **The informal 320M are largely AI-resilient** — but they also contribute nothing to the direct tax system. They cannot offset the fiscal impact of displacing formal workers.

4. **14.3M workers are in the fiscal danger zone** — high AI risk + direct tax contributors. Disrupting them = losing jobs and tax revenue simultaneously.

5. **Delhi, Karnataka, Maharashtra, Telangana** are the most fiscally vulnerable states — highest concentration of high-risk, high-tax workers.

---

## Contributing

Pull requests welcome. If you have access to PLFS microdata or state-level NCO-2004 breakdowns that could improve the accuracy of workforce distributions, please open an issue.

---

*Built for research and policy exploration. Not for investment or financial decisions.*
*Data: PLFS 2023-24 · NCO-2004 · CBDT Annual Reports · © Government of India*
