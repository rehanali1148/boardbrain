# 🎓 Ustad AI (استاد اے آئی) — Next.js Mobile-First Frontend
## Education Trust Nasra Schools • Class 9 & Class 10 Academic Intelligence Platform
**Curriculum Standards:** BSEK Karachi & AKU-EB  
**Target Viewports:** Mobile iPhone 13/14/15 (375x812) & Desktop (1440x900)  
**Backend API:** FastAPI running on Oracle Cloud VM (`http://130.210.108.6:8000/api/v1`)

---

### 1. 1-Click Vercel Deployment Instructions
1. Create a new repository on your GitHub account (e.g. `ustad-ai-frontend`).
2. Push this directory to your GitHub repository:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/ustad-ai-frontend.git
   git branch -M main
   git push -u origin main
   ```
3. Open **Vercel** (`https://vercel.com`), click **"Add New Project"**, and import your `ustad-ai-frontend` repository.
4. Set Environment Variable in Vercel:
   ```env
   NEXT_PUBLIC_API_URL=http://130.210.108.6:8000/api/v1
   ```
5. Click **Deploy**. Your students can now access Ustad AI worldwide with sub-second page loads.

---

### 2. Local Development Setup
```bash
npm install
npm run dev
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

### 3. Key Student & Teacher Modules Included
- **Today's Command Home:** 40% Pass + A-1 Shield Readiness rings, board countdown, and daily streaks.
- **5-Min MCQ Blitz:** Real BSEK Section A & AKU-EB SLO questions with instant examiner trap notes.
- **Spaced-Repetition Mistake Vault:** Automatically queues missed questions for 48-hour retry.
- **Topper Sheet Presentation Studio:** Interactive step solver enforcing Given Data (+1.0), Formula (+1.0), Math (+1.5), and SI Unit (+0.5 / -0.5 deduction).
- **Scan My Notebook (Examiner Eye 2.0):** Homework camera upload with editable parsed-text confirmation before deduction scoring runs.
- **"Samjho in Roman Urdu -> Write in Board English" Dual Cards:** Instant toggle between natural Roman Urdu senior-mentor explanations and board-ready English answers with e-marking tags.
- **15-Mark Science Lab Practical Arena:** Audio Viva Voce simulator (Web Speech API), 60-Second Biology Spotting Flashcard deck, and Concordant Observation Table Auditor.
- **15-Year Historical Frequency Radar:** Rotational gap analysis citing 2014–2024 annual board papers.
- **48-Hour Exam Rescue Planner:** Hourly sprint generator based on student's available hours.
- **Socratic AI Ustad & Doubt Escalation:** Guided chips + "Still Stuck? Ask My Teacher" creating 2-line tickets sent to section faculty.
- **60-Second Teacher Exam Generator:** Generates camera-ready Row A & Row B parallel variants, step marking rubrics, and clean `@media print` PDF exports.
- **Class Weakness Heatmap & Doubt Inbox:** Aggregates top section traps for 5-minute pre-class review.
