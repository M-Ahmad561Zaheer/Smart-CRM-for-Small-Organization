import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
const server = await createServer({ root: fileURLToPath(new URL('../', import.meta.url)), server: { middlewareMode: true }, appType: 'custom' })
try {
  const config = await server.ssrLoadModule('/src/workspace-store.js')
  const { default: Workspace } = await server.ssrLoadModule('/src/dashboard/SchoolWorkspace.jsx')
  const render = route => renderToString(React.createElement(Workspace, { route }))
  assert.equal(config.getWorkspace().gym, false)
  assert.match(render('#gym-training'), /Feature not enabled/)
  assert.equal(config.saveWorkspace('School', true, []), false)
  assert.equal(config.saveWorkspace('School', true, ['training', 'reports']), true)
  assert.match(render('#school-dashboard'), /Gym module navigation/)
  assert.match(render('#gym-training'), /Schedule Personal Training/)
  assert.doesNotMatch(render('#gym-training'), /Fitness workspace/)
  assert.match(render('#gym-members'), /Feature not enabled/)
  assert.match(render('#gym-member/1'), /Feature not enabled/)
  assert.match(render('#gym-add-member'), /Feature not enabled/)
  assert.equal(config.saveWorkspace('School', false, ['training']), true)
  assert.deepEqual(config.getWorkspace().features, [])
  assert.doesNotMatch(render('#school-dashboard'), /Gym module navigation/)
  const mobile = await server.ssrLoadModule(fileURLToPath(new URL('../../../mobile/my-app/src/components/workspace-store.ts', import.meta.url)))
  assert.equal(mobile.saveWorkspace('School', true, []), false)
  assert.equal(mobile.saveWorkspace('School', true, ['members']), true)
  assert.deepEqual(mobile.getWorkspace().features, ['members'])
  assert.equal(mobile.saveWorkspace('School', false, ['members']), true)
  assert.deepEqual(mobile.getWorkspace().features, [])
  console.log('PASS: School-only default, required feature selection, selected navigation, disabled direct routes, module removal, mobile config parity')
} finally { await server.close() }
