import "../globals.css";
import localFont from "next/font/local";
import { Lora } from "next/font/google";

const instrumentSerif = Lora({
    variable: "--font-instrument-serif",
    display: "swap",
    subsets: ["latin"],
    weight: ["400", "700"],
    style: ["normal", "italic"],
});

const instrumentSans = localFont({
    variable: "--font-instrument-sans",
    display: "swap",
    src: [
        {
            path: "../(typograhy)/Instrument-Sans/InstrumentSans-VariableFont_wdth,wght.ttf",
            weight: "100 900",
            style: "normal",
        },
        {
            path: "../(typograhy)/Instrument-Sans/InstrumentSans-Italic-VariableFont_wdth,wght.ttf",
            weight: "100 900",
            style: "italic",
        },
    ],
});

export default function PrototypesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="es" className={`${instrumentSerif.variable} ${instrumentSans.variable}`}>
            <body>{children}</body>
        </html>
    );
}
