
import { redirect } from 'next/navigation';

export default function DebuggerPage() {
  // This page is deprecated and has been integrated into the main challenge IDE view.
  // We will redirect to the challenges page.
  redirect('/challenges');
}
