// =============================================================================
// Egyptian Pharmacist AI - Comprehensive Learning Content
// Extracted from 35 pharmacy reference PDFs
// =============================================================================

export const LEARNING_SECTIONS = [
  // SECTION 1: DRUG NAMING CONVENTIONS
  {
    id: 'drug-naming',
    title: 'تقنيات التعرف على الأدوية',
    titleEn: 'Drug Naming Conventions',
    icon: '💊',
    subsections: [
      {
        title: 'لاحقات أسماء الأدوية',
        titleEn: 'Drug Suffix Recognition Chart',
        content: `## Drug Suffix Recognition Chart

| Suffix | Drug Class | Example |
|--------|-----------|---------|
| **-profen** | NSAIDs | Ibuprofen |
| **-olol** | Beta-Blockers | Atenolol |
| **-pril** | ACE Inhibitors | Enalapril |
| **-sartan** | ARBs | Losartan |
| **-dipine** | CCBs | Amlodipine |
| **-statin** | HMG-CoA Inhibitors | Atorvastatin |
| **-cillin** | Penicillins | Amoxicillin |
| **-floxacin** | Fluoroquinolones | Ciprofloxacin |
| **-azole** | Antifungals | Metronidazole |
| **-prazole** | PPIs | Omeprazole |
| **-tidine** | H2 Blockers | Ranitidine |
| **-lone** | Corticosteroids | Prednisolone |
| **-mycin** | Macrolides | Erythromycin |
| **-lactam** | Beta-lactams | Ceftriaxone |
| **-zepam** | Benzodiazepines | Diazepam |
| **-pine** | Atypical Antipsychotics | Quetiapine |
| **-done** | Opioid Analgesics | Tramadol |

### Key Points
- **-olol** → always Beta-Blockers (حاصرات بيتا)
- **-pril** → always ACE Inhibitors
- **-sartan** → always ARBs
- **-dipine** → always CCBs
- **-statin** → always cholesterol-lowering
- **-cillin** → always Penicillins
- **-floxacin** → always Fluoroquinolones`
      },
      {
        title: 'الأسماء التجارية والمكافئة الدوائية',
        titleEn: 'Common Brand-Generic Pairs',
        content: `## Common Brand-Generic Pairs in Egypt

### Analgesics
| Brand | Generic | Class |
|-------|---------|-------|
| Panadol | Paracetamol | Simple Analgesic |
| Brufen | Ibuprofen | NSAID |
| Voltaren | Diclofenac | NSAID |
| Cataflam | Diclofenac Potassium | NSAID |
| Celebrex | Celecoxib | COX-2 Selective |
| Tramal | Tramadol | Opioid |
| Nobfen | Naproxen | NSAID |
| Mobic | Meloxicam | NSAID |

### GIT Drugs
| Brand | Generic | Class |
|-------|---------|-------|
| Losec/Omez | Omeprazole | PPI |
| Nexium | Esomeprazole | PPI |
| Pantop/Pantoloc | Pantoprazole | PPI |
| Zantac | Ranitidine | H2 Blocker |
| Buscopan | Hyoscine Butylbromide | Antispasmodic |
| Maxolon | Metoclopramide | Prokinetic |
| Motilium | Domperidone | Prokinetic |
| Imodium | Loperamide | Antidiarrheal |
| Colofac | Mebeverine | Antispasmodic |
| Flagyl | Metronidazole | Antibiotic |
| Pylores | Bismuth Subcitrate | H. pylori |

### Cardiovascular
| Brand | Generic | Class |
|-------|---------|-------|
| Concor | Bisoprolol | Beta-Blocker |
| Inderal | Propranolol | Beta-Blocker |
| Lopressor | Metoprolol | Beta-Blocker |
| Lorista | Losartan | ARB |
| Diovan | Valsartan | ARB |
| Norvasc | Amlodipine | CCB |
| Adalat | Nifedipine | CCB |
| Coversyl | Perindopril | ACE Inhibitor |
| Renitec | Enalapril | ACE Inhibitor |
| Ramilich | Ramipril | ACE Inhibitor |
| Lipitor | Atorvastatin | Statin |
| Crestor | Rosuvastatin | Statin |
| Zocor | Simvastatin | Statin |
| Coumadin | Warfarin | Anticoagulant |
| Plavix | Clopidogrel | Antiplatelet |
| Aspocard | Aspirin | Antiplatelet |

### Antibiotics
| Brand | Generic | Class |
|-------|---------|-------|
| Amoxil | Amoxicillin | Penicillin |
| Augmentin | Amox+Clavulanate | Penicillin+BLI |
| Keflex | Cephalexin | 1st Gen Cephalosporin |
| Rocephin | Ceftriaxone | 3rd Gen Cephalosporin |
| Zinnat | Cefuroxime | 2nd Gen Cephalosporin |
| Zithromax | Azithromycin | Macrolide |
| Klaricid | Clarithromycin | Macrolide |
| Ciproxin | Ciprofloxacin | Fluoroquinolone |
| Levaquin | Levofloxacin | Fluoroquinolone |
| Tavanic | Levofloxacin | Fluoroquinolone |
| Avelox | Moxifloxacin | Fluoroquinolone |
| Diflucan | Fluconazole | Antifungal |
| Nizoral | Ketoconazole | Antifungal |
| Lamisil | Terbinafine | Antifungal |
| Zovirax | Acyclovir | Antiviral |
| Tamiflu | Oseltamivir | Antiviral |

### Diabetes
| Brand | Generic | Class |
|-------|---------|-------|
| Glucophage | Metformin | Biguanide |
| Daonil | Glibenclamide | Sulfonylurea |
| Amaryl | Glimepiride | Sulfonylurea |
| Diamicron | Gliclazide | Sulfonylurea |
| Januvia | Sitagliptin | DPP-4 Inhibitor |
| Galvus | Vildagliptin | DPP-4 Inhibitor |
| Jardiance | Empagliflozin | SGLT2 Inhibitor |
| Forxiga | Dapagliflozin | SGLT2 Inhibitor |
| Ozempic | Semaglutide | GLP-1 Agonist |
| Victoza | Liraglutide | GLP-1 Agonist |

### Respiratory
| Brand | Generic | Class |
|-------|---------|-------|
| Ventolin | Salbutamol | SABA |
| Berodual | Ipratropium+Salbutamol | Comb bronchodilator |
| Seretide | Fluticasone+Salmeterol | ICS+LABA |
| Symbicort | Budesonide+Formoterol | ICS+LABA |
| Pulmicort | Budesonide | ICS |
| Flixotide | Fluticasone | ICS |
| Singulair | Montelukast | LTRA |
| Spiriva | Tiotropium | LAMA |

### Psychiatric
| Brand | Generic | Class |
|-------|---------|-------|
| Prozac | Fluoxetine | SSRI |
| Cipramil | Citalopram | SSRI |
| Lustral | Sertraline | SSRI |
| Efexor | Venlafaxine | SNRI |
| Cymbalta | Duloxetine | SNRI |
| Tofranil | Imipramine | TCA |
| Anafranil | Clomipramine | TCA |
| Valium | Diazepam | Benzodiazepine |
| Xanax | Alprazolam | Benzodiazepine |
| Rivotril | Clonazepam | Benzodiazepine |
| Lexotan | Bromazepam | Benzodiazepine |
| Depakene | Valproic Acid | Anticonvulsant |
| Tegretol | Carbamazepine | Anticonvulsant |
| Lamictal | Lamotrigine | Anticonvulsant |
| Risperdal | Risperidone | Antipsychotic |
| Seroquel | Quetiapine | Antipsychotic |
| Aricept | Donepezil | Alzheimer's Drug |`
      }
    ]
  },

  // SECTION 2: GIT DRUGS
  {
    id: 'git-drugs',
    title: 'أدوية الجهاز الهضمي',
    titleEn: 'GIT Drugs',
    icon: '🫁',
    subsections: [
      {
        title: 'مثبطات مضخة البروتون',
        titleEn: 'Proton Pump Inhibitors (PPIs)',
        content: `## Proton Pump Inhibitors (PPIs)

**Mechanism:** Irreversibly inhibit H+/K+ ATPase on parietal cells

| Drug | Brand (Egypt) | Dose | Notes |
|------|--------------|------|-------|
| Omeprazole | Losec, Omez | 20-40mg OD | Most prescribed |
| Esomeprazole | Nexium | 20-40mg OD | Better bioavailability |
| Pantoprazole | Pantop, Pantoloc | 40mg OD | Fewer drug interactions |
| Lansoprazole | Lanston | 15-30mg OD | Rapid onset |
| Rabeprazole | Pariet | 20mg OD | Less CYP2C19 dependent |

### Indications
- GERD (الارتجاع المعدي المريئي)
- Peptic ulcer disease (القرحة الهضمية)
- H. pylori eradication (القضاء على هيليكوباكتر)
- Zollinger-Ellison syndrome
- NSAID-induced ulcer prophylaxis

### Side Effects
- Headache, Diarrhea/Constipation
- Hypomagnesemia (long term)
- Vitamin B12 deficiency
- Increased C. difficile risk
- Bone fractures (long term)

### Clinical Pearls
- Take 30-60 min before breakfast
- Do not crush enteric-coated capsules
- Long-term: monitor Mg2+, B12, Ca2+
- PPIs reduce absorption of ketoconazole, iron, B12
- Pantoprazole preferred with drug interactions
- 8-week course for GERD, 14 days for H. pylori`
      },
      {
        title: 'حاصرات H2',
        titleEn: 'H2 Receptor Antagonists',
        content: `## H2 Receptor Antagonists

**Mechanism:** Block H2 receptors on parietal cells

| Drug | Brand (Egypt) | Dose |
|------|--------------|------|
| Ranitidine | Zantac, Histac | 150mg BD or 300mg HS |
| Cimetidine | Tagamet | 400mg BD or 800mg HS |
| Famotidine | Pepcid | 20mg BD or 40mg HS |
| Nizatidine | Axid | 150mg BD |

### Notes
- Ranitidine recalled in many countries (NDMA contamination)
- Cimetidine: most drug interactions (CYP450 inhibitor)
- Famotidine: now preferred H2 blocker
- Less potent than PPIs`
      },
      {
        title: 'المخادات والمضادات للتشنجات المعوية',
        titleEn: 'Antacids & Antispasmodics',
        content: `## Antacids

| Drug | Brand | Dose |
|------|-------|------|
| Aluminum+Magnesium Hydroxide | Maalox, Mylanta | 10-20ml TID |
| Calcium Carbonate | Tums | 500-1500mg PRN |
| Sodium Bicarbonate | - | 0.5-1g |
| Magaldrate | Riopan | 5-10ml TID |

- Aluminum hydroxide → Constipation
- Magnesium hydroxide → Diarrhea
- Separate from other drugs by 2 hours

---

## Antispasmodics

| Drug | Brand | Dose |
|------|-------|------|
| Hyoscine Butylbromide | Buscopan | 10-20mg TID |
| Mebeverine | Colofac, Duspatal | 135mg TID |
| Dicyclomine | Bentyl | 10-20mg TID |
| Drotaverine | No-Spa | 40-80mg TID |
| Hyoscine+Paracetamol | Buscopan Compound | 1-2 tabs TID |

### Indications
- IBS (القولون العصبي)
- Colicky abdominal pain, Biliary colic, Renal colic

### Pearls
- Buscopan: does NOT cross BBB → fewer CNS effects
- Mebeverine: well tolerated, preferred for IBS
- Avoid anticholinergics in glaucoma and urinary retention`
      },
      {
        title: 'المضادات للقيء والمحفّزات الحركية',
        titleEn: 'Antiemetics & Prokinetics',
        content: `## Antiemetics

| Drug | Brand | Dose | Mechanism |
|------|-------|------|-----------|
| Metoclopramide | Maxolon, Plasil | 10mg TID | D2+5-HT3 antagonist |
| Domperidone | Motilium | 10mg TID | D2 antagonist (peripheral) |
| Ondansetron | Zofran | 4-8mg TID | 5-HT3 antagonist |
| Granisetron | Kytril | 1mg BD | 5-HT3 antagonist |
| Dimenhydrinate | Dramamine | 50mg TID | Antihistamine |
| Promethazine | Phenergan | 25mg HS | Antihistamine |

### Scenarios
- **Chemo-induced:** Ondansetron + Dexamethasone + Aprepitant
- **Post-op:** Ondansetron 4mg IV
- **Morning sickness:** Doxylamine + Pyridoxine
- **Motion sickness:** Dimenhydrinate or Scopolamine patch

### Prokinetics
| Drug | Mechanism |
|------|-----------|
| Metoclopramide | D2 antagonist + 5-HT4 agonist |
| Domperidone | D2 antagonist |
| Erythromycin | Motilin agonist (short term) |

### Pearls
- Metoclopramide: max 3 months (EPS risk)
- Domperidone: avoid with CYP3A4 inhibitors`
      },
      {
        title: 'المسهّلات ومضادات الإسهال',
        titleEn: 'Laxatives & Antidiarrheals',
        content: `## Laxatives

| Class | Drug | Dose |
|-------|------|------|
| Bulk-forming | Psyllium | 1-2 tsp daily |
| Osmotic | Lactulose | 15-30ml HS |
| Osmotic | PEG (Miralax) | 17g in water |
| Stimulant | Bisacodyl | 5-10mg HS |
| Stimulant | Senna | 1-2 tabs HS |
| Stool softener | Docusate | 100mg BD |

---

## Antidiarrheals

| Drug | Brand | Dose |
|------|-------|------|
| Loperamide | Imodium | 2-4mg, max 16mg/day |
| Diphenoxylate+Atropine | Lomotil | 2.5-5mg TID |
| Bismuth Subsalicylate | Pepto-Bismol | 30-60ml QID |
| Racecadotril | Hidrasec | 100mg TID |
| Saccharomyces boulardii | Ultra-Levure | 250-500mg BID |

### Pearls
- ORS is FIRST LINE for infectious diarrhea
- Loperamide: does NOT cross BBB
- Rule out C. difficile before antimotility agents`
      },
      {
        title: 'أدوية قرحة المعدة والقولون وهيليكوباكتر',
        titleEn: 'IBD Drugs & H. pylori Eradication',
        content: `## IBD - Ulcerative Colitis
| Drug | Dose |
|------|------|
| Mesalazine (5-ASA) | 1-4g/day |
| Sulfasalazine | 2-6g/day |
| Prednisolone | 40-60mg taper |
| Azathioprine | 2-2.5mg/kg |
| Infliximab | 5mg/kg IV |

## Crohn's Disease
- Budesonide (Entocort): ileal/right colon
- Metronidazole: perianal disease
- Infliximab: fistulizing

## H. pylori Triple Therapy (14 days)
| Drug | Dose |
|------|------|
| PPI (Omeprazole) | 20mg BD |
| Amoxicillin | 1g BD |
| Clarithromycin | 500mg BD |
| OR Metronidazole | 500mg BD |

## Bismuth Quadruple (14 days)
PPI + Bismuth 120mg QID + Metronidazole + Tetracycline

### Pearls
- Confirm eradication 4 weeks after treatment
- 14 days > 7 days for triple therapy
- Always use PPI with antibiotics`
      }
    ]
  },

  // SECTION 3: CARDIOVASCULAR DRUGS
  {
    id: 'cardiovascular-drugs',
    title: 'أدوية القلب والأوعية الدموية',
    titleEn: 'Cardiovascular Drugs',
    icon: '❤️',
    subsections: [
      {
        title: 'حاصرات بيتا',
        titleEn: 'Beta-Blockers',
        content: `## Beta-Blockers

| Selectivity | Drug | Dose |
|-------------|------|------|
| Non-selective | Propranolol | 40-320mg/day |
| Non-selective | Nadolol | 40-320mg OD |
| B1-selective | Atenolol | 50-100mg OD |
| B1-selective | Metoprolol | 50-200mg OD/BD |
| B1-selective | Bisoprolol | 2.5-20mg OD |
| B1-selective | Nebivolol | 5-40mg OD |
| Combined a+b | Carvedilol | 6.25-50mg BD |
| Combined a+b | Labetalol | 100-400mg BD |

### Indications
- Hypertension, Angina, Heart failure (bisoprolol, carvedilol, metoprolol succinate)
- Post-MI, Arrhythmias, Thyrotoxicosis

### Side Effects
- Bradycardia, Hypotension, Fatigue, Cold extremities
- Bronchospasm (non-selective), Depression
- Masking hypoglycemia symptoms

### Contraindications
- Severe bradycardia, 2nd/3rd degree AV block
- Decompensated heart failure, Asthma/Severe COPD

### Pearls
- NEVER stop abruptly (taper over 1-2 weeks)
- Bisoprolol: most selective B1 blocker
- Carvedilol: preferred in heart failure`
      },
      {
        title: 'حاصرات ACE و ARBs',
        titleEn: 'ACE Inhibitors & ARBs',
        content: `## ACE Inhibitors

| Drug | Brand | Dose |
|------|-------|------|
| Enalapril | Renitec | 5-40mg OD/BD |
| Ramipril | Tritace | 2.5-20mg OD |
| Perindopril | Coversyl | 4-16mg OD |
| Lisinopril | Sinopril | 5-40mg OD |
| Captopril | - | 25-150mg TID |

### Side Effects
- Dry cough (10-15%, from bradykinin)
- Hyperkalemia, Hypotension (first dose)
- Angioedema (rare), Teratogenic

### Contraindications
- Pregnancy (Category D), Bilateral renal artery stenosis
- Angioedema history, Hyperkalemia >5.5

---

## ARBs

| Drug | Brand | Dose |
|------|-------|------|
| Losartan | Cozaar, Lorista | 25-100mg OD |
| Valsartan | Diovan | 80-320mg OD |
| Irbesartan | Aprovel | 150-300mg OD |
| Candesartan | Atacand | 4-32mg OD |
| Telmisartan | Micardis | 20-80mg OD |

### ARB Advantages
- NO dry cough, lower angioedema risk

### Pearls
- ACE+ARB: do NOT combine (hyperkalemia, renal failure)
- Losartan: uricosuric effect (useful in gout)
- Ramipril: strongest evidence (HOPE trial)`
      },
      {
        title: 'حاصرات قنوات الكالسيوم',
        titleEn: 'Calcium Channel Blockers',
        content: `## Dihydropyridines (Vascular)

| Drug | Brand | Dose |
|------|-------|------|
| Amlodipine | Norvasc | 2.5-10mg OD |
| Nifedipine SR | Adalat SR | 20-90mg BD |
| Felodipine | Plendil | 5-10mg OD |
| Lercanidipine | Zanidip | 10-20mg OD |

## Non-dihydropyridines (Cardiac)

| Drug | Brand | Dose |
|------|-------|------|
| Verapamil | Isoptin | 120-480mg/day |
| Diltiazem | Cardizem | 120-360mg/day |

### Side Effects
- Peripheral edema (amlodipine)
- Constipation (verapamil)
- Reflex tachycardia (nifedipine IR)

### Contraindications
- Heart failure (verapamil, diltiazem)
- Sick sinus syndrome, 2nd/3rd AV block

### Pearls
- Amlodipine: safest in heart failure (PRAISE trial)
- NEVER use nifedipine immediate release
- CCBs preferred in elderly`
      },
      {
        title: 'المدرات والمضادات للتخثر',
        titleEn: 'Diuretics & Anticoagulants',
        content: `## Loop Diuretics
| Drug | Brand | Dose |
|------|-------|------|
| Furosemide | Lasix | 40-500mg OD/BD |
| Bumetanide | Burinex | 0.5-5mg OD |
| Torsemide | Demadex | 10-20mg OD |

## Thiazide Diuretics
| Drug | Brand | Dose |
|------|-------|------|
| Hydrochlorothiazide | Esidrix | 12.5-50mg OD |
| Indapamide | Natrilix | 1.5-2.5mg OD |

## Potassium-Sparing
| Drug | Dose |
|------|------|
| Spironolactone | 25-100mg OD |
| Eplerenone | 25-50mg OD |

---

## Anticoagulants

| Drug | Brand | Dose | Monitoring |
|------|-------|------|------------|
| Warfarin | Coumadin | 1-10mg OD | INR (2-3) |
| Heparin (UFH) | - | IV | aPTT |
| Enoxaparin | Clexane | 1mg/kg SC BD | Anti-Xa |
| Rivaroxaban | Xarelto | 10-20mg OD | None |
| Apixaban | Eliquis | 2.5-5mg BD | None |
| Dabigatran | Pradaxa | 150mg BD | None |

### Warfarin Interactions
- ↑ INR: Amiodarone, Fluconazole, Metronidazole, NSAIDs
- ↓ INR: Rifampicin, Carbamazepine, Phenytoin

### Pearls
- DOACs preferred for non-valvular AF
- Warfarin antidote: Vitamin K (slow), PCC (rapid)`
      },
      {
        title: 'مضادات الصفيحات والذهاب والخافضات للكوليسترول',
        titleEn: 'Antiplatelets, Antianginals & Statins',
        content: `## Antiplatelets
| Drug | Brand | Dose |
|------|-------|------|
| Aspirin | Aspocard | 75-325mg OD |
| Clopidogrel | Plavix | 75mg OD |
| Ticagrelor | Brilinta | 90mg BD |

---

## Antianginals
| Drug | Class | Dose |
|------|-------|------|
| Nitroglycerin (GTN) | Nitrate | 0.4mg SL PRN |
| Isosorbide dinitrate | Nitrate | 5-40mg TID |
| Isosorbide-5-MN | Nitrate | 10-40mg BD |
| Ranolazine | Late Na+ inhibitor | 375-750mg BD |
| Trimetazidine | Metabolic agent | 20mg TID |

### Pearls
- GTN: drug-free interval (8-12h) to prevent tolerance
- PDE5 inhibitors + nitrates = CONTRAINDICATED

---

## Statins
| Drug | Brand | Dose |
|------|-------|------|
| Atorvastatin | Lipitor | 10-80mg |
| Rosuvastatin | Crestor | 5-40mg |
| Simvastatin | Zocor | 10-80mg |
| Pravastatin | Pravachol | 10-80mg |

### Side Effects
- Myalgia, Hepatotoxicity, Rhabdomyolysis (rare)

### Pearls
- Take evening (except atorvastatin/rosuvastatin)
- Simvastatin: avoid with amiodarone/verapamil
- High-intensity: atorvastatin 40-80mg or rosuvastatin 20-40mg
- Target LDL < 70 mg/dL for high-risk`
      }
    ]
  },

  // SECTION 4: ANTIBIOTICS
  {
    id: 'antibiotics',
    title: 'المضادات الحيوية',
    titleEn: 'Antibiotics',
    icon: '🦠',
    subsections: [
      {
        title: 'البنسلينات والسفالوسبورينات',
        titleEn: 'Penicillins & Cephalosporins',
        content: `## Penicillins

### Natural
| Drug | Dose |
|------|------|
| Penicillin G | IM/IV |
| Penicillin V | 250-500mg TID PO |

### Aminopenicillins
| Drug | Brand | Dose |
|------|-------|------|
| Amoxicillin | Amoxil | 250-1000mg TID |
| Ampicillin | - | 250-500mg QID |

### With Beta-Lactamase Inhibitor
| Drug | Brand | Dose |
|------|-------|------|
| Amox+Clavulanate | Augmentin | 625mg TID or 1g BD |
| Amp+Sulbactam | Unasyn | 1.5-3g IV QID |
| Pip+Tazobactam | Tazocin | 4.5g IV TID |

---

## Cephalosporins

| Gen | Drug | Brand | Spectrum |
|-----|------|-------|----------|
| 1st | Cephalexin | Keflex | Gram+ |
| 1st | Cefazolin | - | Surgical prophylaxis |
| 2nd | Cefuroxime | Zinnat | Gram+, some Gram- |
| 3rd | Ceftriaxone | Rocephin | Broad, once daily |
| 3rd | Cefixime | Suprax | Oral 3rd gen |
| 4th | Cefepime | - | Anti-pseudomonal |

### Pearls
- Augmentin: take with food
- Ceftriaxone: most versatile, do NOT mix calcium IV
- Cross-reactivity with PCN: ~1-2%`
      },
      {
        title: 'المacrolides والفلوروكوينولونات',
        titleEn: 'Macrolides & Fluoroquinolones',
        content: `## Macrolides

| Drug | Brand | Dose |
|------|-------|------|
| Erythromycin | Mycin | 250-500mg QID |
| Azithromycin | Zithromax | 500mg day 1 then 250mg x4 |
| Clarithromycin | Klaricid | 250-500mg BD |

- GI upset, QT prolongation
- Clarithromycin: CYP3A4 inhibitor (many interactions)
- Azithromycin: 3-day course for CAP

---

## Fluoroquinolones

| Drug | Brand | Dose |
|------|-------|------|
| Ciprofloxacin | Ciproxin | 250-750mg BD |
| Levofloxacin | Levaquin/Tavanic | 250-750mg OD |
| Moxifloxacin | Avelox | 400mg OD |

- BLACK BOX: Tendinitis/Tendon rupture
- Avoid in: Myasthenia gravis, Pregnancy/children <18
- Cipro: UTI, Pseudomonas; Levo: respiratory; Moxy: broadest
- Take with water, avoid dairy/antacids`
      },
      {
        title: 'Tetracyclines, Aminoglycosides & Carbapenems',
        titleEn: 'Tetracyclines, Aminoglycosides & Carbapenems',
        content: `## Tetracyclines
| Drug | Brand | Dose |
|------|-------|------|
| Doxycycline | Doryx | 100mg BD-OD |
| Tetracycline | Sumycin | 250-500mg QID |

- Contraindicated: Pregnancy, Children <8 (teeth staining)
- Doxycycline: safe in renal impairment

---

## Aminoglycosides
| Drug | Brand | Dose |
|------|-------|------|
| Gentamicin | Garamycin | 3-5mg/kg OD |
| Amikacin | Amikin | 15mg/kg OD |

- TDM required (narrow therapeutic index)
- Nephrotoxicity, Ototoxicity
- Synergistic with beta-lactams

---

## Carbapenems
| Drug | Brand | Dose |
|------|-------|------|
| Imipenem+Cilastatin | Tienam | 500mg-1g QID |
| Meropenem | Meronem | 1-2g TID |
| Ertapenem | Invanz | 1g OD |

- Reserve for MDR organisms
- Meropenem: lower seizure risk than imipenem`
      },
      {
        title: 'المضادات الفطرية والفيروسية',
        titleEn: 'Antifungals & Antivirals',
        content: `## Antifungals
| Drug | Brand | Dose |
|------|-------|------|
| Fluconazole | Diflucan | 100-400mg OD |
| Itraconazole | Sporanox | 100-200mg BD |
| Terbinafine | Lamisil | 250mg OD |
| Nystatin | - | Oral suspension |
| Amphotericin B | - | IV |

- Fluconazole 150mg single dose for vaginal candidiasis
- Terbinafine: nail dermatophyte infections
- Amphotericin: monitor K+, Mg2+, creatinine

---

## Antivirals
| Drug | Brand | Dose | Virus |
|------|-------|------|-------|
| Acyclovir | Zovirax | 200-800mg 5x/day | HSV, VZV |
| Valacyclovir | Valtrex | 500mg-1g BD | HSV, VZV |
| Oseltamivir | Tamiflu | 75mg BD x5d | Influenza |
| Sofosbuvir | Sovaldi | 400mg OD | HCV |

- Acyclovir: drink plenty of water
- Oseltamivir: within 48h of symptom onset`
      }
    ]
  },

  // SECTION 5: ANALGESICS & PAIN
  {
    id: 'analgesics-pain',
    title: 'المسكنات وإدارة الألم',
    titleEn: 'Analgesics & Pain Management',
    icon: '🩹',
    subsections: [
      {
        title: 'باراسيتامول ومضادات الالتهاب',
        titleEn: 'Paracetamol & NSAIDs',
        content: `## Paracetamol (Acetaminophen)

| Population | Dose | Max |
|------------|------|-----|
| Adults | 500-1000mg QID | 4g/day |
| Elderly | 500mg QID | 2g/day |
| Children | 10-15mg/kg QID | - |

- First-line analgesic, safe in pregnancy/children
- NAC (Acetylcysteine): antidote for overdose
- Max 2g/day in liver disease

---

## NSAIDs (Non-Selective)
| Drug | Brand | Dose |
|------|-------|------|
| Ibuprofen | Brufen | 200-400mg TID |
| Diclofenac | Voltaren | 25-75mg TID |
| Naproxen | Nobfen | 250-500mg BD |
| Piroxicam | Feldene | 20mg OD |
| Ketorolac | Toradol | 10mg QID (max 5d) |

## COX-2 Selective
| Drug | Brand | Dose |
|------|-------|------|
| Celecoxib | Celebrex | 100-200mg BD |
| Etoricoxib | Arcoxia | 60-120mg OD |

### Side Effects (All NSAIDs)
- GI ulceration/bleeding, Renal injury
- CV risk, Platelet inhibition

### Contraindications
- Active ulcer, Severe renal impairment
- 3rd trimester pregnancy, CABG`
      },
      {
        title: 'الأفيونات',
        titleEn: 'Opioids',
        content: `## Opioid Analgesics

| Drug | Brand | Dose | Potency |
|------|-------|------|---------|
| Codeine | - | 15-60mg QID | Low |
| Tramadol | Tramal | 50-100mg QID | Weak-Moderate |
| Oxycodone | OxyContin | 5-20mg Q4-6H | Moderate-High |
| Morphine | - | 2-10mg Q4H | High |
| Fentanyl | - | 25-100mcg/hr patch | Very High |

### Tramadol
- Weak mu-opioid + SNRI
- Max 400mg/day, seizure risk, serotonin syndrome with SSRIs

### Side Effects
- Constipation (most common, no tolerance)
- Respiratory depression (most dangerous)
- Nausea, Sedation, Urinary retention

### Antagonists
- Naloxone 0.4-2mg IV: overdose reversal

### Pearls
- NEVER combine opioids + benzodiazepines
- Constipation prophylaxis: docusate + senna`
      },
      {
        title: 'مرخيات العضلات وأدوية الصداع والنقرس',
        titleEn: 'Muscle Relaxants, Migraine & Gout',
        content: `## Muscle Relaxants
| Drug | Brand | Dose |
|------|-------|------|
| Tizanidine | Sirdalud | 2-4mg TID |
| Baclofen | Lioresal | 5-20mg TID |
| Thiocolchicoside | Muscoril | 4-8mg BD |

- Short-term only (2-3 weeks)
- Baclofen: taper to avoid withdrawal seizures

---

## Migraine - Acute
| Drug | Dose |
|------|------|
| Sumatriptan | 50-100mg PO or 6mg SC |
| Rizatriptan | 5-10mg PO |
| Paracetamol | 1g PO |
| Ibuprofen | 400-600mg PO |

## Migraine - Prophylaxis
| Drug | Dose |
|------|------|
| Propranolol | 40-160mg/day (first-line) |
| Topiramate | 25-100mg BD |
| Amitriptyline | 10-75mg HS |

- Triptans: avoid in CV disease

---

## Gout - Acute
| Drug | Dose |
|------|------|
| Colchicine | 0.5mg 1-2hrly then BD |
| Indomethacin | 50mg TID |

## Gout - Chronic
| Drug | Dose |
|------|------|
| Allopurinol | 100-300mg OD (start low, go slow) |
| Febuxostat | 80-120mg OD |

- NEVER start allopurinol during acute attack
- Prophylaxis with colchicine when starting`
      },
      {
        title: 'أدوية الألم العصبي',
        titleEn: 'Neuropathic Pain Drugs',
        content: `## Neuropathic Pain

| Drug | Brand | Dose |
|------|-------|------|
| Pregabalin | Lyrica | 75-300mg BD |
| Gabapentin | Neurontin | 300-800mg TID |
| Duloxetine | Cymbalta | 30-60mg OD |
| Amitriptyline | - | 10-75mg HS |
| Carbamazepine | Tegretol | 200-400mg BD |

### Pearls
- Carbamazepine: GOLD STANDARD for trigeminal neuralgia
- Pregabalin: faster onset than gabapentin
- Duloxetine: first-line for diabetic neuropathy
- Combine agents for refractory pain`
      }
    ]
  },

  // SECTION 6: RESPIRATORY DRUGS
  {
    id: 'respiratory-drugs',
    title: 'أدوية الجهاز التنفسي',
    titleEn: 'Respiratory Drugs',
    icon: '🫁',
    subsections: [
      {
        title: 'الموسعات القصبية',
        titleEn: 'Bronchodilators',
        content: `## SABA (Short-Acting)
| Drug | Brand | Dose |
|------|-------|------|
| Salbutamol | Ventolin | 100-200mcg PRN |
| Terbutaline | Bricanyl | 250-500mcg PRN |

## LABA (Long-Acting)
| Drug | Brand | Dose |
|------|-------|------|
| Salmeterol | - | 50mcg BD |
| Formoterol | - | 12-24mcg BD |
| Indacaterol | - | 150-300mcg OD |

## Anticholinergics
| Drug | Brand | Type | Dose |
|------|-------|------|------|
| Ipratropium | Atrovent | SAMA | 20-40mcg QID |
| Tiotropium | Spiriva | LAMA | 18mcg OD |

## Combinations
| Drug | Components |
|------|------------|
| Berodual | Ipratropium+Salbutamol |
| Seretide | Fluticasone+Salmeterol |
| Symbicort | Budesonide+Formoterol |

### Pearls
- SABA: rescue only; overuse = poor control
- LABA: NEVER monotherapy in asthma
- Rinse mouth after ICS`
      },
      {
        title: 'الستيرويدات الاستنشاقية',
        titleEn: 'Inhaled Corticosteroids',
        content: `## ICS

| Drug | Brand | Dose Range |
|------|-------|------------|
| Beclomethasone | Becotide | 100-800mcg/day |
| Budesonide | Pulmicort | 200-1600mcg/day |
| Fluticasone | Flixotide | 100-1000mcg/day |
| Ciclesonide | - | 80-320mcg/day |

### Side Effects
- Oral candidiasis (thrush) - use spacer + rinse
- Dysphonia, Bruising (long term high dose)

## SMART Therapy
- Symbicort as maintenance AND reliever
- 200/6mcg: 1-2 inh BID + 1-2 PRN (max 8/day)

### Pearls
- Take ICS after bronchodilator
- ALWAYS rinse mouth after ICS`
      },
      {
        title: 'مضادات اللوكوترين والثيوفيلين',
        titleEn: 'Leukotriene Antagonists & Theophylline',
        content: `## LTRA
| Drug | Brand | Dose |
|------|-------|------|
| Montelukast | Singulair | 10mg OD |
| Zafirlukast | Accolate | 20mg BD |

- LESS effective than ICS
- ADD-ON for moderate asthma
- FDA black box: neuropsychiatric effects

---

## Theophylline

| Drug | Brand | Dose |
|------|-------|------|
| Theophylline | Eryphyl | 300-600mg BD |
| Aminophylline | - | 100-200mg TID |

- Therapeutic range: 10-20 mcg/mL
- CYP1A2 metabolized; smoking increases clearance
- Ciprofloxacin/erythromycin: toxic levels
- Narrow therapeutic index`
      }
    ]
  },

  // SECTION 7: ENDOCRINE & DIABETES
  {
    id: 'endocrine-diabetes',
    title: 'الغدد الصماء والسكري',
    titleEn: 'Endocrine & Diabetes',
    icon: '💉',
    subsections: [
      {
        title: 'أنواع الأنسولين',
        titleEn: 'Insulin Types',
        content: `## Rapid-Acting
| Insulin | Brand | Onset | Peak | Duration |
|---------|-------|-------|------|----------|
| Lispro | Humalog | 15min | 1-2h | 3-5h |
| Aspart | NovoRapid | 15min | 1-2h | 3-5h |
| Glulisine | Apidra | 15min | 1-2h | 3-5h |

## Short-Acting
| Insulin | Brand | Onset | Peak | Duration |
|---------|-------|-------|------|----------|
| Regular | Actrapid | 30min | 2-4h | 6-8h |

## Intermediate-Acting
| Insulin | Brand | Onset | Peak | Duration |
|---------|-------|-------|------|----------|
| NPH | Humulin N | 2-4h | 4-10h | 12-18h |

## Long-Acting
| Insulin | Brand | Onset | Peak | Duration |
|---------|-------|-------|------|----------|
| Glargine | Lantus | 1-2h | Peakless | 24h |
| Detemir | Levemir | 1-2h | 8-12h | 18-24h |
| Degludec | Tresiba | 1-2h | Peakless | 42h |

## Pre-mixed
| Insulin | Composition |
|---------|-------------|
| NovoMix 30 | 30% Aspart + 70% Aspart protamine |
| Mixtard 30 | 30% Regular + 70% NPH |

### Pearls
- Glargine: NEVER mix with other insulins
- NPH: roll (not shaken) before use
- Opened insulin: room temp 28 days`
      },
      {
        title: 'الأدوية الفموية للسكري',
        titleEn: 'Oral Hypoglycemics',
        content: `## Metformin (Biguanide)
| Brand | Dose |
|-------|------|
| Glucophage | 500mg BD → max 2550mg/day |

- FIRST-LINE for T2DM
- GI side effects, Lactic acidosis (rare)
- Contraindicated: eGFR <30, contrast dye

---

## Sulfonylureas
| Drug | Brand | Dose |
|------|-------|------|
| Glibenclamide | Daonil | 2.5-20mg/day |
| Gliclazide | Diamicron | 40-320mg/day |
| Glimepiride | Amaryl | 1-6mg OD |

- Glimepiride: safest in elderly
- Glibenclamide: AVOID in elderly

---

## DPP-4 Inhibitors
| Drug | Brand | Dose |
|------|-------|------|
| Sitagliptin | Januvia | 100mg OD |
| Vildagliptin | Galvus | 50mg BD |
| Linagliptin | Trajenta | 5mg OD (no renal adjust) |

- Neutral weight, no hypoglycemia

---

## SGLT2 Inhibitors
| Drug | Brand | Dose |
|------|-------|------|
| Empagliflozin | Jardiance | 10-25mg OD |
| Dapagliflozin | Forxiga | 5-10mg OD |

- CV and renal benefit proven
- Genital mycotic infections, UTIs

---

## GLP-1 Agonists
| Drug | Brand | Dose |
|------|-------|------|
| Liraglutide | Victoza | 0.6-1.8mg OD SC |
| Semaglutide | Ozempic | 0.25-1mg weekly SC |
| Dulaglutide | Trulicity | 0.75-4.5mg weekly |

- CV benefit proven
- Start low, titrate slowly (nausea)`
      },
      {
        title: 'أدوية الغدة الدرقية',
        titleEn: 'Thyroid Drugs',
        content: `## Hypothyroidism
| Drug | Brand | Dose |
|------|-------|------|
| Levothyroxine | Euthyrox | 1.6mcg/kg OD |

## Hyperthyroidism
| Drug | Brand | Dose |
|------|-------|------|
| Carbimazole | Neo-Mercazole | 10-40mg/day |
| Propylthiouracil | PTU | 100-300mg TID |

## Thyroid Storm
PTU + Iodine (1hr after PTU) + Propranolol + Hydrocortisone

### Pearls
- Levothyroxine: empty stomach 30-60min before breakfast
- Separate from calcium/iron/PPIs by 4 hours
- Carbimazole: teratogenic 1st trimester (use PTU)`
      }
    ]
  },

  // SECTION 8: PSYCHIATRIC DRUGS
  {
    id: 'psychiatric-drugs',
    title: 'الأدوية النفسية',
    titleEn: 'Psychiatric Drugs',
    icon: '🧠',
    subsections: [
      {
        title: 'المضادات للاكتئاب',
        titleEn: 'Antidepressants',
        content: `## SSRIs
| Drug | Brand | Dose |
|------|-------|------|
| Fluoxetine | Prozac | 20-80mg OD |
| Sertraline | Lustral | 50-200mg OD |
| Citalopram | Cipramil | 20-40mg OD |
| Escitalopram | Cipralex | 10-20mg OD |
| Paroxetine | Seroxat | 20-50mg OD |

## SNRIs
| Drug | Brand | Dose |
|------|-------|------|
| Venlafaxine | Efexor | 75-225mg OD |
| Duloxetine | Cymbalta | 30-60mg OD |

## TCAs
| Drug | Brand | Dose |
|------|-------|------|
| Amitriptyline | - | 10-150mg HS |
| Imipramine | Tofranil | 75-200mg/day |
| Clomipramine | Anafranil | 75-200mg/day |

- Start LOW go SLOW
- SSRIs: 2-4 weeks for full effect
- Sexual dysfunction (most common SSRI effect)
- TCA overdose: sodium bicarbonate
- Never stop paroxetine/venlafaxine abruptly`
      },
      {
        title: 'مضادات الذهان والبنزوديازيبين',
        titleEn: 'Antipsychotics & Benzodiazepines',
        content: `## Atypical Antipsychotics
| Drug | Brand | Dose |
|------|-------|------|
| Risperidone | Risperdal | 2-6mg/day |
| Olanzapine | Zyprexa | 5-20mg/day |
| Quetiapine | Seroquel | 150-800mg/day |
| Clozapine | Leponex | 200-450mg/day |
| Aripiprazole | Abilify | 10-30mg/day |

- Clozapine: treatment-resistant only, monitor WBC

---

## Benzodiazepines
| Drug | Brand | Dose |
|------|-------|------|
| Diazepam | Valium | 2-40mg/day |
| Alprazolam | Xanax | 0.25-4mg/day |
| Clonazepam | Rivotril | 0.5-8mg/day |
| Lorazepam | Ativan | 1-6mg/day |
| Bromazepam | Lexotan | 3-18mg/day |

### Pearls
- NEVER combine with opioids (respiratory depression)
- Short-term only (2-4 weeks)
- Taper gradually (10-25% every 1-2 weeks)
- Lorazepam: safest in liver disease
- Antidote: Flumazenil`
      },
      {
        title: 'مضادات الاختلاج وأدوية الزهايمر',
        titleEn: 'Anticonvulsants & Alzheimer\'s Drugs',
        content: `## Anticonvulsants
| Drug | Brand | Dose |
|------|-------|------|
| Valproic Acid | Depakene | 500-2000mg/day |
| Carbamazepine | Tegretol | 400-1600mg/day |
| Phenytoin | Dilantin | 300-400mg OD |
| Lamotrigine | Lamictal | 100-400mg/day |
| Levetiracetam | Keppra | 500-3000mg BD |

- Valproic: teratogenic, hepatotoxic
- Carbamazepine: SJS (HLA-B1502)
- Lamotrigine: MUST titrate slowly
- Always taper (never stop abruptly)

---

## Alzheimer's Drugs
### Cholinesterase Inhibitors
| Drug | Brand | Dose |
|------|-------|------|
| Donepezil | Aricept | 5-10mg OD |
| Rivastigmine | Exelon | 6-12mg BD |
| Galantamine | Razadyne | 8-24mg BD |

### NMDA Antagonist
| Drug | Brand | Dose |
|------|-------|------|
| Memantine | Namenda | 5-20mg OD |

- Mild-moderate: cholinesterase inhibitors
- Moderate-severe: memantine
- Side effects: GI, bradycardia`
      }
    ]
  },

  // SECTION 9: COSMETICS & SKINCARE
  {
    id: 'cosmetics-skincare',
    title: 'مستحضرات التجميل',
    titleEn: 'Cosmetics & Skincare',
    icon: '🧴',
    subsections: [
      {
        title: 'المنظفات والمرطبات',
        titleEn: 'Cleansers & Moisturizers',
        content: `## Cleansers
| Type | Best For | Example |
|------|----------|---------|
| Micellar Water | Sensitive | Bioderma Sensibio |
| Gel | Oily/Combination | CeraVe Foaming |
| Cream | Dry/Sensitive | Cetaphil |
| Benzoyl Peroxide Wash | Acne | PanOxyl |

## Moisturizers by Skin Type
| Type | Recommended | Example |
|------|-------------|---------|
| Dry | Rich cream | CeraVe Cream |
| Oily | Lightweight gel | Neutrogena Hydro Boost |
| Sensitive | Fragrance-free | Cetaphil |

### Key Ingredients
- Hyaluronic Acid: deep hydration
- Ceramides: restore skin barrier
- Glycerin: humectant`
      },
      {
        title: 'واقي الشمس',
        titleEn: 'Sunscreens',
        content: `## Sunscreens

| Type | Ingredients | Mechanism |
|------|-------------|-----------|
| Chemical | Avobenzone, Octinoxate | Absorb UV |
| Physical | Zinc Oxide, Titanium Dioxide | Reflect UV |

## SPF Guide
| SPF | UVB Protection |
|-----|---------------|
| 15 | 93% |
| 30 | 97% |
| 50 | 98% |

### Application
- Apply 15-30min before sun, reapply every 2hrs
- Use daily even on cloudy days
- Broad spectrum SPF 30 minimum

### Pearls
- Physical: better for sensitive skin
- Chemical: better cosmetic feel
- Sunscreen = #1 anti-aging product`
      },
      {
        title: 'العناية بالبشرة والشعر والطفولة',
        titleEn: 'Anti-aging, Acne, Hair & Baby Care',
        content: `## Anti-Aging
| Ingredient | Notes |
|------------|-------|
| Retinol/Tretinoin | PM use, sun sensitivity |
| Vitamin C | AM, antioxidant |
| Niacinamide | Well tolerated |

## Acne Treatment
| Product | Active |
|---------|--------|
| PanOxyl | Benzoyl Peroxide 2.5-10% |
| Differin | Adapalene 0.1% |
| Acne-UV | Sunscreen for acne |

- Isotretinoin: most effective, teratogenic

## Hair Care
| Condition | Treatment |
|-----------|-----------|
| Alopecia | Minoxidil 5% |
| Dandruff | Ketoconazole shampoo |

## Baby Care
| Product | Brand |
|---------|-------|
| Diaper Rash | Sudocrem, Bepanthen |
| Fever | Panadol Baby (10-15mg/kg) |
| Fever (>6mo) | Brufen Baby (5-10mg/kg) |

- Never give aspirin to children <16`
      }
    ]
  },

  // SECTION 10: CLINICAL PEARLS
  {
    id: 'clinical-pearls',
    title: 'لآلئ سريرية',
    titleEn: 'Clinical Pearls',
    icon: '✨',
    subsections: [
      {
        title: 'تفاعلادات الأدوية الحرجة',
        titleEn: 'Key Drug Interactions',
        content: `## Critical Drug Interactions

| Drug A | Drug B | Effect | Severity |
|--------|--------|--------|----------|
| Warfarin | NSAIDs | Bleeding | SEVERE |
| Warfarin | Amiodarone | ↑ INR | SEVERE |
| Statins | Macrolides | Rhabdomyolysis | SEVERE |
| Statins | Azole antifungals | Rhabdomyolysis | SEVERE |
| Metformin | Contrast dye | Lactic acidosis | SEVERE |
| ACE-I | K-sparing diuretics | Hyperkalemia | HIGH |
| SSRIs | Tramadol | Serotonin syndrome | HIGH |
| Opioids | Benzodiazepines | Respiratory depression | SEVERE |
| Ciprofloxacin | Theophylline | Theophylline toxicity | HIGH |
| Fluconazole | Warfarin | ↑ INR | HIGH |
| Verapamil | BB (IV) | Heart block | SEVERE |

### Pearls
- ALWAYS check interactions before dispensing
- Most dangerous: opioids+BZDs, warfarin+NSAIDs
- Clarithromycin: potent CYP3A4 inhibitor`
      },
      {
        title: 'مناعات الإصابة',
        titleEn: 'Contraindications',
        content: `## Major Contraindications

| Drug | Contraindication | Reason |
|------|-----------------|--------|
| Beta-Blockers | Asthma, Heart block | Bronchospasm |
| ACE Inhibitors | Pregnancy | Teratogenic |
| Metformin | eGFR <30 | Lactic acidosis |
| NSAIDs | 3rd trimester pregnancy | Premature DA closure |
| Tetracyclines | Pregnancy, Children <8 | Teeth staining |
| Fluoroquinolones | Children <18, MG | Cartilage damage |
| BZDs | Sleep apnea, Severe liver disease | Respiratory depression |
| Warfarin | Pregnancy | Teratogenic |

### Universal Rule
- ALWAYS ask about pregnancy for women of childbearing age`
      },
      {
        title: 'نصائح الجرعات',
        titleEn: 'Dosing Tips',
        content: `## Renal Dose Adjustments
| Drug | Adjustment |
|------|-----------|
| Metformin | Contraindicated eGFR <30 |
| Gabapentin | Reduce if eGFR <60 |
| DOACs | Adjust based on eGFR |
| Linagliptin | NO adjustment needed |

## Weight-Based Dosing
| Drug | Dose |
|------|------|
| Amoxicillin (child) | 25-50mg/kg/day TID |
| Ceftriaxone | 50-100mg/kg/day |
| Gentamicin | 5-7mg/kg OD |
| Enoxaparin | 1mg/kg BD |

## Elderly Principles
- Start low, go slow
- Lowest effective dose
- Review regularly
- Check renal function`
      },
      {
        title: 'بروتوكولات الطوارئ',
        titleEn: 'Emergency Protocols',
        content: `## Paracetamol Overdose
NAC 150mg/kg IV over 15min → 50mg/kg over 4h → 100mg/kg over 16h

## Warfarin Overdose
- INR 5-9: Hold + Vit K 1-2.5mg PO
- INR >9: Hold + Vit K 2.5-5mg PO
- Active bleeding: Vit K 5-10mg IV + PCC

## Opioid Overdose
Naloxone 0.4-2mg IV/IM, repeat q2-3min

## Anaphylaxis
Epinephrine 0.3-0.5mg IM (1:1000) lateral thigh, repeat q5-15min

## Status Epilepticus
Lorazepam 0.1mg/kg IV (max 4mg)
OR Diazepam 0.2mg/kg IV (max 10mg)

## TCA Overdose
NaHCO3 1-2mEq/kg IV for QRS >100ms`
      },
      {
        title: 'تحذيرات سلامة الأدوية',
        titleEn: 'Drug Safety Warnings',
        content: `## FDA Black Box Warnings

| Drug | Warning |
|------|---------|
| Fluoroquinolones | Tendinitis, tendon rupture |
| Opioids + BZDs | Respiratory depression, death |
| Clozapine | Agranulocytosis |
| Valproic acid | Hepatotoxicity, teratogenicity |
| NSAIDs | CV/GI bleeding risk |

## Common Medication Errors
1. Look-alike/sound-alike drugs
2. Wrong pediatric dose calculations
3. Not checking allergies
4. Missing drug interactions
5. Incorrect insulin technique
6. Crushing enteric-coated/SR tablets
7. Not counseling on adherence

## Patient Counseling
- Complete full antibiotic course
- Do not share antibiotics
- Report unusual side effects
- Do not stop chronic medications without advice`
      }
    ]
  },

  // SECTION 11: INTERVIEW PREPARATION
  {
    id: 'interview-prep',
    title: 'تحضير المقابلات',
    titleEn: 'Interview Preparation',
    icon: '📝',
    subsections: [
      {
        title: 'أسئلة المقابلة الشائعة',
        titleEn: 'Common Interview Questions & Answers',
        content: `## Common Q&A

**Q: Difference between Paracetamol and NSAIDs?**
A: Paracetamol acts centrally, no anti-inflammatory, safe in pregnancy. NSAIDs act peripherally, have anti-inflammatory effect but cause GI/renal/CV issues.

**Q: When to refer a patient?**
A: Serious symptoms (chest pain, weight loss), complex interactions, failed OTC treatment, prescription-only needs.

**Q: How to counsel on antibiotic use?**
A: Complete full course, take at regular intervals, do not share, report allergic reactions, store properly.

**Q: Role of pharmacist in diabetes management?**
A: Medication counseling, insulin technique, glucose monitoring education, lifestyle advice, adherence support.

## Clinical Scenarios

**Q: Heartburn for 2 weeks?**
A: Lifestyle modifications + antacids or H2 blocker. If persistent, refer for PPI/H. pylori testing.

**Q: Patient on warfarin asks for ibuprofen?**
A: Advise against. Recommend paracetamol. If NSAID essential: lowest dose, shortest duration + PPI.

**Q: Patient wants antibiotics without prescription?**
A: Assess for viral infection. Explain antibiotics don't work for viruses. Advise symptomatic treatment or see doctor.`
      },
      {
        title: 'مرجع الأسماء التجارية السريع',
        titleEn: 'Brand-Generic Quick Reference',
        content: `## Top 50 Brand-Generic Pairs

| # | Brand | Generic | Use |
|---|-------|---------|-----|
| 1 | Panadol | Paracetamol | Analgesic |
| 2 | Brufen | Ibuprofen | NSAID |
| 3 | Glucophage | Metformin | Diabetes |
| 4 | Lipitor | Atorvastatin | Cholesterol |
| 5 | Norvasc | Amlodipine | HTN |
| 6 | Concor | Bisoprolol | HTN |
| 7 | Omez | Omeprazole | GERD |
| 8 | Augmentin | Amox+Clav | Antibiotic |
| 9 | Ventolin | Salbutamol | Asthma |
| 10 | Symbicort | Budes+Formo | Asthma |
| 11 | Coumadin | Warfarin | Anticoagulant |
| 12 | Plavix | Clopidogrel | Antiplatelet |
| 13 | Lantus | Glargine | Long insulin |
| 14 | Xanax | Alprazolam | Anxiolytic |
| 15 | Prozac | Fluoxetine | SSRI |
| 16 | Crestor | Rosuvastatin | Cholesterol |
| 17 | Ciproxin | Ciprofloxacin | Antibiotic |
| 18 | Zithromax | Azithromycin | Antibiotic |
| 19 | Voltaren | Diclofenac | NSAID |
| 20 | Singulair | Montelukast | Asthma |
| 21 | Spiriva | Tiotropium | COPD |
| 22 | Aricept | Donepezil | Alzheimer's |
| 23 | Lamictal | Lamotrigine | Anticonvulsant |
| 24 | Cymbalta | Duloxetine | SNRI |
| 25 | Ozempic | Semaglutide | Diabetes |
| 26 | Jardiance | Empagliflozin | Diabetes |
| 27 | Januvia | Sitagliptin | Diabetes |
| 28 | Forxiga | Dapagliflozin | Diabetes |
| 29 | Tamiflu | Oseltamivir | Influenza |
| 30 | Zovirax | Acyclovir | HSV |
| 31 | Diflucan | Fluconazole | Antifungal |
| 32 | Lamisil | Terbinafine | Antifungal |
| 33 | Coversyl | Perindopril | ACE-I |
| 34 | Diovan | Valsartan | ARB |
| 35 | Seroquel | Quetiapine | Antipsychotic |
| 36 | Risperdal | Risperidone | Antipsychotic |
| 37 | Lyrica | Pregabalin | Neuropathic pain |
| 38 | Neurontin | Gabapentin | Neuropathic pain |
| 39 | Levemir | Detemir | Long insulin |
| 40 | NovoRapid | Aspart | Rapid insulin |
| 41 | Humalog | Lispro | Rapid insulin |
| 42 | Tresiba | Degludec | Ultra-long insulin |
| 43 | Buscopan | Hyoscine Butyl | Antispasmodic |
| 44 | Imodium | Loperamide | Antidiarrheal |
| 45 | Neurontin | Gabapentin | Seizures |
| 46 | Keppra | Levetiracetam | Seizures |
| 47 | Tramal | Tramadol | Opioid |
| 48 | Maxolon | Metoclopramide | Prokinetic |
| 49 | Motilium | Domperidone | Prokinetic |
| 50 | Flagyl | Metronidazole | Antibiotic |`
      }
    ]
  }
];

export const LEARNING_CATEGORIES = LEARNING_SECTIONS.map(s => ({
  id: s.id,
  title: s.title,
  titleEn: s.titleEn,
  icon: s.icon
}));
