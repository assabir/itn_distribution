
# ITN Distribution API Documentation

## Base URL: `http://localhost:3000/api`

## Authentication:
- **Login Endpoint**: `POST /login`
  - Required credentials:
    - `username`: **admin**
    - `password`: **password**
  - Authentication is required before accessing the ITN distribution API.

---

### 1. POST ITN Distribution Data

- **Endpoint**: `POST /distribution`
- **Description**: Submit ITN distribution data to the system.
- **Request Body** (JSON):
  ```json
  {
    "household_id": "HH001",
    "household_head_name": "Assabiru Musa Dibal",
    "family_members": 5,
    "itns_distributed": 3,
    "distribution_date": "2024-09-20"
  }
  ```

- **Success Response** (201):
  ```json
  {
    "message": "ITN Distribution data submitted successfully",
    "id": 1
  }
  ```

- **Error Responses**:
  - 400 (Bad Request):
    ```json
    {
      "error": "All fields are required"
    }
    ```
  - 500 (Internal Server Error):
    ```json
    {
      "error": "Failed to submit data"
    }
    ```

---

### 2. GET All ITN Distribution Data

- **Endpoint**: `GET /distribution`
- **Description**: Retrieve all ITN distribution data submitted so far.
- **Request Parameters**: None

- **Success Response** (200):
  ```json
  [
    {
      "id": 1,
      "household_id": "HH001",
      "household_head_name": "Asabiru",
      "family_members": 5,
      "itns_distributed": 3,
      "distribution_date": "2024-09-20"
    }
  ]
  ```

- **Error Response** (500):
  ```json
  {
    "error": "Failed to retrieve data"
  }
  ```

---

### 3. Error Handling

- **400 Bad Request**: If required fields are missing or invalid.
- **401 Unauthorized**: If the user is not authenticated or logged in.
- **500 Internal Server Error**: If there are issues with the server or database.

---

### 4. Testing Tools

- **Postman**:
  - Add a new POST request for submitting the ITN distribution data.
  - Add a new GET request for retrieving the submitted data.

- **cURL**:

  **POST ITN Distribution Data**:
  ```bash
  curl -X POST http://localhost:3000/api/distribution \
  -H "Content-Type: application/json" \
  -d '{
    "household_id": "HH001",
    "household_head_name": "John Doe",
    "family_members": 5,
    "itns_distributed": 3,
    "distribution_date": "2024-09-20"
  }'
  ```

  **GET All ITN Distribution Data**:
  ```bash
  curl -X GET http://localhost:3000/api/distribution
  ```
