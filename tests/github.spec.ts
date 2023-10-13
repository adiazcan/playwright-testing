import { expect, test } from '@playwright/test';

const REPO = 'playwright-testing';
const USER = 'adiazcan';

test('should create a bug report', async ({ request }) => {
    const newIssue = await request.post(`/repos/${USER}/${REPO}/issues`, {
        data: {
            title: 'New issue',
            body: 'This is a new issue'
        }
    });

    expect(newIssue.status()).toBe(201);

    const issues = await request.get(`/repos/${USER}/${REPO}/issues`);
    expect(issues.ok()).toBeTruthy();
    expect(await issues.json()).toContainEqual(expect.objectContaining({
        title: 'New issue',
        body: 'This is a new issue'
    }));
});

// a test for validating if main granch exists
test('should validate if main branch exists', async ({ request }) => {
    const branch = await request.get(`/repos/${USER}/${REPO}/branches/main`);
    expect(branch.status()).toBe(200);
});

// a test for listing all issues on the page and finding "New issue" by title
test('should list all issues on the page and find "New issue" by title', async ({ page }) => {
    await page.goto(`https://github.com/${USER}/${REPO}/issues`);
    const issues = await page.$$('.js-issue-row');
    expect(issues.length).toBeGreaterThan(0);
    const newIssue = await page.$(`.js-issue-row a[href="/${USER}/${REPO}/issues/1"]`);
    expect(newIssue).not.toBeNull();
    const title = await newIssue?.textContent();
    expect(title).toBe('New issue');
});


