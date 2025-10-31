use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod processor;
pub mod state;

use instructions::*;
use ephemeral_rollups_sdk::anchor::{ephemeral, delegate};
use ephemeral_rollups_sdk::cpi::DelegateConfig;

declare_id!("7bmPzyNe65Br7yR83KaewmatgrACQLwnaa4UzFjsVV3P");

#[ephemeral]
#[program]
pub mod toy_dfba {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, batch_interval: u64) -> Result<()> {
        instructions::initialize::initialize_handler(ctx, batch_interval)
    }

    pub fn place_order(ctx: Context<PlaceOrder>, params: PlaceOrderParams) -> Result<()> {
        instructions::place_order::place_order_handler(ctx, params)
    }

    pub fn place_multiple_orders(
        ctx: Context<PlaceMultipleOrders>,
        orders: Vec<PlaceOrderParams>,
    ) -> Result<()> {
        instructions::place_multiple_orders::place_multiple_orders_handler(ctx, orders)
    }

    pub fn cancel_all_orders(ctx: Context<CancelAllOrders>) -> Result<()> {
        instructions::cancel_all_orders::cancel_orders_handler(ctx)
    }

    pub fn cancel_all_and_post_new_orders(
        ctx: Context<CancelAllAndPostNewOrders>,
        orders: Vec<PlaceOrderParams>,
    ) -> Result<()> {
        instructions::cancel_all_and_post_new_orders::cancel_all_and_post_new_orders_handler(ctx, orders)
    }

    pub fn initialize_result(ctx: Context<InitializeResult>, batch_id: u64) -> Result<()> {
        instructions::initialize_result::initialize_result_handler(ctx, batch_id)
    }

    pub fn execute_batch(ctx: Context<ExecuteBatch>, batch_id: u64) -> Result<()> {
        instructions::execute_batch::execute_batch_handler(ctx, batch_id)
    }

    pub fn delegate_auction_state(ctx: Context<DelegateInput>) -> Result<()> {
        ctx.accounts.delegate_pda(
            &ctx.accounts.payer,
            &[b"auction_state"],
            DelegateConfig::default()
        )?;

        Ok(())
    }

    pub fn delegate_bid_queue(ctx: Context<DelegateInput>) -> Result<()> {
        ctx.accounts.delegate_pda(
            &ctx.accounts.payer,
            &[b"bid_queue"],
            DelegateConfig::default()
        )?;

        Ok(())
    }

    pub fn delegate_ask_queue(ctx: Context<DelegateInput>) -> Result<()> {
        ctx.accounts.delegate_pda(
            &ctx.accounts.payer,
            &[b"ask_queue"],
            DelegateConfig::default()
        )?;

        Ok(())
    }

    pub fn delegate_result(ctx: Context<DelegateResult>, batch_id: u64) -> Result<()> {
        ctx.accounts.delegate_pda(
            &ctx.accounts.payer,
            &[b"result", batch_id.to_le_bytes().as_ref()],
            DelegateConfig::default()
        )?;

        Ok(())
    }
}

#[delegate]
#[derive(Accounts)]
pub struct DelegateInput<'info> {
    pub payer: Signer<'info>,
    /// CHECK: The PDA to delegate
    #[account(mut, del)]
    pub pda: AccountInfo<'info>,
}

#[delegate]
#[derive(Accounts)]
#[instruction(batch_id: u64)]
pub struct DelegateResult<'info> {
    pub payer: Signer<'info>,
    /// CHECK: The result PDA to delegate
    #[account(
        mut,
        del,
        seeds = [b"result", batch_id.to_le_bytes().as_ref()],
        bump
    )]
    pub pda: AccountInfo<'info>,
}

