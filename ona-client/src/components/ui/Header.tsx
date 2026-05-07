import { Switch } from "@/components/ui/switch"
import { User, Clock, Moon, Sun } from "lucide-react"

interface HeaderProps {
    isDarkMode: boolean
    toggleDarkMode: () => void
    isRestaurant: boolean
    setIsRestaurant: (value: boolean) => void
    activeTab: 'pos' | 'history' | 'kitchen' // <-- NOUVEAU : On ajoute 'kitchen'
    setActiveTab: (tab: 'pos' | 'history' | 'kitchen') => void // <-- NOUVEAU
}

export function Header({ isDarkMode, toggleDarkMode, isRestaurant, setIsRestaurant, activeTab, setActiveTab }: HeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shadow-sm transition-colors duration-300">

            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    ONA.
                </h1>

                <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveTab('pos')}
                        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'pos' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        Point of Sale
                    </button>

                    {/* NOUVEAU : On cache ce bouton si on est en mode Market */}
                    {isRestaurant && (
                        <button
                            onClick={() => setActiveTab('kitchen')}
                            className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'kitchen' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                        >
                            Kitchen Display
                        </button>
                    )}

                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${activeTab === 'history' ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'}`}
                    >
                        History & Stats
                    </button>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="flex items-center gap-3 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 border border-transparent dark:border-slate-700 transition-colors">
                    <span className={`text-sm transition-colors ${!isRestaurant ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>Market</span>
                    <Switch id="mode-toggle" checked={isRestaurant} onCheckedChange={setIsRestaurant} />
                    <span className={`text-sm transition-colors ${isRestaurant ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>Restaurant</span>
                </div>

                <div className="h-6 w-px bg-slate-200 dark:bg-slate-700"></div>

                <button onClick={toggleDarkMode} className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Anwar</span>
                </div>
            </div>
        </header>
    )
}