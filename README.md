# Node.js IP Info API

Node.js IP Info API is a simple RESTful service that provides information about IP addresses, including the country code, public IP address, and country information. It also supports caching to minimize external API requests.

## Table of Contents

- [Usage](#usage)
- [Endpoints](#endpoints)
  - [Get Client's Country Code](#get-clients-country-code)
  - [Get Client's Country Info](#get-clients-country-info)
  - [Get Client's Public IP Address](#get-clients-public-ip-address)
  - [Get IP Details](#get-ip-details)
  - [Get Country Information by Alpha Code](#get-country-information-by-alpha-code)
- [Project Structure](#project-structure)
- [Dependencies](#dependencies)
- [How to Contribute](#how-to-contribute)

## Usage

1. Clone this repository:

```shell
git clone https://github.com/cemonal/nodejs-ip-info.git
```

2. Install dependencies:

```shell
cd nodejs-ip-info
npm install
```

3. Start the server:

```shell
npm start
```

The server will be running on `http://localhost:3000` by default.

## Endpoints

### Get Client's Country Code

- **Description:** Retrieves the country code based on the client's IP address.

- **Endpoint:** `/mycountrycode`

- **Example:** `http://localhost:3000/mycountrycode`

### Get Client's Country Info

- **Description:** Retrieves detailed country information based on the client's IP address.

- **Endpoint:** `/mycountry`

- **Example:** `http://localhost:3000/mycountry`

### Get Client's Public IP Address

- **Description:** Retrieves the public IP address of the client.

- **Endpoint:** `/myip`

- **Example:** `http://localhost:3000/myip`

### Get IP Details

- **Description:** Retrieves IP details, including city, region, country, postal code, timezone, and organization, based on the client's IP address.

- **Endpoint:** `/mydetails`

- **Example:** `http://localhost:3000/mydetails`

### Get Country Information by Alpha Code

- **Description:** Retrieves country information by alpha code (e.g., "TR" for Turkey).

- **Endpoint:** `/country/:alphaCode`

- **Example:** `http://localhost:3000/country/TR`

## Project Structure

The project has the following structure:

```go
nodejs-ip-info/
├── ipInfo.js
├── node_modules/
├── package.json
├── package-lock.json
├── README.md
└── .gitignore
```

- **ipInfo.js:** The main application file that contains the Node.js code.
- **node_modules/:** The directory where project dependencies are installed.
- **package.json:** Configuration file that lists project dependencies and scripts.
- **package-lock.json:** An automatically generated file to lock dependencies to specific versions.
- **README.md:** This file, which provides detailed information about the project, how to use it, and other relevant details.
- **.gitignore:** Configuration file specifying files and directories to be ignored by Git.

## Dependencies

The project uses the following dependencies:

- [Express](https://expressjs.com/): A fast, unopinionated, minimalist web framework for Node.js.
- [Axios](https://axios-http.com/): A promise-based HTTP client for the browser and Node.js.
- [Node-cache](https://www.npmjs.com/package/node-cache): A simple in-memory cache for Node.js.
- [Request-ip](https://www.npmjs.com/package/request-ip): A middleware for extracting a user's IP address in Express.js.

## How to Contribute

Contributions to this project are welcome! Here's how you can contribute:

1. Fork the repository.
2. Clone the forked repository to your local machine.
3. Create a new branch for your feature or bugfix: `git checkout -b feature-name`.
4. Make your changes and commit them with descriptive messages.
5. Push your changes to your fork: `git push origin feature-name`.
6. Create a pull request on the original repository.
7. Wait for the maintainers to review your pull request.

Please ensure that your contributions align with the project's goals and follow best practices.
