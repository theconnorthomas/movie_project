# Movie Project
Web app for coordinating film distribution

## Frontend Setup

This project uses Vue.js 3 with TypeScript for the frontend, located in the `frontend/` directory.

### Technologies Used

- **Vue.js 3** - Progressive JavaScript framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - State management for Vue
- **Vue Router** - Official router for Vue.js
- **ESLint** - Code linting and style enforcement
- **Prettier** - Code formatting

### Getting Started

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and visit: `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run type-check` - Run TypeScript type checking
- `npm run lint` - Run ESLint to check code quality
- `npm run format` - Format code with Prettier

### Project Structure

```
frontend/
├── src/
│   ├── assets/          # Static assets and global styles
│   ├── components/      # Reusable Vue components
│   ├── router/          # Vue Router configuration
│   ├── stores/          # Pinia state management stores
│   ├── views/           # Page-level components
│   ├── App.vue          # Root component
│   └── main.ts          # Application entry point
├── public/              # Public static files
└── index.html           # HTML template
```

### Development

The application is configured with:
- Hot module replacement for fast development
- TypeScript support with full type checking
- ESLint with Vue and TypeScript rules
- Prettier for consistent code formatting
- Tailwind CSS for utility-first styling
- Pinia for reactive state management
- Vue Router for client-side navigation
