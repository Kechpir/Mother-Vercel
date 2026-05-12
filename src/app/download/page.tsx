import Link from 'next/link';
import { Download, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'Скачать проект',
  description: 'Скачайте полный проект с luxury дизайном',
};

export default function DownloadPage() {
  return (
    <main className="flex flex-col min-h-screen bg-[#0f0e0a] text-[#e8dcc8]">
      {/* Header spacer */}
      <div className="h-32" />

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="max-w-2xl w-full">
          <div className="text-center space-y-8">
            <h1 className="text-4xl md:text-5xl font-serif font-light tracking-[-0.01em]">
              Скачайте проект
            </h1>
            
            <p className="text-lg text-[#c9a89a] font-light">
              Luxury версия с обновленным дизайном
            </p>

            {/* Features */}
            <div className="grid gap-4 my-12">
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-[#c9a85c] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-light text-[#e8dcc8]">Элегантный luxury дизайн</p>
                  <p className="text-sm text-[#a89a8a]">Золотая цветовая схема и минималистичный стиль</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-[#c9a85c] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-light text-[#e8dcc8]">Весь контент сохранен</p>
                  <p className="text-sm text-[#a89a8a]">Все текст, функции и интеграции на месте</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 text-left">
                <CheckCircle2 className="w-5 h-5 text-[#c9a85c] mt-1 flex-shrink-0" />
                <div>
                  <p className="font-light text-[#e8dcc8]">Готов к использованию</p>
                  <p className="text-sm text-[#a89a8a]">Просто распакуйте и запустите локально</p>
                </div>
              </div>
            </div>

            {/* Download button */}
            <div className="space-y-4">
              <a
                href="/Mother-Vercel-Luxury-Design.tar.gz"
                download="Mother-Vercel-Luxury-Design.tar.gz"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#c9a85c] text-[#0f0e0a] font-light tracking-[0.1em] uppercase hover:bg-[#d4a574] transition-colors w-full md:w-auto"
              >
                <Download className="w-5 h-5" />
                Скачать архив (2.4 MB)
              </a>

              <p className="text-sm text-[#a89a8a] font-light">
                Формат: tar.gz | Совместимо: Linux, macOS, Windows (с WinRAR/7-Zip)
              </p>
            </div>

            {/* Instructions */}
            <div className="mt-16 text-left bg-[#1a1915] border border-[#3a3a32] p-6 rounded-none space-y-4">
              <h2 className="text-xl font-serif font-light text-[#d4a574]">Как использовать:</h2>
              
              <ol className="space-y-3 text-[#c9a89a] font-light">
                <li className="flex gap-3">
                  <span className="text-[#c9a85c] font-bold">1.</span>
                  <span>Скачайте и распакуйте архив</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#c9a85c] font-bold">2.</span>
                  <span>Откройте папку в терминале</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-[#c9a85c] font-bold">3.</span>
                  <span>Выполните команды:</span>
                </li>
              </ol>

              <div className="bg-[#0f0e0a] p-4 rounded text-[#d4a574] font-mono text-sm border border-[#3a3a32] space-y-2">
                <p>$ cd v0-project</p>
                <p>$ npm install</p>
                <p>$ npm run dev</p>
              </div>

              <p className="text-[#a89a8a] font-light text-sm">
                Проект откроется на <code className="text-[#c9a85c]">http://localhost:3000</code>
              </p>
            </div>

            {/* Back link */}
            <div className="pt-8">
              <Link 
                href="/" 
                className="inline-flex items-center gap-2 text-[#d4a574] hover:text-[#e8dcc8] transition-colors font-light tracking-[0.08em] uppercase text-sm"
              >
                ← Вернуться на главную
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
