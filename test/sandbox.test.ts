import { expect, it } from 'vitest'
import { convertVariable } from '../index'

it('sandbox', async () => {
  expect(
    convertVariable(
      `const el = Array.from(document.querySelectorAll('link'))`,
      'document',
      'legacyQiankunDocument'
      )
  ).toBe(`const el = Array.from(legacyQiankunDocument.querySelectorAll('link'))`)

  expect(
    convertVariable(
      `const link = document.createElement('style')`,
      'document',
      'legacyQiankunDocument'
      )
  ).toBe(`const link = legacyQiankunDocument.createElement('style')`)

  expect(
    convertVariable(
      `document.createElement('legacyQiankunWindow')`,
      'document',
      'legacyQiankunDocument'
      )
  ).toBe(`legacyQiankunDocument.createElement('legacyQiankunWindow')`)

  expect(
    convertVariable(
      `const do = document`,
      'document',
      'legacyQiankunDocument'
      )
  ).toBe(`const do = legacyQiankunDocument`)

  expect(
    convertVariable(
      `const do = window.document`,
      'document',
      'legacyQiankunDocument'
      )
  ).toBe(`const do = window.document`)

  expect(
    convertVariable(
      `function test () {
        window.vueName = 'xxxxxxxxxxxxxxxxx'
      }`,
      'window',
      'legacyQiankunWindow'
      )
  ).toContain(`legacyQiankunWindow.vueName`)

})

  