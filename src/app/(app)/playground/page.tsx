
import { redirect } from 'next/navigation';

export default function ApiPlaygroundPage() {
    // This page is deprecated. We redirect users to the first challenge.
    // A better approach might be a dedicated "playground" challenge.
    redirect('/challenges/node-hello-world');
}
