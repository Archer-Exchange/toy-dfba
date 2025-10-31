import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import dotenv from 'dotenv';
import IDL from '../target/idl/toy_dfba.json';
import type { ToyDfba } from '../target/types/toy_dfba';

dotenv.config();

async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const programId = new PublicKey("7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P");
    const program = new Program(IDL as ToyDfba, provider);

    const [auctionStatePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("auction_state")],
        program.programId
    );

    const [bidQueuePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("bid_queue")],
        program.programId
    );

    const [askQueuePDA] = PublicKey.findProgramAddressSync(
        [Buffer.from("ask_queue")],
        program.programId
    );

    console.log("Running demo...");

    // Create 10 maker orders (5 buys, 5 sells)
    const makerOrders = [];
    const basePrice = 100000000; // $100

    for (let i = 0; i < 5; i++) {
        makerOrders.push({
            orderType: { maker: {} },
            side: { buy: {} },
            price: new anchor.BN(basePrice - (i + 1) * 1000000), // Decreasing buy prices
            quantity: new anchor.BN(100 + i * 50),
        });
    }

    for (let i = 0; i < 5; i++) {
        makerOrders.push({
            orderType: { maker: {} },
            side: { sell: {} },
            price: new anchor.BN(basePrice + (i + 1) * 1000000), // Increasing sell prices
            quantity: new anchor.BN(100 + i * 50),
        });
    }

    // Create 2-3 taker orders
    const takerOrders = [
        {
            orderType: { taker: {} },
            side: { buy: {} },
            price: new anchor.BN(102000000),
            quantity: new anchor.BN(150),
        },
        {
            orderType: { taker: {} },
            side: { sell: {} },
            price: new anchor.BN(98000000),
            quantity: new anchor.BN(150),
        },
        {
            orderType: { taker: {} },
            side: { buy: {} },
            price: new anchor.BN(103000000),
            quantity: new anchor.BN(100),
        },
    ];

    try {
        console.log(`Placing ${makerOrders.length} maker orders...`);
        const makerTx = await program.methods
            .placeMultipleOrders(makerOrders)
            .accounts({
                orderPlacer: provider.wallet.publicKey,
                auctionState: auctionStatePDA,
                bidQueue: bidQueuePDA,
                askQueue: askQueuePDA,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log(`Placed ${makerOrders.length} maker orders: ${makerTx}`);

        console.log(`\nPlacing ${takerOrders.length} taker orders...`);
        const takerTx = await program.methods
            .placeMultipleOrders(takerOrders)
            .accounts({
                orderPlacer: provider.wallet.publicKey,
                auctionState: auctionStatePDA,
                bidQueue: bidQueuePDA,
                askQueue: askQueuePDA,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log(`Placed ${takerOrders.length} taker orders: ${takerTx}`);
    } catch (error) {
        console.error("Error placing orders:", error);
    }

    console.log("\nExecuting batch auction...");
    
    const auctionState = await (program.account as any).auctionState.fetchNullable(auctionStatePDA);
    //@ts-ignore
    const batchId = auctionState.batchCounter.toNumber() + 1;

    try {
        const tx = await program.methods
            .executeBatch(new anchor.BN(batchId))
            .accounts({
                auctionState: auctionStatePDA,
                bidQueue: bidQueuePDA,
                askQueue: askQueuePDA,
                result: PublicKey.findProgramAddressSync(
                    [Buffer.from("result"), Buffer.from(new anchor.BN(batchId).toArray("le", 8))],
                    program.programId
                )[0],
                authority: provider.wallet.publicKey,
                systemProgram: SystemProgram.programId,
            })
            .rpc();

        console.log("Batch executed:", tx);

        const result = await (program.account as any).auctionResult.fetchNullable(
            PublicKey.findProgramAddressSync(
                [Buffer.from("result"), Buffer.from(new anchor.BN(batchId).toArray("le", 8))],
                program.programId
            )[0]
        );

        console.log("\nAuction Results:");
        //@ts-ignore
        console.log(`Bid Clearing Price: ${result.bidClearingPrice.toNumber() / 1e6}`);
        //@ts-ignore
        console.log(`Bid Volume: ${result.bidVolume.toNumber()}`);
        //@ts-ignore
        console.log(`Ask Clearing Price: ${result.askClearingPrice.toNumber() / 1e6}`);
        //@ts-ignore
        console.log(`Ask Volume: ${result.askVolume.toNumber()}`);
    } catch (error) {
        console.error("Error executing batch:", error);
    }
}

main().then(
    () => process.exit(0),
    (err) => {
        console.error(err);
        process.exit(1);
    }
);