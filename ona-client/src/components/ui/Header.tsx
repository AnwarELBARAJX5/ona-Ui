import { Switch } from "@/components/ui/switch"
import { User, Clock, Moon, Sun } from "lucide-react"

// On met à jour les props attendues
interface HeaderProps {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
    isRestaurant: boolean;
    setIsRestaurant: (value: boolean) => void;
}

export function Header({ isDarkMode, toggleDarkMode, isRestaurant, setIsRestaurant }: HeaderProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 shadow-sm transition-colors duration-300">

            <div className="flex items-center gap-8">
                <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    ONA.
                </h1>

                {/* Switch Market / Restaurant */}
                <div className="flex items-center gap-3 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-1.5 border border-transparent dark:border-slate-700 transition-colors">
          <span className={`text-sm transition-colors ${!isRestaurant ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
            Market
          </span>

                    <Switch
                        id="mode-toggle"
                        checked={isRestaurant}
                        onCheckedChange={setIsRestaurant}
                    />

                    <span className={`text-sm transition-colors ${isRestaurant ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-500 dark:text-slate-400'}`}>
            Restaurant
          </span>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <button
                    onClick={toggleDarkMode}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                    {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </button>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Anwar</span>
                </div>

                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm font-medium">02:15 PM</span>
                </div>

                <div className="flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-900/30 px-3 py-1 border border-emerald-100 dark:border-emerald-800">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 dark:bg-emerald-400"></span>
          </span>
                    <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Online</span>
                </div>
            </div>
        </header>
    )
}