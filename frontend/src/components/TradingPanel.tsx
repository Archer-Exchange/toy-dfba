// frontend/src/components/TradingPanel.tsx
import React, { useState } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Program, AnchorProvider, BN } from '@coral-xyz/anchor';
import { PublicKey, SystemProgram } from '@solana/web3.js';
import toast from 'react-hot-toast';
import idl from '../idl.json';
import './TradingPanel.css';

const PROGRAM_ID = new PublicKey('GA1dpF2Q72aWVYtwzWqL6uYoV3nbDa7U5DPmJwuvFiQF');

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
            toast.error('Please connect your wallet');
            return;
        }

        setLoading(true);
        setStatus('Submitting order...');

        try {
            const provider = new AnchorProvider(
                connection,
                wallet as any,
                {
                    commitment: 'processed',
                    skipPreflight: true
                }
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

            const explorerUrl = `https://explorer.solana.com/tx/${tx}?cluster=devnet`;

            toast.success(
                <div>
                    Order placed successfully!
                    <br />
                    <a
                        href={explorerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#00ff00', textDecoration: 'underline' }}
                    >
                        View on Explorer
                    </a>
                </div>,
                {
                    duration: 6000,
                    style: {
                        background: '#10b981',
                        color: '#fff',
                    },
                }
            );

            setStatus('');
            setPrice('');
            setQuantity('');
        } catch (error: any) {
            console.error('Failed to place order:', error);
            toast.error(
                `Failed to place order: ${error.message || 'Unknown error'}`,
                {
                    duration: 6000,
                }
            );
            setStatus('');
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