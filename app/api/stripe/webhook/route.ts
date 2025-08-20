import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-06-20',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      
      // Extract gym ID from metadata
      const gymId = session.metadata?.gymId;
      const plan = session.metadata?.plan;
      
      if (!gymId) {
        console.error('No gymId found in session metadata');
        return NextResponse.json({ error: 'No gymId in metadata' }, { status: 400 });
      }

      try {
        // Activate the gym
        const { error: updateError } = await supabaseAdmin
          .from('gyms')
          .update({ 
            is_active: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', gymId);

        if (updateError) {
          console.error('Error activating gym:', updateError);
          return NextResponse.json({ error: 'Failed to activate gym' }, { status: 500 });
        }

        console.log(`Gym ${gymId} activated successfully with ${plan} plan`);
        
        // You could also create a record of this subscription in your database here
        // For example, storing the Stripe subscription ID, plan details, etc.
        
      } catch (error) {
        console.error('Error processing successful payment:', error);
        return NextResponse.json({ error: 'Error processing payment' }, { status: 500 });
      }
      
      break;
    }
    
    case 'invoice.payment_succeeded': {
      // Handle recurring subscription payments
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;
      
      try {
        // Get subscription details to find the gym
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const gymId = subscription.metadata?.gymId;
        
        if (gymId) {
          // Ensure gym remains active for recurring payments
          const { error: updateError } = await supabaseAdmin
            .from('gyms')
            .update({ 
              is_active: true,
              updated_at: new Date().toISOString()
            })
            .eq('id', gymId);

          if (updateError) {
            console.error('Error maintaining gym active status:', updateError);
          } else {
            console.log(`Gym ${gymId} subscription payment confirmed`);
          }
        }
      } catch (error) {
        console.error('Error processing recurring payment:', error);
      }
      
      break;
    }
    
    case 'invoice.payment_failed': {
      // Handle failed payments
      const invoice = event.data.object as Stripe.Invoice;
      const subscriptionId = invoice.subscription as string;
      
      try {
        // Get subscription details to find the gym
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        const gymId = subscription.metadata?.gymId;
        
        if (gymId) {
          console.log(`Payment failed for gym ${gymId} - consider implementing grace period logic`);
          // You might want to implement a grace period before deactivating
          // or send notifications to the gym owner
        }
      } catch (error) {
        console.error('Error processing failed payment:', error);
      }
      
      break;
    }
    
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return NextResponse.json({ received: true });
}