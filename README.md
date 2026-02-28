# Whisker Anime Frontend Client

## Purpose
The project is a Single Page Application (SPA) designed for the consumption and interaction of media content (animes). The system manages catalog viewing, user authentication, personalized profiles, and a comment system supporting nested replies and like interactions.

---

## Core Technologies
* **Core Framework:** Angular (Version 17+ using Standalone Components).
* **Language:** TypeScript.
* **State Management:** Angular Signals (utilization of signals for reactive states and computed/asReadonly for flow control).
* **Change Detection Strategy:** ChangeDetectionStrategy.OnPush for performance optimization and reduction of rendering cycles.
* **Communication:** Angular HttpClient for REST API integration.
* **Forms:** Reactive Forms for validation and data capture in authentication and comment modules.
* **Icons:** FontAwesome (utilization of @fortawesome/angular-fontawesome).
* **Styling:** Native CSS with dynamic theme switching (Dark Mode) implemented via document class manipulation and localStorage persistence.

---

## Architecture and Componentization
The application is structured through independent and modular components, prioritizing logic and interface reuse:

* **Comment System:** Recursive tree logic for displaying replies, like counters, and user interaction status verification.
* **Authentication:** Management of Login, Registration, and Password Recovery flows within a single component using Angular control flow directives.
* **Custom Directives:** Implementation of interface functionalities, such as the TooltipDirective.
* **Lifecycle Management:** Use of ngOnInit and afterNextRender for asynchronous request control and post-initial rendering state manipulation.

---

## Backend Integration
The interface communicates with an external server through dedicated services. Integrated functionalities include:

* **Session Persistence:** Cookie-based authentication (credential transmission via withCredentials).
* **Media Management:** Upload and display of avatars with cache control via timestamp query params.
* **Dynamic Interactions:** Toggle Like system with persistence in a relational database through the backend.

---

## Rendering and Performance
* **SSR Awareness:** Platform verification via isPlatformBrowser and PLATFORM_ID to ensure the execution of browser-specific code (such as cookie handling and localStorage).
* **Reference Refactoring:** Object updates via the spread operator to ensure reactivity in components utilizing the OnPush strategy.