// src/app/zipconvet/page.jsx
import React from 'react';
import ZipExporter from '@/components/ZipExporter'; // '@/' points to your 'src/' directory

export default function ZipConvertPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-2xl font-bold mb-4">Zip File Converter</h1>
      {/* Rendering your custom component here */}
      <ZipExporter />
    </main>
  );
}
