/**
 * LaunchPad – Startup Co-Pilot
 * The Strategic Startup Planning Platform
 * Pure Vanilla JavaScript • Transparent Rule-Based Decision Modeling
 */

(function () {
  'use strict';

  // Global Error Boundary & Unhandled Rejection Watcher
  if (typeof window !== 'undefined') {
    window.addEventListener('error', function (event) {
      console.error('LaunchPad UI Runtime Exception:', event.error || event.message);
    });
    window.addEventListener('unhandledrejection', function (event) {
      console.error('LaunchPad Unhandled Promise Rejection:', event.reason);
    });
  }

  // =========================================================================
  // 1. STORAGE KEYS & APP STATE
  // =========================================================================
  const STORAGE_KEY_PLANS = 'launchpad_startup_plans_v3';
  const STORAGE_KEY_ACTIVE = 'launchpad_active_plan_id_v3';

  const state = {
    currentPlan: null,
    savedPlans: [],
    activeTab: 'feasibility',
    mvpFilter: 'all',
    previousActiveElement: null
  };

  // =========================================================================
  // 2. DOM ELEMENT REFERENCES
  // =========================================================================
  const elements = {
    // Nav & Brand
    brandHome: document.getElementById('brandHome'),
    navLanding: document.getElementById('navLanding'),
    navHowItWorks: document.getElementById('navHowItWorks'),
    navFeatures: document.getElementById('navFeatures'),
    navPlanner: document.getElementById('navPlanner'),
    navSaved: document.getElementById('navSaved'),
    savedCount: document.getElementById('savedCount'),
    btnQuickSample: document.getElementById('btnQuickSample'),
    btnNavGetStarted: document.getElementById('btnNavGetStarted'),

    // Sections
    landingSection: document.getElementById('landingSection'),
    plannerSection: document.getElementById('plannerSection'),
    dashboardSection: document.getElementById('dashboardSection'),
    howItWorksSection: document.getElementById('howItWorksSection'),
    featuresSection: document.getElementById('featuresSection'),

    // Hero Buttons
    btnHeroStart: document.getElementById('btnHeroStart'),
    btnHeroExplore: document.getElementById('btnHeroExplore'),
    btnHeroSample: document.getElementById('btnHeroSample'),

    // Form
    startupForm: document.getElementById('startupForm'),
    startupName: document.getElementById('startupName'),
    startupIdea: document.getElementById('startupIdea'),
    startupIndustry: document.getElementById('startupIndustry'),
    targetAudience: document.getElementById('targetAudience'),
    customBudget: document.getElementById('customBudget'),
    businessModel: document.getElementById('businessModel'),
    startupStage: document.getElementById('startupStage'),
    charCount: document.getElementById('charCount'),
    btnSubmitForm: document.getElementById('btnSubmitForm'),
    audienceTags: document.getElementById('audienceTags'),

    // Errors
    nameError: document.getElementById('nameError'),
    ideaError: document.getElementById('ideaError'),
    industryError: document.getElementById('industryError'),
    audienceError: document.getElementById('audienceError'),

    // Dashboard Header
    dashPlanName: document.getElementById('dashPlanName'),
    dashPlanDesc: document.getElementById('dashPlanDesc'),
    dashTagIndustry: document.getElementById('dashTagIndustry'),
    dashTagBudget: document.getElementById('dashTagBudget'),
    dashTagAudience: document.getElementById('dashTagAudience'),
    btnEditInputs: document.getElementById('btnEditInputs'),
    btnSavePlan: document.getElementById('btnSavePlan'),
    saveBtnText: document.getElementById('saveBtnText'),
    btnPrintDossier: document.getElementById('btnPrintDossier'),
    btnNewIdea: document.getElementById('btnNewIdea'),

    // Real User Stats Strip
    stripScoreVal: document.getElementById('stripScoreVal'),
    stripScoreVerdict: document.getElementById('stripScoreVerdict'),
    stripMvpVal: document.getElementById('stripMvpVal'),
    stripMvpPct: document.getElementById('stripMvpPct'),
    stripRoadmapVal: document.getElementById('stripRoadmapVal'),
    stripRoadmapPct: document.getElementById('stripRoadmapPct'),
    stripCompetitorVal: document.getElementById('stripCompetitorVal'),
    stripSavedVal: document.getElementById('stripSavedVal'),

    // Dashboard Tabs & Panels
    dashTabs: document.querySelectorAll('.dash-tab'),
    tabPanels: {
      feasibility: document.getElementById('tabFeasibility'),
      swot: document.getElementById('tabSwot'),
      persona: document.getElementById('tabPersona'),
      mvp: document.getElementById('tabMvp'),
      competitors: document.getElementById('tabCompetitors'),
      monetization: document.getElementById('tabMonetization'),
      roadmap: document.getElementById('tabRoadmap')
    },

    // Feasibility Elements
    overallScoreVal: document.getElementById('overallScoreVal'),
    scoreCircleProgress: document.getElementById('scoreCircleProgress'),
    scoreVerdictBadge: document.getElementById('scoreVerdictBadge'),
    scoreSummaryDesc: document.getElementById('scoreSummaryDesc'),
    pillarMarketVal: document.getElementById('pillarMarketVal'),
    pillarMarketBar: document.getElementById('pillarMarketBar'),
    pillarMarketRationale: document.getElementById('pillarMarketRationale'),
    pillarTechVal: document.getElementById('pillarTechVal'),
    pillarTechBar: document.getElementById('pillarTechBar'),
    pillarTechRationale: document.getElementById('pillarTechRationale'),
    pillarFinanceVal: document.getElementById('pillarFinanceVal'),
    pillarFinanceBar: document.getElementById('pillarFinanceBar'),
    pillarFinanceRationale: document.getElementById('pillarFinanceRationale'),
    pillarMoatVal: document.getElementById('pillarMoatVal'),
    pillarMoatBar: document.getElementById('pillarMoatBar'),
    pillarMoatRationale: document.getElementById('pillarMoatRationale'),

    // Problem & Solution + Market Opportunity Cards
    evalProblemTitle: document.getElementById('evalProblemTitle'),
    evalProblemBody: document.getElementById('evalProblemBody'),
    chipProblemUrgency: document.getElementById('chipProblemUrgency'),
    chipSolutionClarity: document.getElementById('chipSolutionClarity'),
    evalMarketTitle: document.getElementById('evalMarketTitle'),
    evalMarketBody: document.getElementById('evalMarketBody'),
    chipMarketGrowth: document.getElementById('chipMarketGrowth'),
    chipTimingWindow: document.getElementById('chipTimingWindow'),
    recHeadline: document.getElementById('recHeadline'),
    recDetailedText: document.getElementById('recDetailedText'),
    recNextStepsList: document.getElementById('recNextStepsList'),

    // SWOT Elements
    strengthsCount: document.getElementById('strengthsCount'),
    strengthsList: document.getElementById('strengthsList'),
    weaknessesCount: document.getElementById('weaknessesCount'),
    weaknessesList: document.getElementById('weaknessesList'),
    riskMatrixContainer: document.getElementById('riskMatrixContainer'),

    // Persona Elements
    personaAvatar: document.getElementById('personaAvatar'),
    personaName: document.getElementById('personaName'),
    personaRole: document.getElementById('personaRole'),
    personaDemographics: document.getElementById('personaDemographics'),
    personaQuote: document.getElementById('personaQuote'),
    personaJTBD: document.getElementById('personaJTBD'),
    personaPainPoints: document.getElementById('personaPainPoints'),
    personaOutcomes: document.getElementById('personaOutcomes'),
    personaPayTriggers: document.getElementById('personaPayTriggers'),
    personaChannels: document.getElementById('personaChannels'),

    // MVP Elements
    mvpProgressBadge: document.getElementById('mvpProgressBadge'),
    mvpBuiltCount: document.getElementById('mvpBuiltCount'),
    mvpTotalCount: document.getElementById('mvpTotalCount'),
    mvpProgressBar: document.getElementById('mvpProgressBar'),
    mvpFilterBtns: document.querySelectorAll('.mvp-filter-btn'),
    mvpFeaturesList: document.getElementById('mvpFeaturesList'),
    btnToggleAddMvp: document.getElementById('btnToggleAddMvp'),
    addFeatureBox: document.getElementById('addFeatureBox'),
    newFeatureTitle: document.getElementById('newFeatureTitle'),
    newFeaturePriority: document.getElementById('newFeaturePriority'),
    newFeatureRationale: document.getElementById('newFeatureRationale'),
    btnSaveCustomFeature: document.getElementById('btnSaveCustomFeature'),

    // Competitors Elements
    btnToggleAddCompetitor: document.getElementById('btnToggleAddCompetitor'),
    addCompetitorBox: document.getElementById('addCompetitorBox'),
    compName: document.getElementById('compName'),
    compPricing: document.getElementById('compPricing'),
    compDesc: document.getElementById('compDesc'),
    compStrengths: document.getElementById('compStrengths'),
    compWeaknesses: document.getElementById('compWeaknesses'),
    btnCancelAddCompetitor: document.getElementById('btnCancelAddCompetitor'),
    btnSaveCompetitor: document.getElementById('btnSaveCompetitor'),
    competitorTableBody: document.getElementById('competitorTableBody'),

    // Monetization Elements
    monetizationPrimaryModel: document.getElementById('monetizationPrimaryModel'),
    monetizationModelRationale: document.getElementById('monetizationModelRationale'),
    pricingTiersGrid: document.getElementById('pricingTiersGrid'),
    secondaryStreamsList: document.getElementById('secondaryStreamsList'),
    targetMarginVal: document.getElementById('targetMarginVal'),

    // Roadmap Elements
    roadmapProgressBadge: document.getElementById('roadmapProgressBadge'),
    sprintTasksCompleted: document.getElementById('sprintTasksCompleted'),
    sprintTasksTotal: document.getElementById('sprintTasksTotal'),
    sprintProgressBar: document.getElementById('sprintProgressBar'),
    sprintStatusMsg: document.getElementById('sprintStatusMsg'),
    btnResetTasks: document.getElementById('btnResetTasks'),
    btnCompleteAllTasks: document.getElementById('btnCompleteAllTasks'),
    roadmapDaysList: document.getElementById('roadmapDaysList'),

    // Saved Plans Modal
    savedPlansModal: document.getElementById('savedPlansModal'),
    btnCloseSavedModal: document.getElementById('btnCloseSavedModal'),
    btnDismissSaved: document.getElementById('btnDismissSaved'),
    btnCreateNewFromSaved: document.getElementById('btnCreateNewFromSaved'),
    savedPlansList: document.getElementById('savedPlansList'),
    modalSavedCount: document.getElementById('modalSavedCount'),
    searchSavedPlans: document.getElementById('searchSavedPlans'),
    btnExportAllPlans: document.getElementById('btnExportAllPlans'),

    // Toast Container
    toastContainer: document.getElementById('toastContainer')
  };

  // =========================================================================
  // 3. SAMPLE PRESETS (ONE-CLICK TESTING)
  // =========================================================================
  const SAMPLE_PRESETS = {
    saas: {
      name: 'DocuBrief AI',
      idea: 'An automated contract review and risk scoring platform for freelance designers and independent creative studios. Scans inbound client agreements in seconds, highlights predatory liability clauses, unpaid scope-creep risks, and generates standard pushback clauses.',
      industry: 'saas',
      audience: 'Freelance Designers & Independent Agencies',
      budgetTier: 'bootstrap',
      customBudget: '850',
      businessModel: 'subscription',
      stage: 'idea'
    },
    health: {
      name: 'MealSync',
      idea: 'Personalized macro and meal planning engine designed specifically for sedentary remote software workers. Integrates with calendar events to deliver instant 10-minute recipes and grocery delivery orders calibrated against daily screen time and exercise dips.',
      industry: 'health',
      audience: 'Remote Tech Workers & Engineers',
      budgetTier: 'lean',
      customBudget: '2200',
      businessModel: 'freemium',
      stage: 'validated'
    },
    ecommerce: {
      name: 'EcoPack Direct',
      idea: 'A sustainable, zero-plastic packaging sourcing marketplace connecting direct-to-consumer eco brands with certified regional compostable box and tape suppliers with low minimum order quantities (MOQs).',
      industry: 'ecommerce',
      audience: 'Emerging D2C Brands & Eco-Founders',
      budgetTier: 'growth',
      customBudget: '7500',
      businessModel: 'marketplace',
      stage: 'prototype'
    },
    edtech: {
      name: 'SprintPrep',
      idea: 'A gamified, bite-sized technical interview prep simulator for college CS students that pairs micro-challenges with 5-minute interactive code refactoring puzzles and peer mock review rooms.',
      industry: 'edtech',
      audience: 'College Computer Science Students & Job Seekers',
      budgetTier: 'bootstrap',
      customBudget: '600',
      businessModel: 'freemium',
      stage: 'idea'
    }
  };

  // =========================================================================
  // 4. TRANSPARENT RULE-BASED ANALYSIS ENGINE
  // =========================================================================
  const RuleEngine = {
    industryWeights: {
      saas: { baseMarket: 82, techFriction: 35, capitalNeed: 40, moatFactor: 80, margin: '80% - 90%', avgLTV: '$900' },
      ai: { baseMarket: 92, techFriction: 55, capitalNeed: 65, moatFactor: 68, margin: '65% - 80%', avgLTV: '$750' },
      fintech: { baseMarket: 88, techFriction: 75, capitalNeed: 85, moatFactor: 85, margin: '70% - 85%', avgLTV: '$2,400' },
      health: { baseMarket: 80, techFriction: 60, capitalNeed: 60, moatFactor: 75, margin: '60% - 75%', avgLTV: '$450' },
      edtech: { baseMarket: 74, techFriction: 40, capitalNeed: 45, moatFactor: 62, margin: '70% - 85%', avgLTV: '$320' },
      ecommerce: { baseMarket: 78, techFriction: 30, capitalNeed: 70, moatFactor: 55, margin: '40% - 60%', avgLTV: '$280' },
      creator: { baseMarket: 84, techFriction: 35, capitalNeed: 40, moatFactor: 60, margin: '75% - 88%', avgLTV: '$360' },
      marketplace: { baseMarket: 86, techFriction: 65, capitalNeed: 80, moatFactor: 88, margin: '15% - 25% Take Rate', avgLTV: '$1,200' },
      logistics: { baseMarket: 80, techFriction: 65, capitalNeed: 75, moatFactor: 82, margin: '50% - 70%', avgLTV: '$3,800' },
      cleantech: { baseMarket: 85, techFriction: 80, capitalNeed: 85, moatFactor: 80, margin: '45% - 65%', avgLTV: '$4,200' }
    },

    budgetMultipliers: {
      bootstrap: { maxViableFriction: 45, capitalScoreMod: 22, advice: 'No-code MVP, organic DM outreach, manual concierge onboarding.' },
      lean: { maxViableFriction: 60, capitalScoreMod: 14, advice: 'Dedicated landing page, micro-influencer seeding, lightweight integrations.' },
      growth: { maxViableFriction: 80, capitalScoreMod: 6, advice: 'Custom full-stack web application, targeted paid validation, legal compliance.' },
      venture: { maxViableFriction: 100, capitalScoreMod: 0, advice: 'Full engineering sprint, multi-channel growth campaigns, dedicated support.' }
    },

    analyze: function (input) {
      const ind = this.industryWeights[input.industry] || this.industryWeights.saas;
      const bud = this.budgetMultipliers[input.budgetTier] || this.budgetMultipliers.bootstrap;
      const textLower = (input.name + ' ' + input.idea + ' ' + input.audience).toLowerCase();

      // Heuristic keyword modifiers
      const highIntentKeywords = ['automation', 'workflow', 'save time', 'platform', 'ai', 'dashboard', 'analytics', 'b2b', 'agency', 'contract', 'compliance', 'revenue'];
      const frictionKeywords = ['hardware', 'patent', 'biotech', 'manufacturing', 'blockchain', 'logistics fleet', 'fda approval'];

      let keywordScoreBonus = 0;
      highIntentKeywords.forEach(kw => {
        if (textLower.includes(kw)) keywordScoreBonus += 2;
      });
      frictionKeywords.forEach(kw => {
        if (textLower.includes(kw)) keywordScoreBonus -= 5;
      });

      // 1. Pillar 1: Market Potential (0-100)
      let marketScore = Math.min(96, Math.max(45, ind.baseMarket + (keywordScoreBonus > 0 ? 4 : 0) + (input.stage === 'validated' ? 5 : 0)));

      // 2. Pillar 2: Technical Execution Velocity (0-100)
      let techPenalty = Math.max(0, ind.techFriction - bud.maxViableFriction);
      let techScore = Math.min(95, Math.max(40, 100 - ind.techFriction - (techPenalty * 0.8)));

      // 3. Pillar 3: Capital Efficiency & Runway (0-100)
      let capitalGap = Math.max(0, ind.capitalNeed - (bud.capitalScoreMod === 0 ? 90 : (bud.capitalScoreMod === 6 ? 75 : (bud.capitalScoreMod === 14 ? 50 : 35))));
      let financeScore = Math.min(98, Math.max(42, 92 - (capitalGap * 0.7) + (input.budgetTier === 'bootstrap' ? 6 : 0)));

      // 4. Pillar 4: Defensible Moat & Retention (0-100)
      let moatScore = Math.min(94, Math.max(45, ind.moatFactor + (textLower.includes('workflow') || textLower.includes('data') ? 4 : 0)));

      // Composite Feasibility Score
      const overallScore = Math.round(
        (marketScore * 0.30) +
        (techScore * 0.25) +
        (financeScore * 0.25) +
        (moatScore * 0.20)
      );

      // Score Verdict
      let verdict = { text: 'Strong Viability with High Potential', class: 'verdict-high' };
      if (overallScore >= 85) {
        verdict = { text: 'Exceptional Market Readiness', class: 'verdict-high' };
      } else if (overallScore >= 70) {
        verdict = { text: 'Strong Viability with High Potential', class: 'verdict-high' };
      } else if (overallScore >= 58) {
        verdict = { text: 'Moderate Viability – Scope Narrowing Advised', class: 'verdict-mid' };
      } else {
        verdict = { text: 'High Risk – Consider Leaner Wedge Pivot', class: 'verdict-low' };
      }

      // Rationales
      const rationales = {
        market: `Strong tailwinds in ${this.formatIndustry(input.industry)}. High demand for specialized solutions tailored specifically to ${input.audience}.`,
        tech: techScore > 75 
          ? `Low-to-moderate engineering friction. Feasible to build an initial core prototype using modern lightweight frameworks within 7 days.` 
          : `Higher structural complexity. Recommend pruning non-essential integrations and shipping a streamlined wedge product first.`,
        finance: input.budgetTier === 'bootstrap'
          ? `High capital efficiency. Low infrastructure overhead allows founders to reach cash-flow positivity purely via direct customer outreach.`
          : `Budget tier provides comfortable runway for initial paid experimentation and essential SaaS tooling subscriptions.`,
        moat: moatScore > 75
          ? `High switching costs created by workflow integration and user proprietary data retention.`
          : `Initial moat relies on speed to market and hyper-focused niche branding; build proprietary workflows to prevent copycats.`
      };

      // Problem & Solution Evaluation (Requirement 4)
      const problemEvaluation = {
        title: `Problem Severity & Solution Fit Evaluation`,
        body: `Your concept directly targets ${input.audience}. The core friction described carries measurable operational costs. By replacing manual fragmented processes with a centralized workflow, the value delivery is immediate and quantifiable.`,
        urgencyChip: overallScore > 70 ? 'Acute Pain Point' : 'Moderate Inconvenience',
        clarityChip: input.idea.length > 100 ? 'High Solution Clarity' : 'Broad Solution Definition'
      };

      // Market Opportunity (Requirement 4)
      const marketOpportunity = {
        title: `Market Opportunity & Timing Dynamics`,
        body: `The ${this.formatIndustry(input.industry)} space is seeing increased willingness-to-pay from customers seeking specialized tooling. Modern low-code integrations allow rapid MVP delivery without massive seed capital.`,
        growthChip: 'Expanding Addressable Niche',
        timingChip: 'Favorable Founder Window'
      };

      // Recommended Next Steps (Requirement 4)
      const nextSteps = [
        `Conduct 10 direct discovery interviews with ${input.audience} before writing production backend code.`,
        `Scope the MVP strictly to the P0 Must-Have feature to ship within 7 days.`,
        `Pre-sell 3 beta subscriptions or concierge onboarding passes to prove commercial willingness to pay.`
      ];

      // SWOT
      const swot = this.generateSWOT(input, ind, overallScore);

      // Customer Persona
      const persona = this.generatePersona(input);

      // MVP Features (Requirement 5)
      const mvp = this.generateMVP(input);

      // Starter Competitors (Requirement 7)
      const competitors = this.generateStarterCompetitors(input);

      // Monetization
      const monetization = this.generateMonetization(input, ind);

      // 7-Day Roadmap (Requirement 6)
      const roadmap = this.generateRoadmap(input);

      return {
        overallScore,
        verdict,
        pillars: {
          market: { score: marketScore, rationale: rationales.market },
          tech: { score: techScore, rationale: rationales.tech },
          finance: { score: financeScore, rationale: rationales.finance },
          moat: { score: moatScore, rationale: rationales.moat }
        },
        problemEvaluation,
        marketOpportunity,
        nextSteps,
        recommendation: {
          headline: `Strategic Directive: Focus on Wedge Validation for ${input.audience}`,
          body: `Given your ${bud.advice} Avoid building a generic horizontal tool. Your fastest route to paying customers is validating a single acute pain point with 5-10 pre-launch commits.`
        },
        swot,
        persona,
        mvp,
        competitors,
        monetization,
        roadmap
      };
    },

    formatIndustry: function (indKey) {
      const names = {
        saas: 'B2B SaaS & Cloud Software',
        ai: 'AI Tools & Intelligent Automation',
        fintech: 'FinTech & Transactional Infrastructure',
        health: 'HealthTech, Wellness & Nutrition',
        edtech: 'EdTech & Professional Upskilling',
        ecommerce: 'E-Commerce & D2C Brands',
        creator: 'Creator Economy & Digital Media',
        marketplace: 'Two-Sided Marketplaces',
        logistics: 'B2B Logistics & Supply Chain',
        cleantech: 'CleanTech & Sustainability'
      };
      return names[indKey] || 'Software & Technology';
    },

    generateSWOT: function (input, ind, score) {
      const strengths = [
        `Hyper-targeted value proposition designed specifically for ${input.audience}.`,
        `Low initial capital expenditure requirement, allowing maximum iteration agility.`,
        `Direct founder-to-customer feedback loop without enterprise procurement bottlenecks.`,
        `Clear path to product-led growth through immediate utility and word-of-mouth referral.`
      ];

      const weaknesses = [
        `Initial brand obscurity against established legacy enterprise alternatives.`,
        `Customer acquisition friction if cold-outreach channels become noisy or saturated.`,
        `Founder bandwidth constraints when balancing product shipping with sales outreach.`,
        `Potential churn vulnerability if onboarding friction delays the user's "aha" moment.`
      ];

      const risks = [
        {
          name: 'Customer Inertia & Habit Resistance',
          severity: 'high',
          detail: `Prospects rely on existing patchwork tools (spreadsheets, manual emails) and resist changing their default habit.`,
          mitigation: `Offer a frictionless, zero-setup demo flow that delivers tangible value within 90 seconds without requiring a credit card.`
        },
        {
          name: 'Competitive Feature Replication',
          severity: 'med',
          detail: `A larger horizontal competitor could clone your core feature into their broader suite.`,
          mitigation: `Double down on deep niche customization and workflow integrations that horizontal competitors consider too small to service.`
        },
        {
          name: 'Platform or Dependency Shift',
          severity: score > 75 ? 'low' : 'med',
          detail: `Changes in third-party API pricing, platform terms, or browser restrictions could impact unit economics.`,
          mitigation: `Architect modular abstraction layers so underlying data sources and APIs can be swapped without rewriting the user interface.`
        }
      ];

      return { strengths, weaknesses, risks };
    },

    generatePersona: function (input) {
      let name = 'Alex, 31';
      let role = 'Solo Creative Studio Lead';
      let avatar = '🎨';
      let demo = 'Tech-Savvy • High Workload • Solopreneur';
      let quote = 'I waste hours every week wrestling with clunky manual workflows when I should be delivering for high-paying clients.';
      let jtbd = 'Eliminate administrative friction so I can focus 100% on revenue-generating deliverables.';

      const audLower = input.audience.toLowerCase();
      if (audLower.includes('developer') || audLower.includes('engineer') || audLower.includes('cs student') || audLower.includes('student')) {
        name = 'Devon, 23';
        role = 'Junior Developer & Job Seeker';
        avatar = '💻';
        demo = 'Self-Taught • Fast Learner • Outcome-Driven';
        quote = 'Generic tutorials are boring. I need hands-on practice that mirrors real company production code.';
        jtbd = 'Fast-track technical mastery and build verifiable portfolio proof to land my next role.';
      } else if (audLower.includes('remote') || audLower.includes('team') || audLower.includes('health') || audLower.includes('worker')) {
        name = 'Maya, 34';
        role = 'Remote Product Manager & Knowledge Worker';
        avatar = '💼';
        demo = 'Desk-Bound • Health-Conscious • Time-Constrained';
        quote = 'I am trapped in back-to-back video calls all day. If a solution takes more than 5 minutes to set up, I will drop it.';
        jtbd = 'Seamlessly automate my routine health and workflow habits directly around my existing calendar.';
      } else if (audLower.includes('retail') || audLower.includes('smb') || audLower.includes('store') || audLower.includes('ecommerce') || audLower.includes('d2c')) {
        name = 'Marcus, 39';
        role = 'D2C Brand Owner & Operations Director';
        avatar = '📦';
        demo = 'Margin-Sensitive • Inventory-Focused • Multi-Channel';
        quote = 'Every dollar saved on packaging and shipping directly bolsters our bottom line. We need vetted, reliable suppliers.';
        jtbd = 'Source eco-friendly, compliant materials without risking stockouts or exorbitant minimum order quantities.';
      } else if (audLower.includes('founder') || audLower.includes('startup')) {
        name = 'Elena, 29';
        role = 'Early-Stage Tech Founder';
        avatar = '🚀';
        demo = 'Rapid Experimenter • Bootstrapper • High Ambition';
        quote = 'Speed is our only unfair advantage. I need tools that help us validate hypotheses and collect cash in days, not quarters.';
        jtbd = 'Systematically de-risk launch execution and land initial paying design partners before running out of runway.';
      }

      return {
        avatar,
        name,
        role,
        demographics: demo,
        quote,
        jtbd,
        painPoints: [
          `Wastes 6-12 hours per week on fragmented, manual tasks that lack centralized automation.`,
          `Frustrated by bloated enterprise software priced far beyond indie or SMB budgets.`,
          `High cognitive switching cost between disconnected browser tabs and legacy tools.`
        ],
        outcomes: [
          `Reclaim at least 1 full workday every week for high-leverage business growth.`,
          `Deliver a seamless, professional experience that boosts customer retention and trust.`,
          `Attain predictable, transparent operational metrics with zero spreadsheet maintenance.`
        ],
        payTriggers: [
          `Directly saves > $200/mo in outsourced labor or software subscriptions.`,
          `Clear 14-day ROI guarantee or instant 5-minute time-saving proof.`,
          `Transparent monthly flat pricing with no predatory surprise overage fees.`
        ],
        channels: [
          '🎯 Niche Subreddits & Indie Communities',
          '💼 LinkedIn InMail & Founder DMs',
          '🐦 X / Twitter Builder Community',
          '💬 Specialized Discord / Slack Groups',
          '📧 Direct Personalized Cold Outreach'
        ]
      };
    },

    generateMVP: function (input) {
      return [
        {
          id: 'feat_1',
          priority: 'p0',
          title: `Core Value Engine: 1-Click Solution Generator`,
          desc: `The central workflow allowing ${input.audience} to input their core data and receive the promised primary output within 60 seconds.`,
          effort: 'Launch Blocker',
          rationale: `Without this primary utility, no value exchange takes place. Must be fast, intuitive, and reliable.`
        },
        {
          id: 'feat_2',
          priority: 'p0',
          title: `User Authentication & Workspace Provisioning`,
          desc: `Magic-link authentication, instant workspace setup, and a guided 3-step tour delivering the initial quick win.`,
          effort: 'Medium Effort',
          rationale: `Reduces day-1 activation drop-off and secures user data integrity.`
        },
        {
          id: 'feat_3',
          priority: 'p0',
          title: `Stripe Checkout & Billing Entitlement Gate`,
          desc: `Self-serve subscription checkout with automated billing portal and immediate feature unlock upon successful transaction.`,
          effort: 'Low Effort',
          rationale: `Validates willingness to pay from day one. Essential for early revenue feedback.`
        },
        {
          id: 'feat_4',
          priority: 'p1',
          title: `Actionable Dashboard & History Log`,
          desc: `A clean visual repository allowing users to review, filter, duplicate, and export previous outputs or transactions.`,
          effort: 'Medium Effort',
          rationale: `Encourages recurring daily/weekly usage and strengthens switching barrier moat.`
        },
        {
          id: 'feat_5',
          priority: 'p1',
          title: `Custom Export & Sharing (PDF / CSV / Link)`,
          desc: `Branded export formats allowing users to share results with team members, clients, or external stakeholders.`,
          effort: 'Low Effort',
          rationale: `Acts as a natural viral loop when users share outputs with non-registered prospects.`
        },
        {
          id: 'feat_6',
          priority: 'p1',
          title: `Automated Email & Status Notification Alerts`,
          desc: `Contextual email/SMS updates on critical task deadlines, status changes, or weekly executive summaries.`,
          effort: 'Low Effort',
          rationale: `Re-engages dormant users and reinforces perceived ongoing software value.`
        },
        {
          id: 'feat_7',
          priority: 'p2',
          title: `Team Collaboration & Multi-Seat Roles`,
          desc: `Multi-seat workspace allowing team leads to invite contributors with granular view/edit privileges.`,
          effort: 'Post-Launch',
          rationale: `Valuable for expansion revenue, but unnecessary for validating core single-player MVP value.`
        },
        {
          id: 'feat_8',
          priority: 'p2',
          title: `Public Webhook API & Zapier Ecosystem`,
          desc: `Public API endpoints and third-party workflow triggers to automate data ingestion from external platforms.`,
          effort: 'Version 2.0',
          rationale: `Focus on making the native product magical before managing public API integrations.`
        }
      ];
    },

    generateStarterCompetitors: function (input) {
      return [
        {
          id: 'comp_1',
          name: 'Legacy Enterprise Suite',
          desc: 'High-cost horizontal incumbent with extensive feature sets but complex onboarding.',
          pricing: '$120 - $350 / user / mo',
          strengths: 'Established brand equity, extensive integrations, enterprise security compliance.',
          weaknesses: 'Prohibitive pricing for smaller teams, steep learning curve, slow customer support turnaround.'
        },
        {
          id: 'comp_2',
          name: 'Manual Spreadsheets & Email',
          desc: 'The default status-quo habit. Free but fragile, fragmented, and prone to human oversight.',
          pricing: '$0 (Default habit)',
          strengths: 'Zero friction to start, highly customizable to idiosyncratic personal habits.',
          weaknesses: 'No automated enforcement, zero live synchronization, significant daily time sink.'
        },
        {
          id: 'comp_3',
          name: 'Point Solution Alternative',
          desc: 'A modern lightweight tool solving one narrow step of the overall problem.',
          pricing: '$15 - $29 / month',
          strengths: 'Simple single-purpose UI, fast initial setup time.',
          weaknesses: 'Lacks end-to-end integration, forces users to jump between disconnected tabs.'
        }
      ];
    },

    generateMonetization: function (input, ind) {
      let basePrice = 29;
      if (input.industry === 'saas' || input.industry === 'fintech') basePrice = 49;
      if (input.industry === 'edtech' || input.industry === 'health') basePrice = 19;
      if (input.industry === 'ecommerce' || input.industry === 'logistics') basePrice = 79;

      const tiers = [
        {
          name: 'Starter Tier',
          price: `$${Math.round(basePrice * 0.5)}`,
          period: '/ month',
          desc: `Ideal for solo creators and freelancers getting started.`,
          featured: false,
          features: [
            'Core MVP Solution Engine access',
            'Up to 25 automated operations / month',
            'Standard email support (48h turnaround)',
            'Standard data export (PDF/CSV)'
          ]
        },
        {
          name: 'Pro / Growth Tier',
          price: `$${basePrice}`,
          period: '/ month',
          desc: `Most popular for active professionals needing uninterrupted workflows.`,
          featured: true,
          features: [
            'Unlimited core processing & generation',
            'Advanced priority queueing & zero latency',
            'Priority email & chat support (< 6h)',
            'Custom branding on client deliverables',
            'Early access to weekly feature drops'
          ]
        },
        {
          name: 'Studio / Team Tier',
          price: `$${Math.round(basePrice * 2.8)}`,
          period: '/ month',
          desc: `For scaling agencies and small teams demanding centralized governance.`,
          featured: false,
          features: [
            'Includes up to 5 team member seats',
            'Centralized billing & usage audit logs',
            'Dedicated onboarding concierge call',
            'Custom integration roadmap priority'
          ]
        }
      ];

      const secondaryStreams = [
        {
          name: 'Annual Prepay Discount (Upfront Cash Flow)',
          desc: `Offer 2 months free (approx. 17% discount) for upfront annual billing to generate upfront working capital and slash monthly churn.`
        },
        {
          name: 'Concierge Onboarding & Setup Service ($299 One-Time)',
          desc: `A high-touch white-glove setup service where the founder configures the client's initial workspace and templates, proving willingness to pay.`
        },
        {
          name: 'Pay-As-You-Go Overages & Add-on Packs',
          desc: `Sell supplementary credit packs for heavy users exceeding monthly limits without forcing an immediate full tier upgrade.`
        }
      ];

      return {
        primaryModel: input.businessModel === 'auto' ? 'Tiered B2B SaaS Subscription' : input.businessModel.toUpperCase(),
        rationale: `Predictable recurrent cash flow aligned with continuous value delivery. Low friction monthly commitments with high lifetime expansion potential.`,
        targetMargin: ind.margin,
        tiers,
        secondaryStreams
      };
    },

    // 7-Day Roadmap (Requirement 6)
    generateRoadmap: function (input) {
      return [
        {
          day: 1,
          theme: 'Validate the Problem',
          tasks: [
            {
              id: 'task_d1_1',
              title: `Draft a 1-page Problem Interview Script focused on ${input.audience}'s acute friction points.`,
              hint: `Ask: 'How do you currently handle this, and what did you spend fixing it last month?' Avoid asking speculative questions like 'Would you buy this?'`
            },
            {
              id: 'task_d1_2',
              title: `Directly message 15 target prospects across LinkedIn, Twitter DMs, or community forums with personalized non-sales notes.`,
              hint: `Aim for 4-5 quick 10-minute feedback chats. Offer genuine peer insights in return.`
            },
            {
              id: 'task_d1_3',
              title: `Synthesize feedback to verify problem severity and confirm willingness to pay.`,
              hint: `If at least 3 people do not express serious urgency, tighten your problem definition before writing any code.`
            }
          ]
        },
        {
          day: 2,
          theme: 'Research Target Customers',
          tasks: [
            {
              id: 'task_d2_1',
              title: `Map out the customer buying trigger: identify the exact moment they realize they need a solution.`,
              hint: `Document the trigger event (e.g., missed invoice deadline, rejected proposal, client onboarding delay).`
            },
            {
              id: 'task_d2_2',
              title: `Formulate a crisp 1-sentence value proposition: 'We help [Audience] achieve [Outcome] without [Friction].'`,
              hint: `Test 3 variations with peer founders or target prospects to measure instant comprehension.`
            },
            {
              id: 'task_d2_3',
              title: `Identify the top 3 high-converting online channels where ${input.audience} actively congregate.`,
              hint: `Focus on niche subreddits, specialized Slack/Discord groups, or LinkedIn community threads.`
            }
          ]
        },
        {
          day: 3,
          theme: 'Study Competitors',
          tasks: [
            {
              id: 'task_d3_1',
              title: `Document 3 direct and indirect alternatives in your Competitor Analysis matrix.`,
              hint: `Benchmark their pricing models, advertised features, and user reviews on G2 / Capterra / Reddit.`
            },
            {
              id: 'task_d3_2',
              title: `Identify competitor blind spots (e.g., poor UI, overpriced tiers, bloated setup time).`,
              hint: `Position your product as the streamlined, specialized alternative built specifically for ${input.audience}.`
            },
            {
              id: 'task_d3_3',
              title: `Establish your unfair wedge advantage: define the 1 thing your product does 10x faster or simpler.`,
              hint: `A narrower focus beats a broad suite every time in the early validation stage.`
            }
          ]
        },
        {
          day: 4,
          theme: 'Finalize MVP Features',
          tasks: [
            {
              id: 'task_d4_1',
              title: `Audit your MVP Builder list and lock in the P0 Must-Have feature set.`,
              hint: `Ruthlessly defer non-critical features to P1 or P2. Focus 100% on delivering the core value exchange.`
            },
            {
              id: 'task_d4_2',
              title: `Map the end-to-end user journey from landing page to initial successful output in 3 clicks or less.`,
              hint: `Reduce onboarding friction to deliver the user's "aha" moment within the first 90 seconds.`
            },
            {
              id: 'task_d4_3',
              title: `Set up a clean Stripe Checkout link or pre-order payment button.`,
              hint: `Validating financial transactions early proves true market demand.`
            }
          ]
        },
        {
          day: 5,
          theme: 'Create a Basic Prototype',
          tasks: [
            {
              id: 'task_d5_1',
              title: `Assemble the working MVP prototype using your chosen stack or no-code tools.`,
              hint: `Ensure the core input-to-output engine works reliably before adding any secondary polish.`
            },
            {
              id: 'task_d5_2',
              title: `Build a clean, high-converting single-page landing page featuring headline, 3 benefit cards, and CTA.`,
              hint: `Keep it clear and minimalist. Highlight the transformation your product delivers.`
            },
            {
              id: 'task_d5_3',
              title: `Perform an internal stress test: run through the complete flow 5 times on desktop and mobile.`,
              hint: `Check for layout breakage, slow load times, and broken form validation.`
            }
          ]
        },
        {
          day: 6,
          theme: 'Collect Feedback',
          tasks: [
            {
              id: 'task_d6_1',
              title: `Share the prototype with the validated Day 1 prospects for private beta testing.`,
              hint: `Ask them to share their screen while using it without coaching them. Note where they hesitate.`
            },
            {
              id: 'task_d6_2',
              title: `Collect at least 2 authentic testimonial quotes from early testers.`,
              hint: `Focus on tangible outcomes: 'Before [Startup], I spent X hours. Now I finish in Y minutes.'`
            },
            {
              id: 'task_d6_3',
              title: `Fix high-friction blockers identified during beta testing.`,
              hint: `Only fix critical bugs that prevent users from experiencing the core value. Ignore minor styling requests.`
            }
          ]
        },
        {
          day: 7,
          theme: 'Finalize the Launch Strategy',
          tasks: [
            {
              id: 'task_d7_1',
              title: `Launch publicly on Product Hunt, Hacker News Show HN, and relevant founder communities.`,
              hint: `Write a compelling maker story explaining why you built this and what problem it solves.`
            },
            {
              id: 'task_d7_2',
              title: `Send a dedicated broadcast email to your early access waitlist with a limited-time launch offer.`,
              hint: `Offer a 'Founding Member' lifetime discount or bonus setup call to spur immediate conversions.`
            },
            {
              id: 'task_d7_3',
              title: `Review Day 7 conversion metrics and outline the next sprint priorities.`,
              hint: `Double down on the single marketing channel that produced your highest-converting visitors.`
            }
          ]
        }
      ];
    }
  };

  // =========================================================================
  // 5. LOCALSTORAGE PERSISTENCE & PLAN MANAGEMENT
  // =========================================================================
  function sanitizeData(val) {
    if (val === null || typeof val !== 'object') return val;
    if (Array.isArray(val)) {
      return val.map(sanitizeData);
    }
    const clean = {};
    for (const key of Object.keys(val)) {
      if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
        continue;
      }
      clean[key] = sanitizeData(val[key]);
    }
    return clean;
  }

  const PlanManager = {
    getAll: function () {
      try {
        const raw = localStorage.getItem(STORAGE_KEY_PLANS);
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];
        return parsed.map(sanitizeData);
      } catch (e) {
        console.error('Failed to parse saved plans from localStorage', e);
        return [];
      }
    },

    saveAll: function (plans) {
      try {
        const sanitized = sanitizeData(plans);
        localStorage.setItem(STORAGE_KEY_PLANS, JSON.stringify(sanitized));
        state.savedPlans = sanitized;
        this.updateBadge();
        UI.updateStatsStrip();
      } catch (e) {
        console.error('Failed to write to localStorage', e);
        if (e && (e.name === 'QuotaExceededError' || e.code === 22 || e.code === 1014)) {
          Toast.show('Storage quota exceeded. Please export or delete older plans.', 'error');
          if (UI.announce) UI.announce('Storage quota exceeded. Please export or delete older plans.');
        } else {
          Toast.show('Storage error: unable to save plan locally.', 'warning');
          if (UI.announce) UI.announce('Storage error: unable to save plan locally.');
        }
      }
    },

    saveCurrentPlan: function () {
      if (!state.currentPlan) return;
      const plans = this.getAll();
      const existingIdx = plans.findIndex(p => p.id === state.currentPlan.id);

      if (existingIdx >= 0) {
        plans[existingIdx] = state.currentPlan;
      } else {
        plans.unshift(state.currentPlan);
      }

      this.saveAll(plans);
      Toast.show(`Saved "${state.currentPlan.name}" to your blueprints!`, 'success');
      this.renderSavedList();
      if (elements.saveBtnText) elements.saveBtnText.textContent = 'Saved ✓';
    },

    deletePlan: function (id) {
      const plan = this.getAll().find(p => p.id === id);
      const planName = plan ? plan.name : 'this plan';

      if (!confirm(`Are you sure you want to delete "${planName}"? This action cannot be undone.`)) {
        return;
      }

      const plans = this.getAll().filter(p => p.id !== id);
      this.saveAll(plans);
      this.renderSavedList();
      Toast.show(`Deleted "${planName}".`, 'info');

      if (state.currentPlan && state.currentPlan.id === id) {
        state.currentPlan = null;
        UI.switchSection('landing');
      }
    },

    loadPlan: function (id) {
      const plans = this.getAll();
      const plan = plans.find(p => p.id === id);
      if (!plan) return;

      plan.completedMvpFeatures = plan.completedMvpFeatures || [];
      plan.completedTasks = plan.completedTasks || [];
      plan.competitors = plan.competitors || (plan.analysis && plan.analysis.competitors ? [...plan.analysis.competitors] : []);

      state.currentPlan = plan;
      UI.renderDashboard(plan);
      UI.switchSection('dashboard');
      UI.closeModal(elements.savedPlansModal);
      Toast.show(`Loaded "${plan.name}"`, 'info');
    },

    updateBadge: function () {
      const count = state.savedPlans.length;
      if (elements.savedCount) elements.savedCount.textContent = count;
      if (elements.modalSavedCount) elements.modalSavedCount.textContent = count;
      if (elements.stripSavedVal) elements.stripSavedVal.textContent = count;
    },

    renderSavedList: function (filterQuery = '') {
      const container = elements.savedPlansList;
      if (!container) return;

      let plans = this.getAll();
      if (filterQuery.trim()) {
        const q = filterQuery.toLowerCase();
        plans = plans.filter(p => 
          p.name.toLowerCase().includes(q) ||
          p.industry.toLowerCase().includes(q) ||
          p.audience.toLowerCase().includes(q)
        );
      }

      if (plans.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-icon">📂</div>
            <h4>No saved startup blueprints found</h4>
            <p>Generate an analysis and click "Save Plan" to revisit your blueprints anytime.</p>
          </div>
        `;
        return;
      }

      container.innerHTML = plans.map(p => {
        const completedTasks = p.completedTasks ? p.completedTasks.length : 0;
        const progressPct = Math.round((completedTasks / 21) * 100);
        const dateStr = p.createdAt ? new Date(p.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

        return `
          <div class="saved-plan-item" data-id="${p.id}">
            <div class="saved-plan-info">
              <div class="saved-plan-name">${escapeHTML(p.name)}</div>
              <div class="saved-plan-meta">
                <span class="tag tag-industry">${p.industry.toUpperCase()}</span>
                <span>Score: <strong>${p.analysis ? p.analysis.overallScore : '--'}%</strong></span>
                <span>Sprint: <strong>${progressPct}%</strong></span>
                <span>Saved ${dateStr}</span>
              </div>
            </div>
            <div class="saved-plan-actions">
              <button class="btn btn-primary btn-sm btn-load-plan" data-id="${p.id}">Open</button>
              <button class="btn btn-outline btn-sm btn-delete-plan" data-id="${p.id}" title="Delete Plan">🗑️</button>
            </div>
          </div>
        `;
      }).join('');

      // Attach button listeners
      container.querySelectorAll('.btn-load-plan').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          PlanManager.loadPlan(id);
        });
      });

      container.querySelectorAll('.btn-delete-plan').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const id = e.currentTarget.getAttribute('data-id');
          PlanManager.deletePlan(id);
        });
      });
    }
  };

  // =========================================================================
  // 6. UI RENDERING & CONTROLLER
  // =========================================================================
  const UI = {
    init: function () {
      state.savedPlans = PlanManager.getAll();
      PlanManager.updateBadge();

      this.bindEvents();
      this.initFormCounters();

      // Show landing page by default
      this.switchSection('landing');
    },

    bindEvents: function () {
      // Nav Brand
      elements.brandHome.addEventListener('click', () => this.switchSection('landing'));
      elements.navLanding.addEventListener('click', () => this.switchSection('landing'));
      
      // Nav Smooth Scroll Links
      if (elements.navHowItWorks) {
        elements.navHowItWorks.addEventListener('click', () => {
          this.switchSection('landing');
          setTimeout(() => {
            if (elements.howItWorksSection) {
              elements.howItWorksSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        });
      }

      if (elements.navFeatures) {
        elements.navFeatures.addEventListener('click', () => {
          this.switchSection('landing');
          setTimeout(() => {
            if (elements.featuresSection) {
              elements.featuresSection.scrollIntoView({ behavior: 'smooth' });
            }
          }, 100);
        });
      }

      elements.navPlanner.addEventListener('click', () => this.switchSection('planner'));
      elements.navSaved.addEventListener('click', () => {
        PlanManager.renderSavedList();
        this.openModal(elements.savedPlansModal);
      });

      // Quick Idea Nav
      elements.btnQuickSample.addEventListener('click', () => {
        this.fillPreset('saas');
        this.switchSection('planner');
      });

      elements.btnNavGetStarted.addEventListener('click', () => this.switchSection('planner'));
      elements.btnHeroStart.addEventListener('click', () => this.switchSection('planner'));

      if (elements.btnHeroExplore) {
        elements.btnHeroExplore.addEventListener('click', () => {
          if (elements.featuresSection) {
            elements.featuresSection.scrollIntoView({ behavior: 'smooth' });
          }
        });
      }

      // Hero Sample Plan Runner
      elements.btnHeroSample.addEventListener('click', () => {
        this.fillPreset('saas');
        this.runFormAnalysis();
      });

      // Preset Buttons
      document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const presetKey = e.currentTarget.getAttribute('data-preset');
          this.fillPreset(presetKey);
        });
      });

      // Quick Audience Tags
      if (elements.audienceTags) {
        elements.audienceTags.querySelectorAll('.quick-tag').forEach(tag => {
          tag.addEventListener('click', (e) => {
            elements.targetAudience.value = e.target.textContent;
            elements.targetAudience.focus();
            if (elements.audienceError) elements.audienceError.style.display = 'none';
          });
        });
      }

      // Form Submission
      elements.startupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.runFormAnalysis();
      });

      // Dashboard Toolbar
      elements.btnEditInputs.addEventListener('click', () => {
        this.switchSection('planner');
      });

      elements.btnSavePlan.addEventListener('click', () => {
        PlanManager.saveCurrentPlan();
      });

      elements.btnPrintDossier.addEventListener('click', () => {
        window.print();
      });

      elements.btnNewIdea.addEventListener('click', () => {
        elements.startupForm.reset();
        elements.charCount.textContent = '0';
        this.switchSection('planner');
      });

      // Dashboard Tabs (with WAI-ARIA arrow key navigation)
      const tabList = Array.from(elements.dashTabs);
      tabList.forEach((tab, index) => {
        tab.addEventListener('click', (e) => {
          const tabKey = e.currentTarget.getAttribute('data-tab');
          this.switchDashboardTab(tabKey);
        });

        tab.addEventListener('keydown', (e) => {
          let newIndex = null;
          if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            newIndex = (index + 1) % tabList.length;
          } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            newIndex = (index - 1 + tabList.length) % tabList.length;
          } else if (e.key === 'Home') {
            e.preventDefault();
            newIndex = 0;
          } else if (e.key === 'End') {
            e.preventDefault();
            newIndex = tabList.length - 1;
          }

          if (newIndex !== null) {
            const nextTab = tabList[newIndex];
            const nextKey = nextTab.getAttribute('data-tab');
            this.switchDashboardTab(nextKey);
            nextTab.focus();
          }
        });
      });

      // MVP Builder Controls
      elements.mvpFilterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
          elements.mvpFilterBtns.forEach(b => b.classList.remove('active'));
          e.currentTarget.classList.add('active');
          const filter = e.currentTarget.getAttribute('data-filter');
          state.mvpFilter = filter;
          if (state.currentPlan && state.currentPlan.analysis) {
            this.renderMVPFeatures(state.currentPlan.analysis.mvp, filter);
          }
        });
      });

      if (elements.btnToggleAddMvp) {
        elements.btnToggleAddMvp.addEventListener('click', () => {
          const isVisible = elements.addFeatureBox.style.display !== 'none';
          elements.addFeatureBox.style.display = isVisible ? 'none' : 'block';
          if (!isVisible) elements.newFeatureTitle.focus();
        });
      }

      if (elements.btnSaveCustomFeature) {
        elements.btnSaveCustomFeature.addEventListener('click', () => {
          this.addCustomFeature();
        });
      }

      // Competitor Analysis Controls
      if (elements.btnToggleAddCompetitor) {
        elements.btnToggleAddCompetitor.addEventListener('click', () => {
          elements.addCompetitorBox.style.display = 'block';
          elements.compName.focus();
        });
      }

      if (elements.btnCancelAddCompetitor) {
        elements.btnCancelAddCompetitor.addEventListener('click', () => {
          elements.addCompetitorBox.style.display = 'none';
        });
      }

      if (elements.btnSaveCompetitor) {
        elements.btnSaveCompetitor.addEventListener('click', () => {
          this.addCompetitor();
        });
      }

      // Roadmap Controls
      elements.btnResetTasks.addEventListener('click', () => {
        if (!state.currentPlan) return;
        state.currentPlan.completedTasks = [];
        this.updateRoadmapProgress();
        this.renderRoadmapDays(state.currentPlan.analysis.roadmap, state.currentPlan.completedTasks);
        this.updateStatsStrip();
        PlanManager.saveCurrentPlan();
        Toast.show('Sprint checklist reset.', 'info');
      });

      elements.btnCompleteAllTasks.addEventListener('click', () => {
        if (!state.currentPlan) return;
        const allIds = [];
        state.currentPlan.analysis.roadmap.forEach(day => {
          day.tasks.forEach(t => allIds.push(t.id));
        });
        state.currentPlan.completedTasks = allIds;
        this.updateRoadmapProgress();
        this.renderRoadmapDays(state.currentPlan.analysis.roadmap, state.currentPlan.completedTasks);
        this.updateStatsStrip();
        PlanManager.saveCurrentPlan();
        Toast.show('All sprint tasks marked complete! 🚀', 'success');
      });

      // Modals
      elements.btnCloseSavedModal.addEventListener('click', () => this.closeModal(elements.savedPlansModal));
      elements.btnDismissSaved.addEventListener('click', () => this.closeModal(elements.savedPlansModal));
      elements.btnCreateNewFromSaved.addEventListener('click', () => {
        this.closeModal(elements.savedPlansModal);
        elements.startupForm.reset();
        this.switchSection('planner');
      });

      elements.searchSavedPlans.addEventListener('input', (e) => {
        PlanManager.renderSavedList(e.target.value);
      });

      elements.btnExportAllPlans.addEventListener('click', () => {
        const plans = PlanManager.getAll();
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(plans, null, 2));
        const dlAnchor = document.createElement('a');
        dlAnchor.setAttribute('href', dataStr);
        dlAnchor.setAttribute('download', 'launchpad_startup_blueprints.json');
        dlAnchor.click();
        Toast.show('Exported plans backup JSON.', 'success');
      });

      // Close modal on outside click
      if (elements.savedPlansModal) {
        elements.savedPlansModal.addEventListener('click', (e) => {
          if (e.target === elements.savedPlansModal) this.closeModal(elements.savedPlansModal);
        });
      }
    },

    initFormCounters: function () {
      elements.startupIdea.addEventListener('input', () => {
        const len = elements.startupIdea.value.length;
        elements.charCount.textContent = len;
        if (len >= 25 && elements.ideaError) {
          elements.ideaError.style.display = 'none';
        }
      });

      elements.startupName.addEventListener('input', () => {
        if (elements.startupName.value.trim() && elements.nameError) {
          elements.nameError.style.display = 'none';
        }
      });

      elements.startupIndustry.addEventListener('change', () => {
        if (elements.startupIndustry.value && elements.industryError) {
          elements.industryError.style.display = 'none';
        }
      });

      elements.targetAudience.addEventListener('input', () => {
        if (elements.targetAudience.value.trim() && elements.audienceError) {
          elements.audienceError.style.display = 'none';
        }
      });
    },

    fillPreset: function (key) {
      const preset = SAMPLE_PRESETS[key];
      if (!preset) return;

      elements.startupName.value = preset.name;
      elements.startupIdea.value = preset.idea;
      elements.charCount.textContent = preset.idea.length;
      elements.startupIndustry.value = preset.industry;
      elements.targetAudience.value = preset.audience;
      elements.customBudget.value = preset.customBudget;
      elements.businessModel.value = preset.businessModel;
      elements.startupStage.value = preset.stage;

      const radio = document.querySelector(`input[name="budgetTier"][value="${preset.budgetTier}"]`);
      if (radio) radio.checked = true;

      // Clear any errors
      [elements.nameError, elements.ideaError, elements.industryError, elements.audienceError].forEach(err => {
        if (err) err.style.display = 'none';
      });

      Toast.show(`Loaded preset: ${preset.name}`, 'info');
    },

    validateForm: function () {
      let isValid = true;
      let firstInvalidEl = null;

      const name = elements.startupName.value.trim();
      const idea = elements.startupIdea.value.trim();
      const industry = elements.startupIndustry.value;
      const audience = elements.targetAudience.value.trim();

      if (!name || name.length > 80) {
        elements.nameError.style.display = 'block';
        elements.startupName.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = elements.startupName;
      } else {
        elements.nameError.style.display = 'none';
        elements.startupName.setAttribute('aria-invalid', 'false');
      }

      if (!idea || idea.length < 25 || idea.length > 600) {
        elements.ideaError.style.display = 'block';
        elements.startupIdea.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = elements.startupIdea;
      } else {
        elements.ideaError.style.display = 'none';
        elements.startupIdea.setAttribute('aria-invalid', 'false');
      }

      if (!industry) {
        elements.industryError.style.display = 'block';
        elements.startupIndustry.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = elements.startupIndustry;
      } else {
        elements.industryError.style.display = 'none';
        elements.startupIndustry.setAttribute('aria-invalid', 'false');
      }

      if (!audience || audience.length > 100) {
        elements.audienceError.style.display = 'block';
        elements.targetAudience.setAttribute('aria-invalid', 'true');
        isValid = false;
        if (!firstInvalidEl) firstInvalidEl = elements.targetAudience;
      } else {
        elements.audienceError.style.display = 'none';
        elements.targetAudience.setAttribute('aria-invalid', 'false');
      }

      // Check custom budget bounds if entered
      if (elements.customBudget && elements.customBudget.value) {
        const val = parseInt(elements.customBudget.value, 10);
        if (isNaN(val) || val < 50 || val > 1000000) {
          elements.customBudget.setAttribute('aria-invalid', 'true');
          isValid = false;
          if (!firstInvalidEl) firstInvalidEl = elements.customBudget;
          Toast.show('Custom budget must be between $50 and $1,000,000.', 'warning');
        } else {
          elements.customBudget.setAttribute('aria-invalid', 'false');
        }
      }

      if (!isValid && firstInvalidEl) {
        firstInvalidEl.focus();
        if (this.announce) {
          this.announce('Form validation failed. Please check the highlighted errors.');
        }
      }

      return isValid;
    },

    runFormAnalysis: function () {
      if (!this.validateForm()) {
        Toast.show('Please complete all required fields with valid details.', 'warning');
        return;
      }

      const budgetTierChecked = document.querySelector('input[name="budgetTier"]:checked');
      const input = {
        name: elements.startupName.value.trim(),
        idea: elements.startupIdea.value.trim(),
        industry: elements.startupIndustry.value,
        audience: elements.targetAudience.value.trim(),
        budgetTier: budgetTierChecked ? budgetTierChecked.value : 'bootstrap',
        customBudget: elements.customBudget.value ? elements.customBudget.value : null,
        businessModel: elements.businessModel.value,
        stage: elements.startupStage.value
      };

      // Show loading state
      const btnText = elements.btnSubmitForm.querySelector('.btn-text');
      const btnLoading = elements.btnSubmitForm.querySelector('.btn-loading');
      if (btnText && btnLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        elements.btnSubmitForm.disabled = true;
      }

      setTimeout(() => {
        // Execute rule-based analysis
        const analysis = RuleEngine.analyze(input);

        // Build plan object with interactive state tracking
        const newPlan = {
          id: 'plan_' + Date.now(),
          name: input.name,
          idea: input.idea,
          industry: input.industry,
          audience: input.audience,
          budgetTier: input.budgetTier,
          customBudget: input.customBudget,
          businessModel: input.businessModel,
          stage: input.stage,
          analysis: analysis,
          completedMvpFeatures: [],
          competitors: analysis.competitors ? [...analysis.competitors] : [],
          completedTasks: [],
          createdAt: new Date().toISOString()
        };

        state.currentPlan = newPlan;

        // Render dashboard
        this.renderDashboard(newPlan);
        this.switchSection('dashboard');

        // Reset button
        if (btnText && btnLoading) {
          btnText.style.display = 'inline-flex';
          btnLoading.style.display = 'none';
          elements.btnSubmitForm.disabled = false;
        }

        if (elements.saveBtnText) elements.saveBtnText.textContent = 'Save Plan';
        Toast.show('Startup Blueprint generated successfully! ⚡', 'success');
      }, 400);
    },

    renderDashboard: function (plan) {
      if (!plan) return;

      plan.completedMvpFeatures = plan.completedMvpFeatures || [];
      plan.completedTasks = plan.completedTasks || [];
      plan.competitors = plan.competitors || (plan.analysis && plan.analysis.competitors ? [...plan.analysis.competitors] : []);

      // Header Info
      elements.dashPlanName.textContent = plan.name;
      elements.dashPlanDesc.textContent = plan.idea;
      elements.dashTagIndustry.textContent = plan.industry.toUpperCase();
      elements.dashTagBudget.textContent = plan.budgetTier.toUpperCase();
      elements.dashTagAudience.textContent = plan.audience;

      const a = plan.analysis;

      // 1. Feasibility Score & Circular Gauge
      this.animateScore(a.overallScore);
      elements.scoreVerdictBadge.textContent = a.verdict.text;
      elements.scoreVerdictBadge.className = `score-verdict ${a.verdict.class}`;
      elements.scoreSummaryDesc.textContent = a.recommendation.body;

      // 4 Pillars
      this.renderPillars(a.pillars);

      // Problem & Solution Assessment + Market Opportunity
      if (a.problemEvaluation) {
        elements.evalProblemTitle.textContent = a.problemEvaluation.title;
        elements.evalProblemBody.textContent = a.problemEvaluation.body;
        elements.chipProblemUrgency.textContent = a.problemEvaluation.urgencyChip;
        elements.chipSolutionClarity.textContent = a.problemEvaluation.clarityChip;
      }

      if (a.marketOpportunity) {
        elements.evalMarketTitle.textContent = a.marketOpportunity.title;
        elements.evalMarketBody.textContent = a.marketOpportunity.body;
        elements.chipMarketGrowth.textContent = a.marketOpportunity.growthChip;
        elements.chipTimingWindow.textContent = a.marketOpportunity.timingChip;
      }

      // Next Steps
      elements.recHeadline.textContent = a.recommendation.headline;
      elements.recDetailedText.textContent = a.recommendation.body;
      if (a.nextSteps && elements.recNextStepsList) {
        elements.recNextStepsList.innerHTML = a.nextSteps.map((step, idx) => `
          <div class="next-step-item">
            <span class="next-step-num">${idx + 1}</span>
            <span>${escapeHTML(step)}</span>
          </div>
        `).join('');
      }

      // 2. SWOT & Risks
      this.renderSWOT(a.swot);

      // 3. Customer Persona
      this.renderPersona(a.persona);

      // 4. MVP Features
      this.renderMVPFeatures(a.mvp, state.mvpFilter);
      this.updateMvpProgress();

      // 5. Competitor Analysis (Requirement 7)
      this.renderCompetitors(plan.competitors || []);

      // 6. Monetization
      this.renderMonetization(a.monetization);

      // 7. 7-Day Sprint Roadmap & Tasks
      this.renderRoadmapDays(a.roadmap, plan.completedTasks || []);
      this.updateRoadmapProgress();

      // Update real stats strip
      this.updateStatsStrip();
    },

    updateStatsStrip: function () {
      if (!state.currentPlan) return;
      const plan = state.currentPlan;
      const a = plan.analysis;

      // Feasibility Score
      if (elements.stripScoreVal) elements.stripScoreVal.textContent = `${a.overallScore}%`;
      if (elements.stripScoreVerdict) elements.stripScoreVerdict.textContent = a.verdict ? a.verdict.text.split('–')[0].trim() : 'Viable';

      // MVP Stats
      const mvpTotal = a.mvp ? a.mvp.length : 8;
      const mvpBuilt = plan.completedMvpFeatures ? plan.completedMvpFeatures.length : 0;
      const mvpPct = Math.round((mvpBuilt / mvpTotal) * 100);
      if (elements.stripMvpVal) elements.stripMvpVal.textContent = `${mvpBuilt} / ${mvpTotal}`;
      if (elements.stripMvpPct) elements.stripMvpPct.textContent = `${mvpPct}% Built`;

      // Roadmap Stats
      const roadmapTotal = 21;
      const roadmapDone = plan.completedTasks ? plan.completedTasks.length : 0;
      const roadmapPct = Math.round((roadmapDone / roadmapTotal) * 100);
      if (elements.stripRoadmapVal) elements.stripRoadmapVal.textContent = `${roadmapDone} / ${roadmapTotal}`;
      if (elements.stripRoadmapPct) elements.stripRoadmapPct.textContent = `${roadmapPct}% Completed`;

      // Competitors Count
      const compCount = plan.competitors ? plan.competitors.length : 0;
      if (elements.stripCompetitorVal) elements.stripCompetitorVal.textContent = compCount;

      // Total Saved Plans
      const savedCount = state.savedPlans.length;
      if (elements.stripSavedVal) elements.stripSavedVal.textContent = savedCount;
    },

    animateScore: function (targetScore) {
      const circle = elements.scoreCircleProgress;
      const scoreVal = elements.overallScoreVal;
      const circumference = 2 * Math.PI * 58;

      let current = 0;
      const stepTime = 12;
      const step = Math.max(1, Math.round(targetScore / 40));

      const timer = setInterval(() => {
        current += step;
        if (current >= targetScore) {
          current = targetScore;
          clearInterval(timer);
        }
        scoreVal.textContent = current;
      }, stepTime);

      const offset = circumference - (targetScore / 100) * circumference;
      circle.style.strokeDasharray = circumference;
      circle.style.strokeDashoffset = offset;

      if (targetScore >= 80) {
        circle.style.stroke = '#29483C'; // Moss Green
      } else if (targetScore >= 60) {
        circle.style.stroke = '#D9AE52'; // Muted Gold
      } else {
        circle.style.stroke = '#D66A45'; // Terracotta
      }
    },

    renderPillars: function (pillars) {
      elements.pillarMarketVal.textContent = `${pillars.market.score}%`;
      elements.pillarMarketBar.style.width = `${pillars.market.score}%`;
      elements.pillarMarketRationale.textContent = pillars.market.rationale;

      elements.pillarTechVal.textContent = `${pillars.tech.score}%`;
      elements.pillarTechBar.style.width = `${pillars.tech.score}%`;
      elements.pillarTechRationale.textContent = pillars.tech.rationale;

      elements.pillarFinanceVal.textContent = `${pillars.finance.score}%`;
      elements.pillarFinanceBar.style.width = `${pillars.finance.score}%`;
      elements.pillarFinanceRationale.textContent = pillars.finance.rationale;

      elements.pillarMoatVal.textContent = `${pillars.moat.score}%`;
      elements.pillarMoatBar.style.width = `${pillars.moat.score}%`;
      elements.pillarMoatRationale.textContent = pillars.moat.rationale;
    },

    renderSWOT: function (swot) {
      elements.strengthsCount.textContent = `${swot.strengths.length} Strategic Drivers`;
      elements.strengthsList.innerHTML = swot.strengths.map(s => `
        <li class="swot-item">
          <strong>Key Strength</strong>
          ${escapeHTML(s)}
        </li>
      `).join('');

      elements.weaknessesCount.textContent = `${swot.weaknesses.length} Vulnerabilities`;
      elements.weaknessesList.innerHTML = swot.weaknesses.map(w => `
        <li class="swot-item">
          <strong>Watchout Friction</strong>
          ${escapeHTML(w)}
        </li>
      `).join('');

      elements.riskMatrixContainer.innerHTML = swot.risks.map(r => `
        <div class="risk-row">
          <div class="risk-name">${escapeHTML(r.name)}</div>
          <div>
            <span class="risk-severity severity-${r.severity}">
              ${r.severity.toUpperCase()} RISK
            </span>
          </div>
          <div class="risk-detail">${escapeHTML(r.detail)}</div>
          <div class="risk-mitigation">
            <strong>Actionable Mitigation Protocol</strong>
            ${escapeHTML(r.mitigation)}
          </div>
        </div>
      `).join('');
    },

    renderPersona: function (p) {
      elements.personaAvatar.textContent = p.avatar;
      elements.personaName.textContent = p.name;
      elements.personaRole.textContent = p.role;
      elements.personaDemographics.textContent = p.demographics;
      elements.personaQuote.textContent = p.quote;
      elements.personaJTBD.textContent = p.jtbd;

      elements.personaPainPoints.innerHTML = p.painPoints.map(pt => `
        <li class="tag-bullet-item">
          <span class="tag-bullet-dot"></span>
          <span>${escapeHTML(pt)}</span>
        </li>
      `).join('');

      elements.personaOutcomes.innerHTML = p.outcomes.map(out => `
        <li class="tag-bullet-item">
          <span class="tag-bullet-dot"></span>
          <span>${escapeHTML(out)}</span>
        </li>
      `).join('');

      elements.personaPayTriggers.innerHTML = p.payTriggers.map(trig => `
        <li>${escapeHTML(trig)}</li>
      `).join('');

      elements.personaChannels.innerHTML = p.channels.map(ch => `
        <span class="channel-pill">${escapeHTML(ch)}</span>
      `).join('');
    },

    // MVP Feature Rendering with Completion Checkboxes (Requirement 5)
    renderMVPFeatures: function (features, filter) {
      const container = elements.mvpFeaturesList;
      if (!container) return;

      let filtered = features;
      if (filter && filter !== 'all') {
        filtered = features.filter(f => f.priority === filter);
      }

      const completedFeatures = state.currentPlan && state.currentPlan.completedMvpFeatures 
        ? state.currentPlan.completedMvpFeatures 
        : [];

      container.innerHTML = filtered.map(f => {
        const isBuilt = completedFeatures.includes(f.id);
        const priorityLabels = {
          p0: 'Must Have (P0)',
          p1: 'Should Have (P1)',
          p2: 'Could Have (P2)'
        };

        return `
          <div class="mvp-feature-card ${isBuilt ? 'mvp-completed' : ''}" data-feature-id="${f.id}">
            <div>
              <input 
                type="checkbox" 
                class="mvp-checkbox" 
                data-feature-id="${f.id}" 
                ${isBuilt ? 'checked' : ''} 
                title="Mark feature as built"
              />
            </div>
            <div>
              <span class="priority-badge priority-${f.priority}">
                ${priorityLabels[f.priority] || f.priority.toUpperCase()}
              </span>
            </div>
            <div class="feature-info">
              <div class="feature-title">${escapeHTML(f.title)}</div>
              <div class="feature-desc">${escapeHTML(f.desc)}</div>
              <div class="feature-rationale">${escapeHTML(f.rationale)}</div>
            </div>
            <div class="feature-meta">
              <span class="effort-tag">${escapeHTML(f.effort)}</span>
              ${isBuilt ? '<span class="built-status-tag">✓ Built &amp; Verified</span>' : ''}
            </div>
          </div>
        `;
      }).join('');

      // Attach checkbox listeners
      container.querySelectorAll('.mvp-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const featId = e.target.getAttribute('data-feature-id');
          const isChecked = e.target.checked;
          const parentCard = e.target.closest('.mvp-feature-card');

          if (!state.currentPlan.completedMvpFeatures) {
            state.currentPlan.completedMvpFeatures = [];
          }

          if (isChecked) {
            parentCard.classList.add('mvp-completed');
            if (!state.currentPlan.completedMvpFeatures.includes(featId)) {
              state.currentPlan.completedMvpFeatures.push(featId);
            }
          } else {
            parentCard.classList.remove('mvp-completed');
            state.currentPlan.completedMvpFeatures = state.currentPlan.completedMvpFeatures.filter(id => id !== featId);
          }

          UI.updateMvpProgress();
          UI.updateStatsStrip();
          PlanManager.saveCurrentPlan();
        });
      });
    },

    updateMvpProgress: function () {
      if (!state.currentPlan || !state.currentPlan.analysis) return;
      const total = state.currentPlan.analysis.mvp ? state.currentPlan.analysis.mvp.length : 8;
      const built = state.currentPlan.completedMvpFeatures ? state.currentPlan.completedMvpFeatures.length : 0;
      const pct = Math.round((built / total) * 100);

      if (elements.mvpBuiltCount) elements.mvpBuiltCount.textContent = built;
      if (elements.mvpTotalCount) elements.mvpTotalCount.textContent = total;
      if (elements.mvpProgressBar) elements.mvpProgressBar.style.width = `${pct}%`;
      if (elements.mvpProgressBadge) elements.mvpProgressBadge.textContent = `${pct}%`;
    },

    addCustomFeature: function () {
      const title = elements.newFeatureTitle.value.trim();
      const priority = elements.newFeaturePriority.value;
      const rationale = elements.newFeatureRationale.value.trim() || 'Custom founder priority item.';

      if (!title) {
        Toast.show('Please enter a feature name.', 'warning');
        return;
      }

      const newFeat = {
        id: 'feat_custom_' + Date.now(),
        priority: priority,
        title: title,
        desc: 'Custom MVP feature defined during sprint planning.',
        effort: 'Custom Priority',
        rationale: rationale
      };

      if (!state.currentPlan.analysis.mvp) {
        state.currentPlan.analysis.mvp = [];
      }

      state.currentPlan.analysis.mvp.push(newFeat);
      this.renderMVPFeatures(state.currentPlan.analysis.mvp, state.mvpFilter);
      this.updateMvpProgress();
      this.updateStatsStrip();

      // Reset form
      elements.newFeatureTitle.value = '';
      elements.newFeatureRationale.value = '';
      elements.addFeatureBox.style.display = 'none';

      PlanManager.saveCurrentPlan();
      Toast.show(`Added "${title}" to your MVP roadmap.`, 'success');
    },

    // Competitor Analysis Rendering (Requirement 7)
    renderCompetitors: function (competitors) {
      const tbody = elements.competitorTableBody;
      if (!tbody) return;

      if (!competitors || competitors.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td colspan="6" style="text-align: center; color: var(--text-dim); padding: 24px;">
              No competitors tracked yet. Click "+ Add Competitor" to benchmark your market alternatives.
            </td>
          </tr>
        `;
        return;
      }

      tbody.innerHTML = competitors.map(c => `
        <tr data-comp-id="${c.id}">
          <td class="comp-name-cell">${escapeHTML(c.name)}</td>
          <td>${escapeHTML(c.desc)}</td>
          <td class="comp-pricing-cell">${escapeHTML(c.pricing)}</td>
          <td class="comp-badge-strength">${escapeHTML(c.strengths)}</td>
          <td class="comp-badge-weakness">${escapeHTML(c.weaknesses)}</td>
          <td style="text-align: right;">
            <button class="btn-delete-row btn-delete-comp" data-comp-id="${c.id}" title="Delete competitor">🗑️</button>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.btn-delete-comp').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const compId = e.currentTarget.getAttribute('data-comp-id');
          UI.deleteCompetitor(compId);
        });
      });
    },

    addCompetitor: function () {
      const name = elements.compName.value.trim();
      const pricing = elements.compPricing.value.trim() || 'Undisclosed';
      const desc = elements.compDesc.value.trim() || 'Alternative market solution.';
      const strengths = elements.compStrengths.value.trim() || 'Established market footprint';
      const weaknesses = elements.compWeaknesses.value.trim() || 'Higher friction / generic offering';

      if (!name) {
        Toast.show('Please provide a competitor name.', 'warning');
        return;
      }

      const newComp = {
        id: 'comp_' + Date.now(),
        name,
        pricing,
        desc,
        strengths,
        weaknesses
      };

      if (!state.currentPlan.competitors) {
        state.currentPlan.competitors = [];
      }

      state.currentPlan.competitors.push(newComp);
      this.renderCompetitors(state.currentPlan.competitors);
      this.updateStatsStrip();

      // Reset form
      elements.compName.value = '';
      elements.compPricing.value = '';
      elements.compDesc.value = '';
      elements.compStrengths.value = '';
      elements.compWeaknesses.value = '';
      elements.addCompetitorBox.style.display = 'none';

      PlanManager.saveCurrentPlan();
      Toast.show(`Added "${name}" to competitor matrix.`, 'success');
    },

    deleteCompetitor: function (compId) {
      if (!state.currentPlan || !state.currentPlan.competitors) return;
      state.currentPlan.competitors = state.currentPlan.competitors.filter(c => c.id !== compId);
      this.renderCompetitors(state.currentPlan.competitors);
      this.updateStatsStrip();
      PlanManager.saveCurrentPlan();
      Toast.show('Competitor entry removed.', 'info');
    },

    renderMonetization: function (m) {
      elements.monetizationPrimaryModel.textContent = m.primaryModel;
      elements.monetizationModelRationale.textContent = m.rationale;
      elements.targetMarginVal.textContent = m.targetMargin;

      elements.pricingTiersGrid.innerHTML = m.tiers.map(t => `
        <div class="pricing-card ${t.featured ? 'featured' : ''}">
          ${t.featured ? '<div class="featured-pill">Founder Recommendation</div>' : ''}
          <div class="pricing-tier-name">${escapeHTML(t.name)}</div>
          <div class="pricing-price-row">
            <span class="price-amount">${escapeHTML(t.price)}</span>
            <span class="price-period">${escapeHTML(t.period)}</span>
          </div>
          <div class="pricing-tier-desc">${escapeHTML(t.desc)}</div>
          <ul class="pricing-features-list">
            ${t.features.map(f => `
              <li class="pricing-feat-item">
                <span class="check-icon">✓</span>
                <span>${escapeHTML(f)}</span>
              </li>
            `).join('')}
          </ul>
        </div>
      `).join('');

      elements.secondaryStreamsList.innerHTML = m.secondaryStreams.map(s => `
        <div class="stream-item">
          <div class="stream-name">${escapeHTML(s.name)}</div>
          <div class="stream-desc">${escapeHTML(s.desc)}</div>
        </div>
      `).join('');
    },

    // 7-Day Sprint Roadmap Rendering (Requirement 6)
    renderRoadmapDays: function (roadmap, completedIds = []) {
      const container = elements.roadmapDaysList;
      if (!container) return;

      container.innerHTML = roadmap.map(day => {
        const totalInDay = day.tasks.length;
        const finishedInDay = day.tasks.filter(t => completedIds.includes(t.id)).length;
        const isDayAllDone = totalInDay > 0 && totalInDay === finishedInDay;

        return `
          <div class="day-card ${isDayAllDone ? 'day-completed' : ''}" data-day="${day.day}">
            <div class="day-header">
              <div class="day-meta">
                <span class="day-num-badge">Day ${day.day}</span>
                <span class="day-headline">${escapeHTML(day.theme)}</span>
              </div>
              <span class="day-progress-stat">${finishedInDay} / ${totalInDay} Tasks Done</span>
            </div>

            <div class="day-tasks-list">
              ${day.tasks.map(t => {
                const isChecked = completedIds.includes(t.id);
                return `
                  <label class="task-item ${isChecked ? 'checked' : ''}" data-task-id="${t.id}">
                    <input 
                      type="checkbox" 
                      class="task-checkbox" 
                      data-task-id="${t.id}" 
                      ${isChecked ? 'checked' : ''} 
                    />
                    <div class="task-content">
                      <div class="task-title">${escapeHTML(t.title)}</div>
                      <div class="task-hint">${escapeHTML(t.hint)}</div>
                    </div>
                  </label>
                `;
              }).join('')}
            </div>
          </div>
        `;
      }).join('');

      container.querySelectorAll('.task-checkbox').forEach(cb => {
        cb.addEventListener('change', (e) => {
          const taskId = e.target.getAttribute('data-task-id');
          const isChecked = e.target.checked;
          const parentLabel = e.target.closest('.task-item');

          if (isChecked) {
            parentLabel.classList.add('checked');
            if (!state.currentPlan.completedTasks.includes(taskId)) {
              state.currentPlan.completedTasks.push(taskId);
            }
          } else {
            parentLabel.classList.remove('checked');
            state.currentPlan.completedTasks = state.currentPlan.completedTasks.filter(id => id !== taskId);
          }

          const dayCard = e.target.closest('.day-card');
          const allDayCbs = dayCard.querySelectorAll('.task-checkbox');
          const allChecked = Array.from(allDayCbs).every(c => c.checked);
          if (allChecked) {
            dayCard.classList.add('day-completed');
          } else {
            dayCard.classList.remove('day-completed');
          }

          const dayStat = dayCard.querySelector('.day-progress-stat');
          const checkedCount = dayCard.querySelectorAll('.task-checkbox:checked').length;
          dayStat.textContent = `${checkedCount} / ${allDayCbs.length} Tasks Done`;

          UI.updateRoadmapProgress();
          UI.updateStatsStrip();
          PlanManager.saveCurrentPlan();
        });
      });
    },

    updateRoadmapProgress: function () {
      if (!state.currentPlan) return;
      const completed = state.currentPlan.completedTasks ? state.currentPlan.completedTasks.length : 0;
      const total = 21;
      const pct = Math.round((completed / total) * 100);

      elements.sprintTasksCompleted.textContent = completed;
      elements.sprintTasksTotal.textContent = total;
      elements.sprintProgressBar.style.width = `${pct}%`;
      elements.roadmapProgressBadge.textContent = `${pct}%`;

      if (pct === 100) {
        elements.sprintStatusMsg.textContent = '🎉 Incredible Momentum! All 7 Days Completed – You Are Launch-Ready!';
      } else if (pct >= 50) {
        elements.sprintStatusMsg.textContent = `⚡ Halfway Mark • ${pct}% completed. Execution pace is strong!`;
      } else if (pct > 0) {
        elements.sprintStatusMsg.textContent = `🚀 Sprint In Motion • ${completed} of ${total} tasks completed. Keep pushing!`;
      } else {
        elements.sprintStatusMsg.textContent = 'Sprint Ready • Check off your first task on Day 1 to begin!';
      }
    },

    switchSection: function (sectionKey) {
      elements.landingSection.style.display = sectionKey === 'landing' ? 'block' : 'none';
      elements.plannerSection.style.display = sectionKey === 'planner' ? 'block' : 'none';
      elements.dashboardSection.style.display = sectionKey === 'dashboard' ? 'block' : 'none';

      elements.navLanding.classList.toggle('active', sectionKey === 'landing');
      elements.navPlanner.classList.toggle('active', sectionKey === 'planner');

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    switchDashboardTab: function (tabKey) {
      state.activeTab = tabKey;
      let activeLabel = '';
      elements.dashTabs.forEach(tab => {
        const isActive = tab.getAttribute('data-tab') === tabKey;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        tab.setAttribute('tabindex', isActive ? '0' : '-1');
        if (isActive) activeLabel = tab.textContent.trim();
      });

      Object.keys(elements.tabPanels).forEach(key => {
        if (elements.tabPanels[key]) {
          elements.tabPanels[key].classList.toggle('active', key === tabKey);
        }
      });

      if (activeLabel && this.announce) {
        this.announce('Viewing ' + activeLabel);
      }
    },

    openModal: function (modal) {
      if (!modal) return;
      state.previousActiveElement = document.activeElement;
      modal.style.display = 'flex';

      const mainEl = document.getElementById('mainContent');
      const headerEl = document.querySelector('.app-header');
      if (mainEl) mainEl.setAttribute('aria-hidden', 'true');
      if (headerEl) headerEl.setAttribute('aria-hidden', 'true');

      // Focus first focusable element inside modal
      const focusable = modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
      if (focusable.length > 0) {
        setTimeout(() => focusable[0].focus(), 50);
      }

      // Modal keydown listener for Escape and Tab trap
      this._modalKeyHandler = (e) => {
        if (e.key === 'Escape') {
          e.preventDefault();
          this.closeModal(modal);
          return;
        }
        if (e.key === 'Tab') {
          const focusables = Array.from(modal.querySelectorAll('button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'));
          if (focusables.length === 0) return;
          const first = focusables[0];
          const last = focusables[focusables.length - 1];

          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      };
      document.addEventListener('keydown', this._modalKeyHandler);
      this.announce('Opened dialog: Saved Startup Blueprints');
    },

    closeModal: function (modal) {
      if (!modal) return;
      modal.style.display = 'none';

      const mainEl = document.getElementById('mainContent');
      const headerEl = document.querySelector('.app-header');
      if (mainEl) mainEl.removeAttribute('aria-hidden');
      if (headerEl) headerEl.removeAttribute('aria-hidden');

      if (this._modalKeyHandler) {
        document.removeEventListener('keydown', this._modalKeyHandler);
        this._modalKeyHandler = null;
      }

      if (state.previousActiveElement && typeof state.previousActiveElement.focus === 'function') {
        state.previousActiveElement.focus();
        state.previousActiveElement = null;
      }
      this.announce('Closed dialog.');
    },

    announce: function (message) {
      if (!message) return;
      const el = document.getElementById('a11yAnnouncer');
      if (!el) return;
      el.textContent = '';
      setTimeout(() => {
        el.textContent = message;
      }, 50);
    }
  };

  // =========================================================================
  // 7. TOAST NOTIFICATION UTILITY
  // =========================================================================
  const Toast = {
    show: function (message, type = 'info') {
      const container = elements.toastContainer;
      if (!container) return;

      const toast = document.createElement('div');
      toast.className = `toast toast-${type}`;
      toast.innerHTML = `<span>${escapeHTML(message)}</span>`;

      container.appendChild(toast);
      if (UI.announce) {
        UI.announce(message);
      }

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(50px)';
        setTimeout(() => {
          if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
          }
        }, 300);
      }, 3200);
    }
  };

  // Helper escape
  function escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // =========================================================================
  // 8. INITIALIZE ON DOM READY
  // =========================================================================
  if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
      UI.init();
    });
  }

  // =========================================================================
  // 9. EXPORTS FOR AUTOMATED TESTING
  // =========================================================================
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
      RuleEngine,
      PlanManager,
      UI,
      Toast,
      escapeHTML,
      STORAGE_KEY_PLANS,
      STORAGE_KEY_ACTIVE,
      SAMPLE_PRESETS
    };
  }

})();
