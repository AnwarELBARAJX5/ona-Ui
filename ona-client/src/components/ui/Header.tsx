import { Switch } from "@/components/ui/switch"
import { User, Clock } from "lucide-react" // Lucide est la bibliothèque d'icônes par défaut de shadcn

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm">

            {/* --- CÔTÉ GAUCHE : Logo + Switch --- */}
            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-black tracking-tight text-slate-900">
                    ONA.
                </h1>

                {/* Le fameux Switch Supermarché / Restaurant */}
                <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-1.5 border">
                    <span className="text-sm font-medium text-slate-500">Supermarché</span>
                    <Switch id="mode-toggle" />
                    <span className="text-sm font-semibold text-slate-900">Restaurant</span>
                </div>
            </div>

            {/* --- CÔTÉ DROIT : Infos Utilisateur --- */}
            <div className="flex items-center gap-6">

                {/* Caissier */}
                <div className="flex items-center gap-2 text-slate-600">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Anwar</span>
                </div>

                {/* Heure */}
                <div className="flex items-center gap-2 text-slate-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">14:15</span>
                </div>

                {/* Statut En ligne (avec une petite animation de point vert) */}
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 border border-emerald-100">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">En ligne</span>
                </div>

            </div>
        </header>
    )
}