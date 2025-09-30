# Film Distribution Hub

A comprehensive web application for coordinating film distribution built with Vue.js and Supabase.

## Features

### 🎬 Film Management
- Add, edit, and organize your film catalog
- Track film status (draft, in distribution, distributed, archived)
- Store detailed film information including budget, revenue, and metadata
- Upload and manage film assets

### 🌍 Distribution Coordination
- Manage distribution deals across different territories
- Track multiple distribution types (theatrical, streaming, digital, home video)
- Monitor deal status and progress
- Revenue sharing and guaranteed minimum tracking

### 📊 Analytics & Reporting
- Financial overview with profit/loss analysis
- Film portfolio insights by genre and status
- Distribution performance metrics
- Top performing films analysis

### 🔐 Authentication & Authorization
- Secure user authentication with Supabase Auth
- Role-based access control (Producer, Distributor, Sales Agent, Admin)
- Row-level security for data protection

## Tech Stack

- **Frontend**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Type Safety**: TypeScript
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: CSS with modern design patterns
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Linting**: ESLint with Prettier

## Project Setup

### Prerequisites
- Node.js 20.19.0 or higher
- npm 10.8.2 or higher
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd movie_project
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Set up Supabase database:
   - Create a new Supabase project
   - Run the SQL schema from `SUPABASE_SCHEMA.md`
   - Enable authentication in your Supabase dashboard

### Development

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

### Code Quality

Type check:
```bash
npm run type-check
```

Lint and fix code:
```bash
npm run lint
```

Format code:
```bash
npm run format
```

## Project Structure

```
src/
├── components/          # Reusable Vue components
│   └── AppHeader.vue   # Main navigation header
├── lib/                # Utility libraries
│   └── supabase.ts     # Supabase client and types
├── router/             # Vue Router configuration
│   └── index.ts        # Route definitions and guards
├── stores/             # Pinia stores
│   ├── auth.ts         # Authentication store
│   ├── films.ts        # Film management store
│   └── counter.ts      # Example store (can be removed)
├── views/              # Page components
│   ├── HomeView.vue           # Dashboard/landing page
│   ├── LoginView.vue          # User login
│   ├── RegisterView.vue       # User registration
│   ├── FilmsView.vue          # Film listing
│   ├── FilmCreateView.vue     # Add new film
│   ├── FilmDetailView.vue     # Film details
│   ├── DistributionsView.vue  # Distribution deals
│   ├── AnalyticsView.vue      # Analytics dashboard
│   └── AboutView.vue          # About page
├── assets/             # Static assets
├── App.vue            # Root component
└── main.ts            # Application entry point
```

## Key Features Implementation

### Authentication Flow
- JWT-based authentication with Supabase Auth
- Protected routes with navigation guards
- Automatic session management
- Role-based access control

### Data Management
- Reactive state management with Pinia
- Real-time updates with Supabase subscriptions
- Type-safe API interactions
- Optimistic UI updates

### User Interface
- Responsive design for all screen sizes
- Modern CSS with flexbox and grid layouts
- Consistent design system
- Loading states and error handling

## Database Schema

The application uses the following main entities:

- **Users**: User profiles with roles and metadata
- **Films**: Film catalog with financial and metadata
- **Distributions**: Distribution deals and agreements

See `SUPABASE_SCHEMA.md` for complete database schema.

## Environment Configuration

### Production
- Set up environment variables in your hosting platform
- Configure Supabase for production
- Enable appropriate authentication providers
- Set up custom domain and SSL

### Development
- Use local environment variables
- Enable Supabase development mode
- Use test data for development

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Run linting and type checking: `npm run lint && npm run type-check`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## Security Considerations

- All API interactions are protected by Supabase RLS (Row Level Security)
- User authentication is handled by Supabase Auth
- Environment variables are used for sensitive configuration
- Input validation on both client and server side

## Performance Optimizations

- Code splitting with dynamic imports
- Lazy loading of route components
- Optimized build with Vite
- Efficient state management with Pinia

## Browser Support

- Chrome/Chromium 88+
- Firefox 85+
- Safari 14+
- Edge 88+

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the database schema guide
