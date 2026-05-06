import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Utensils, Coffee, Pizza, IceCream, LayoutGrid, ShoppingBasket } from "lucide-react"

interface ProductGridProps {
    onProductClick: (product: { id: number; name: string; price: number }) => void
    isRestaurant: boolean // <-- On récupère l'état du switch ici
}

export function ProductGrid({ onProductClick, isRestaurant }: ProductGridProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeCategory, setActiveCategory] = useState("all")

    // Réinitialise la vue quand on change de mode (Market/Restaurant)
    useEffect(() => {
        setActiveCategory("all")
        setSearchQuery("")
    }, [isRestaurant])

    const currentMode = isRestaurant ? 'restaurant' : 'market'

    // On ajoute un 'mode' à chaque catégorie
    const categories = [
        { id: 'all', name: 'All Items', icon: <LayoutGrid className="h-4 w-4" />, mode: 'both' },
        { id: 'burgers', name: 'Burgers', icon: <Pizza className="h-4 w-4" />, mode: 'restaurant' },
        { id: 'drinks', name: 'Drinks', icon: <Coffee className="h-4 w-4" />, mode: 'both' }, // Les boissons sont dans les deux !
        { id: 'desserts', name: 'Desserts', icon: <IceCream className="h-4 w-4" />, mode: 'restaurant' },
        { id: 'fresh', name: 'Fresh Food', icon: <Utensils className="h-4 w-4" />, mode: 'market' },
        { id: 'grocery', name: 'Grocery', icon: <ShoppingBasket className="h-4 w-4" />, mode: 'market' },
    ]

    // On ajoute quelques produits pour le mode Market
    const products = [
        // --- RESTAURANT ---
        { id: 1, name: "ONA Special Burger", price: 12.50, color: "bg-orange-100 dark:bg-orange-900/30", category: 'burgers', mode: 'restaurant' },
        { id: 2, name: "Classic Cheeseburger", price: 10.00, color: "bg-orange-100 dark:bg-orange-900/30", category: 'burgers', mode: 'restaurant' },
        { id: 3, name: "House Fries", price: 4.00, color: "bg-yellow-100 dark:bg-yellow-900/30", category: 'burgers', mode: 'restaurant' },
        { id: 6, name: "Chocolate Muffin", price: 3.50, color: "bg-pink-100 dark:bg-pink-900/30", category: 'desserts', mode: 'restaurant' },
        { id: 7, name: "Ice Cream Scoop", price: 2.00, color: "bg-pink-100 dark:bg-pink-900/30", category: 'desserts', mode: 'restaurant' },
        { id: 8, name: "Chicken Nuggets", price: 6.50, color: "bg-orange-100 dark:bg-orange-900/30", category: 'burgers', mode: 'restaurant' },

        // --- BOTH (Les deux modes) ---
        { id: 4, name: "Coca Cola 33cl", price: 2.50, color: "bg-blue-100 dark:bg-blue-900/30", category: 'drinks', mode: 'both' },
        { id: 5, name: "Mineral Water", price: 1.50, color: "bg-blue-100 dark:bg-blue-900/30", category: 'drinks', mode: 'both' },
        { id: 9, name: "Orange Juice", price: 3.00, color: "bg-blue-100 dark:bg-blue-900/30", category: 'drinks', mode: 'both' },

        // --- MARKET ---
        { id: 10, name: "Organic Apples (1kg)", price: 3.20, color: "bg-green-100 dark:bg-green-900/30", category: 'fresh', mode: 'market' },
        { id: 11, name: "Fresh Baguette", price: 1.10, color: "bg-yellow-100 dark:bg-yellow-900/30", category: 'fresh', mode: 'market' },
        { id: 12, name: "Chips BBQ", price: 2.50, color: "bg-red-100 dark:bg-red-900/30", category: 'grocery', mode: 'market' },
        { id: 13, name: "Bananas", price: 1.80, color: "bg-yellow-100 dark:bg-yellow-900/30", category: 'fresh', mode: 'market' },
        { id: 14, name: "Hand Soap", price: 4.00, color: "bg-purple-100 dark:bg-purple-900/30", category: 'grocery', mode: 'market' },
    ]

    // On filtre d'abord les catégories visibles selon le switch
    const visibleCategories = categories.filter(c => c.mode === 'both' || c.mode === currentMode)

    // On filtre ensuite les produits
    const filteredProducts = products.filter((product) => {
        const matchesMode = product.mode === 'both' || product.mode === currentMode
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesCategory = activeCategory === "all" || product.category === activeCategory
        return matchesMode && matchesSearch && matchesCategory
    })

    return (
        <div className="flex flex-col h-full gap-4">
            {/* Barre de recherche */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500" />
                <Input
                    placeholder={`Search ${currentMode} items...`}
                    className="pl-10 h-12 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white dark:placeholder:text-slate-500 transition-colors"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Catégories (On utilise visibleCategories au lieu de categories) */}
            <div className="flex gap-2 overflow-x-auto pb-1">
                {visibleCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm border ${
                            activeCategory === cat.id
                                ? "bg-blue-600 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-600"
                                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        {cat.icon}
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Grille de produits */}
            <div className="flex-1 overflow-y-auto">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4">
                        {filteredProducts.map((product) => (
                            <Card
                                key={product.id}
                                className="cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200"
                                onClick={() => onProductClick(product)}
                            >
                                <CardContent className="p-0">
                                    <div className={`h-24 ${product.color} flex items-center justify-center transition-colors`}>
                                        {/* On change un peu l'icône selon le mode pour le style */}
                                        {product.mode === 'market' ? (
                                            <ShoppingBasket className="h-8 w-8 text-slate-400 dark:text-slate-500 opacity-50" />
                                        ) : (
                                            <Utensils className="h-8 w-8 text-slate-400 dark:text-slate-500 opacity-50" />
                                        )}
                                    </div>
                                    <div className="p-3 bg-white dark:bg-slate-900 transition-colors">
                                        <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 line-clamp-1">{product.name}</h3>
                                        <p className="text-blue-600 dark:text-blue-400 font-black mt-1">${product.price.toFixed(2)}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500">
                        <p className="italic text-sm">No products found in {currentMode}.</p>
                    </div>
                )}
            </div>
        </div>
    )
}