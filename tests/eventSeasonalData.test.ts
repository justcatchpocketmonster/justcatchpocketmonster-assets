import { assertHasKeys, assertNoExactDuplicates, isNonEmptyString, readJson } from './helpers/validators'

type SeasonalEntry = {
  id: number
  name: string
  startDate: string | null
  endDate: string | null
  image: string | null
  description: string
  statMultipliers: Record<string, unknown>
}

const seasonal = readJson<SeasonalEntry[]>('json/eventSeasonalData.json')

describe('json/eventSeasonalData.json', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(seasonal)).toBe(true)
    expect(seasonal.length).toBeGreaterThan(0)
  })

  it('has no exact duplicate objects', () => {
    assertNoExactDuplicates(seasonal, 'eventSeasonalData')
  })

  seasonal.forEach((s, i) => {
    it(`entry ${i} (id=${s?.id ?? 'unknown'}) is valid`, () => {
      const ctx = `eventSeasonalData[id=${s?.id ?? 'unknown'} index=${i}]`
      assertHasKeys(s as unknown as Record<string, unknown>, ['id', 'name', 'startDate', 'endDate', 'image', 'description', 'statMultipliers'], ctx)
      expect(typeof s.id).toBe('number')
      expect(s.id).toBeGreaterThanOrEqual(0)
      expect(isNonEmptyString(s.name)).toBe(true)
      expect(s.startDate === null || isNonEmptyString(s.startDate)).toBe(true)
      expect(s.endDate === null || isNonEmptyString(s.endDate)).toBe(true)
      expect(s.image === null || isNonEmptyString(s.image)).toBe(true)
      expect(isNonEmptyString(s.description)).toBe(true)
      expect(typeof s.statMultipliers).toBe('object')
      expect(s.statMultipliers).not.toBeNull()
    })
  })
})

