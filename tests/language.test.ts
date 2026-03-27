import { isNonEmptyString, readJson } from './helpers/validators'

type LanguageMap = Record<string, Record<string, string[]>>
type Rules = { languagesRequired: string[] }

const rules = readJson<Rules>('json/schemaRules.json')
const lang = readJson<LanguageMap>('json/language.json')

describe('json/language.json', () => {
  it('is a non-empty object with language rules', () => {
    expect(lang && typeof lang === 'object' && !Array.isArray(lang)).toBe(true)
    expect(Array.isArray(rules.languagesRequired)).toBe(true)
    expect(rules.languagesRequired.length).toBeGreaterThan(0)
  })

  Object.entries(lang).forEach(([key, value]) => {
    it(`key "${key}" has required languages and non-empty values`, () => {
      const ctx = `language[key=${key}]`
      expect(value && typeof value === 'object' && !Array.isArray(value)).toBe(true)

      for (const l of rules.languagesRequired) {
        if (!(l in value)) throw new Error(`${ctx}: missing language "${l}"`)
        const arr = value[l]
        if (!Array.isArray(arr)) throw new Error(`${ctx}: language "${l}" is not an array`)
        if (arr.length < 1) throw new Error(`${ctx}: language "${l}" must have at least 1 element`)
        for (let i = 0; i < arr.length; i++) {
          if (!isNonEmptyString(arr[i])) throw new Error(`${ctx}: language "${l}" has empty value at index ${i}`)
        }
      }
    })
  })
})

