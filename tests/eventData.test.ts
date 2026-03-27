import { assertHasKeys, assertImageExists, assertNoExactDuplicates, isNonEmptyString, readJson } from './helpers/validators'

type EventEntry = {
  id: number
  name: string
  description: string
  type: string
  color: string
  image: string
  statMultipliers: Record<string, unknown>
}

type Rules = {
  events: { imageFolder: string; allowedImageExtensions: string[] }
}

const rules = readJson<Rules>('json/schemaRules.json')
const events = readJson<EventEntry[]>('json/eventData.json')

describe('json/eventData.json', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(events)).toBe(true)
    expect(events.length).toBeGreaterThan(0)
  })

  it('has no exact duplicate objects', () => {
    assertNoExactDuplicates(events, 'eventData')
  })

  events.forEach((e, i) => {
    it(`entry ${i} (id=${e?.id ?? 'unknown'}) is valid`, () => {
      const ctx = `eventData[id=${e?.id ?? 'unknown'} index=${i}]`
      assertHasKeys(e as unknown as Record<string, unknown>, ['id', 'name', 'description', 'type', 'color', 'image', 'statMultipliers'], ctx)
      expect(typeof e.id).toBe('number')
      expect(e.id).toBeGreaterThanOrEqual(0)
      expect(isNonEmptyString(e.name)).toBe(true)
      expect(isNonEmptyString(e.description)).toBe(true)
      expect(isNonEmptyString(e.type)).toBe(true)
      expect(isNonEmptyString(e.color)).toBe(true)
      expect(typeof e.statMultipliers).toBe('object')
      expect(e.statMultipliers).not.toBeNull()
      expect(isNonEmptyString(e.image)).toBe(true)
      assertImageExists(rules.events.imageFolder, e.image, rules.events.allowedImageExtensions, ctx)
    })
  })
})

