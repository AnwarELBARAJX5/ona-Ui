import { Header } from "@/components/ui/Header"

export default function App() {
  return (
      <div className="flex h-screen flex-col bg-slate-50">
        {/* On insère notre nouveau composant ici */}
        <Header />

        {/* L'espace vide en dessous servira pour le Panier et les Produits */}
        <main className="flex flex-1 overflow-hidden p-4 gap-4">
          <div className="flex h-full w-[35%] items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
            Zone Panier (à venir)
          </div>
          <div className="flex h-full w-[65%] items-center justify-center rounded-xl border-2 border-dashed border-slate-300 text-slate-400">
            Zone Produits (à venir)
          </div>
        </main>
      </div>
  )
}