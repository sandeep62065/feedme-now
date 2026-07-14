import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-hot-toast';
import { addCartItem, updateCartItemQty, removeCartItem } from '../store/slices/cartSlice';

export default function FoodCard({ food }) {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);

  const { _id, name, description, price, image, isVeg, rating } = food;

  // Find if this item is in cart
  const cartItem = items.find((item) => item.food._id === _id);

  const handleAdd = () => {
    dispatch(addCartItem({ food, quantity: 1 }));
    toast.success(`${name} added to cart!`);
  };

  const handleIncrement = () => {
    dispatch(updateCartItemQty({ foodId: _id, quantity: cartItem.quantity + 1 }));
  };

  const handleDecrement = () => {
    if (cartItem.quantity === 1) {
      dispatch(removeCartItem(_id));
      toast.success('Item removed from cart');
    } else {
      dispatch(updateCartItemQty({ foodId: _id, quantity: cartItem.quantity - 1 }));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-3 flex gap-4 hover:shadow-md transition-shadow active:scale-[0.99] duration-150 border border-outline-variant/10 w-full animate-in fade-in duration-200">
      
      {/* Food Image */}
      <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-surface-container shrink-0 shadow-sm">
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Veg/Non-Veg tag */}
        <span 
          className={`absolute top-1 left-1 h-3.5 w-3.5 rounded border border-white flex items-center justify-center p-0.5 ${isVeg ? 'bg-white' : 'bg-white'}`}
        >
          <span 
            className={`h-2 w-2 rounded-full ${isVeg ? 'bg-emerald-600' : 'bg-red-600'}`}
          />
        </span>
      </div>

      {/* Info Content */}
      <div className="flex-1 flex flex-col justify-between py-0.5">
        <div>
          <div className="flex justify-between items-start gap-2">
            <h4 className="font-label-lg text-on-surface line-clamp-1 leading-tight">{name}</h4>
            <div className="flex items-center text-yellow-500 bg-yellow-50/50 px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0">
              <span className="material-symbols-outlined text-[12px] mr-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              {rating.toFixed(1)}
            </div>
          </div>
          <p className="text-on-surface-variant text-body-md text-xs line-clamp-2 mt-1 leading-normal">
            {description}
          </p>
        </div>

        <div className="flex justify-between items-center mt-3">
          {/* Price */}
          <span className="font-headline-sm text-base text-primary font-bold">
            ₹{price.toFixed(2)}
          </span>

          {/* Stepper or Add Button */}
          {cartItem ? (
            <div className="flex items-center bg-primary text-on-primary rounded-lg shadow-sm border border-primary h-8 select-none">
              <button 
                onClick={handleDecrement}
                className="w-8 h-full font-bold hover:bg-primary-container text-center transition-colors active:scale-90 cursor-pointer text-sm"
              >
                -
              </button>
              <span className="px-2 text-xs font-bold w-6 text-center">{cartItem.quantity}</span>
              <button 
                onClick={handleIncrement}
                className="w-8 h-full font-bold hover:bg-primary-container text-center transition-colors active:scale-90 cursor-pointer text-sm"
              >
                +
              </button>
            </div>
          ) : (
            <button 
              onClick={handleAdd}
              className="px-4 py-1.5 border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all rounded-lg text-xs font-bold active:scale-95 shadow-sm hover:shadow cursor-pointer bg-white"
            >
              ADD
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
