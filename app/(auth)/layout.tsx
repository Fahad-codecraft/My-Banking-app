import NextTopLoader from 'nextjs-toploader';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <main className="flex min-h-screen w-full justify-between font-inter">
    <NextTopLoader />
    {children}
  </main>
  );
}
