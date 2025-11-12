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
        description: "コミットする変更の種類を選択してください",
        enum: {
          feat: { description: '新しい機能', title: 'Features', emoji: '✨' },
          fix: { description: 'バグ修正', title: 'Bug Fixes', emoji: '🐛' },
          docs: { description: 'ドキュメントのみの変更', title: 'Documentation', emoji: '📚' },
          style: { description: '意味のないコードの変更（空白やフォーマットなど）', title: 'Styles', emoji: '💎' },
          refactor: { description: 'リファクタリング（機能追加やバグ修正を含まない構造改善）', title: 'Code Refactoring', emoji: '📦' },
          perf: { description: 'パフォーマンス向上', title: 'Performance Improvements', emoji: '🚀' },
          test: { description: 'テストの追加や修正', title: 'Tests', emoji: '🚨' },
          build: { description: 'ビルドシステムや依存パッケージの変更', title: 'Builds', emoji: '🛠' },
          ci: { description: 'CI構成・スクリプトの変更', title: 'Continuous Integrations', emoji: '⚙️' },
          chore: { description: "ソースやテスト以外のその他の変更", title: 'Chores', emoji: '♻️' },
          revert: { description: '以前のコミットの取り消し', title: 'Reverts', emoji: '🗑' },
        },
      },
      scope: { description: '変更のスコープ（必須）' },
      subject: { description: 'コミット内容の簡潔な要約（日本語・必須）' },
      body: { description: '詳細な説明（日本語・必須）' },
      isBreaking: { description: '破壊的な変更がありますか？' },
      breakingBody: { description: '破壊的変更の場合は詳細を入力（必須）' },
      breaking: { description: '破壊的変更の内容を記述してください' },
      isIssueAffected: { description: 'この変更はIssueに影響しますか？' },
      issuesBody: { description: 'Issueと関連付ける場合は内容を入力（必須）' },
      issues: { description: 'Issueの参照（例: fix #123, re #123）' },
    },
  },
};
