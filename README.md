# signed-proof-chat
This is a rapid prototype app based on [this OrbitDB chat example](https://github.com/christroutner/e2e-orbitDB-chat-app-prototype).

The purpose of this app is to create two client nodes that communicate with one another:

- The first node will broadcast a JSON object as a message. It will also sign the message with its BCH wallet.

- The second node will read the message and verify the signature. It will also verify the address that signed the message is in position of 10 PSF tokens.

The app uses [slp-cli-wallet](https://github.com/christroutner/slp-cli-wallet) for BCH wallet functionality and message signing.

## License
[MIT](LICENSE.md)
