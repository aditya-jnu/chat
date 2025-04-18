import "./globals.css";
import AppInit from "@/components/jwtrestore/Appinit";
import Providers from "@/components/redux/Provider";

export const metadata = {
  title: "chat",
  description: "Create or join a room and chat with your friends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
      <Providers>
        <AppInit/>
        {children}
      </Providers>
      </body>
    </html>
  );
}
