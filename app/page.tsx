"use client";
import html2canvas from "html2canvas";
import { useState, useRef, useEffect } from "react";


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
  const [selectedItem, setSelectedItem] = useState<any>(null);
    const [showPrinterModal, setShowPrinterModal] = useState(false);

  useEffect(() => {
    window.onPrintersFound = (devices) => {
      setPrinters(devices);
      setShowPrinterModal(true);
    };
  }, []);


  const handlePrintFlow = () => {
    // step 1: scan printer lewat native
    window.AndroidPrint?.scanPrinters();
  };

  const handleSelectPrinter = async (address: string) => {
    setShowPrinterModal(false);

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
  const items = [
    { id: 1, name: "Kopi Susu", price: 20000 },
    { id: 2, name: "Es Teh", price: 10000 },
    { id: 3, name: "Roti Bakar", price: 15000 },
  ];

  const openDetail = (item: any) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      {/* Container ukuran mobile */}
      <div className="w-full max-w-sm bg-white flex flex-col min-h-screen">
        {/* Header */}
        <header className="p-4 bg-blue-600 text-white font-bold text-center text-lg">
          Kasir App
        </header>

        {/* List Produk */}
        <main className="flex-1 p-4 space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="p-3 border rounded flex justify-between items-center shadow-sm"
              onClick={() => openDetail(item)}
            >
              <span>{item.name}</span>
              <span className="font-bold">Rp {item.price.toLocaleString()}</span>
            </div>
          ))}
        </main>
      </div>

      {/* Modal Detail Transaksi */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-4">
            <h2 className="text-lg font-bold text-center mb-2">
              Struk Pembelian
            </h2>
            <div ref={printRef} className="text-sm">
              <p>Produk: {selectedItem.name}</p>
              <p>Harga: Rp {selectedItem.price.toLocaleString()}</p>
              <p className="mt-2 text-center">Terima kasih!</p>
            </div>
            <div className="mt-4 flex gap-2">
              <button
                onClick={handlePrintFlow}
                className="flex-1 bg-blue-600 text-white py-2 rounded"
              >
                Print
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Pilih Printer */}
      {showPrinterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
          <div className="bg-white p-4 rounded w-full max-w-sm shadow-lg">
            <h3 className="font-bold mb-3 text-center">Pilih Printer</h3>
            <ul className="max-h-[200px] overflow-y-auto">
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
              onClick={() => setShowPrinterModal(false)}
              className="mt-2 w-full bg-gray-400 text-white px-3 py-1 rounded"
            >
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
