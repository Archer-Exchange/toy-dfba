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
    rpcUrl: process.env.RPC_URL || `https://api.devnet.solana.com`,
    programId: process.env.PROGRAM_ID || 'GA1dpF2Q72aWVYtwzWqL6uYoV3nbDa7U5DPmJwuvFiQF',
    makerKeypair: loadKeypair(process.env.MAKER_KEYPAIR_PATH || './src/config/maker-keypair.json'),
    crankKeypair: loadKeypair(process.env.CRANK_KEYPAIR_PATH || './src/config/crank-keypair.json'),
    batchInterval: 3000,
}