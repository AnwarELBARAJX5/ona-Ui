import { useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { ReceiptText, TrendingUp, Users, Clock, Printer } from "lucide-react"
import type { Order } from "@/types"

interface OrderHistoryProps {
    orders: Order[]
}

export function OrderHistory({ orders }: OrderHistoryProps) {
    // État pour stocker la commande sélectionnée pour la modale
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0)
    const totalCustomers = orders.filter(o => o.customer).length

    return (
        <div className="flex flex-col h-full gap-4 animate-in fade-in slide-in-from-bottom-2 max-w-5xl mx-auto w-full">

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Revenue</CardTitle>
                        <div className="h-8 w-8 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">${totalRevenue.toFixed(2)}</div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Orders</CardTitle>
                        <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                            <ReceiptText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{orders.length}</div>
                    </CardContent>
                </Card>

                <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">Loyalty Used</CardTitle>
                        <div className="h-8 w-8 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                            <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black text-slate-900 dark:text-white">{totalCustomers}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Liste des transactions */}
            <Card className="flex-1 flex flex-col dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden">
                <CardHeader className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                    <CardTitle className="text-lg text-slate-900 dark:text-white flex items-center gap-2">
                        <ReceiptText className="h-5 w-5" /> Recent Transactions
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 p-0">
                    <ScrollArea className="h-[calc(100vh-300px)]">
                        {orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 gap-2">
                                <ReceiptText className="h-12 w-12 opacity-20 mb-2" />
                                <p className="font-medium text-lg">No orders yet today.</p>
                                <p className="text-sm">Processed transactions will appear here.</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {orders.slice().reverse().map((order) => (
                                    <div key={order.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-xs">
                                                #{order.id}
                                            </div>
                                            <div>
                                                <p className="font-bold text-sm text-slate-900 dark:text-white">
                                                    {order.items.length} items sold
                                                </p>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                              {order.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                                                    {order.customer && (
                                                        <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full font-medium">
                              <Users className="h-3 w-3" /> {order.customer.name}
                            </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-black text-lg text-slate-900 dark:text-white">${order.total.toFixed(2)}</p>
                                            {/* BOUTON POUR OUVRIR LA MODALE */}
                                            <button
                                                onClick={() => setSelectedOrder(order)}
                                                className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold mt-1 transition-colors"
                                            >
                                                View Details
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
            </Card>

            {/* MODALE DE DÉTAILS DU TICKET */}
            <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
                <DialogContent className="sm:max-w-[425px] bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    {selectedOrder && (
                        <>
                            <DialogHeader className="flex flex-col items-center justify-center pt-2">
                                <div className="h-16 w-16 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mb-2">
                                    <ReceiptText className="h-8 w-8" />
                                </div>
                                <DialogTitle className="text-2xl font-black text-slate-900 dark:text-white">Order #{selectedOrder.id}</DialogTitle>
                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    {selectedOrder.date.toLocaleDateString()} at {selectedOrder.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </DialogHeader>

                            <div className="py-2 space-y-4">
                                <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-lg border border-dashed border-slate-300 dark:border-slate-700">

                                    {/* Client s'il y en a un */}
                                    {selectedOrder.customer && (
                                        <div className="mb-4 pb-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2 text-sm">
                                            <Users className="h-4 w-4 text-slate-400" />
                                            <span className="text-slate-600 dark:text-slate-400">Customer: </span>
                                            <span className="font-semibold text-slate-900 dark:text-white">{selectedOrder.customer.name}</span>
                                        </div>
                                    )}

                                    {/* Liste des articles */}
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 text-center">Receipt Summary</p>
                                    {selectedOrder.items.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm mb-1 text-slate-600 dark:text-slate-400">
                                            <span>{item.qty}x {item.name}</span>
                                            <span className="font-mono">${(item.qty * item.price).toFixed(2)}</span>
                                        </div>
                                    ))}

                                    <Separator className="my-3 border-slate-200 dark:border-slate-700" />

                                    {/* Totaux et méthode */}
                                    <div className="space-y-1">
                                        <div className="flex justify-between font-bold text-lg text-slate-900 dark:text-white">
                                            <span>Total Paid</span>
                                            <span>${selectedOrder.total.toFixed(2)}</span>
                                        </div>

                                        <div className="flex justify-between text-sm text-slate-500 mt-2">
                                            <span>Method</span>
                                            <span className="font-semibold text-slate-700 dark:text-slate-300">{selectedOrder.paymentMethod}</span>
                                        </div>

                                        {/* Affichage de la monnaie rendue si Espèces ou Split */}
                                        {(selectedOrder.paymentMethod === 'Cash' || selectedOrder.paymentMethod === 'Split') && selectedOrder.change > 0 && (
                                            <div className="flex justify-between text-sm text-emerald-600 font-medium mt-1">
                                                <span>Change Returned</span>
                                                <span>${selectedOrder.change.toFixed(2)}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter className="flex-col sm:flex-col gap-2 mt-4">
                                <Button variant="outline" className="w-full gap-2 border-slate-200 dark:border-slate-700" onClick={() => setSelectedOrder(null)}>
                                    Close
                                </Button>
                                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold gap-2">
                                    <Printer className="h-4 w-4" /> Print Copy
                                </Button>
                            </DialogFooter>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}