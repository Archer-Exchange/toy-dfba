// frontend/src/components/TradingPanel.tsx
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import idl from '../idl.json';
import './TradingPanel.css';

const PROGRAM_ID = new PublicKey('7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P');

export const TradingPanel: React.FC = () => {
    const { connection } = useConnection();
    const wallet = useWallet();
    const [side, setSide] = useState<'buy' | 'sell'>('buy');
    const [price, setPrice] = useState('');
    const [quantity, setQuantity] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('');

    const submitOrder = async () => {
        if (!wallet.publicKey || !wallet.signTransaction) {
            setStatus('Please connect your wallet');
            return;
        }

        setLoading(true);
        setStatus('Submitting order...');

        try {
            const provider = new AnchorProvider(
                connection,
                wallet as any,
                { commitment: 'processed' }
            );

            const program = new Program(idl as any, provider);

            // Derive PDAs
            const [auctionStatePDA] = PublicKey.findProgramAddressSync(
                [Buffer.from('auction_state')],
                program.programId
            );
            
            const [bidQueuePDA] = PublicKey.findProgramAddressSync(
                [Buffer.from('bid_queue')],
                program.programId
            );
            
            const [askQueuePDA] = PublicKey.findProgramAddressSync(
                [Buffer.from('ask_queue')],
                program.programId
            );

            const tx = await program.methods
                .placeOrder({
                    orderType: { taker: {} },
                    side: side === 'buy' ? { buy: {} } : { sell: {} },
                    price: new BN(parseFloat(price) * 1e6),
                    quantity: new BN(parseFloat(quantity)),
                })
                .accounts({
                    orderPlacer: wallet.publicKey,
                    auctionState: auctionStatePDA,
                    bidQueue: bidQueuePDA,
                    askQueue: askQueuePDA,
                    systemProgram: SystemProgram.programId,
                })
                .rpc();

            setStatus(`Order placed! Transaction: ${tx.substring(0, 8)}...`);
            setPrice('');
            setQuantity('');
        } catch (error: any) {
            console.error('Failed to place order:', error);
            setStatus(`Error: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="trading-panel">
            <h2>Place Taker Order</h2>
            <div className="wallet-section">
                <WalletMultiButton />
            </div>
            <div className="order-type-selector">
                <button 
                    className={side === 'buy' ? 'active' : ''}
                    onClick={() => setSide('buy')}
                >
                    Buy
                </button>
                <button 
                    className={side === 'sell' ? 'active' : ''}
                    onClick={() => setSide('sell')}
                >
                    Sell
                </button>
            </div>
            <div className="input-group">
                <label>Price</label>
                <input
                    type="number"
                    placeholder="100.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    disabled={loading}
                />
            </div>
            <div className="input-group">
                <label>Quantity</label>
                <input
                    type="number"
                    placeholder="100"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    disabled={loading}
                />
            </div>
            <button 
                className="submit-button"
                onClick={submitOrder}
                disabled={loading || !price || !quantity}
            >
                {loading ? 'Submitting...' : 'Submit Order'}
            </button>
            {status && <div className="status-message">{status}</div>}
        </div>
    );
};