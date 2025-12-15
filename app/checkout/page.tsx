export const runtime = 'nodejs'
import { auth } from '@/auth';
import { Metadata } from 'next';
import { redirect } from 'next/navigation';
import CheckoutForm from './checkout-form';

export const metadata: Metadata = {
  title: 'Checkout',
};

export default async function CheckoutPage() {
  const session = await auth();
  console.log('CHECKOUT PAGE SESSION:', session);
  if (!session?.user) {
    console.log('NO SESSION USER, REDIRECTING TO SIGN-IN');
    redirect('/sign-in?callbackUrl=/checkout');
  } else {
    console.log('SESSION USER FOUND:', session.user);
  }
  return <CheckoutForm />;
}