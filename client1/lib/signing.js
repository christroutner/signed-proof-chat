/*
  A utility library for signing and verifying messages.
*/

const BCHJS = require('@psf/bch-js')
const MinimalSlpWallet = require('minimal-slp-wallet')

const MNEMONIC =
  'creek caution crouch bid route gold prepare need above movie broom denial'
// const BCH_ADDR = 'bitcoincash:qzgz0pxx23lj4qham7338r8hnewe3xp0jgl7m3zzgk'
// const SLP_ADDR = 'simpleledger:qzgz0pxx23lj4qham7338r8hnewe3xp0jgn9s2hzkg'
// const WIF = 'L1o2nePHqRzkoeh6V9Tjiktr4tdRirKCmSu6bcv81bqdbrYcBj28'

class Signing {
  constructor () {
    this.bchjs = new BCHJS()
    this.wallet = new MinimalSlpWallet(MNEMONIC)

    this.isReady = this.initialize()
  }

  async initialize () {
    // Wait for the wallet to finish being created.
    await this.wallet.walletInfoPromise

    this.bchAddr = this.wallet.walletInfo.cashAddress
    this.slpAddr = this.wallet.walletInfo.slpAddress
    this.privateKey = this.wallet.walletInfo.privateKey

    console.log(`bchAddr: ${this.bchAddr}`)
    console.log(`slpAddr: ${this.slpAddr}`)
  }

  // Signs the provided message and returns the signature.
  sign (message) {
    try {
      // Debugging.
      // console.log(`this.privateKey: ${this.privateKey}`)
      // console.log(`message: ${message}`)

      const signature = this.bchjs.BitcoinCash.signMessageWithPrivKey(
        this.privateKey,
        message
      )
      return signature
    } catch (err) {
      console.error('Error in sign()')
      throw err
    }
  }

  // Verify the signature of a message was actually signed by the address.
  verify (addr, signature, message) {
    try {
      let isValid = false

      isValid = this.bchjs.BitcoinCash.verifyMessage(addr, signature, message)

      return isValid
    } catch (err) {
      console.error('Error in verify()')
      throw err
    }
  }
}

module.exports = Signing
