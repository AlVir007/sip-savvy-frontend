// Create src/hooks/useCardOrder.ts
import { useState, useEffect } from 'react';

interface UseCardOrderProps<T> {
  items: T[];
  preferenceType: 'agents_order' | 'personas_order' | 'social_order';
}

export function useCardOrder<T extends { id: string }>({ 
  items, 
  preferenceType 
}: UseCardOrderProps<T>) {
  const [orderedItems, setOrderedItems] = useState<T[]>(items);
  const [isLoading, setIsLoading] = useState(false);

  // Load saved order from backend on mount
  useEffect(() => {
    const loadSavedOrder = async () => {
      if (items.length === 0) return;

      setIsLoading(true);
      try {
        const token = localStorage.getItem('auth_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/user-preferences/${preferenceType}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          
          if (data.success && data.data && Array.isArray(data.data)) {
            // Reorder items based on saved preference
            const savedOrderIds = data.data;
            const reorderedItems = savedOrderIds
              .map(id => items.find(item => item.id === id))
              .filter(Boolean) as T[];
            
            // Add any new items that weren't in the saved order
            const newItems = items.filter(item => !savedOrderIds.includes(item.id));
            const finalOrder = [...reorderedItems, ...newItems];
            
            if (finalOrder.length === items.length) {
              console.log(`Loaded ${preferenceType}:`, finalOrder.map(i => i.id));
              setOrderedItems(finalOrder);
            } else {
              setOrderedItems(items);
            }
          } else {
            setOrderedItems(items);
          }
        } else {
          // No saved preference found, use original order
          setOrderedItems(items);
        }
      } catch (error) {
        console.error(`Failed to load ${preferenceType}:`, error);
        setOrderedItems(items);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedOrder();
  }, [items, preferenceType]);

  // Save order to backend
  const saveOrder = async (newOrder: T[]) => {
    try {
      const token = localStorage.getItem('auth_token');
      const orderIds = newOrder.map(item => item.id);
      
      console.log(`Saving ${preferenceType}:`, orderIds);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/user-preferences`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preference_type: preferenceType,
          preference_data: orderIds,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`${preferenceType} saved successfully:`, data);
      } else {
        console.error(`Failed to save ${preferenceType}:`, response.statusText);
      }
    } catch (error) {
      console.error(`Error saving ${preferenceType}:`, error);
    }
  };

  // Handle reorder with immediate UI update and background save
  const handleReorder = (newOrder: T[]) => {
    setOrderedItems(newOrder); // Update UI immediately
    saveOrder(newOrder); // Save to backend in background
  };

  return {
    orderedItems,
    handleReorder,
    isLoading,
  };
}