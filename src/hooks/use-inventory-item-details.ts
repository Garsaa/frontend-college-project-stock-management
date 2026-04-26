import { useEffect, useState } from 'react';

import type { InventoryItemDetails } from '@/contract/inventory';
import { inventoryService } from '@/services/inventory-service';
import { getApiErrorMessage } from '@/services/http';

interface InventoryItemDetailsState {
  item: InventoryItemDetails | null;
  loading: boolean;
  error: string | null;
}

export function useInventoryItemDetails(
  itemCode: string | null,
  enabled = true,
  refreshToken = 0,
) {
  const [state, setState] = useState<InventoryItemDetailsState>({
    item: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!enabled || !itemCode) {
      setState({
        item: null,
        loading: false,
        error: null,
      });
      return;
    }

    let active = true;

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }));

    inventoryService
      .getItem(itemCode)
      .then((response) => {
        if (!active) {
          return;
        }

        setState({
          item: response.item,
          loading: false,
          error: null,
        });
      })
      .catch((error) => {
        if (!active) {
          return;
        }

        setState({
          item: null,
          loading: false,
          error: getApiErrorMessage(error),
        });
      });

    return () => {
      active = false;
    };
  }, [enabled, itemCode, refreshToken]);

  return state;
}
