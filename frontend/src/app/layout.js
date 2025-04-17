import "./globals.css";

export const metadata = {
  title: "chat",
  description: "Create or join a room and chat with your friends",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
