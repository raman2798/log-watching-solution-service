# Log Watching Solution Service

This is the repository for the Log Watching Solution Service.

## Getting Started

### Installation Instructions

1. Clone the repository:

```bash
git clone https://github.com/raman2798/log-watching-solution-service.git

cd log-watching-solution-service
```

2. Install node and npm

3. Install dependencies:

```
npm install
```

4. Set the environment variables:

```bash
cp .env.sample .env

# Open .env and modify the environment variables if needed
```

### Starting the Server

To start the server on localhost, run:

```bash
npm run start
```

## Project Structure

```
src/
 |--config/             # Environment variables and configuration related things
 |--controllers/        # Route controllers (controller layer)
 |--interfaces/         # Interfaces
 |--middlewares/        # Middlewares
 |--routes/             # Routes
 |--utils/              # All types of utils
 |--index.ts            # App entry point
```
