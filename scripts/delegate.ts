import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { PublicKey, SystemProgram } from "@solana/web3.js";
import dotenv from 'dotenv';
import IDL from '../target/idl/toy_dfba.json';
import type { ToyDfba } from '../target/types/toy_dfba';

dotenv.config();

async function main() {
    const provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);

    const programId = new PublicKey("7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P");
    const program = new Program(IDL as ToyDfba, provider);

    // Derive PDAs for all state accounts
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

    console.log("=".repeat(60));
    console.log("Delegating DFBA State to Ephemeral Rollup");
    console.log("=".repeat(60));
    console.log("\nPDAs to delegate:");
    console.log("  Auction State:", auctionStatePDA.toString());
    console.log("  Bid Queue:    ", bidQueuePDA.toString());
    console.log("  Ask Queue:    ", askQueuePDA.toString());
    console.log("\n" + "=".repeat(60));

    try {
        // 1. Delegate Auction State
        console.log("\n[1/3] Delegating Auction State...");
        const auctionStateTx = await program.methods
            .delegateAuctionState()
            .accounts({
                payer: provider.wallet.publicKey,
                pda: auctionStatePDA,
            })
            .rpc();

        console.log("✓ Auction State delegated successfully");
        console.log("  Transaction:", auctionStateTx);

        // 2. Delegate Bid Queue
        console.log("\n[2/3] Delegating Bid Queue...");
        const bidQueueTx = await program.methods
            .delegateBidQueue()
            .accounts({
                payer: provider.wallet.publicKey,
                pda: bidQueuePDA,
            })
            .rpc();

        console.log("✓ Bid Queue delegated successfully");
        console.log("  Transaction:", bidQueueTx);

        // 3. Delegate Ask Queue
        console.log("\n[3/3] Delegating Ask Queue...");
        const askQueueTx = await program.methods
            .delegateAskQueue()
            .accounts({
                payer: provider.wallet.publicKey,
                pda: askQueuePDA,
            })
            .rpc();

        console.log("✓ Ask Queue delegated successfully");
        console.log("  Transaction:", askQueueTx);

        console.log("\n" + "=".repeat(60));
        console.log("✓ All state accounts delegated successfully!");
        console.log("=".repeat(60));
        console.log("\nYou can now execute batch auctions every 100ms on the");
        console.log("Ephemeral Rollup with these delegated state accounts.");
        console.log("=".repeat(60));

    } catch (error) {
        console.error("\n✗ Error during delegation:", error);
        if (error instanceof Error) {
            console.error("Error message:", error.message);
        }
        process.exit(1);
    }
}

main().then(
    () => process.exit(0),
    (err) => {
        console.error(err);
        process.exit(1);
    }
);
