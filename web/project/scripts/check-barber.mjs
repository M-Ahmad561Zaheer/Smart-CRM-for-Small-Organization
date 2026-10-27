import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'
import React from 'react'
import { renderToString } from 'react-dom/server'
const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' })
try {
  for (const path of ['/src/barber/barber-store.js', fileURLToPath(new URL('../../../mobile/my-app/src/components/barber-store.ts', import.meta.url))]) {
    const store = await server.ssrLoadModule(path)
    const james = store.getBarber().clients[0]
    assert.deepEqual(store.totals(['haircut','shave'],james,false),{subtotal:6000,discount:0,tax:480,total:6480,earned:60})
    assert.equal(store.totals(['haircut'],james,true).discount,0)
    assert.match(store.recordService('james',['haircut'],true,'Cash'),/500/)
    assert.match(store.recordService('james',[],false,'Cash'),/Select/)
    assert.match(store.addClient({name:'',phone:'x',email:'bad',service:'bad',loyalty:false,notes:''}),/Enter/)
    assert.equal(store.addClient({name:'New Client',phone:'5559876543',email:'new@example.com',service:'beard',loyalty:true,notes:'Short beard'}),'')
    assert.match(store.addClient({name:'Duplicate',phone:'5559876543',email:'other@example.com',service:'beard',loyalty:false,notes:''}),/already exists/)
    assert.equal(store.recordService('alex',['haircut','shave'],true,'Card'),'')
    assert.equal(store.getBarber().receipts[0].total,5400)
    assert.equal(store.getBarber().clients.find(c=>c.id==='alex').points,200)
    assert.equal(store.getBarber().clients.find(c=>c.id==='james').points,450)
  }
  const config = await server.ssrLoadModule('/src/workspace-store.js')
  const {default: Workspace} = await server.ssrLoadModule('/src/dashboard/SchoolWorkspace.jsx')
  const render = route => renderToString(React.createElement(Workspace,{route}))
  assert.match(render('#barber-dashboard'),/Feature not enabled/)
  assert.equal(config.saveWorkspace('School',false,[],true,[]),false)
  assert.equal(config.saveWorkspace('School',true,['members'],true,['clients']),true)
  assert.match(render('#barber-dashboard'),/Barber module navigation/)
  assert.match(render('#barber-add-client'),/Client Information/)
  assert.match(render('#barber-payments'),/Feature not enabled/)
  config.saveWorkspace('School',false,[],true,['payments'])
  assert.match(render('#barber-payments'),/Record Service/)
  assert.match(render('#barber-clients'),/Feature not enabled/)
  config.saveWorkspace('School',false,[])
  assert.doesNotMatch(render('#school-dashboard'),/Barber module navigation/)
  console.log('PASS: web/mobile client validation, payment totals, loyalty redemption, isolation, module selection and route gates')
} finally { await server.close() }
