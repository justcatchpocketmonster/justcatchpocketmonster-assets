import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export function readJson<T>(relativePathFromRepoRoot: string): T {
  const abs = path.resolve(__dirname, '..', '..', relativePathFromRepoRoot)
  const raw = fs.readFileSync(abs, 'utf8')
  return JSON.parse(raw) as T
}

export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0
}

export function assertHasKeys(obj: Record<string, unknown>, keys: string[], ctx: string): void {
  for (const k of keys) {
    if (!(k in obj)) throw new Error(`${ctx}: missing key "${k}"`)
  }
}

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value)
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`
  const obj = value as Record<string, unknown>
  const keys = Object.keys(obj).sort()
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`).join(',')}}`
}

function hashObjectStable(obj: unknown): string {
  const s = stableStringify(obj)
  return crypto.createHash('sha256').update(s).digest('hex')
}

export function assertNoExactDuplicates(arr: unknown[], ctx: string): void {
  const seen = new Map<string, number>()
  for (let i = 0; i < arr.length; i++) {
    const h = hashObjectStable(arr[i])
    if (seen.has(h)) throw new Error(`${ctx}: exact duplicate at index ${i} (same as index ${seen.get(h)})`)
    seen.set(h, i)
  }
}

export function assertImageExists(
  folderAbsOrRelFromRepoRoot: string,
  baseNameNoExt: string,
  allowedExts: string[],
  ctx: string,
): void {
  const folderAbs = path.isAbsolute(folderAbsOrRelFromRepoRoot)
    ? folderAbsOrRelFromRepoRoot
    : path.resolve(__dirname, '..', '..', folderAbsOrRelFromRepoRoot)

  for (const ext of allowedExts) {
    const p = path.join(folderAbs, `${baseNameNoExt}${ext}`)
    if (fs.existsSync(p)) return
  }
  throw new Error(`${ctx}: missing image "${baseNameNoExt}" in "${folderAbs}"`)
}

export function assertAllowed<T>(value: T, allowed: T[], ctx: string): void {
  if (!allowed.includes(value)) {
    throw new Error(`${ctx}: value "${String(value)}" not allowed (allowed: ${allowed.join(', ')})`)
  }
}

