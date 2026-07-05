# Project Manager — Frontend

Vue 3 single-page application for managing projects and tasks. This is the front-end for [project_manager_api](https://github.com/mehedi-200/project_manager_api) (Laravel 12 + Sanctum).

## Tech Stack

- Vue 3 (Composition API) + TypeScript
- Pinia (state management)
- Vue Router
- Axios
- Vite 7
- Vitest (unit tests), ESLint + oxlint + Prettier

## Getting Started

```bash
npm install
```

Create a `.env` file pointing at the API:

```
VITE_API_URL=http://127.0.0.1:8000/api
```

Then run:

```bash
npm run dev        # start dev server
npm run build      # type-check + production build
npm run test:unit  # run unit tests
npm run lint       # lint & fix
```

> Requires the [project_manager_api](https://github.com/mehedi-200/project_manager_api) backend running locally.

## Author

**Mehedi** — [@mehedi-200](https://github.com/mehedi-200)
