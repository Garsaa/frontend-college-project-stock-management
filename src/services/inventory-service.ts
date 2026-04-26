import type {
  CreateItemPayload,
  DeleteItemResponse,
  GetItemResponse,
  ItemMutationResponse,
  ListItemsResponse,
  ListMovementsResponse,
  StockChangePayload,
  UpdateItemPayload,
} from '@/contract/inventory';
import { httpClient } from '@/services/http';

export const inventoryService = {
  async listItems(search?: string) {
    const { data } = await httpClient.get<ListItemsResponse>('/api/items', {
      params: search ? { search } : undefined,
    });
    return data;
  },
  async getItem(code: string) {
    const { data } = await httpClient.get<GetItemResponse>(`/api/items/${code}`);
    return data;
  },
  async createItem(payload: CreateItemPayload) {
    const { data } = await httpClient.post<ItemMutationResponse>('/api/items', payload);
    return data;
  },
  async updateItem(code: string, payload: UpdateItemPayload) {
    const { data } = await httpClient.patch<ItemMutationResponse>(`/api/items/${code}`, payload);
    return data;
  },
  async deleteItem(code: string) {
    const { data } = await httpClient.delete<DeleteItemResponse>(`/api/items/${code}`);
    return data;
  },
  async registerInbound(code: string, payload: StockChangePayload) {
    const { data } = await httpClient.post<ItemMutationResponse>(
      `/api/items/${code}/inbound`,
      payload,
    );
    return data;
  },
  async registerOutbound(code: string, payload: StockChangePayload) {
    const { data } = await httpClient.post<ItemMutationResponse>(
      `/api/items/${code}/outbound`,
      payload,
    );
    return data;
  },
  async listMovements() {
    const { data } = await httpClient.get<ListMovementsResponse>('/api/movements');
    return data;
  },
};
