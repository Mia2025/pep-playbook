export const metadata = {
  title: 'The Peptide Buyer\u2019s Playbook',
  description: 'Know the market before you spend a cent.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
          background: '#FBFAFC',
          color: '#16141C',
        }}
      >
        {children}
      </body>
    </html>
  );
}
