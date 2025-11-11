// commitlint.config.mjs
export default {
  extends: ['@commitlint/config-conventional'],
  parserPreset: 'conventional-changelog-conventionalcommits',
  rules: {
    'type-enum': [2, 'always', ['build','chore','ci','docs','feat','fix','perf','refactor','revert','style','test']],
    'type-empty': [2, 'never'],
    'type-case': [2, 'always', 'lower-case'],
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-case': [0], // 日本語主体のため無効化
    'subject-full-stop': [2, 'never', '.'],
    'subject-full-stop-japanese': [2, 'never'],
    'header-max-length': [2, 'always', 100],
    'header-trim': [2, 'always'],
    'body-leading-blank': [1, 'always'], // 空行は警告
    'body-empty': [2, 'never'],
    'body-max-line-length': [2, 'always', 100],
    'footer-leading-blank': [1, 'always'],
    'footer-max-line-length': [2, 'always', 100],

    // 日本語強制
    'subject-japanese': [2, 'always'],
    'body-japanese': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        'subject-japanese': (parsed, when = 'always') => {
          const s = parsed.subject || '';
          const hasJa = /[\u3040-\u309F\u30A0-\u30FF\uFF66-\uFF9F\u4E00-\u9FFF]/.test(s);
          const ok = hasJa;
          return [when === 'never' ? !ok : ok, 'subjectは日本語で記述してください'];
        },
        'body-japanese': (parsed, when = 'always') => {
          const b = (parsed.body || '').trim();
          const hasJa = /[\u3040-\u309F\u30A0-\u30FF\uFF66-\uFF9F\u4E00-\u9FFF]/.test(b);
          const ok = hasJa;
          return [when === 'never' ? !ok : ok, 'bodyは日本語で記述してください'];
        },
        'subject-full-stop-japanese': (parsed, when = 'always') => {
          const s = parsed.subject || '';
          const endsWithJapanesePeriod = s.endsWith('。');
          const ok = when === 'never' ? !endsWithJapanesePeriod : endsWithJapanesePeriod;
          return [ok, 'subjectは句点（。）で終わらないでください'];
        },
      },
    },
  ],
  prompt: {
    questions: {
      type: {
        description: "Select the type of change that you're committing",
        enum: {
          feat: { description: 'A new feature', title: 'Features', emoji: '✨' },
          fix: { description: 'A bug fix', title: 'Bug Fixes', emoji: '🐛' },
          docs: { description: 'Documentation only changes', title: 'Documentation', emoji: '📚' },
          style: { description: 'Non-meaningful code changes', title: 'Styles', emoji: '💎' },
          refactor: { description: 'Code refactor', title: 'Code Refactoring', emoji: '📦' },
          perf: { description: 'Performance improvements', title: 'Performance Improvements', emoji: '🚀' },
          test: { description: 'Add or correct tests', title: 'Tests', emoji: '🚨' },
          build: { description: 'Build system or deps changes', title: 'Builds', emoji: '🛠' },
          ci: { description: 'CI config/script changes', title: 'Continuous Integrations', emoji: '⚙️' },
          chore: { description: "Other changes that don't modify src or test", title: 'Chores', emoji: '♻️' },
          revert: { description: 'Reverts a previous commit', title: 'Reverts', emoji: '🗑' },
        },
      },
      scope: { description: 'Scope of change (required)' },
      subject: { description: 'Short imperative subject in Japanese (required)' },
      body: { description: 'Longer description in Japanese (required)' },
      isBreaking: { description: 'Any breaking changes?' },
      breakingBody: { description: 'Body is required for breaking changes' },
      breaking: { description: 'Describe the breaking changes' },
      isIssueAffected: { description: 'Does this change affect any issues?' },
      issuesBody: { description: 'Body required if closing issues' },
      issues: { description: 'Issue refs (e.g. fix #123, re #123)' },
    },
  },
};
