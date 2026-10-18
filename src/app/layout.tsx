import './globals.css';
import Link from 'next/link';
import { Calendar, Users, Sparkles, MessageCircle, BarChart3, Settings, Home, UserCheck, Award } from 'lucide-react';

export const metadata = {
  title: 'MJ Estética - Gestión de Clínica Estética, Clientes & CRM',
  description: 'Sistema integral de administración de pacientes, agenda, CRM y tratamientos para MJ Estética',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="bg-gray-50 text-gray-900 min-h-screen flex flex-col md:flex-row">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-rose-100 flex flex-col justify-between p-4 shadow-sm z-10">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 px-3 py-4 mb-6 border-b border-rose-100">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-400 to-amber-300 flex items-center justify-center text-white font-bold text-lg shadow">
                MJ
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-wide text-gray-800">MJ Estética</h1>
                <p className="text-xs text-amber-600 font-medium">Clínica & CRM</p>
              </div>
            </div>

            {/* Navigation Links */}
            <nav className="space-y-1">
              <Link
                href="/"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-pink-600 transition"
              >
                <Home className="w-4 h-4 text-pink-500" />
                Dashboard
              </Link>

              <Link
                href="/agenda"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-pink-600 transition"
              >
                <Calendar className="w-4 h-4 text-amber-500" />
                Agenda / Calendario
              </Link>

              <Link
                href="/pacientes"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-pink-600 transition"
              >
                <Users className="w-4 h-4 text-pink-500" />
                Clientes & Pacientes
              </Link>

              <Link
                href="/crm"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-pink-600 transition"
              >
                <UserCheck className="w-4 h-4 text-purple-500" />
                CRM & Pipeline
              </Link>

              <Link
                href="/tratamientos"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-pink-600 transition"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                Tratamientos
              </Link>

              <Link
                href="/recordatorios"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-pink-600 transition"
              >
                <MessageCircle className="w-4 h-4 text-emerald-500" />
                Recordatorios WhatsApp
              </Link>

              <Link
                href="/reportes"
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-pink-600 transition"
              >
                <span className="flex items-center gap-3">
                  <BarChart3 className="w-4 h-4 text-pink-500" />
                  Reportes & Asistentes
                </span>
                <span className="text-[10px] font-extrabold bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                  Metas 6
                </span>
              </Link>

              <Link
                href="/configuracion"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-rose-50 hover:text-pink-600 transition"
              >
                <Settings className="w-4 h-4 text-gray-500" />
                Configuración
              </Link>
            </nav>
          </div>

          <div className="pt-4 border-t border-rose-100 text-xs text-gray-400 text-center">
            &copy; {new Date().getFullYear()} MJ Estética
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </body>
    </html>
  );
}
