export const metadata = {
  title: "Papá Estoico & Dragones Negros",
  description: "Sistema unificado de fortalecimiento familiar",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#f4f4f4",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {children}
      </body>
    </html>
  );
}

