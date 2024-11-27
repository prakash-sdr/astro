# shopping-cart

---


## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd <project-directory>
   ```

---

---
# frontend

## Overview
This Astro app is an e-commerce platform that leverages React components, Zustand for state management, and Zod for validation.

## Key Features
- **Product Management**: Create, update, and delete products.
- **Cart Management**: Add, remove, and update items in the shopping cart.

## Directory Structure
```
app/
├── components/
├── layouts/
├── pages/
├── services/
├── stores/
└── types/
```

- `components`: Reusable React components.
- `layouts`: Define the overall application layout.
- `pages`: Individual application pages.
- `services`: Business logic and data access.
- `stores`: Zustand-based state management.
- `types`: TypeScript types and interfaces.

## Getting Started
1. Install dependencies: `npm install`
2. Start the development server: `npm run dev`
3. Open the application: `http://localhost:4321`

## Deployment
To build the production-ready version, run: `npm run build`

## Technologies Used
- **Astro**: Static site generator
- **React**: UI components
- **Zustand**: State management
- **Zod**: Data validation
- **Tailwind CSS**: UI library and components

## Contact
For any questions or issues, please reach out to the project maintainers at [support@astroapp.com](mailto:support@astroapp.com).

---
---

# Backend

# Express.js API with TypeScript, Docker, and Testing

This project is a Express.js backend API built with TypeScript. It follows a modular structure with controllers, services, routes, interceptors, and tests. The project is containerized using Docker and supports running tests with Jest.

---

## Project Structure

```
src
├── controllers
│   ├── cartController.ts
│   └── productController.ts
├── docs
│   ├── cartPaths.yaml
│   └── productPaths.yaml
├── schemas
│   ├── cartSchemas.yaml
│   └── productSchemas.yaml
├── interceptors
│   ├── exception.interceptor.ts
│   └── response.interceptor.ts
├── middlewares
│   └── validateProduct.ts
├── models
│   ├── cartModel.ts
│   └── productModel.ts
├── routes
│   ├── cartRoutes.ts
│   └── productRoutes.ts
├── services
│   ├── cartService.ts
│   └── productsService.ts
├── tests
│   ├── cartController.test.ts
│   ├── cartService.test.ts
│   ├── exceptionInterceptor.test.ts
│   ├── productController.test.ts
│   ├── productsService.test.ts
│   └── responseInterceptor.test.ts
├── utils
    ├── AppError.errorHandler.ts
    ├── dbConnector.ts
    ├── swagger-jsdoc.type.ts
    ├── swagger-ui-express.type.ts
    ├── tryCatch.errorHandler.ts
    ├── app.ts
    └── swagger.ts
```

- `controllers/`: Contains controllers that handle incoming requests and delegate them to appropriate services.
- `docs/`: Stores API documentation, typically in YAML format.
- `schemas/`: Contains JSON schemas for validating data.
- `interceptors/`: Interceptors are used to intercept incoming requests and outgoing responses to perform specific tasks like authentication, authorization, logging, or error handling.
- `middlewares/`: Middleware functions are executed before the request reaches the controller. They can be used for tasks like authentication, authorization, or logging.
- `models/`: Contains data models that define the structure of data.
- `routes/`: Defines the API routes and their corresponding controllers.
- `services/`: Contains services that encapsulate business logic and data access.
- `tests/`: Contains unit and integration tests for the application.
- `utils/- `: Contains utility functions and configuration files.

---

## Features

- **TypeScript**: Strongly typed codebase for better developer experience.
- **Jest**: Unit testing with detailed coverage reports.
- **Docker**: Easy containerization for deployment.
- **Modular Architecture**: Separation of concerns with controllers, services, and routes.
- **Swagger**: API documentation with YAML schemas.
- **Validation**: Middleware for input validation.

---

---

## Getting Started

1. Install dependencies: `npm install`
2. Start the development server: `npm run start`
3. Tests can be performed by running: `npm test`
4. Base URL of the application: `http://localhost:4321`

## Docker Setup

The project is fully containerized with Docker.

### **Build and Run with Docker**
1. Navigate to the `docker` directory:
   ```
   cd docker
   ```

2. Start the container:
   ```
   docker-compose up --build
   ```

3. Access the API at:
   ```
   http://localhost:3000/api/products-server
   ```

---

## Testing

The project uses Jest for unit testing.

- To run all tests:
  ```
  npm test
  ```

- View coverage in the `coverage/` folder after tests are executed.

---

## Deployment

The app can be deployed using Docker. Ensure the `docker-compose.yml` is correctly set up and run:
```
docker-compose up --build
```

---

## API Documentation

Swagger is used for API documentation. YAML files in `src/docs/` define paths and schemas.

- Swagger setup is in `swagger.ts`.
- Documentation can be accessed at:
  ```
  http://localhost:3000/api/products-server/api-docs
  ```

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

---
