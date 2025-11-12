# commitメッセージ生成手順書

## 概要
全てのcommitメッセージに適用されるcommitメッセージを生成する際の手順書です

## 手順
1. **過去のcommitとの変更差分を取得**
    - `git diff HEAD`コマンドを実行

2. **変更内容を把握**
    - 差分の内容を分析し、どのような変更が行われたかを理解する
    - 変更の種類（追加・修正・削除）を確認する
    - 関連するファイル群を特定する

3. **論理的に変更最小単位でcommitを実行**
    - 変更内容を論理的な単位に分割する
    - 1つのcommitには1つの明確な目的を持たせる
    - 複数の変更がある場合は、`git add`でステージングを分けて実行
    - 各commitメッセージはConventional Commits形式に従う（scopeは必須）：
    ```
    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>
    ```
    - typeは小文字・以下から選択：`build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, `test`
    - scopeは必須（対象領域を明確にする）
    - subjectは簡潔に（推奨: 50文字以内）。ヘッダー全体は100文字以内
    - subjectの末尾に句点やピリオド（`。`/`.`）を付けない
    - bodyは必須（日本語）。ヘッダー行との間に空行を入れる
    - bodyは1行100文字以内になるように適宜改行する
    - footerがある場合は、bodyとの間に空行を入れ、各行100文字以内に収める
    - commit実行のコマンド（zsh のヒアドキュメント / -F で一本化）：
      ```bash
      # zsh: ヒアドキュメントで全文を一括指定（改行・空行を完全制御）
      git commit -F =(cat <<'MSG'
      type(scope): subject
      
      本文1行目（100字以内で改行）
      本文2行目
      本文3行目
      
      refs: #123
      MSG
      )
      ```
    - 複数の変更を分割してcommitする場合：
      ```bash
      # 1つ目の変更をステージング
      git add <ファイル1>
      git commit -F =(cat <<'MSG'
      type(scope1): subject1
      
      body1-1行目（100字以内で改行）
      body1-2行目
      MSG
      )
      
      # 2つ目の変更をステージング
      git add <ファイル2>
      git commit -F =(cat <<'MSG'
      type(scope2): subject2
      
      body2-1行目（100字以内で改行）
      body2-2行目
      MSG
      )
      ```

## 注意
commitメッセージのsubjectとbodyは必ず日本語で記述してください。また、ヘッダー（`<type>(<scope>): <subject>`）は100文字以内、body/ footerは各行100文字以内を厳守してください。