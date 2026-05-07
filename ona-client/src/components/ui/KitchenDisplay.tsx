import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Clock, CheckCircle2, ChefHat, Timer } from "lucide-react"
import type { Order } from "@/types"

interface KitchenDisplayProps {
    orders: Order[]
    onCompleteOrder: (orderId: string) => void
}

export function KitchenDisplay({ orders, onCompleteOrder }: KitchenDisplayProps) {
    // On ne garde que les commandes en attente ("pending")
    const pendingOrders = orders.filter(order => order.status === 'pending')

    return (
        <div className="flex flex-col h-full gap-4 animate-in fade-in max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-lg flex items-center justify-center">
                        <ChefHat className="h-6 w-6" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white">Kitchen Display</h2>
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                            {pendingOrders.length} order(s) to prepare
                        </p>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1">
                {pendingOrders.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-slate-400 dark:text-slate-500 gap-4 mt-10">
                        <ChefHat className="h-16 w-16 opacity-20" />
                        <p className="font-bold text-xl">The kitchen is clear!</p>
                        <p className="text-sm">Waiting for new orders...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
                        {pendingOrders.map((order) => (
                            <Card
                                key={order.id}
                                className="flex flex-col bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 dark:border-amber-900/50 shadow-sm overflow-hidden animate-in zoom-in-95"
                            >
                                <CardHeader className="bg-amber-100/50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-900/50 py-3">
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-black text-amber-900 dark:text-amber-100">
                                            #{order.id}
                                        </CardTitle>
                                        <div className="flex items-center gap-1 text-xs font-bold text-amber-700 dark:text-amber-400 bg-amber-200/50 dark:bg-amber-800/50 px-2 py-1 rounded-full">
                                            <Timer className="h-3 w-3" />
                                            {order.date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                    </div>
                                    {order.paymentMethod === 'Market' ? null : (
                                        <p className="text-xs font-semibold text-amber-700/70 dark:text-amber-400/70 uppercase tracking-wider mt-1">
                                            {order.items.reduce((acc, item) => acc + item.qty, 0)} Items
                                        </p>
                                    )}
                                </CardHeader>

                                <CardContent className="flex-1 p-0">
                                    <div className="divide-y divide-amber-100 dark:divide-amber-900/30">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="p-3 flex items-start gap-3 hover:bg-amber-100/30 dark:hover:bg-amber-900/10 transition-colors">
                        <span className="font-black text-amber-900 dark:text-amber-100 bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800 h-6 w-6 flex items-center justify-center rounded text-xs shadow-sm">
                          {item.qty}
                        </span>
                                                <span className="font-medium text-amber-900 dark:text-amber-100 text-sm mt-0.5 leading-tight">
                          {item.name}
                        </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>

                                <CardFooter className="p-3 bg-white/50 dark:bg-slate-900/50 border-t border-amber-100 dark:border-amber-900/50 mt-auto">
                                    <Button
                                        onClick={() => onCompleteOrder(order.id)}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-2 shadow-sm"
                                    >
                                        <CheckCircle2 className="h-4 w-4" />
                                        Mark as Ready
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}