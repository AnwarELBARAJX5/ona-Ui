import { useState, useEffect ,useCallback } from "react"
import { Header } from "@/components/ui/Header"
import { Cart } from "@/components/ui/Cart"
import { ProductGrid } from "@/components/ui/ProductGrid"
import { OrderHistory } from "@/components/ui/OrderHistory"
import { KitchenDisplay } from "@/components/ui/KitchenDisplay"
import type { CartItem, Customer, Order } from "@/types"

export default function App() {
    // 1. CHARGEMENT DU PANIER
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const saved = localStorage.getItem('ona_cart')
        return saved ? JSON.parse(saved) : []
    })

    // 2. CHARGEMENT DU CLIENT EN COURS
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(() => {
        const saved = localStorage.getItem('ona_current_customer')
        return saved ? JSON.parse(saved) : null
    })

    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isRestaurant, setIsRestaurant] = useState(true)
    const [activeTab, setActiveTab] = useState<'pos' | 'history' | 'kitchen'>('pos')

    // 3. CHARGEMENT DE L'HISTORIQUE (avec reconversion des Dates)
    const [orders, setOrders] = useState<Order[]>(() => {
        const saved = localStorage.getItem('ona_orders')
        if (saved) {
            const parsedOrders = JSON.parse(saved)
            // Le JSON transforme les Dates en texte, on doit les retransformer en vrai objet Date
            return parsedOrders.map((o: any) => ({ ...o, date: new Date(o.date) }))
        }
        return []
    })

    // 4. CHARGEMENT DES CLIENTS (avec des données de secours si c'est vide)
    const [customers, setCustomers] = useState<Customer[]>(() => {
        const saved = localStorage.getItem('ona_customers')
        if (saved) {
            return JSON.parse(saved)
        }
        return [
            { id: "1", name: "Alice Martin", phone: "06 12 34 56 78", points: 450 },
            { id: "2", name: "Bob Dupont", phone: "06 98 76 54 32", points: 120 },
            { id: "3", name: "Emma Bernard", phone: "07 11 22 33 44", points: 850 },
        ]
    })

    // ==========================================
    // SAUVEGARDE AUTOMATIQUE (LES "WATCHERS")
    // ==========================================

    useEffect(() => {
        localStorage.setItem('ona_cart', JSON.stringify(cartItems))
    }, [cartItems])

    useEffect(() => {
        localStorage.setItem('ona_current_customer', JSON.stringify(currentCustomer))
    }, [currentCustomer])

    useEffect(() => {
        localStorage.setItem('ona_orders', JSON.stringify(orders))
    }, [orders])

    useEffect(() => {
        localStorage.setItem('ona_customers', JSON.stringify(customers))
    }, [customers])

    // (Le dark mode watcher)
    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDarkMode])

    useEffect(() => {
        if (!isRestaurant && activeTab === 'kitchen') {
            setActiveTab('pos')
        }
    }, [isRestaurant, activeTab])


    const addToCart = useCallback((product: { id: number; name: string; price: number }) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item)
            }
            return [...prev, { ...product, qty: 1 }]
        })
    }, [])

    const removeFromCart = useCallback((id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id))
    }, [])

    const updateQuantity = useCallback((id: number, delta: number) => {
        setCartItems((prev) =>
            prev.map((item) => item.id === id ? { ...item, qty: item.qty + delta } : item).filter((item) => item.qty > 0)
        )
    }, [])

    const clearOrder = useCallback(() => {
        setCartItems([])
        setCurrentCustomer(null)
    }, [])

    const handleCheckoutSuccess = (totalPaid: number, method: string, change: number, pointsEarned: number, pointsUsed: number) => {
        const newOrder: Order = {
            id: Math.floor(1000 + Math.random() * 9000).toString(),
            date: new Date(),
            items: [...cartItems],
            total: totalPaid,
            customer: currentCustomer,
            paymentMethod: method,
            change: change,
            status: isRestaurant ? 'pending' : 'completed' // <-- Toute nouvelle commande va direct en cuisine !
        }

        if (currentCustomer) {
            setCustomers(prevCustomers =>
                prevCustomers.map(c => c.id === currentCustomer.id ? { ...c, points: c.points - pointsUsed + pointsEarned } : c)
            )
        }

        setOrders(prev => [...prev, newOrder])
        clearOrder()
    }

    // NOUVEAU : Fonction pour marquer une commande comme prête depuis le KDS
    const handleCompleteOrder = (orderId: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, status: 'completed' } : order
            )
        )
    }

    return (
        <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
            <Header
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                isRestaurant={isRestaurant}
                setIsRestaurant={setIsRestaurant}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
            />

            {/* ROUTAGE ENTRE LES 3 ÉCRANS */}
            {activeTab === 'pos' ? (
                <main className="flex flex-1 overflow-hidden p-4 gap-4 animate-in fade-in">
                    <div className="w-[35%] h-full">
                        <Cart
                            items={cartItems}
                            onRemove={removeFromCart}
                            onUpdateQuantity={updateQuantity}
                            onCheckoutSuccess={handleCheckoutSuccess}
                            onClearCart={clearOrder}
                            customer={currentCustomer}
                            onSetCustomer={setCurrentCustomer}
                            customers={customers}
                        />
                    </div>
                    <div className="flex-1 h-full">
                        <ProductGrid onProductClick={addToCart} isRestaurant={isRestaurant} />
                    </div>
                </main>
            ) : activeTab === 'kitchen' ? (
                <main className="flex-1 overflow-hidden p-6 bg-slate-50 dark:bg-slate-950">
                    {/* On passe les commandes et la fonction au KDS */}
                    <KitchenDisplay orders={orders} onCompleteOrder={handleCompleteOrder} />
                </main>
            ) : (
                <main className="flex-1 overflow-hidden p-6 bg-slate-50 dark:bg-slate-950">
                    <OrderHistory orders={orders} />
                </main>
            )}
        </div>
    )
}