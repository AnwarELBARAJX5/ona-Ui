import { useState, useEffect } from "react"
import { Header } from "@/components/ui/Header"
import { Cart } from "@/components/ui/Cart"
import { ProductGrid } from "@/components/ui/ProductGrid"

export type CartItem = {
    id: number
    name: string
    price: number
    qty: number
}

// NOUVEAU : Type pour notre client
export type Customer = {
    id: string
    name: string
    phone: string
    points: number
}

export default function App() {
    const [cartItems, setCartItems] = useState<CartItem[]>([])
    const [isDarkMode, setIsDarkMode] = useState(false)
    const [isRestaurant, setIsRestaurant] = useState(true)

    // NOUVEAU : État pour stocker le client actuel
    const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null)

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add('dark')
        } else {
            document.documentElement.classList.remove('dark')
        }
    }, [isDarkMode])

    const addToCart = (product: { id: number; name: string; price: number }) => {
        setCartItems((prev) => {
            const existing = prev.find((item) => item.id === product.id)
            if (existing) {
                return prev.map((item) =>
                    item.id === product.id ? { ...item, qty: item.qty + 1 } : item
                )
            }
            return [...prev, { ...product, qty: 1 }]
        })
    }

    const removeFromCart = (id: number) => {
        setCartItems((prev) => prev.filter((item) => item.id !== id))
    }

    const updateQuantity = (id: number, delta: number) => {
        setCartItems((prev) =>
            prev.map((item) =>
                item.id === id ? { ...item, qty: item.qty + delta } : item
            ).filter((item) => item.qty > 0)
        )
    }

    const clearOrder = () => {
        setCartItems([])
        setCurrentCustomer(null) // On retire le client quand on vide la commande
    }

    return (
        <div className="flex h-screen flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden transition-colors duration-300">
            <Header
                isDarkMode={isDarkMode}
                toggleDarkMode={() => setIsDarkMode(!isDarkMode)}
                isRestaurant={isRestaurant}
                setIsRestaurant={setIsRestaurant}
            />

            <main className="flex flex-1 overflow-hidden p-4 gap-4">
                <div className="w-[35%] h-full">
                    <Cart
                        items={cartItems}
                        onRemove={removeFromCart}
                        onUpdateQuantity={updateQuantity}
                        onCheckoutSuccess={clearOrder}
                        onClearCart={clearOrder}
                        // NOUVELLES PROPS :
                        customer={currentCustomer}
                        onSetCustomer={setCurrentCustomer}
                    />
                </div>

                <div className="flex-1 h-full">
                    <ProductGrid onProductClick={addToCart} isRestaurant={isRestaurant} />
                </div>
            </main>
        </div>
    )
}