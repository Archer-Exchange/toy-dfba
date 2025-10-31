/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/toy_dfba.json`.
 */
export type ToyDfba = {
  "address": "7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P",
  "metadata": {
    "name": "toyDfba",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "cancelAllAndPostNewOrders",
      "discriminator": [
        224,
        221,
        134,
        170,
        113,
        156,
        238,
        117
      ],
      "accounts": [
        {
          "name": "orderPlacer",
          "writable": true,
          "signer": true
        },
        {
          "name": "auctionState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "bidQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "askQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  115,
                  107,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "orders",
          "type": {
            "vec": {
              "defined": {
                "name": "placeOrderParams"
              }
            }
          }
        }
      ]
    },
    {
      "name": "cancelAllOrders",
      "discriminator": [
        196,
        83,
        243,
        171,
        17,
        100,
        160,
        143
      ],
      "accounts": [
        {
          "name": "owner",
          "writable": true,
          "signer": true
        },
        {
          "name": "bidQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "askQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  115,
                  107,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        }
      ],
      "args": []
    },
    {
      "name": "delegateAskQueue",
      "discriminator": [
        122,
        251,
        209,
        142,
        165,
        136,
        213,
        116
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "bufferPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  102,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                98,
                14,
                17,
                130,
                141,
                56,
                230,
                218,
                157,
                2,
                78,
                196,
                178,
                53,
                3,
                186,
                22,
                184,
                222,
                243,
                101,
                18,
                87,
                94,
                202,
                56,
                253,
                100,
                215,
                152,
                249,
                58
              ]
            }
          }
        },
        {
          "name": "delegationRecordPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "delegationMetadataPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "pda",
          "writable": true
        },
        {
          "name": "ownerProgram",
          "address": "7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P"
        },
        {
          "name": "delegationProgram",
          "address": "DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "delegateAuctionState",
      "discriminator": [
        72,
        149,
        204,
        136,
        156,
        58,
        145,
        147
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "bufferPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  102,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                98,
                14,
                17,
                130,
                141,
                56,
                230,
                218,
                157,
                2,
                78,
                196,
                178,
                53,
                3,
                186,
                22,
                184,
                222,
                243,
                101,
                18,
                87,
                94,
                202,
                56,
                253,
                100,
                215,
                152,
                249,
                58
              ]
            }
          }
        },
        {
          "name": "delegationRecordPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "delegationMetadataPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "pda",
          "writable": true
        },
        {
          "name": "ownerProgram",
          "address": "7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P"
        },
        {
          "name": "delegationProgram",
          "address": "DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "delegateBidQueue",
      "discriminator": [
        76,
        80,
        231,
        171,
        44,
        243,
        8,
        141
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "bufferPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  102,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                98,
                14,
                17,
                130,
                141,
                56,
                230,
                218,
                157,
                2,
                78,
                196,
                178,
                53,
                3,
                186,
                22,
                184,
                222,
                243,
                101,
                18,
                87,
                94,
                202,
                56,
                253,
                100,
                215,
                152,
                249,
                58
              ]
            }
          }
        },
        {
          "name": "delegationRecordPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "delegationMetadataPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "pda",
          "writable": true
        },
        {
          "name": "ownerProgram",
          "address": "7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P"
        },
        {
          "name": "delegationProgram",
          "address": "DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "delegateResult",
      "discriminator": [
        201,
        198,
        51,
        69,
        241,
        173,
        75,
        3
      ],
      "accounts": [
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "bufferPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  117,
                  102,
                  102,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "const",
              "value": [
                98,
                14,
                17,
                130,
                141,
                56,
                230,
                218,
                157,
                2,
                78,
                196,
                178,
                53,
                3,
                186,
                22,
                184,
                222,
                243,
                101,
                18,
                87,
                94,
                202,
                56,
                253,
                100,
                215,
                152,
                249,
                58
              ]
            }
          }
        },
        {
          "name": "delegationRecordPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "delegationMetadataPda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  100,
                  101,
                  108,
                  101,
                  103,
                  97,
                  116,
                  105,
                  111,
                  110,
                  45,
                  109,
                  101,
                  116,
                  97,
                  100,
                  97,
                  116,
                  97
                ]
              },
              {
                "kind": "account",
                "path": "pda"
              }
            ],
            "program": {
              "kind": "account",
              "path": "delegationProgram"
            }
          }
        },
        {
          "name": "pda",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "batchId"
              }
            ]
          }
        },
        {
          "name": "ownerProgram",
          "address": "7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P"
        },
        {
          "name": "delegationProgram",
          "address": "DELeGGvXpWV2fqJUhqcF5ZSYMS4JTLjteaAMARRSaeSh"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "batchId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "executeBatch",
      "discriminator": [
        112,
        159,
        211,
        51,
        238,
        70,
        212,
        60
      ],
      "accounts": [
        {
          "name": "auctionState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "bidQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "askQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  115,
                  107,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "result",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "batchId"
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "batchId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "auctionState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "bidQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "askQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  115,
                  107,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "authority",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "batchInterval",
          "type": "u64"
        }
      ]
    },
    {
      "name": "initializeResult",
      "discriminator": [
        150,
        212,
        176,
        141,
        183,
        117,
        137,
        138
      ],
      "accounts": [
        {
          "name": "result",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  101,
                  115,
                  117,
                  108,
                  116
                ]
              },
              {
                "kind": "arg",
                "path": "batchId"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "batchId",
          "type": "u64"
        }
      ]
    },
    {
      "name": "placeMultipleOrders",
      "discriminator": [
        12,
        44,
        82,
        108,
        22,
        209,
        74,
        186
      ],
      "accounts": [
        {
          "name": "orderPlacer",
          "writable": true,
          "signer": true
        },
        {
          "name": "auctionState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "bidQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "askQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  115,
                  107,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "orders",
          "type": {
            "vec": {
              "defined": {
                "name": "placeOrderParams"
              }
            }
          }
        }
      ]
    },
    {
      "name": "placeOrder",
      "discriminator": [
        51,
        194,
        155,
        175,
        109,
        130,
        96,
        106
      ],
      "accounts": [
        {
          "name": "orderPlacer",
          "writable": true,
          "signer": true
        },
        {
          "name": "auctionState",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  117,
                  99,
                  116,
                  105,
                  111,
                  110,
                  95,
                  115,
                  116,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "bidQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  98,
                  105,
                  100,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "askQueue",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  97,
                  115,
                  107,
                  95,
                  113,
                  117,
                  101,
                  117,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "params",
          "type": {
            "defined": {
              "name": "placeOrderParams"
            }
          }
        }
      ]
    },
    {
      "name": "processUndelegation",
      "discriminator": [
        196,
        28,
        41,
        206,
        48,
        37,
        51,
        167
      ],
      "accounts": [
        {
          "name": "baseAccount",
          "writable": true
        },
        {
          "name": "buffer"
        },
        {
          "name": "payer",
          "writable": true
        },
        {
          "name": "systemProgram"
        }
      ],
      "args": [
        {
          "name": "accountSeeds",
          "type": {
            "vec": "bytes"
          }
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "auctionResult",
      "discriminator": [
        182,
        105,
        71,
        113,
        228,
        147,
        117,
        135
      ]
    },
    {
      "name": "auctionState",
      "discriminator": [
        252,
        227,
        205,
        147,
        72,
        64,
        250,
        126
      ]
    },
    {
      "name": "orderQueue",
      "discriminator": [
        190,
        69,
        194,
        176,
        26,
        115,
        144,
        53
      ]
    }
  ],
  "events": [
    {
      "name": "batchExecutedEvent",
      "discriminator": [
        215,
        35,
        42,
        14,
        15,
        94,
        132,
        29
      ]
    },
    {
      "name": "orderPlacedEvent",
      "discriminator": [
        245,
        198,
        202,
        247,
        110,
        231,
        254,
        156
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "tooEarlyToExecute",
      "msg": "Too early to execute batch"
    },
    {
      "code": 6001,
      "name": "orderQueueFull",
      "msg": "Order queue is full"
    },
    {
      "code": 6002,
      "name": "invalidOrderParameters",
      "msg": "Invalid order parameters"
    },
    {
      "code": 6003,
      "name": "auctionPaused",
      "msg": "Auction is paused"
    }
  ],
  "types": [
    {
      "name": "auctionResult",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "batchId",
            "type": "u64"
          },
          {
            "name": "bidClearingPrice",
            "type": "u64"
          },
          {
            "name": "bidVolume",
            "type": "u64"
          },
          {
            "name": "askClearingPrice",
            "type": "u64"
          },
          {
            "name": "askVolume",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "auctionState",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "authority",
            "type": "pubkey"
          },
          {
            "name": "batchInterval",
            "type": "u64"
          },
          {
            "name": "lastBatchSlot",
            "type": "u64"
          },
          {
            "name": "batchCounter",
            "type": "u64"
          },
          {
            "name": "isPaused",
            "type": "bool"
          }
        ]
      }
    },
    {
      "name": "auctionType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "bid"
          },
          {
            "name": "ask"
          }
        ]
      }
    },
    {
      "name": "batchExecutedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "batchId",
            "type": "u64"
          },
          {
            "name": "bidClearingPrice",
            "type": "u64"
          },
          {
            "name": "bidVolume",
            "type": "u64"
          },
          {
            "name": "askClearingPrice",
            "type": "u64"
          },
          {
            "name": "askVolume",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "order",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "id",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "orderType",
            "type": {
              "defined": {
                "name": "orderType"
              }
            }
          },
          {
            "name": "side",
            "type": {
              "defined": {
                "name": "side"
              }
            }
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "quantity",
            "type": "u64"
          },
          {
            "name": "timestamp",
            "type": "i64"
          },
          {
            "name": "isActive",
            "type": "bool"
          },
          {
            "name": "filledQuantity",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "orderPlacedEvent",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderId",
            "type": "u64"
          },
          {
            "name": "owner",
            "type": "pubkey"
          },
          {
            "name": "orderType",
            "type": {
              "defined": {
                "name": "orderType"
              }
            }
          },
          {
            "name": "side",
            "type": {
              "defined": {
                "name": "side"
              }
            }
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "quantity",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "orderQueue",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "auctionType",
            "type": {
              "defined": {
                "name": "auctionType"
              }
            }
          },
          {
            "name": "orders",
            "type": {
              "vec": {
                "defined": {
                  "name": "order"
                }
              }
            }
          },
          {
            "name": "maxOrders",
            "type": "u32"
          }
        ]
      }
    },
    {
      "name": "orderType",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "maker"
          },
          {
            "name": "taker"
          }
        ]
      }
    },
    {
      "name": "placeOrderParams",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "orderType",
            "type": {
              "defined": {
                "name": "orderType"
              }
            }
          },
          {
            "name": "side",
            "type": {
              "defined": {
                "name": "side"
              }
            }
          },
          {
            "name": "price",
            "type": "u64"
          },
          {
            "name": "quantity",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "side",
      "type": {
        "kind": "enum",
        "variants": [
          {
            "name": "buy"
          },
          {
            "name": "sell"
          }
        ]
      }
    }
  ]
};
