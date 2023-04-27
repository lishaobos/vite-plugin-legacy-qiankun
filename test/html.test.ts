import { describe, expect, it } from 'vitest'
import { createCtx } from '../index'
import { promises as fs } from 'node:fs'
import { resolve } from 'node:path'

describe('html transform', () => {
  const {
    devTransformIndexHtml,
    proTransformIndexHtml
  } = createCtx({ name: 'test-app' })
  const commentReg = /<!--(.+)-->/g
  const scriptModuleReg = /<script\s*type=['"]module/g
  const scriptNoModuleReg = /<script\s*nomodule/g

  it('serve', async () => {
    const html = await fs.readFile(resolve(__dirname, './tmp/serve.html'), 'utf-8')
    const tHtml = devTransformIndexHtml(html).replaceAll(commentReg, '')
    expect(tHtml).not.toMatch(scriptModuleReg)
    expect(tHtml).not.toMatch(scriptNoModuleReg)
  })

  it('build', async () => {
    const html = await fs.readFile(resolve(__dirname, './tmp/build.html'), 'utf-8')
    const tHtml = proTransformIndexHtml(html).replaceAll(commentReg, '')
    expect(tHtml).not.toMatch(scriptModuleReg)
    expect(tHtml).not.toMatch(scriptNoModuleReg)
  })
})