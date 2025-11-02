"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  IconPlus,
  IconTrash,
  IconShoppingCart,
  IconCheck,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

interface CartItem {
  productId: string;
  productName: string;
  sizeKg: number;
  price: number;
  quantity: number;
  availableKg: number;
}

interface ProductWithSizes {
  id: string;
  name: string;
  brand: string;
  stockKg: number;
  availableKg: number;
  sizes: Array<{
    size: number;
    price: number;
  }>;
}

interface SalesFormProps {
  products: ProductWithSizes[];
}

export default function SalesForm({ products }: SalesFormProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [channel, setChannel] = useState<
    "presencial" | "whatsapp" | "instagram"
  >("presencial");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("efectivo");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);

  const selectedProductData = products.find((p) => p.id === selectedProduct);
  const selectedSizeData = selectedProductData?.sizes.find(
    (s) => s.size.toString() === selectedSize
  );

  const addToCart = () => {
    if (!selectedSizeData || !selectedProductData) return;

    // Calcular KG totales que se necesitan
    const kgNeeded = selectedSizeData.size * quantity;

    // Calcular KG ya en el carrito para este producto
    const kgInCart = cart
      .filter((item) => item.productId === selectedProduct)
      .reduce((sum, item) => sum + item.sizeKg * item.quantity, 0);

    const totalKgRequested = kgInCart + kgNeeded;

    // Verificar stock disponible EN KILOGRAMOS
    if (totalKgRequested > selectedProductData.availableKg) {
      toast.error(
        `Stock insuficiente. Disponible: ${selectedProductData.availableKg}kg, solicitado: ${totalKgRequested}kg`
      );
      return;
    }

    // Buscar si ya existe este producto con este tamaño
    const cartKey = `${selectedProduct}-${selectedSize}`;
    const existingItem = cart.find(
      (item) => `${item.productId}-${item.sizeKg}` === cartKey
    );

    if (existingItem) {
      setCart(
        cart.map((item) =>
          `${item.productId}-${item.sizeKg}` === cartKey
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
      toast.success(
        `Cantidad actualizada: ${existingItem.quantity + quantity} bolsas (${(
          existingItem.sizeKg *
          (existingItem.quantity + quantity)
        ).toFixed(1)}kg)`
      );
    } else {
      setCart([
        ...cart,
        {
          productId: selectedProduct,
          productName: selectedProductData.name,
          sizeKg: selectedSizeData.size,
          price: selectedSizeData.price,
          quantity,
          availableKg: selectedProductData.availableKg,
        },
      ]);
      toast.success(
        `${selectedProductData.name} ${
          selectedSizeData.size
        }kg agregado (${kgNeeded.toFixed(1)}kg total)`
      );
    }

    // Reset selección
    setSelectedProduct("");
    setSelectedSize("");
    setQuantity(1);
  };

  const removeFromCart = (productId: string, sizeKg: number) => {
    const item = cart.find(
      (i) => i.productId === productId && i.sizeKg === sizeKg
    );
    setCart(
      cart.filter((i) => !(i.productId === productId && i.sizeKg === sizeKg))
    );
    if (item) {
      toast.info(`${item.productName} ${item.sizeKg}kg eliminado del carrito`);
    }
  };

  const updateQuantity = (
    productId: string,
    sizeKg: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;

    const item = cart.find(
      (i) => i.productId === productId && i.sizeKg === sizeKg
    );
    if (!item) return;

    const newTotalKg = sizeKg * newQuantity;

    // Calcular KG de otros items del mismo producto
    const otherItemsKg = cart
      .filter((i) => i.productId === productId && i.sizeKg !== sizeKg)
      .reduce((sum, i) => sum + i.sizeKg * i.quantity, 0);

    if (newTotalKg + otherItemsKg > item.availableKg) {
      toast.error(`Stock insuficiente. Disponible: ${item.availableKg}kg`);
      return;
    }

    setCart(
      cart.map((i) =>
        i.productId === productId && i.sizeKg === sizeKg
          ? { ...i, quantity: newQuantity }
          : i
      )
    );
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const total = subtotal;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast.error("Agrega al menos un producto al carrito");
      return;
    }

    if (!customerName || !customerPhone) {
      toast.error("Complete los datos del cliente");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderData = {
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        channel,
        paymentMethod,
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          sizeKg: item.sizeKg,
          quantity: item.quantity,
          unitPrice: item.price,
        })),
        shippingAddress: {
          street: "Retiro en local",
          number: "S/N",
          neighborhood: "Centro",
          city: "Córdoba",
          state: "Córdoba",
          postalCode: "5000",
          country: "Argentina",
        },
        subtotal,
        total,
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success(`¡Venta registrada! Pedido: ${result.order.orderNumber}`);

        // Limpiar formulario
        setCart([]);
        setCustomerName("");
        setCustomerPhone("");
        setCustomerEmail("");
        setPaymentMethod("efectivo");
      } else {
        toast.error(result.error || "Error al registrar la venta");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al registrar la venta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Registrar Venta</h1>
        <p className="text-muted-foreground">
          Registra ventas presenciales, WhatsApp o Instagram
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de venta */}
          <div className="lg:col-span-2 space-y-6">
            {/* Selección de canal */}
            <Card>
              <CardHeader>
                <CardTitle>Canal de Venta</CardTitle>
                <CardDescription>
                  Selecciona cómo se realizó la venta
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant={channel === "presencial" ? "default" : "outline"}
                    onClick={() => setChannel("presencial")}
                    className="w-full"
                  >
                    🏪 Presencial
                  </Button>
                  <Button
                    type="button"
                    variant={channel === "whatsapp" ? "default" : "outline"}
                    onClick={() => setChannel("whatsapp")}
                    className="w-full"
                  >
                    💬 WhatsApp
                  </Button>
                  <Button
                    type="button"
                    variant={channel === "instagram" ? "default" : "outline"}
                    onClick={() => setChannel("instagram")}
                    className="w-full"
                  >
                    📸 Instagram
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Agregar productos */}
            <Card>
              <CardHeader>
                <CardTitle>Agregar Productos</CardTitle>
                <CardDescription>
                  Selecciona productos y variantes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Label>Producto</Label>
                    <Select
                      value={selectedProduct}
                      onValueChange={(value) => {
                        setSelectedProduct(value);
                        setSelectedVariant("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tamaño</Label>
                    <Select
                      value={selectedSize}
                      onValueChange={setSelectedSize}
                      disabled={!selectedProduct}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Peso" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedProductData?.sizes.map((size) => (
                          <SelectItem
                            key={size.size}
                            value={size.size.toString()}
                          >
                            {size.size}kg - $
                            {size.price.toLocaleString("es-AR")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Cantidad (bolsas)</Label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) =>
                        setQuantity(parseInt(e.target.value) || 1)
                      }
                    />
                    {selectedSizeData && quantity > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        = {(selectedSizeData.size * quantity).toFixed(1)}kg
                        total
                      </p>
                    )}
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={addToCart}
                  disabled={!selectedSize}
                  className="w-full"
                >
                  <IconPlus className="mr-2 h-4 w-4" />
                  Agregar al Carrito
                </Button>

                {/* Carrito */}
                {cart.length > 0 && (
                  <div className="space-y-2 mt-6">
                    <Label>Productos en el carrito:</Label>
                    {cart.map((item) => {
                      const itemTotalKg = item.sizeKg * item.quantity;
                      return (
                        <div
                          key={`${item.productId}-${item.sizeKg}`}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <p className="font-medium">
                              {item.productName} - {item.sizeKg}kg
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {item.quantity} bolsas × {item.sizeKg}kg ={" "}
                              {itemTotalKg.toFixed(1)}kg total
                            </p>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <Button
                                type="button"
                                size="icon-sm"
                                variant="outline"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.sizeKg,
                                    item.quantity - 1
                                  )
                                }
                              >
                                -
                              </Button>
                              <span className="w-12 text-center font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                type="button"
                                size="icon-sm"
                                variant="outline"
                                onClick={() =>
                                  updateQuantity(
                                    item.productId,
                                    item.sizeKg,
                                    item.quantity + 1
                                  )
                                }
                              >
                                +
                              </Button>
                            </div>
                            <span className="font-semibold w-28 text-right">
                              $
                              {(item.price * item.quantity).toLocaleString(
                                "es-AR"
                              )}
                            </span>
                            <Button
                              type="button"
                              size="icon-sm"
                              variant="destructive"
                              onClick={() =>
                                removeFromCart(item.productId, item.sizeKg)
                              }
                            >
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Datos del cliente */}
            <Card>
              <CardHeader>
                <CardTitle>Datos del Cliente</CardTitle>
                <CardDescription>Información de contacto</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="customerName">Nombre Completo *</Label>
                    <Input
                      id="customerName"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="customerPhone">Teléfono *</Label>
                    <Input
                      id="customerPhone"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="3512345678"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="customerEmail">Email (opcional)</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="cliente@email.com"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Método de pago */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">💵 Efectivo</SelectItem>
                    <SelectItem value="transferencia">
                      🏦 Transferencia
                    </SelectItem>
                    <SelectItem value="mercadopago">💳 MercadoPago</SelectItem>
                    <SelectItem value="debito">💳 Débito</SelectItem>
                    <SelectItem value="credito">💳 Crédito</SelectItem>
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          {/* Resumen del pedido */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconShoppingCart className="h-5 w-5" />
                  Resumen de Venta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium">Canal:</span>
                    <Badge variant="outline">
                      {channel === "presencial" && "🏪 Presencial"}
                      {channel === "whatsapp" && "💬 WhatsApp"}
                      {channel === "instagram" && "📸 Instagram"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Pago:</span>
                    <Badge variant="outline">{paymentMethod}</Badge>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Items:</span>
                    <span className="font-medium">{cart.length}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Bolsas:</span>
                    <span className="font-medium">
                      {cart.reduce((sum, item) => sum + item.quantity, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Total KG:</span>
                    <span className="font-medium">
                      {cart
                        .reduce(
                          (sum, item) => sum + item.sizeKg * item.quantity,
                          0
                        )
                        .toFixed(1)}{" "}
                      kg
                    </span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">
                      ${subtotal.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total:</span>
                    <span>${total.toLocaleString("es-AR")}</span>
                  </div>
                </div>

                <Separator />

                <Button
                  type="submit"
                  disabled={
                    cart.length === 0 ||
                    !customerName ||
                    !customerPhone ||
                    isSubmitting
                  }
                  className="w-full"
                  size="lg"
                >
                  {isSubmitting ? (
                    <>Registrando...</>
                  ) : (
                    <>
                      <IconCheck className="mr-2 h-4 w-4" />
                      Registrar Venta
                    </>
                  )}
                </Button>

                {cart.length === 0 && (
                  <p className="text-sm text-center text-muted-foreground">
                    Agrega productos para continuar
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
}
