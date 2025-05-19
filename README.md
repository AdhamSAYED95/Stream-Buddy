# Gamers Lounge App

## Tech Stack Decisions

### Why Electron + Vue?

- Electron: Chosen for its ability to create cross-platform desktop applications using web technologies (HTML, CSS, JavaScript). Electron allows the app to run on Windows, macOS, and Linux with a single codebase, making it ideal for reaching a wide audience of gamers. Its rich ecosystem and access to Node.js APIs enable native functionalities like file system access and system notifications.

- Vue: Selected for its reactive and component-based architecture, which simplifies building dynamic user interfaces. Vue's simplicity and excellent documentation make it a great fit for rapid development and maintaining a scalable frontend, enhanced by its integration with modern tools like Vite.

### Why Vite?

- Vite: Opted for Vite as the build tool due to its lightning-fast development server powered by native ES modules and Hot Module Replacement (HMR). This ensures near-instant updates during development, improving productivity. Vite's optimized build process also delivers efficient production bundles, crucial for a smooth gaming app experience.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run start:dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
