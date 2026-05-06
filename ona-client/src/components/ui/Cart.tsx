import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Trash2, CreditCard, ShoppingBasket, CheckCircle2, Printer, Plus, Minus, UserPlus, Search, Award, X } from "lucide-react"
import type { CartItem, Customer } from "@/App"

interface CartProps {
    items: CartItem[]
    onRemove: (id: number) => void
    onUpdateQuantity: (id: number, delta: number) => void
    onCheckoutSuccess: () => void
    onClearCart: () => void
    customer: Customer | null
    onSetCustomer: (c: Customer | null) => void
}

// Fausse base de données de clients
const MOCK_CUSTOMERS: Customer[] = [
    { id: "1", name: "Alice Martin", phone: "06 12 34 56 78", points: 450 },
    { id: "2", name: "Bob Dupont", phone: "06 98 76 54 32", points: 120 },
    { id: "3", name: "Emma Bernard", phone: "07 11 22 33 44", points: 850 },
]

export function Cart({ items, onRemove, onUpdateQuantity, onCheckoutSuccess, onClearCart, customer, onSetCustomer }: CartProps) {
    const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false)
    const [customerSearch, setCustomerSearch] = useState("")
    const [applyDiscount, setApplyDiscount] = useState(false)

    // Calculs financiers
    const subtotal = items.reduce((acc, item) => acc + (item.price * item.qty), 0)
    const tax = subtotal * 0.20
    // Si on applique la réduction, on enlève 5$
    const discountAmount = applyDiscount ? 5.00 : 0
    const total = Math.max(0, subtotal + tax - discountAmount) // Math.max empêche un total négatif

    // Points gagnés sur cet achat (ex: 1 point par dollar)
    const earnedPoints = Math.floor(total)

    // Filtrage des clients pour la barre de recherche
    const filteredCustomers = MOCK_CUSTOMERS.filter(c =>
        c.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        c.phone.replace(/\s/g, '').includes(customerSearch.replace(/\s/g, ''))
    )

    const handleLinkCustomer = (selectedCustomer: Customer) => {
        onSetCustomer(selectedCustomer)
        setIsCustomerModalOpen(false)
        setCustomerSearch("")
    }

    const handleUnlinkCustomer = () => {
        onSetCustomer(null)
        setApplyDiscount(false) // On enlève la réduc si le client part
    }

    const handleFinish = () => {
        setIsCheckoutOpen(false)
        setApplyDiscount(false)
        onCheckoutSuccess()
    }

    return (
        <div className="flex h-full flex-col bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors duration-300">

            {/* En-tête du panier */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <h2 className="text-lg font-bold flex items-center gap-2 text-slate-900 dark:text-white">
                        🛒 Current Order <span className="text-sm font-normal text-slate-500 dark:text-slate-400">({items.length})</span>
                    </h2>
                    {items.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={onClearCart} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 h-8 px-2 font-medium">
                            Clear
                        </Button>
                    )}
                </div>

                {/* Section Fidélité Client */}
                {!customer ? (
                    <Dialog open={isCustomerModalOpen} onOpenChange={setIsCustomerModalOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="w-full border-dashed border-slate-300 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 gap-2 h-10">
                                <UserPlus className="h-4 w-4" /> Link Customer
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[400px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                            <DialogHeader>
                                <DialogTitle className="text-slate-900 dark:text-white">Search Customer</DialogTitle>
                            </DialogHeader>
                            <div className="py-4 space-y-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                                    <Input
                                        placeholder="Name or phone number..."
                                        value={customerSearch}
                                        onChange={(e) => setCustomerSearch(e.target.value)}
                                        className="pl-9 dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                                    />
                                </div>
                                <ScrollArea className="h-[200px] rounded-md border border-slate-200 dark:border-slate-800">
                                    <div className="p-2 space-y-1">
                                        {filteredCustomers.length > 0 ? filteredCustomers.map(c => (
                                            <div key={c.id} onClick={() => handleLinkCustomer(c)} className="flex items-center justify-between p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md cursor-pointer transition-colors">
                                                <div>
                                                    <p className="font-semibold text-sm text-slate-900 dark:text-white">{c.name}</p>
                                                    <p className="text-xs text-slate-500">{c.phone}</p>
                                                </div>
                                                <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-1 rounded-full text-xs font-bold">
                                                    <Award className="h-3 w-3" /> {c.points} pts
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-center text-sm text-slate-500 dark:text-slate-400 py-4">No customer found.</p>
                                        )}
                                    </div>
                                </ScrollArea>
                            </div>
                        </DialogContent>
                    </Dialog>
                ) : (
                    <div className="flex items-center justify-between bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 rounded-lg p-2 px-3 animate-in fade-in">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-100 dark:bg-blue-800 text-blue-600 dark:text-blue-300 rounded-full flex items-center justify-center font-bold text-sm">
                                {customer.name.charAt(0)}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-sm text-blue-900 dark:text-blue-100 leading-none">{customer.name}</span>
                                <span className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                  <Award className="h-3 w-3" /> {customer.points} pts
                </span>
                            </div>
                        </div>
                        <button onClick={handleUnlinkCustomer} className="p-1.5 text-blue-400 hover:text-blue-600 dark:hover:text-blue-200 hover:bg-blue-100 dark:hover:bg-blue-800 rounded-full transition-colors">
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>

            <ScrollArea className="flex-1 p-4">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-500 gap-2">
                        <ShoppingBasket className="h-8 w-8 opacity-20" />
                        <p className="text-sm italic">Your cart is empty</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="flex items-center justify-between animate-in fade-in slide-in-from-right-2 pb-3 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
                                <div className="flex flex-col flex-1">
                                    <span className="font-semibold text-sm text-slate-900 dark:text-white">{item.name}</span>
                                    <span className="text-xs text-slate-500 dark:text-slate-400">${item.price.toFixed(2)}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-lg p-1">
                                        <button onClick={() => onUpdateQuantity(item.id, -1)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors">
                                            <Minus className="h-3 w-3" />
                                        </button>
                                        <span className="text-xs font-bold w-4 text-center text-slate-900 dark:text-white">{item.qty}</span>
                                        <button onClick={() => onUpdateQuantity(item.id, 1)} className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-md transition-colors">
                                            <Plus className="h-3 w-3" />
                                        </button>
                                    </div>
                                    <span className="font-bold text-sm text-slate-900 dark:text-white w-12 text-right">
                    ${(item.qty * item.price).toFixed(2)}
                  </span>
                                    <button onClick={() => onRemove(item.id)} className="text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors ml-1">
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </ScrollArea>

            <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800 space-y-3 flex flex-col">

                {/* Affichage du bouton de récompense si le client a assez de points */}
                {customer && customer.points >= 200 && (
                    <Button
                        variant={applyDiscount ? "default" : "outline"}
                        onClick={() => setApplyDiscount(!applyDiscount)}
                        className={`w-full gap-2 transition-all ${applyDiscount ? 'bg-amber-500 hover:bg-amber-600 text-white border-transparent' : 'border-amber-200 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30'}`}
                    >
                        <Award className="h-4 w-4" />
                        {applyDiscount ? "Reward Applied (-$5.00)" : "Use 200 pts for -$5.00"}
                    </Button>
                )}

                <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Subtotal</span>
                        <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 dark:text-slate-400">
                        <span>Tax (20%)</span>
                        <span>${tax.toFixed(2)}</span>
                    </div>
                    {applyDiscount && (
                        <div className="flex justify-between text-sm font-bold text-amber-500 dark:text-amber-400 animate-in fade-in">
                            <span>Loyalty Discount</span>
                            <span>-$5.00</span>
                        </div>
                    )}
                    <Separator className="my-2 border-slate-200 dark:border-slate-700" />
                    <div className="flex justify-between text-xl font-black text-slate-900 dark:text-white">
                        <span>TOTAL</span>
                        <span>${total.toFixed(2)}</span>
                    </div>
                </div>

                <Dialog open={isCheckoutOpen} onOpenChange={setIsCheckoutOpen}>
                    <DialogTrigger asChild>
                        <Button disabled={items.length === 0} className="w-full h-14 text-lg font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-md gap-2 mt-2">
                            <CreditCard className="h-5 w-5" />
                            CHECKOUT
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                        <DialogHeader className="flex flex-col items-center justify-center pt-6">
                            <div className="h-16 w-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 className="h-10 w-10" />
                            </div>
                            <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">Payment Successful!</DialogTitle>
                            <p className="text-slate-500 dark:text-slate-400 text-center">Order #8825 has been processed.</p>
                        </DialogHeader>

                        <div className="py-4 space-y-4">
                            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Receipt Summary</p>
                                {items.map(item => (
                                    <div key={item.id} className="flex justify-between text-sm mb-1">
                                        <span className="text-slate-600 dark:text-slate-400">{item.qty}x {item.name}</span>
                                        <span className="font-mono text-slate-900 dark:text-white">${(item.qty * item.price).toFixed(2)}</span>
                                    </div>
                                ))}
                                {applyDiscount && (
                                    <div className="flex justify-between text-sm mb-1 text-amber-500">
                                        <span>Loyalty Discount</span>
                                        <span className="font-mono">-$5.00</span>
                                    </div>
                                )}
                                <Separator className="my-3 border-slate-200 dark:border-slate-700" />
                                <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                                    <span>Total Paid</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Résumé des points gagnés si client présent */}
                            {customer && (
                                <div className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 p-3 rounded-lg flex items-center justify-center gap-2 text-sm font-semibold border border-blue-100 dark:border-blue-900/50">
                                    <Award className="h-4 w-4" />
                                    {customer.name} earned +{earnedPoints} points!
                                </div>
                            )}
                        </div>

                        <DialogFooter className="flex-col sm:flex-col gap-2">
                            <Button variant="outline" className="w-full gap-2 border-slate-200 dark:border-slate-700 dark:text-white">
                                <Printer className="h-4 w-4" />
                                Print Receipt
                            </Button>
                            <Button onClick={handleFinish} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                Start New Order
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    )
}