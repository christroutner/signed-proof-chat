/*
  Unit tests for signing library.
*/

const assert = require('chai').assert

const Signing = require('../lib/signing')
let uut

describe('#signing', () => {
  beforeEach(async () => {
    uut = new Signing()
    await uut.isReady
  })

  describe('#sign', () => {
    it('should sign a message', async () => {
      // Wait for the wallet to finish being created.
      await uut.wallet.walletInfoPromise

      const sig = uut.sign('this is a test')
      console.log(`sig: ${sig}`)

      assert.isString(sig)
    })
  })
})
