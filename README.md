# Whisker Anime — Frontend

Modern Single Page Application (SPA) for the Whisker Anime platform — a complete anime catalog and tracking system with advanced authentication, favorites, nested comments, and a custom UI component library.

**Main Technologies**  
![Angular](https://img.shields.io/badge/Angular-DD0031?logo=angular&logoColor=white) 
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white) 
![Signals](https://img.shields.io/badge/Angular_Signals-0F0F0F?logo=angular&logoColor=white)

---

## Features

### Authentication & Security
- Complete auth flow (Login, Register, Password Recovery) in a single component using Angular control flow
- Cookie-based session persistence with `withCredentials`
- Avatar upload and display with cache busting (timestamp query params)

### User Interactions
- Anime catalog browsing and search
- Favorites management
- Nested comment system with replies, like counters, and user interaction status
- Dynamic Dark Mode (persisted via `localStorage` and `document.classList`)

### Technical Highlights
- **Angular 21** with Standalone Components
- **Angular Signals** for reactive state management (computed and asReadonly)
- **OnPush** change detection strategy for maximum performance
- Custom UI Component Library (`projects/ui`)
- Recursive comment tree component
- Reactive Forms with validation
- Custom directives (e.g., `TooltipDirective`)
- FontAwesome integration
- SSR-safe code (`isPlatformBrowser` + `PLATFORM_ID`)

---

## How to Run

### Prerequisites
- Node.js (v18 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/glrmrissi/whisker-anime-frontend-client.git
cd whisker-anime-frontend-client

# Install dependencies
npm install

```
### Running the application
```bash
Development mode (with hot-reload)
npm run start:dev

# Build for production
npm run build
The application will be available at http://localhost:4200.
```


### Environment Configuration
Configure the backend URL in src/environments/environment.ts:
```ts 
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/'   // Change to your backend URL
};
```

### Related Repositories

Backend (NestJS): whisker-anime-backend-client
Notifier Service (Go): whisker-anime-notifier-go


### About the Project
Anime catalog frontend built with Angular 21 and TypeScript, featuring a custom UI component library, authentication flow, favorites and comments integrated with the Whisker backend.
Developed by: Guilherme Rissi
Status: Production-ready / Available for demo
