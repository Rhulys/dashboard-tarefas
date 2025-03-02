import "./globals.css";
import ApolloClientProvider from "@/lib/ApolloProvider";
import { AuthProvider } from "@/context/AuthContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt">
      <body>
        <AuthProvider>
          <ApolloClientProvider>{children}</ApolloClientProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
