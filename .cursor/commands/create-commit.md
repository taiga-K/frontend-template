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
    - 各commitメッセージはConventional Commits形式に従う：
    ```
    <type>(<scope>): <subject>
    <BLANK LINE>
    <body>
    <BLANK LINE>
    <footer>
    ```
    - typeの例：`feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`
    - subjectは50文字以内で簡潔に記述
    - body（必要に応じて）で変更の理由や詳細を説明
    - commit実行のコマンド：
      ```bash
      # 1. 変更をステージングに追加
      git add <ファイルパスまたはディレクトリパス>
      
      # 2. commitを実行（メッセージを直接指定）
      git commit -m "<type>: <subject>" -m "<body>"
      
      # または、エディタでメッセージを編集する場合
      git commit
      ```
    - 複数の変更を分割してcommitする場合：
      ```bash
      # 1つ目の変更をステージング
      git add <ファイル1>
      git commit -m "<type>: <subject1>"
      
      # 2つ目の変更をステージング
      git add <ファイル2>
      git commit -m "<type>: <subject2>"
      ```

## 注意
commitメッセージのsubjectとbodyは必ず日本語で記述してください