"use client";

import html2canvas from "html2canvas";
import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    AndroidPrint?: {
      scanPrinters: () => void;
      setPrinter: (address: string) => void;
      printImage: (base64: string) => void;
    };
    onPrintersFound?: (devices: { name: string; address: string }[]) => void;
  }
}

export default function Home() {
  const printRef = useRef<HTMLDivElement>(null);
  const [printers, setPrinters] = useState<{ name: string; address: string }[]>([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    window.onPrintersFound = (devices) => {
      setPrinters(devices);
      setShowModal(true);
    };
  }, []);

  const handlePrintFlow = () => {
    // step 1: scan printer lewat native
    window.AndroidPrint?.scanPrinters();
  };

  const handleSelectPrinter = async (address: string) => {
    setShowModal(false);

    // step 2: simpan printer ke native
    window.AndroidPrint?.setPrinter(address);

    // step 3: render struk ke base64
    if (!printRef.current) return;
    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true
    });
    const base64Image = canvas.toDataURL("image/png").split(",")[1];

    // step 4: kirim ke native untuk print
    window.AndroidPrint?.printImage(base64Image);
  };

  return (
    <div className="p-8">
      {/* Satu tombol utama */}
      <button
        onClick={handlePrintFlow}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Print Struk
      </button>

      {/* Struk yang akan diprint */}
      <div
        ref={printRef}
        className="p-4 border border-gray-400 w-[250px] mt-4 bg-white text-black"
      >
        <h2 className="text-lg font-bold">Struk Pembelian</h2>
        <p>Produk: Kopi Susu</p>
        <p>Harga: Rp 20.000</p>
        <p>Terima kasih!</p>
      </div>

      {/* Modal pilih printer */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-4 rounded w-[300px]">
            <h3 className="font-bold mb-2">Pilih Printer</h3>
            <ul>
              {printers.map((p) => (
                <li
                  key={p.address}
                  className="flex justify-between items-center mb-2"
                >
                  {p.name}
                  <button
                    onClick={() => handleSelectPrinter(p.address)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Pilih
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(false)}
              className="mt-2 bg-gray-400 text-white px-3 py-1 rounded"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
