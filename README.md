# EdenJomla - Perfume Factures Calculator

A Next.js web application for calculating and managing perfume invoices (factures) with Firebase Realtime Database integration.

## Features

- ✨ Create perfume factures/invoices
- 📦 Track perfume weight in grams (g) or kilograms (kg)
- 💰 Calculate prices based on weight and unit price
- 🔥 Real-time database synchronization with Firebase
- 📊 View all factures in a table format
- 🗑️ Delete factures
- 📱 Responsive design

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use an existing one
3. Enable **Realtime Database**:
   - Go to Build > Realtime Database
   - Click "Create Database"
   - Choose location and start in test mode (for development)
4. Get your Firebase configuration:
   - Go to Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click the web icon (</>)
   - Copy the configuration values

### 3. Environment Variables

1. Copy the example environment file:
   ```bash
   copy .env.local.example .env.local
   ```

2. Edit `.env.local` and replace the values with your Firebase configuration:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your_project_id.firebaseio.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Create a New Facture**:
   - Click "New Facture" button
   - Enter the client name
   - Add perfume items with name, weight, unit (g/kg), and price per unit
   - Click "Add Item" to add more perfumes
   - Click "Save Facture" to store it in Firebase

2. **View Factures**:
   - All factures are displayed in a table
   - See facture number, client name, items, total amount, and date

3. **Delete Factures**:
   - Click the delete button on any facture
   - Confirm the deletion

## Project Structure

```
EdenJomla/
├── app/
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page component
│   └── globals.css       # Global styles
├── lib/
│   └── firebase.ts       # Firebase configuration
├── types/
│   └── index.ts          # TypeScript interfaces
├── .env.local.example    # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── tsconfig.json
└── README.md
```

## Firebase Database Structure

```json
{
  "factures": {
    "facture_id": {
      "factureNumber": "FAC-1234567890",
      "clientName": "Client Name",
      "items": [
        {
          "id": "item-0",
          "name": "Rose Oud",
          "weight": 100,
          "weightUnit": "g",
          "pricePerUnit": 0.50,
          "totalPrice": 50.00,
          "createdAt": 1234567890
        }
      ],
      "totalAmount": 50.00,
      "createdAt": 1234567890,
      "updatedAt": 1234567890
    }
  }
}
```

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Firebase Realtime Database** - Real-time data synchronization
- **React Hooks** - State management

## License

MIT
