# Inventory API

Base path: `/api/v1/inventory`

Inventory is the current stock snapshot for one product variant. The audit ledger is stored in `inventory_transactions`; API writes that change `quantity` or `reservedQuantity` also create transaction rows.

## Data Model

### Inventory

| Field | Type | Notes |
| --- | --- | --- |
| `id` | UUID | Inventory row ID |
| `variantId` | UUID | Unique product variant ID |
| `quantity` | integer | On-hand stock |
| `reservedQuantity` | integer | Stock held for pending orders |
| `availableQuantity` | integer | Response-only: `quantity - reservedQuantity` |
| `lowStockThreshold` | integer | Low-stock threshold |
| `isLowStock` | boolean | Response-only: `availableQuantity <= lowStockThreshold` |
| `updatedAt` | ISO datetime | Updated by Prisma |

Validation rules:

- `quantity`, `reservedQuantity`, and `lowStockThreshold` must be non-negative integers.
- `reservedQuantity` cannot exceed `quantity`.
- Only one inventory row can exist per variant.
- Delete is blocked when `reservedQuantity > 0`.

## Create Inventory

`POST /api/v1/inventory`

Creates stock for a variant. If `quantity > 0`, a `restock` transaction is created. If `reservedQuantity > 0`, a `reserved` transaction is created.

Request:

```json
{
  "variantId": "35f2e2f9-bb35-4270-90ee-6e81e9fdaf92",
  "quantity": 25,
  "reservedQuantity": 0,
  "lowStockThreshold": 5,
  "performedById": "1b8cccb9-66c2-4ad5-9c83-5321272bd2cf",
  "referenceId": "PO-1004",
  "note": "Opening stock"
}
```

Response: `201 Created`

```json
{
  "statusCode": 201,
  "data": {
    "id": "7d5fe45a-8f95-42a6-a778-6a7f5d2113d2",
    "variantId": "35f2e2f9-bb35-4270-90ee-6e81e9fdaf92",
    "quantity": 25,
    "reservedQuantity": 0,
    "availableQuantity": 25,
    "lowStockThreshold": 5,
    "isLowStock": false,
    "variant": {
      "id": "35f2e2f9-bb35-4270-90ee-6e81e9fdaf92",
      "name": "Gold / 18K",
      "sku": "RING-18K-GOLD",
      "product": {
        "id": "ef48b0ed-b1fb-43ea-bb3c-c712e503d9b3",
        "name": "Classic Ring"
      }
    }
  },
  "message": "Inventory created successfully",
  "success": true
}
```

## List Inventory

`GET /api/v1/inventory`

Query params:

| Param | Type | Default | Notes |
| --- | --- | --- | --- |
| `page` | integer | `1` | Starts at 1 |
| `limit` | integer | `10` | Max 100 |
| `variantId` | UUID | optional | Filter by variant |
| `productId` | UUID | optional | Filter by product |
| `lowStockOnly` | boolean string | `false` | Use `true` or `false` |

Example:

`GET /api/v1/inventory?page=1&limit=20&productId=ef48b0ed-b1fb-43ea-bb3c-c712e503d9b3&lowStockOnly=true`

Response: `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "inventory": [],
    "pagination": {
      "total": 0,
      "page": 1,
      "limit": 20,
      "pages": 0
    }
  },
  "message": "Inventory fetched successfully",
  "success": true
}
```

## Get Inventory

`GET /api/v1/inventory/:id`

Response: `200 OK`

Returns one inventory row with variant and product summary.

## Update Inventory

`PUT /api/v1/inventory/:id`

Updates stock fields. If `quantity` changes, the API creates a `manual_adjust` transaction using the delta. If `reservedQuantity` changes, it creates `reserved` or `released` transaction entries.

Request:

```json
{
  "quantity": 30,
  "reservedQuantity": 2,
  "lowStockThreshold": 6,
  "performedById": "1b8cccb9-66c2-4ad5-9c83-5321272bd2cf",
  "referenceId": "ADJ-221",
  "note": "Warehouse count correction"
}
```

Response: `200 OK`

```json
{
  "statusCode": 200,
  "data": {
    "id": "7d5fe45a-8f95-42a6-a778-6a7f5d2113d2",
    "quantity": 30,
    "reservedQuantity": 2,
    "availableQuantity": 28,
    "lowStockThreshold": 6,
    "isLowStock": false
  },
  "message": "Inventory updated successfully",
  "success": true
}
```

## Delete Inventory

`DELETE /api/v1/inventory/:id`

Deletes the current stock snapshot. This does not delete `inventory_transactions`.

Response: `200 OK`

## Error Responses

Common errors:

| Status | Cause |
| --- | --- |
| `400` | Invalid UUID or invalid quantity values |
| `404` | Inventory, variant, or performed-by user not found |
| `409` | Inventory already exists for variant, or delete attempted while reserved stock exists |
| `500` | Unexpected server/database error |
