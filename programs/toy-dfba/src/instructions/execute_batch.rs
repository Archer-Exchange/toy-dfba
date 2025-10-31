use crate::errors::ErrorCode;
use crate::processor::auction::execute_auction;
use crate::state::*;
use anchor_lang::prelude::*;

pub fn execute_batch_handler(ctx: Context<ExecuteBatch>, _batch_id: u64) -> Result<()> {
    let auction_state = &mut ctx.accounts.auction_state;
    let bid_queue = &mut ctx.accounts.bid_queue;
    let ask_queue = &mut ctx.accounts.ask_queue;
    let result = &mut ctx.accounts.result;

    let current_slot = Clock::get()?.slot;
    require!(
        current_slot >= auction_state.last_batch_slot + auction_state.batch_interval,
        ErrorCode::TooEarlyToExecute
    );

    let (bid_price, bid_volume) = execute_auction(&mut bid_queue.orders, AuctionType::Bid)?;

    let (ask_price, ask_volume) = execute_auction(&mut ask_queue.orders, AuctionType::Ask)?;

    auction_state.last_batch_slot = current_slot;
    auction_state.batch_counter += 1;

    result.batch_id = auction_state.batch_counter;
    result.bid_clearing_price = bid_price;
    result.bid_volume = bid_volume;
    result.ask_clearing_price = ask_price;
    result.ask_volume = ask_volume;
    result.timestamp = Clock::get()?.unix_timestamp;

    emit!(BatchExecutedEvent {
        batch_id: result.batch_id,
        bid_clearing_price: bid_price,
        bid_volume: bid_volume,
        ask_clearing_price: ask_price,
        ask_volume: ask_volume
    });

    bid_queue
        .orders
        .retain(|order| order.is_active && order.filled_quantity < order.quantity);
    ask_queue
        .orders
        .retain(|order| order.is_active && order.filled_quantity < order.quantity);

    Ok(())
}

#[derive(Accounts)]
#[instruction(batch_id: u64)]
pub struct ExecuteBatch<'info> {
    #[account(
        mut,
        seeds = [b"auction_state"],
        bump
    )]
    pub auction_state: Account<'info, AuctionState>,

    #[account(
        mut,
        seeds = [b"bid_queue"],
        bump
    )]
    pub bid_queue: Account<'info, OrderQueue>,

    #[account(
        mut,
        seeds = [b"ask_queue"],
        bump
    )]
    pub ask_queue: Account<'info, OrderQueue>,

    #[account(
        init,
        payer = authority,
        space = 8 + 8 + 8 + 8 + 8 + 8 + 8,
        seeds = [b"result", batch_id.to_le_bytes().as_ref()],
        bump
    )]
    pub result: Account<'info, AuctionResult>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}