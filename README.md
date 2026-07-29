# ShopWave — E-Commerce Store

A full stack ecommerce store. Clients can add items to their cart and checkout to successfully place an order. The store has a discount system that rewards customers. Discount System works in the following ways - Every nth order gets a coupon code for x% discount. Discount codes can be applied at checkout.

**Backend**: Node.js + Express + TypeScript | **Frontend**: React + Vite + TypeScript + ShadCN-style components

## Project Execution Steps

### 1. Prerequisites

Ensure you have the following installed:
- Node.js ≥ 18
- npm ≥ 9

### 2. Run Backend Server

Open a terminal window and run:

```bash
cd backend
npm install
npm run dev       
```

The backend API will run on `http://localhost:3001`.

### 3. Run Frontend Application

Open another terminal window and run:

```bash
cd frontend
npm install
npm run dev        
```

The frontend will run on `http://localhost:5173` (or port specified by Vite).

### 4. Run Tests

To execute backend unit tests:

```bash
cd backend
npm install
npm test           
```

---

## Documentation

- [Architecture and Decisions (DECISIONS.md)](./DECISIONS.md): Contains the architecture details (Feature-Sliced Design), coding conventions, and major design decisions made during the project's implementation.
