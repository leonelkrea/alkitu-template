# 🚀 Deployment Guide

This guide provides instructions for deploying the Alkitu monorepo to a production environment using Docker.

## 📋 Prerequisites

- A server with Docker and Docker Compose installed.
- A domain name pointing to your server's IP address.
- SSL certificates for your domain (recommended).

## 1. Build Production Docker Images

From the root of the monorepo, run the following command to build the Docker images for the `web` and `api` packages:

```bash
npm run docker:build
```

This command will create production-ready Docker images for both the frontend and backend applications.

## 2. Configure Production Environment

Create a `.env.production` file in the root of the monorepo. This file will contain the environment variables for the production deployment.

```bash
cp .env.example .env.production
```

Edit the `.env.production` file with your production-specific configurations, such as:

- `DATABASE_URL`
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`
- `JWT_SECRET`
- `NEXTAUTH_SECRET`
- API keys for external services

## 3. Deploy with Docker Compose

The `docker-compose.prod.yml` file in the `infrastructure/docker` directory is configured to run the application in production. It uses the images built in step 1 and the environment variables from `.env.production`.

To start the application in production, run the following command:

```bash
docker-compose -f infrastructure/docker/docker-compose.prod.yml --env-file .env.production up -d
```

This will start the `web`, `api`, `mongodb`, and `nginx` services in detached mode.

## 4. SSL Configuration

For a production deployment, it is highly recommended to use SSL. The `nginx` service is configured to use SSL certificates located in the `ssl` directory. You should place your `cert.pem` and `key.pem` files in this directory.

## 5. Monitoring

You can monitor the logs of the running services using the following command:

```bash
docker-compose -f infrastructure/docker/docker-compose.prod.yml logs -f
```

## 6. Continuous Deployment (CI/CD)

For automated deployments, you can set up a CI/CD pipeline (e.g., using GitHub Actions) to perform the following steps:

1.  Build the Docker images.
2.  Push the images to a container registry (e.g., Docker Hub, AWS ECR).
3.  On the production server, pull the new images and restart the Docker Compose services.