# Vue 3 Dynamic Form Generator

A dynamic form generator application built with Vue 3, TypeScript, Vuex, Vue Router, and SCSS.  

## Project Goal

The goal of this project is to implement a reusable, highly customizable form generator component that can render forms dynamically based on a provided structure. The application demonstrates the flexibility and power of Vue 3's Composition API, TypeScript, and modern frontend best practices.

## Main Features

- **Reusable Form Generator Component**  
  Supports `input`, `select`, `checkbox`, `textarea`, and action buttons.
- **Dynamic Form Rendering**  
  Accepts a structure object describing fields (labels, attributes, etc.) and a values object (via `v-model`), which can be server-driven or hardcoded.
- **Customizable Fields via Slots**  
  Each field can be customized using Vue slots for maximum flexibility.
- **Event Handling**  
  Save and cancel actions are fully handled and can be integrated with Vuex/localStorage.
- **Demo Pages**  
  Multiple demo pages with various form structures to showcase component capabilities.
- **Modern Stack**  
  Built with Vue 3, TypeScript, Vuex, Vue Router, and SCSS. Uses Composition API and best practices for scalable frontend development.

## Interesting Aspects

- **Form structure and values are fully dynamic and type-safe.**
- **Custom slot support for field-level customization.**
- **State management with Vuex and persistent storage via localStorage.**
- **Routing for switching between different form demos.**
- **Clean, maintainable codebase using the latest Vue 3 conventions.**

## Stack

- [Vue 3](https://vuejs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vuex](https://vuex.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [SCSS](https://sass-lang.com/)
- [Vite](https://vitejs.dev/)

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run the development server:**
   ```sh
   npm run dev
   ```

3. **Open your browser at:**  
   [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal)

4. **Build for production:**
   ```sh
   npm run build
   ```

5. **Lint and format code:**
   ```sh
   npm run lint
   npm run format
   ```

## Usage

- Visit the home page to see available form demos.
- Select a form type to view and interact with a dynamic form.
- Try customizing fields using slots and see how the form generator adapts.
- Save and cancel actions demonstrate integration with Vuex and localStorage.

---
