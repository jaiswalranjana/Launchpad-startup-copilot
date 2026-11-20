/**
 * Automated Test Suite: Rule Engine & Decision Modeling
 * Uses Node.js native test runner (node:test) and assert (node:assert/strict)
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const { copilot } = require('./test-helper.js');
const { RuleEngine, SAMPLE_PRESETS } = copilot;

describe('LaunchPad Heuristic RuleEngine', () => {

  const sampleInput = {
    name: 'DocuBrief AI',
    idea: 'An intelligent document summarization and extraction platform for busy legal and compliance teams that turns 50-page PDF filings into structured risk briefs.',
    industry: 'ai',
    audience: 'Legal Teams and In-House Counsel',
    budgetTier: 'lean',
    customBudget: null,
    businessModel: 'subscription',
    stage: 'validated'
  };

  it('should generate a complete analysis object with all required properties', () => {
    const analysis = RuleEngine.analyze(sampleInput);

    assert.ok(analysis, 'Analysis object must exist');
    assert.equal(typeof analysis.overallScore, 'number', 'Overall score must be numeric');
    assert.ok(analysis.overallScore >= 0 && analysis.overallScore <= 100, 'Score must be clamped between 0 and 100');
    assert.ok(analysis.verdict, 'Verdict object must exist');
    assert.equal(typeof analysis.verdict.text, 'string');
    assert.equal(typeof analysis.verdict.class, 'string');
    assert.ok(analysis.pillars, 'Pillars object must exist');
    assert.ok(analysis.swot, 'SWOT object must exist');
    assert.ok(analysis.persona, 'Persona object must exist');
    assert.ok(Array.isArray(analysis.mvp), 'MVP must be an array of features');
    assert.ok(Array.isArray(analysis.competitors), 'Competitors must be an array');
    assert.ok(analysis.monetization, 'Monetization object must exist');
    assert.ok(Array.isArray(analysis.roadmap), 'Roadmap must be an array of days');
    assert.equal(analysis.roadmap.length, 7, 'Roadmap must have exactly 7 days');
  });

  it('should compute the 4 pillar scores according to defined weights', () => {
    const analysis = RuleEngine.analyze(sampleInput);
    const { pillars } = analysis;

    assert.equal(typeof pillars.market.score, 'number');
    assert.equal(typeof pillars.tech.score, 'number');
    assert.equal(typeof pillars.finance.score, 'number');
    assert.equal(typeof pillars.moat.score, 'number');

    assert.ok(pillars.market.score >= 0 && pillars.market.score <= 100);
    assert.ok(pillars.tech.score >= 0 && pillars.tech.score <= 100);
    assert.ok(pillars.finance.score >= 0 && pillars.finance.score <= 100);
    assert.ok(pillars.moat.score >= 0 && pillars.moat.score <= 100);

    // Verify composite overall score calculation:
    // (market * 0.30) + (tech * 0.25) + (finance * 0.25) + (moat * 0.20)
    const expected = Math.round(
      (pillars.market.score * 0.30) +
      (pillars.tech.score * 0.25) +
      (pillars.finance.score * 0.25) +
      (pillars.moat.score * 0.20)
    );
    assert.equal(analysis.overallScore, expected, 'Composite score must match weighted sum of 4 pillars');
  });

  it('should apply industry-specific modifiers accurately', () => {
    const saasInput = { ...sampleInput, industry: 'saas' };
    const cleantechInput = { ...sampleInput, industry: 'cleantech' };

    const saasRes = RuleEngine.analyze(saasInput);
    const cleantechRes = RuleEngine.analyze(cleantechInput);

    // SaaS typically has higher tech feasibility & margin than CleanTech (hardware/capex intensive)
    assert.notEqual(saasRes.overallScore, cleantechRes.overallScore, 'Different industries must produce distinct feasibility ratings');
  });

  it('should handle custom numeric budgets and assign proper budget tiers', () => {
    const bootstrapInput = { ...sampleInput, budgetTier: 'bootstrap', customBudget: '400' };
    const ventureInput = { ...sampleInput, budgetTier: 'venture', customBudget: '50000' };

    const bRes = RuleEngine.analyze(bootstrapInput);
    const vRes = RuleEngine.analyze(ventureInput);

    assert.ok(vRes.pillars.finance.score > bRes.pillars.finance.score, 'Venture funding should provide higher financial runway pillar score than $400 bootstrap');
  });

  it('should generate categorized MoSCoW MVP features with valid priority tiers', () => {
    const analysis = RuleEngine.analyze(sampleInput);
    const { mvp } = analysis;

    assert.ok(mvp.length >= 6, 'MVP must contain at least 6 features');

    const priorities = new Set(mvp.map(f => f.priority));
    assert.ok(priorities.has('p0'), 'MVP must include Must-Have (P0) features');
    assert.ok(priorities.has('p1'), 'MVP must include Should-Have (P1) features');

    mvp.forEach(feat => {
      assert.ok(feat.id, 'Feature must have an ID');
      assert.ok(feat.title, 'Feature must have a title');
      assert.ok(feat.desc, 'Feature must have a description');
      assert.ok(feat.effort, 'Feature must specify effort estimate');
      assert.ok(feat.rationale, 'Feature must specify strategic rationale');
    });
  });

  it('should generate a structured 7-day action roadmap with exactly 21 tasks', () => {
    const analysis = RuleEngine.analyze(sampleInput);
    const { roadmap } = analysis;

    assert.equal(roadmap.length, 7, 'Action plan must consist of 7 daily sprints');

    let totalTasks = 0;
    roadmap.forEach((day, idx) => {
      assert.equal(day.day, idx + 1, `Day number must equal ${idx + 1}`);
      assert.ok(day.theme, 'Day must have a strategic theme');
      assert.ok(Array.isArray(day.tasks), 'Day tasks must be an array');
      assert.equal(day.tasks.length, 3, 'Each day must contain exactly 3 actionable tasks');
      totalTasks += day.tasks.length;
    });

    assert.equal(totalTasks, 21, 'Total launch roadmap tasks must equal 21');
  });

  it('should generate distinct SWOT and Persona details tailored to the industry and audience', () => {
    const aiAnalysis = RuleEngine.analyze(sampleInput);
    const edtechAnalysis = RuleEngine.analyze({ 
      ...sampleInput, 
      industry: 'edtech', 
      audience: 'Junior Engineers and Computer Science Students', 
      name: 'LearnFlow' 
    });

    assert.ok(aiAnalysis.swot.strengths.length >= 3, 'Strengths must have at least 3 points');
    assert.ok(aiAnalysis.swot.weaknesses.length >= 3, 'Weaknesses must have at least 3 points');
    assert.ok(aiAnalysis.swot.risks.length >= 3, 'Risks must have at least 3 items');
    assert.ok(aiAnalysis.persona.name, 'Persona must have a representative name');
    assert.ok(aiAnalysis.persona.painPoints.length >= 3, 'Persona must have pain points');

    assert.notEqual(aiAnalysis.persona.name, edtechAnalysis.persona.name, 'AI and EdTech personas must be distinct');
    assert.notEqual(aiAnalysis.swot.strengths[0], edtechAnalysis.swot.strengths[0], 'Strengths must be distinct across industries');
  });

  it('should reliably analyze all built-in sample presets without error', () => {
    Object.keys(SAMPLE_PRESETS).forEach(presetKey => {
      const preset = SAMPLE_PRESETS[presetKey];
      const analysis = RuleEngine.analyze(preset);

      assert.ok(analysis.overallScore >= 0 && analysis.overallScore <= 100, `Preset ${presetKey} score must be in bounds`);
      assert.ok(analysis.verdict.text.length > 0, `Preset ${presetKey} must have verdict text`);
      assert.equal(analysis.roadmap.length, 7, `Preset ${presetKey} must generate 7-day sprint`);
    });
  });

});
