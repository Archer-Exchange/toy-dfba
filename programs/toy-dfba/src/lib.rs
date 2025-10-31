use anchor_lang::prelude::*;

pub mod errors;
pub mod instructions;
pub mod processor;
pub mod state;

use instructions::*;

declare_id!("GA1dpF2Q72aWVYtwzWqL6uYoV3nbDa7U5DPmJwuvFiQF");

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

    pub fn execute_batch(ctx: Context<ExecuteBatch>, batch_id: u64) -> Result<()> {
        instructions::execute_batch::execute_batch_handler(ctx, batch_id)
    }
}
