# issue-tracker

A issue tracking application build with Django

Setting up Local Environment for Issue Tracker Project

## Prerequisites

- Podman installed on the system

- Podman-compose installed on the system

- Python installed on the system

- Node installed on the system

## Setup

- Clone the repository to your local machine.

- Navigate to the root directory of the repository.

## Starting Backend Server

Step 1: Build Docker Image

Go to the root directory of the repository.

`podman-compose build`

Step 2: Start Docker Container

Run the following command to start the Docker container.

`podman-compose up`

Starting Frontend Server

Step 1: Navigate to Frontend Directory

Navigate to the issue_tracker_frontend directory.

Step 2: Install Required Libraries

Run the following command to install all the required libraries.

`npm install`

Step 3: Start Frontend Server

Run the following command to start the frontend server.

`npm start`

## Note

Make sure to have all the required packages installed on your system, including Podman, Podman-compose, Python, and Node.

The backend server will be running on localhost:8000 and the frontend server will be running on localhost:3000.

You can access the application by navigating to http://localhost:3000 in your web browser.

## Troubleshooting

If you encounter any issues while building the Docker image, please check the Podman logs using podman logs command.

If you encounter any issues while starting the frontend server, please check the Node logs using npm run debug command.
