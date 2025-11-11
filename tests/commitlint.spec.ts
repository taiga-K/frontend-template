import { test, expect } from 'vitest';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import lint from '@commitlint/lint';
import config from '../commitlint.config.mjs';

const { rules, parserPreset, plugins } = config;

const dynImport = async (id: string) => {
  const mod = await import(path.isAbsolute(id) ? pathToFileURL(id).toString() : id);
  return ('default' in mod && mod.default) || mod;
};

const commitLint = async (msg: string) => {
  const preset = await (await dynImport(parserPreset))();
  return lint(msg, rules, { ...preset, plugins });
};

test('valid: scope+日本語のsubjectとbody', async () => {
  const r = await commitLint('fix(core): 日本語の件名\n\n日本語の本文');
  expect(r.valid).toBe(true);
});

test('valid: 全てのtype enumが使用可能', async () => {
  const types = ['build', 'chore', 'ci', 'docs', 'feat', 'fix', 'perf', 'refactor', 'revert', 'style', 'test'];
  
  for (const type of types) {
    const r = await commitLint(`${type}(scope): 日本語の件名\n\n日本語の本文`);
    expect(r.valid).toBe(true);
  }
});

test('fail: scope無し', async () => {
  const r = await commitLint('fix: 日本語の件名\n\n日本語の本文');
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'scope-empty')).toBe(true);
});

test('fail: type無し', async () => {
  const r = await commitLint('(scope): 日本語の件名\n\n日本語の本文');
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'type-empty')).toBe(true);
});

test('fail: 無効なtype', async () => {
  const r = await commitLint('invalid(scope): 日本語の件名\n\n日本語の本文');
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'type-enum')).toBe(true);
});

test('fail: typeが大文字', async () => {
  const r = await commitLint('FIX(scope): 日本語の件名\n\n日本語の本文');
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'type-case')).toBe(true);
});

test('fail: subject無し', async () => {
  const r = await commitLint('fix(scope): \n\n日本語の本文');
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'subject-empty')).toBe(true);
});

test('fail: subject英語のみ', async () => {
  const r = await commitLint('fix(core): English subject\n\n日本語の本文');
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'subject-japanese')).toBe(true);
});

test('fail: subjectがピリオドで終わる', async () => {
  const r = await commitLint('fix(core): 日本語の件名。\n\n日本語の本文');
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'subject-full-stop-japanese')).toBe(true);
});

test('fail: body無し', async () => {
  const r = await commitLint('fix(core): 日本語の件名');
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'body-empty')).toBe(true);
});

test('fail: body英語のみ', async () => {
  const r = await commitLint('fix(core): 日本語の件名\n\nEnglish body');
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'body-japanese')).toBe(true);
});

test('warn: 空行不足（bodyの前に空行がない）', async () => {
  const r = await commitLint('fix(core): 日本語の件名\n日本語の本文');
  expect(r.warnings.some(w => w.name === 'body-leading-blank')).toBe(true);
});

test('fail: headerが100文字を超える', async () => {
  const longSubject = '日'.repeat(90); // 100文字を超えるように調整
  const r = await commitLint(`fix(scope): ${longSubject}\n\n日本語の本文`);
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'header-max-length')).toBe(true);
});

test('fail: bodyの行が100文字を超える', async () => {
  const longBody = '日'.repeat(101);
  const r = await commitLint(`fix(scope): 日本語の件名\n\n${longBody}`);
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'body-max-line-length')).toBe(true);
});

test('warn: footerの前に空行がない', async () => {
  const r = await commitLint('fix(core): 日本語の件名\n\n日本語の本文\nBREAKING CHANGE: 重大な変更');
  expect(r.warnings.some(w => w.name === 'footer-leading-blank')).toBe(true);
});

test('fail: footerの行が100文字を超える', async () => {
  const longFooter = '日'.repeat(101);
  const r = await commitLint(`fix(scope): 日本語の件名\n\n日本語の本文\n\nBREAKING CHANGE: ${longFooter}`);
  expect(r.valid).toBe(false);
  expect(r.errors.some(e => e.name === 'footer-max-line-length')).toBe(true);
});

test('valid: 完全な形式のコミットメッセージ', async () => {
  const msg = `feat(auth): ユーザー認証機能を追加

ログイン画面とログアウト機能を実装しました。
セッション管理にはJWTトークンを使用しています。

BREAKING CHANGE: 既存の認証APIが変更されました`;
  
  const r = await commitLint(msg);
  expect(r.valid).toBe(true);
});
