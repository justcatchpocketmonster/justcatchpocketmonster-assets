import {
  assertAllowed,
  assertHasKeys,
  assertImageExists,
  assertNoExactDuplicates,
  isNonEmptyString,
  readJson,
} from './helpers/validators'

type PokemonEntry = {
  id: number
  name: {
    nameEng: string[]
    nameFr: string[]
    nameCompletFr: string[]
    nameCompletEng: string[]
  }
  arrayType: string[]
  rarity: string
  gen: number
  imgName: string
  form: string
  versionForm: number
}

type Rules = {
  pokemon: {
    allowedRarity: string[]
    allowedForm: string[]
    allowedGen: number[]
    allowedImageExtensions: string[]
    imageFolders: { pokeHome: string; pokeHomeShadow: string }
  }
}

const rules = readJson<Rules>('json/schemaRules.json')
const pokemon = readJson<PokemonEntry[]>('json/pokemon.json')

function assertNameObjectValid(nameObj: PokemonEntry['name'], ctx: string): void {
  const keys: Array<keyof PokemonEntry['name']> = ['nameEng', 'nameFr', 'nameCompletFr', 'nameCompletEng']
  assertHasKeys(nameObj as unknown as Record<string, unknown>, keys as string[], `${ctx}.name`)
  for (const k of keys) {
    const arr = nameObj[k]
    if (!Array.isArray(arr) || arr.length < 1) throw new Error(`${ctx}.name.${k}: must be an array with at least 1 element`)
    for (let i = 0; i < arr.length; i++) {
      if (!isNonEmptyString(arr[i])) throw new Error(`${ctx}.name.${k}: empty value at index ${i}`)
    }
  }
}

describe('json/pokemon.json', () => {
  it('is a non-empty array', () => {
    expect(Array.isArray(pokemon)).toBe(true)
    expect(pokemon.length).toBeGreaterThan(0)
  })

  it('has no exact duplicate objects', () => {
    assertNoExactDuplicates(pokemon, 'pokemon')
  })

  pokemon.forEach((p, i) => {
    it(`entry ${i} (id=${p?.id ?? 'unknown'}, img=${p?.imgName ?? 'n/a'}) is valid`, () => {
      const ctx = `pokemon[id=${p?.id ?? 'unknown'} index=${i}]`
      assertHasKeys(p as unknown as Record<string, unknown>, ['id', 'name', 'arrayType', 'rarity', 'gen', 'imgName', 'form', 'versionForm'], ctx)
      expect(typeof p.id).toBe('number')
      expect(p.id).toBeGreaterThanOrEqual(0)
      if (p.id === 0) return

      expect(p.name && typeof p.name === 'object' && !Array.isArray(p.name)).toBe(true)
      assertNameObjectValid(p.name, ctx)

      if (!Array.isArray(p.arrayType)) throw new Error(`${ctx}.arrayType: must be an array`)
      if (p.arrayType.length < 1 || p.arrayType.length > 3) throw new Error(`${ctx}.arrayType: must have 1 to 2 elements`)
      for (let t = 0; t < p.arrayType.length; t++) {
        if (!isNonEmptyString(p.arrayType[t])) throw new Error(`${ctx}.arrayType: empty value at index ${t}`)
      }

      if (!isNonEmptyString(p.rarity)) throw new Error(`${ctx}.rarity: empty`)
      assertAllowed(p.rarity, rules.pokemon.allowedRarity, `${ctx}.rarity`)

      if (!isNonEmptyString(p.form)) throw new Error(`${ctx}.form: empty`)
      assertAllowed(p.form, rules.pokemon.allowedForm, `${ctx}.form`)

      expect(typeof p.gen).toBe('number')
      assertAllowed(p.gen, rules.pokemon.allowedGen, `${ctx}.gen`)

      if (!isNonEmptyString(p.imgName)) throw new Error(`${ctx}.imgName: empty`)
      assertImageExists(rules.pokemon.imageFolders.pokeHome, p.imgName, rules.pokemon.allowedImageExtensions, `${ctx}.pokeHome`)
      assertImageExists(
        rules.pokemon.imageFolders.pokeHomeShadow,
        p.imgName,
        rules.pokemon.allowedImageExtensions,
        `${ctx}.pokeHomeShadow`,
      )

      expect(Number.isInteger(p.versionForm)).toBe(true)
      expect(p.versionForm).toBeGreaterThanOrEqual(1)
    })
  })
})

