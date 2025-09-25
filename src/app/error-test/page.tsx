

export default function ErrorTestPage() {
  // throw the error directly.
  throw new Error('💥 Kaboom! This is a test error from a Next.js Page.');

 
  return <div>You should not see this.</div>;
}