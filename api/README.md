# Care-Track Backend (API)

## Description

This README outlines the backend API for the Care-Track Healthcare Management System. This API is built to support the frontend application by providing the necessary endpoints for data management, user authentication, and business logic related to appointment booking, patient records, and the blood donation platform.

## Key Features

* **User Authentication and Authorization:** Securely manages user logins and permissions for different roles (patients, doctors, nurses, receptionists).
* **Appointment Management:** Provides endpoints to create, read, update, and delete appointment records.
* **Patient Data Management:** Allows for the storage and retrieval of detailed patient medical histories and personal information.
* **Blood Bank Management:** Enables tracking of blood donations, requests, and inventory.
* **Clinic Management:** Manages information about clinics, departments, and services offered.
* **Diagnosis Management:** Supports the recording and retrieval of patient diagnoses.
* **Session Management:** Handles user sessions for maintaining login states.

## Technologies Used

* **TypeScript:** providing enhanced code quality and maintainability.
* **Node.js:** used for building scalable server-side applications.
* **Framework  Express.js :** backend practices, Express is  used for routing and middleware
* **MySQL:** A widely used open-source relational database management system for storing application data.
* **Sequelize:** An (ORM) for Node.js, providing an elegant way to interact with the MySQL database.

## Backend File Structure

## Setting Up the Backend

1.  **Clone the repository:**
    ```bash
    cd api  
    ```

2.  **Install dependencies:**
    ```bash
    npm install  
    ```

3.  **Configure environment variables:**

    * Create a `.env` file in the root of the backend directory.
    * Add the following environment variables to the `.env` file and replace the placeholder values with your actual configurations:

        ```
        JWT_KEY=<your_secret_jwt_key>
        JWT_ACCESS_TTL
        JWT_REFRESH_TTL
        NODE_ENV="development"
        DB_HOST=<your_database_host>
        DB_USER=<your_database_user>
        DB_NAME=<your_database_name>
        DB_PASSWORD=<your_database_password>
        DB_PORT="3306"
        DB_PUBLIC_URL= # Optional: Public URL for database access
        PORT="3030"
        CDN_BASE_URL="http://localhost:3030" # Or your actual CDN base URL
        CLIENT_URL="http://localhost:3000" # URL of your frontend application
        ```

    * **Explanation of the variables:**
        * `JWT_KEY`: Secret key used to sign JSON Web Tokens (JWTs) for authentication. **Keep this key secure.**
        * `JWT_ACCESS_TTL`: Time duration for which the access token is valid (e.g., "10m" for 10 minutes).
        * `JWT_REFRESH_TTL`: Time duration for which the refresh token is valid (e.g., "1y" for 1 year).
        * `NODE_ENV`: Environment in which the application is running (e.g., "development", "production").
        * `DB_HOST`: Hostname or IP address of your MySQL database server.
        * `DB_USER`: Username for connecting to the MySQL database.
        * `DB_NAME`: Name of the MySQL database to be used by the application.
        * `DB_PASSWORD`: Password for the MySQL database user.
        * `DB_PORT`: Port number on which the MySQL database server is listening (default is 3306).
        * `DB_PUBLIC_URL`: (Optional) Publicly accessible URL for your database (may be relevant in certain deployment scenarios).
        * `PORT`: Port number on which the backend server will listen for incoming requests.
        * `CDN_BASE_URL`: Base URL for your Content Delivery Network (if you are serving static assets from a CDN). In development, it might point to your local server.
        * `CLIENT_URL`: URL of your frontend application, used for Cross-Origin Resource Sharing (CORS) configuration.

4.  **Set up the MySQL database:**
    * Ensure you have MySQL installed and running.
    * Create the database specified in the `DB_NAME` environment variable.
    * Make sure the database user specified in `DB_USER` has the necessary permissions to access the database.

5.  **Run database migrations:**
    ```bash
    npx sequelize-cli db:migrate  
    ```
    This command will create the necessary tables in your MySQL database based on the defined models.

6.  **Run the backend server:**
    ```bash
    npm run dev  
    # or
    npm run build  
    npm start      
    ```
