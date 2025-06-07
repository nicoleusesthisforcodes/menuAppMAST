import React, { createContext, useState, useContext } from 'react';

export type Dish = {
  name: string;
  price: number;
  course: 'starter' | 'main' | 'dessert';
};

type MenuContextType = {
  menu: Dish[];
  addDish: (dish: Dish) => void;
  removeDish: (name: string) => void;
  getAveragePrice: (course: Dish['course']) => number;
};

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [menu, setMenu] = useState<Dish[]>([]);

  const addDish = (dish: Dish) => {
    setMenu(prev => [...prev, dish]);
  };

  const removeDish = (name: string) => {
    setMenu(prev => prev.filter(dish => dish.name !== name));
  };

  const getAveragePrice = (course: Dish['course']) => {
    const courseItems = menu.filter(dish => dish.course === course);
    if (courseItems.length === 0) return 0;
    const total = courseItems.reduce((sum, dish) => sum + dish.price, 0);
    return total / courseItems.length;
  };

  return (
    <MenuContext.Provider value={{ menu, addDish, removeDish, getAveragePrice }}>
      {children}
    </MenuContext.Provider>
  );
};

// Optional helper hook to use the context easily
export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) {
    throw new Error('useMenu must be used within a MenuProvider');
  }
  return context;
};