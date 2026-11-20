/**
 * Automated Test Suite: Local Storage Persistence & Plan Lifecycle
 * Uses Node.js native test runner (node:test) and assert (node:assert/strict)
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { copilot, mockStorage } = require('./test-helper.js');
const { PlanManager, RuleEngine, STORAGE_KEY_PLANS } = copilot;

describe('Plan Lifecycle & LocalStorage Management', () => {

  beforeEach(() => {
    for (const key of Object.keys(mockStorage)) {
      delete mockStorage[key];
    }
  });

  it('should initialize with an empty plans list when no storage exists', () => {
    const plans = PlanManager.getAll();
    assert.ok(Array.isArray(plans));
    assert.equal(plans.length, 0);
  });

  it('should persist new plans and retrieve them with intact structure', () => {
    const newPlan = {
      id: 'plan_123',
      name: 'LaunchPad Test',
      idea: 'An AI-powered co-pilot for early founders to build actionable plans.',
      industry: 'ai',
      audience: 'Indie Hackers',
      budgetTier: 'bootstrap',
      customBudget: null,
      businessModel: 'subscription',
      stage: 'validated',
      completedMvpFeatures: ['feat_1'],
      competitors: [{ id: 'comp_1', name: 'Legacy Comp', pricing: '$99' }],
      completedTasks: ['task_d1_1', 'task_d1_2'],
      analysis: {
        overallScore: 82,
        verdict: { text: 'High Potential', class: 'high' }
      },
      createdAt: new Date().toISOString()
    };

    PlanManager.saveAll([newPlan]);

    const retrieved = PlanManager.getAll();
    assert.equal(retrieved.length, 1);
    assert.equal(retrieved[0].id, 'plan_123');
    assert.equal(retrieved[0].name, 'LaunchPad Test');
    assert.deepEqual(retrieved[0].completedTasks, ['task_d1_1', 'task_d1_2']);
    assert.deepEqual(retrieved[0].completedMvpFeatures, ['feat_1']);
    assert.equal(retrieved[0].competitors.length, 1);
  });

  it('should update an existing plan when saved with the same ID', () => {
    const initialPlan = {
      id: 'plan_update_test',
      name: 'Version 1',
      industry: 'saas',
      audience: 'Teams',
      completedTasks: []
    };

    PlanManager.saveAll([initialPlan]);
    assert.equal(PlanManager.getAll()[0].name, 'Version 1');
    assert.equal(PlanManager.getAll()[0].completedTasks.length, 0);

    // Update the plan with completed tasks
    const updatedPlan = {
      ...initialPlan,
      name: 'Version 2 (Refined)',
      completedTasks: ['task_d1_1']
    };

    const currentPlans = PlanManager.getAll();
    const idx = currentPlans.findIndex(p => p.id === updatedPlan.id);
    if (idx >= 0) {
      currentPlans[idx] = updatedPlan;
    }
    PlanManager.saveAll(currentPlans);

    const refreshed = PlanManager.getAll();
    assert.equal(refreshed.length, 1);
    assert.equal(refreshed[0].name, 'Version 2 (Refined)');
    assert.deepEqual(refreshed[0].completedTasks, ['task_d1_1']);
  });

  it('should delete a plan by ID and retain other saved plans', () => {
    const plan1 = { id: 'plan_del_1', name: 'Plan One', industry: 'saas', audience: 'Founders' };
    const plan2 = { id: 'plan_del_2', name: 'Plan Two', industry: 'ai', audience: 'Developers' };

    PlanManager.saveAll([plan1, plan2]);
    assert.equal(PlanManager.getAll().length, 2);

    // Delete plan 1
    const remaining = PlanManager.getAll().filter(p => p.id !== 'plan_del_1');
    PlanManager.saveAll(remaining);

    const afterDelete = PlanManager.getAll();
    assert.equal(afterDelete.length, 1);
    assert.equal(afterDelete[0].id, 'plan_del_2');
    assert.equal(afterDelete[0].name, 'Plan Two');
  });

  it('should preserve custom features added to an MVP during session', () => {
    const plan = {
      id: 'plan_custom_feat',
      name: 'Custom Feature Plan',
      industry: 'saas',
      audience: 'Designers',
      analysis: {
        mvp: [
          { id: 'feat_1', priority: 'p0', title: 'Default Auth' }
        ]
      }
    };

    // Add custom feature
    const customFeature = {
      id: 'feat_custom_99',
      priority: 'p1',
      title: 'Stripe Invoicing Webhook',
      effort: '2 Days',
      rationale: 'Direct payment processing'
    };

    plan.analysis.mvp.push(customFeature);
    PlanManager.saveAll([plan]);

    const loaded = PlanManager.getAll()[0];
    assert.equal(loaded.analysis.mvp.length, 2);
    assert.equal(loaded.analysis.mvp[1].id, 'feat_custom_99');
    assert.equal(loaded.analysis.mvp[1].title, 'Stripe Invoicing Webhook');
  });

});
