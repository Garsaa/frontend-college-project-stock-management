import { useEffect, useState } from 'react';

import type { InventoryItemSummary } from '@/contract/inventory';
import { inventoryService } from '@/services/inventory-service';
import { getApiErrorMessage } from '@/services/http';

interface InventoryItemsState {
  items: InventoryItemSummary[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useInventoryItems(searchTerm: string) {
  const [state, setState] = useState<InventoryItemsState>({
    items: [],
    total: 0,
    loading: true,
    error: null,
  });
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    let active = true;

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    inventoryService
      .listItems(searchTerm)
      .then((response) => {
        if (!active) {
          return;
        }

        setState({
          items: response.items,
          total: response.total,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setState({
          items: [],
          total: 0,
          loading: false,
          error: getApiErrorMessage(error),
        });
      });

    return () => {
      active = false;
    };
  }, [reloadToken, searchTerm]);

  return {
    ...state,
    reload() {
      setReloadToken((current) => current + 1);
    },
  };
}
