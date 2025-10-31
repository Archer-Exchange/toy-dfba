import { SolanaService } from "./solana.service";
import { BN } from "@coral-xyz/anchor";
import { config } from '../config';

export class TakerService {
    private intervalId: NodeJS.Timeout | null = null;
    private basePrice = 100;
    private spread = 0.01;

    constructor(private solanaService: SolanaService) {}

    async start() {
        console.log('Starting taker service...');

        await this.placeTakerOrders();

        this.intervalId = setInterval(async () => {
            try {
                await this.placeTakerOrders();
            }
            catch(err) {
                console.error('Taker service error: ', err);
            }
        }, config.batchInterval);
    }

    stop() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }
    }

    private async placeTakerOrders() {
        const priceVariation = (Math.random() - 0.5) * 0.02;
        const currentMid = this.basePrice * (1 + priceVariation);

        const orders = [];

        const numTakerOrdersPerSide = 3;

        for (let i = 0; i < numTakerOrdersPerSide; i++) {
            const takerPrice = currentMid * (1 + this.spread * (1 + Math.random() * 0.5));
            const takerQuantity = 500 + Math.floor(Math.random() * 1500);
            orders.push({
                orderType: { taker: {} },
                side: { buy: {} },
                price: new BN(Math.floor(takerPrice * 1e6)),
                quantity: new BN(takerQuantity),
            });
        }

        for (let i = 0; i < numTakerOrdersPerSide; i++) {
            const takerPrice = currentMid * (1 - this.spread * (1 + Math.random() * 0.5));
            const takerQuantity = 500 + Math.floor(Math.random() * 1500);
            orders.push({
                orderType: { taker: {} },
                side: { sell: {} },
                price: new BN(Math.floor(takerPrice * 1e6)),
                quantity: new BN(takerQuantity),
            });
        }

        try {
            const tx = await this.solanaService.program.methods
                .placeMultipleOrders(orders)
                .accounts({
                    orderPlacer: config.takerKeypair.publicKey,
                    auctionState: this.solanaService.auctionStatePDA,
                    bidQueue: this.solanaService.bidQueuePDA,
                    askQueue: this.solanaService.askQueuePDA,
                })
                .signers([config.takerKeypair])
                .rpc();

            const totalTakers = numTakerOrdersPerSide * 2;
            const expectedVolume = (500 + 2000) / 2 * totalTakers;
            console.log(`Placed ${totalTakers} taker orders (expected volume: ~${expectedVolume.toLocaleString()}): ${tx}`);
            return tx;
        } catch (error) {
            console.error('Failed to place taker orders:', error);
        }
    }
}
