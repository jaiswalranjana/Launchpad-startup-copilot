/**
 * Automated Test Suite: Security, Input Validation & Sanitization
 * Uses Node.js native test runner (node:test) and assert (node:assert/strict)
 */

const { describe, it, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const { copilot, mockStorage } = require('./test-helper.js');
const { escapeHTML, PlanManager, STORAGE_KEY_PLANS } = copilot;

describe('Security & Input Sanitization', () => {

  it('should escape dangerous HTML characters to prevent XSS injection', () => {
    const malicious = '<script>alert("XSS")</script>';
    const sanitized = escapeHTML(malicious);

    assert.equal(sanitized.includes('<script>'), false);
    assert.equal(sanitized.includes('</script>'), false);
    assert.ok(sanitized.includes('&lt;script&gt;'));
    assert.ok(sanitized.includes('&quot;XSS&quot;'));
  });

  it('should safely handle single quotes, double quotes, and ampersands', () => {
    const input = `Ben & Jerry's "Special" <tag>`;
    const output = escapeHTML(input);

    assert.equal(output.includes('&amp;'), true);
    assert.equal(output.includes('&#039;'), true);
    assert.equal(output.includes('&quot;'), true);
    assert.equal(output.includes('&lt;tag&gt;'), true);
  });

  it('should gracefully handle null, undefined, numbers, and boolean values in escapeHTML', () => {
    assert.equal(escapeHTML(null), '');
    assert.equal(escapeHTML(undefined), '');
    assert.equal(escapeHTML(''), '');
    assert.equal(escapeHTML(0), '0');
    assert.equal(escapeHTML(42), '42');
    assert.equal(escapeHTML(false), 'false');
  });

  it('should protect against Prototype Pollution attacks in stored plans', () => {
    // Attempt prototype pollution injection via JSON payload
    const maliciousPayload = JSON.stringify([
      {
        id: 'plan_malicious',
        name: 'Pollution Test',
        industry: 'saas',
        audience: 'Founders',
        __proto__: { isAdmin: true },
        constructor: { prototype: { hacked: true } },
        analysis: {
          overallScore: 80,
          verdict: { text: 'High', class: 'high' }
        }
      }
    ]);

    mockStorage[STORAGE_KEY_PLANS] = maliciousPayload;

    const plans = PlanManager.getAll();
    assert.ok(Array.isArray(plans), 'Must return an array');
    assert.equal(plans.length, 1);

    // Verify properties were stripped and object prototype was NOT polluted
    const cleanPlan = plans[0];
    assert.equal(Object.prototype.isAdmin, undefined, 'Object.prototype must not be polluted with isAdmin');
    assert.equal(Object.prototype.hacked, undefined, 'Object.prototype must not be polluted with hacked');
    assert.equal(Object.prototype.hasOwnProperty.call(cleanPlan, '__proto__'), false);
  });

  it('should gracefully recover from corrupted JSON in localStorage without throwing', () => {
    mockStorage[STORAGE_KEY_PLANS] = '{ broken JSON [[[[';

    let plans;
    assert.doesNotThrow(() => {
      plans = PlanManager.getAll();
    }, 'Must not throw syntax error on corrupted storage');

    assert.ok(Array.isArray(plans), 'Must safely fallback to empty array');
    assert.equal(plans.length, 0);
  });

  it('should reject non-array data stored under plans key', () => {
    mockStorage[STORAGE_KEY_PLANS] = JSON.stringify({ notAnArray: true, someString: 'invalid' });

    const plans = PlanManager.getAll();
    assert.ok(Array.isArray(plans), 'Must return an empty array if storage holds non-array JSON');
    assert.equal(plans.length, 0);
  });

  it('should catch QuotaExceededError when saving without breaking application flow', () => {
    const originalSetItem = globalThis.localStorage.setItem;

    // Simulate quota exceeded exception
    globalThis.localStorage.setItem = () => {
      const err = new Error('Storage quota exceeded');
      err.name = 'QuotaExceededError';
      err.code = 22;
      throw err;
    };

    assert.doesNotThrow(() => {
      PlanManager.saveAll([{ id: 'test', name: 'Quota Test' }]);
    }, 'Must catch QuotaExceededError gracefully');

    // Restore original
    globalThis.localStorage.setItem = originalSetItem;
  });

});
