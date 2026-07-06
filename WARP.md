# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**Backend Mentor Evolved** is a Next.js-based learning platform for backend development. The application combines AI-powered mentorship, interactive coding challenges, and gamification to create an immersive learning experience for developers.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack on port 9002
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run typecheck` - Type check with TypeScript (no emit)

### AI Development (Genkit)
- `npm run genkit:dev` - Start Genkit development server
- `npm run genkit:watch` - Start Genkit with file watching

### Data Management
- `npm run seed` - Run challenge seeding script (scripts/seed-challenges.js)

## Architecture Overview

### Core Technologies
- **Frontend**: Next.js 15 with App Router, React 18, TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **AI**: Google Genkit for AI flows and mentor functionality
- **Backend**: Firebase (Auth, Firestore, Analytics)
- **UI Components**: Radix UI primitives with custom design system

### Project Structure

#### `/src/ai/` - AI System
- **`genkit.ts`** - Genkit configuration with Google AI
- **`dev.ts`** - Development entry point for Genkit
- **`flows/`** - AI flow definitions:
  - `ai-mentor-chat.ts` - Main AI mentor chat functionality
  - `ai-code-review.ts` - Code review flow
  - `ai-project-ideas.ts` - Project idea generation
  - `ai-realtime-coding-help.ts` - Real-time coding assistance
  - `run-code-flow.ts` - Code execution flow
  - `tech-stack-recommendation.ts` - Technology recommendations

#### `/src/app/` - Next.js App Router
- **`page.tsx`** - Landing page with feature showcase
- **`layout.tsx`** - Root layout with global styling
- **`(app)/layout.tsx`** - App-specific layout
- **`login/page.tsx`** - Authentication page

#### `/src/components/` - React Components
- **`ai-mentor-fab.tsx`** - Floating Action Button for AI mentor
- **`ai-mentor-modal.tsx`** - AI mentor chat interface
- **`app-sidebar.tsx`** - Application sidebar
- **`header.tsx`** - Header component
- **`ui/`** - Reusable UI components (Radix-based)

#### `/src/hooks/` - React Hooks
- **`use-auth.tsx`** - Authentication context and hooks
- **`use-mobile.tsx`** - Mobile device detection
- **`use-toast.ts`** - Toast notification system

#### `/src/lib/` - Utilities and Configuration
- **`firebase.ts`** - Firebase initialization and exports
- **`challenges-data.ts`** - Challenge definitions and test cases
- **`utils.ts`** - Utility functions (cn, clsx, etc.)

#### `/src/services/` - Service Layer
- **`challenges.ts`** - Challenge data service with async operations

### Key Architectural Patterns

#### AI Integration
- Uses Google Genkit for AI flow orchestration
- AI mentor ("Rahim") provides contextual coding assistance
- Structured input/output schemas with Zod validation
- Real-time chat with conversation history

#### Authentication Flow
- Firebase Auth with multiple providers (Google, GitHub, Email/Password)
- Context-based authentication state management
- Protected routes and conditional rendering

#### Component Architecture
- Atomic design with reusable UI components
- Custom design system with CSS custom properties
- Responsive design with mobile-first approach
- Compound component patterns for complex UI

#### Data Management
- Static challenge data with service layer abstraction
- Real-time Firebase integration for user data
- Type-safe data structures with TypeScript

## Design System

### Color Scheme
- **Primary**: Deep blue (#4682B4) for trust and competence
- **Background**: Light gray (#F0F8FF) for clean appearance
- **Accent**: Vibrant orange (#FF7F50) for CTAs
- **Additional**: Gradient system with blue, purple, red, and green accents

### Typography
- **Body/Headlines**: Inter (sans-serif)
- **Code**: Source Code Pro (monospace)

### CSS Architecture
- Custom CSS properties for theme consistency
- Tailwind utility classes with custom theme extension
- Animation system with keyframes for engaging UX

## Environment Setup

### Required Environment Variables
```
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=
```

### Firebase Configuration
- Authentication providers: Google, GitHub, Email/Password
- Firestore for real-time data synchronization
- Analytics for usage tracking (client-side only)

## Testing and Code Quality

### Type Safety
- Strict TypeScript configuration
- Zod schemas for runtime validation
- Type-safe Firebase integration

### Code Style
- ESLint configuration with Next.js rules
- Consistent component patterns
- Proper error handling in async operations

## Deployment

### Firebase App Hosting
- Configured with `apphosting.yaml`
- Maximum 1 instance for cost optimization
- Automatic deployment via Firebase CLI

### Build Optimization
- Next.js App Router for optimal performance
- Turbopack for fast development builds
- Static generation where possible

## AI System Details

### Genkit Flows
The AI system is built around Google Genkit flows, each handling specific functionality:
- **aiMentorChat**: Context-aware coding mentor with personality
- **aiCodeReview**: Automated code review and optimization suggestions
- **aiProjectIdeas**: Generate project ideas based on skill level
- **techStackRecommendation**: Suggest appropriate technologies

### AI Mentor Personality
"Rahim" is designed as a friendly, encouraging senior developer with:
- Informal but professional communication style
- Focus on guiding rather than providing direct answers
- Context awareness of user progress and current challenges
- Integration with platform features and user data

## Key Features Implementation

### Interactive Challenges
- Challenge data structure with metadata, instructions, and test cases
- Service layer for challenge management
- Real-time code execution and validation

### Gamification
- XP system for user engagement
- Leaderboards and achievement tracking
- Progress visualization components

### Real-time Collaboration
- Firebase real-time synchronization
- Shared coding environments
- Community features integration
