import * as dotenv from 'dotenv';
import { Keypair } from '@solana/web3.js';
import fs from 'fs';

dotenv.config();

const loadKeypair = (path: string): Keypair => {
    const secretKey = JSON.parse(fs.readFileSync(path, 'utf8'));
    return Keypair.fromSecretKey(Uint8Array.from(secretKey));
}

export const config = {
    port: process.env.PORT || 3001,
    rpcUrl: process.env.RPC_URL || `https://devnet-router.magicblock.app/`,
    programId: process.env.PROGRAM_ID || '7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P',
    makerKeypair: loadKeypair(process.env.MAKER_KEYPAIR_PATH || './src/config/maker-keypair.json'),
    takerKeypair: loadKeypair(process.env.TAKER_KEYPAIR_PATH || './src/config/taker-keypair.json'),
    crankKeypair: loadKeypair(process.env.CRANK_KEYPAIR_PATH || './src/config/crank-keypair.json'),
    batchInterval: 2000,
}