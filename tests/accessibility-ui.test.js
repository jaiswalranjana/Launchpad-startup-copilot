/**
 * Automated Test Suite: Accessibility (a11y), Semantic HTML & Security Headers
 * Uses Node.js native test runner (node:test) and assert (node:assert/strict)
 */

const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

describe('Accessibility (WCAG 2.1 AA/AAA) & Security Audits', () => {

  const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
  const css = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');

  it('should include a strict Content Security Policy (CSP) meta tag in <head>', () => {
    assert.ok(html.includes('http-equiv="Content-Security-Policy"'), 'HTML must declare a Content-Security-Policy');
    assert.ok(html.includes("default-src 'self'"), 'CSP must set default-src to self');
    assert.ok(html.includes("script-src 'self'"), 'CSP must restrict scripts to self');
    assert.ok(html.includes("base-uri 'self'"), 'CSP must restrict base-uri');
  });

  it('should provide an accessible skip-link directly to #mainContent', () => {
    assert.ok(html.includes('class="skip-link"'), 'A skip link must be present');
    assert.ok(html.includes('href="#mainContent"'), 'Skip link must target #mainContent');
    assert.ok(html.includes('id="mainContent"'), '<main> must have id="mainContent"');
  });

  it('should utilize semantic HTML5 landmark elements throughout the document', () => {
    assert.ok(html.includes('<header class="app-header">'), 'Document must use <header>');
    assert.ok(html.includes('<main'), 'Document must use <main>');
    assert.ok(html.includes('<nav'), 'Document must use <nav>');
    assert.ok(html.includes('<footer class="app-footer">'), 'Document must use <footer>');
  });

  it('should ensure every interactive form input has an accessible label or aria-label', () => {
    const inputMatches = [...html.matchAll(/<(input|select|textarea)[^>]*id=["']([^"']+)["'][^>]*>/gi)];
    assert.ok(inputMatches.length > 0, 'Form inputs must exist');

    const missingLabels = [];
    inputMatches.forEach(match => {
      const id = match[2];
      const hasLabelFor = html.includes(`for="${id}"`);
      const hasAriaLabel = match[0].includes('aria-label');
      if (!hasLabelFor && !hasAriaLabel) {
        missingLabels.push(id);
      }
    });

    assert.equal(missingLabels.length, 0, `All inputs must have labels. Missing: ${missingLabels.join(', ')}`);
  });

  it('should connect form validation errors via aria-describedby and role="alert"', () => {
    assert.ok(html.includes('aria-describedby="nameError"'), 'startupName must link to nameError');
    assert.ok(html.includes('aria-describedby="ideaError"'), 'startupIdea must link to ideaError');
    assert.ok(html.includes('aria-describedby="industryError"'), 'startupIndustry must link to industryError');
    assert.ok(html.includes('aria-describedby="audienceError"'), 'targetAudience must link to audienceError');

    assert.ok(html.includes('id="nameError" role="alert"'), 'nameError must have role="alert"');
    assert.ok(html.includes('id="ideaError" role="alert"'), 'ideaError must have role="alert"');
    assert.ok(html.includes('id="industryError" role="alert"'), 'industryError must have role="alert"');
    assert.ok(html.includes('id="audienceError" role="alert"'), 'audienceError must have role="alert"');
  });

  it('should implement the complete WAI-ARIA tab pattern for dashboard navigation', () => {
    assert.ok(html.includes('role="tablist"'), 'Dashboard tabs container must have role="tablist"');
    assert.ok(html.includes('role="tab"'), 'Tab items must have role="tab"');
    assert.ok(html.includes('aria-selected="true"'), 'Active tab must have aria-selected="true"');
    assert.ok(html.includes('aria-controls="tabFeasibility"'), 'Tab must control its corresponding panel');
    assert.ok(html.includes('role="tabpanel"'), 'Panels must declare role="tabpanel"');
  });

  it('should configure modals with accessible dialog semantics', () => {
    assert.ok(html.includes('role="dialog"'), 'Modal must have role="dialog"');
    assert.ok(html.includes('aria-modal="true"'), 'Modal must declare aria-modal="true"');
    assert.ok(html.includes('aria-labelledby="savedPlansModalTitle"'), 'Modal must reference title via aria-labelledby');
    assert.ok(html.includes('id="savedPlansModalTitle"'), 'Modal title ID must exist');
    assert.ok(html.includes('aria-label="Close saved blueprints dialog"'), 'Modal close button must have accessible label');
  });

  it('should include an aria-live region for screen reader notifications and status updates', () => {
    assert.ok(html.includes('id="a11yAnnouncer"'), 'A dedicated screen-reader announcer must exist');
    assert.ok(html.includes('aria-live="polite"'), 'Live announcer must specify aria-live="polite"');
    assert.ok(html.includes('aria-atomic="true"'), 'Live announcer must specify aria-atomic="true"');
  });

  it('should define high-contrast :focus-visible rules in style.css', () => {
    assert.ok(css.includes(':focus-visible'), 'CSS must define :focus-visible indicators');
    assert.ok(css.includes('.skip-link'), 'CSS must style the skip-link');
    assert.ok(css.includes('.sr-only'), 'CSS must define screen-reader only utility');
  });

  it('should respect user motion preferences with prefers-reduced-motion in style.css', () => {
    assert.ok(css.includes('prefers-reduced-motion'), 'CSS must include @media (prefers-reduced-motion)');
  });

});
