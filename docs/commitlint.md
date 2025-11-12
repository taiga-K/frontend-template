# commitlint 導入・設定ガイド（テンプレート準拠）

## これは何？
このプロジェクトでは commit メッセージの品質を一定に保つために commitlint を導入しています。  
Conventional Commits をベースにしつつ、日本語メッセージや行長・スコープ必須などの独自ルールを追加しています。

## このテンプレートでの構成（どのファイルが何をしているか）
- `commitlint.config.mjs`: commitlint のすべてのルール定義と独自ルールを記述した設定ファイル
- `.husky/commit-msg`: commit 実行時に commitlint を走らせる Git フック（commit メッセージを検証）
- `.cursor/commands/create-commit.md`: プロジェクトで推奨するコミット手順と書式（-F + ヒアドキュメント方式）
- `tests/commitlint.spec.ts`: commitlint 設定のテスト（任意・テンプレートでは同梱）

## 設定の要点（このテンプレートのポリシー）
- type は小文字・以下から選択: `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
- scope は必須（変更の対象領域を明確にする）
- header（`type(scope): subject`）は 100 文字以内
- subject の末尾に句点（`。`）やピリオド（`.`）を付けない
- body は必須・日本語必須。各行 100 文字以内で改行
- footer がある場合も各行 100 文字以内。body/ footer の前には空行を 1 行
- ヘッダーと body/ footer の区切り空行は 1 行に統一（Conventional Commits 準拠）

## 独自ルール（日本語強制など）
- `subject-japanese`: subject に日本語が含まれていることを強制
- `body-japanese`: body に日本語が含まれていることを強制
- `subject-full-stop-japanese`: subject の末尾が句点（`。`）で終わらないことを強制

## 実際の設定ファイル（`commitlint.config.mjs`）
```js
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
          const hasJa = /[\\u3040-\\u309F\\u30A0-\\u30FF\\uFF66-\\uFF9F\\u4E00-\\u9FFF]/.test(s);
          const ok = hasJa;
          return [when === 'never' ? !ok : ok, 'subjectは日本語で記述してください'];
        },
        'body-japanese': (parsed, when = 'always') => {
          const b = (parsed.body || '').trim();
          const hasJa = /[\\u3040-\\u309F\\u30A0-\\u30FF\\uFF66-\\uFF9F\\u4E00-\\u9FFF]/.test(b);
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
      type: { description: 'コミットする変更の種類を選択してください' },
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
```

## 推奨のコミット方法（-F + ヒアドキュメント、zsh）
余計な空行が入らないよう、メッセージ全文を 1 回で渡します。  
ヘッダーと body/ footer の区切りは空行 1 行、本文は 1 行 100 文字以内で改行します。

```bash
git commit -F =(cat <<'MSG'
type(scope): subject

本文1行目（100字以内で改行）
本文2行目
本文3行目

refs: #123
MSG
)
```

## 自分のプロジェクトに適用する手順
1) 依存関係のインストール（Node 18+ 推奨）
```bash
npm i -D @commitlint/cli @commitlint/config-conventional husky
# 任意: 対話プロンプトを使う場合
npm i -D @commitlint/prompt-cli
```

2) Husky を有効化（prepare スクリプト追加 → 初期化）
```bash
npm pkg set scripts.prepare="husky"
npm run prepare
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

3) ルートに `commitlint.config.mjs` を配置  
上記「実際の設定ファイル」の内容をそのまま保存すれば OK です。

4) コミット時はテンプレートの書式に従う  
- ヘッダーは `type(scope): subject`（100 文字以内、末尾に句読点なし）  
- 本文は日本語必須、各行 100 文字以内で改行。直前に空行 1 行  
- フッターがあれば各行 100 文字以内。直前に空行 1 行  
- 実行例は上の「-F + ヒアドキュメント」を参照

## よくあるつまづき
- `husky - commit-msg script failed`  
  - commitlint のルール違反がないか、メッセージの空行や行長を確認してください
  - 権限や Node のグローバル環境の問題がある場合は、シェルや実行権限を見直してください
- ESM の設定について  
  - このテンプレートは `commitlint.config.mjs`（ESM）を想定しています。commitlint v17+ を使用してください


