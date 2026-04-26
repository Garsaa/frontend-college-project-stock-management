import { useEffect, useState } from 'react';

import type { InventoryMovementHistory } from '@/contract/inventory';
import { inventoryService } from '@/services/inventory-service';
import { getApiErrorMessage } from '@/services/http';

interface InventoryMovementsState {
  movements: InventoryMovementHistory[];
  total: number;
  loading: boolean;
  error: string | null;
}

export function useInventoryMovements() {
  const [state, setState] = useState<InventoryMovementsState>({
    movements: [],
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
      .listMovements()
      .then((response) => {
        if (!active) {
          return;
        }

        setState({
          movements: response.movements,
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
          movements: [],
          total: 0,
          loading: false,
          error: getApiErrorMessage(error),
        });
      });

    return () => {
      active = false;
    };
  }, [reloadToken]);

  return {
    ...state,
    reload() {
      setReloadToken((current) => current + 1);
    },
  };
}
