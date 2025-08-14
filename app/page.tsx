"use client";

import html2canvas from "html2canvas";
import { useRef } from "react";

declare global {
  interface Window {
    AndroidPrint?: {
      printImage: (base64: string) => void;
    };
  }
}

export default function Home() {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = async () => {
    if (!printRef.current) return;

    // Convert HTML → Canvas
    const canvas = await html2canvas(printRef.current, { scale: 2 });
    const base64Image = canvas.toDataURL("image/png").split(",")[1]; // hapus prefix data:image/png;base64

    if (window.AndroidPrint) {
      window.AndroidPrint.printImage(base64Image);
    } else {
      alert("AndroidPrint tidak tersedia");
    }
  };

  return (
    <div className="p-8">
      <div ref={printRef} className="p-4 border border-gray-400 w-[250px]">
        <h2 className="text-lg font-bold">Struk Pembelian</h2>
        <p>Produk: Kopi Susu</p>
        <p>Harga: Rp 20.000</p>
        <p>Terima kasih!</p>
      </div>

      <button
        onClick={handlePrint}
        className="bg-blue-500 text-white px-4 py-2 rounded mt-4"
      >
        Print Thermal
      </button>
    </div>
  );
}
