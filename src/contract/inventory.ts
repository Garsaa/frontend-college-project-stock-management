export type ItemType = 'product' | 'material';
export type MovementOperation = 'inbound' | 'outbound';

export interface InventoryMovement {
  id: number;
  operation: MovementOperation;
  quantity: number;
  note: string;
  created_at: string;
}

export interface InventoryMovementHistory {
  id: number;
  item_id: number;
  item_code: string;
  item_type: ItemType;
  item_name: string;
  operation: MovementOperation;
  quantity: number;
  note: string;
  created_at: string;
}

export interface InventoryItemSummary {
  id: number;
  code: string;
  item_type: ItemType;
  name: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  location: string;
  updated_at: string;
}

export interface InventoryItemDetails {
  id: number;
  code: string;
  item_type: ItemType;
  name: string;
  description: string;
  information_link: string;
  quantity: number;
  unit_price: number;
  total_value: number;
  location: string;
  created_at: string;
  updated_at: string;
  movements: InventoryMovement[];
}

export interface CreateItemPayload {
  code: string;
  item_type: ItemType;
  name: string;
  description: string;
  information_link: string;
  quantity: number;
  unit_price: number;
  location: string;
}

export interface UpdateItemPayload {
  item_type?: ItemType;
  name?: string;
  description?: string;
  information_link?: string;
  unit_price?: number;
  location?: string;
}

export interface StockChangePayload {
  quantity: number;
  note: string;
}

export interface ListItemsResponse {
  items: InventoryItemSummary[];
  total: number;
}

export interface GetItemResponse {
  item: InventoryItemDetails;
}

export interface ListMovementsResponse {
  movements: InventoryMovementHistory[];
  total: number;
}

export interface ItemMutationResponse {
  message: string;
  item: InventoryItemDetails;
}

export interface DeleteItemResponse {
  message: string;
}

export interface ApiErrorResponse {
  error?: string;
  message?: string;
}
