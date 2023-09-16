# Node.js IP Information API

This is a Node.js application that retrieves the public IP address of the client.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Endpoints](#endpoints)
- [Rate Limiting](#rate-limiting)
- [Error Handling](#error-handling)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

### Prerequisites

Before running this application, make sure you have the following prerequisites installed on your system:

- Node.js: [Download and Install Node.js](https://nodejs.org/)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/cemonal/nodejs-ip-info.git
   ```

2. Navigate to the project directory:

   ```bash
   cd nodejs-ip-info
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

4. Start the application:

   ```bash
   npm start
   ```

The server will be running on port **3000** by default. You can configure the port and other settings in the `config.js` file.

## Usage

To use the API, simply make GET requests to the appropriate endpoints. The main endpoint for retrieving the client's public IP address is:

   ```bash
   GET /
   ```

You can replace the base URL with your server's address if needed.

## Configuration

You can configure the application settings in the `config.js` file. Here are the available configuration options:

- `rateLimit`: Configure rate limiting settings, such as the time window and maximum number of requests allowed.
- `port`: Configure the port on which the server will listen.

## Endpoints

This application exposes the following endpoint:

- `/`: This endpoint retrieves the public IP address of the client.

## Rate Limiting

To prevent abuse of the API, rate limiting is applied. The default rate limiting settings are defined in the configuration file, but you can customize them to suit your needs.

## Error Handling

Global error handling is implemented to ensure that errors are logged and provide feedback to clients in case of unexpected errors. The error handling middleware logs errors and responds with an error message.

## Contributing

Contributions to this project are welcome! If you'd like to contribute, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test thoroughly.
4. Commit your changes with clear and concise commit messages.
5. Push your changes to your forked repository.
6. Create a pull request to the original repository, explaining your changes and the problem they solve.

Thank you for contributing!
