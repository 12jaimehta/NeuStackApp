import { store, Cart, CartItem } from '../../shared/store/inMemoryStore';
import { AddToCartDto } from './cart.types';

export function addItemToCart(dto: AddToCartDto): Cart {
  return store.upsertCart(dto.userId, (cart) => {
    const existingIndex = cart.items.findIndex((item) => item.productId === dto.productId);

    if (existingIndex !== -1) {
      const currentItem = cart.items[existingIndex];
      const newQuantity = currentItem.quantity + dto.quantity;

      if (newQuantity <= 0) {
        return {
          ...cart,
          items: cart.items.filter((_, idx) => idx !== existingIndex),
        };
      }

      const updatedItems = cart.items.map((item, idx) =>
        idx === existingIndex
          ? { ...item, quantity: newQuantity }
          : item,
      );
      return { ...cart, items: updatedItems };
    }

    if (dto.quantity <= 0) return cart;

    const newItem: CartItem = {
      productId: dto.productId,
      name: dto.name,
      price: dto.price,
      quantity: dto.quantity,
    };
    return { ...cart, items: [...cart.items, newItem] };
  });
}

export function getCart(userId: string): Cart {
  return (
    store.getCart(userId) ?? {
      userId,
      items: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  );
}
