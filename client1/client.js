"use strict";

// CUSTOMIZE THESE VARIABLES
const MASTER_MULTIADDR =
  "/ip4/127.0.0.1/tcp/5004/p2p/QmP6jKbTgL5fX9A9qix2TgD3TYgyCE56XVDUnA9kPPy6D2";
const DB_ADDRESS =
  "/orbitdb/zdpuAvDBNfQzUG2P97TRocAWMoRSztmxeEULZ1FwNf1sKBK2j/example4444";

const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");
let userName = "Node1";
let aux = true;

// Ipfs Options
const ipfsOptions = {
  repo: "./orbitdb/examples/ipfs",
  start: true,
  EXPERIMENTAL: {
    pubsub: true
  },
  config: {
    Addresses: {
      Swarm: ["/ip4/0.0.0.0/tcp/4004", "/ip4/127.0.0.1/tcp/4005/ws"],
      API: "/ip4/127.0.0.1/tcp/4006",
      Gateway: "/ip4/127.0.0.1/tcp/4007",
      Delegates: []
    }
  },
  relay: {
    enabled: true, // enable circuit relay dialer and listener
    hop: {
      enabled: true // enable circuit relay HOP (make this node a relay)
    }
  },
  pubsub: true
};

const printChat = async db => {
  console.clear();
  const latest = db.iterator({ limit: 6 }).collect();
  let output = ``;
  output += `Chat App.\n`;
  output += `--------------------\n`;
  output += `Username   | Message\n`;
  output += `--------------------\n`;
  output +=
    latest
      .map(e => e.payload.value.userName + " : " + e.payload.value.message)
      .join("\n") + `\n`;
  output += `\n`;
  output += `--------------------\n`;
  output += `${userName} Type Message:`;
  console.log(output);
};

// Start ipfs client node
const startClientNode = async () => {
  // Starting ipfs node
  console.log("Starting...");
  const ipfs = await IPFS.create(ipfsOptions);

  console.log("...IPFS is ready.");
  let db;

  await ipfs.swarm.connect(MASTER_MULTIADDR);

  try {
    const orbitdb = await OrbitDB.createInstance(ipfs, {
      repo: "./orbitdb/examples/eventlog"
    });
    db = await orbitdb.eventlog(DB_ADDRESS);
    await db.load();

    db.events.on("replicated", MASTER_MULTIADDR => {
      if (!aux) {
        printChat(db);
      }
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
  console.log("1");

  // Get process.stdin as the standard input object.
  var standard_input = process.openStdin();
  process.stdin.setEncoding("utf8");
  console.log("\n");
  console.log("--------------------\n");
  console.log("Insert Username.");

  standard_input.on("data", async data => {
    console.clear();

    // Watch for the word 'exit' to exit the app.
    if (data === "exit\n") {
      // Program exit.
      console.log("User input complete, program exit.");
      process.exit();

    // Prototype of message.
    } else if(data === "test\n") {

      const testObj = {
        address: 'someAddress',
        signature: 'someSignatureHash',
        message: {
          infoA: 'some info',
          infoB: 'some more info'
        }
      }

      const entry = { userName: userName, message: JSON.stringify(testObj,null,2) };
      await db.add(entry);

      printChat(db);

    // All other input data.
    } else {
      if (aux) {
        userName = data.replace(/(\r\n|\n|\r)/gm, ""); // remove /n from data
        aux = false;
        printChat(db);
      } else {
        const query = async () => {
          try {
            const entry = { userName: userName, message: data };
            await db.add(entry);
            printChat(db);
          } catch (e) {
            console.error(e);
            process.exit(1);
          }
        };
        query();
      }
    }
  });
};

startClientNode();
