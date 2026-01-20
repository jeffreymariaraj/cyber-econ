# API Contract

## Data Models

### Asset
```json
{
  "name": "Billing Server",
  "ip": "192.168.1.5",
  "value": 500000
}
```

### Risk Report
```json
{
  "asset_id": "string",
  "asset_name": "Billing Server",
  "financial_risk_exposure": 300000,
  "vulnerabilities": [
    {
      "cve_id": "CVE-2023-1234",
      "severity": 9.5,
      "description": "Remote Code Execution..."
    }
  ]
}
```

## Endpoints

### 1. Create Asset
Register a new asset in the system.

-   **Endpoint**: `POST /assets`
-   **Request Body**:
    ```json
    {
      "name": "string",
      "ip": "string",
      "value": number
    }
    ```
-   **Response**: `201 Created`
    ```json
    {
      "id": "string",
      "name": "string",
      "ip": "string",
      "value": number
    }
    ```

### 2. Trigger Scan
Initiate an Nmap scan for a specific asset.

-   **Endpoint**: `GET /scan/{asset_id}`
-   **Response**: `202 Accepted`
    ```json
    {
      "message": "Scan started",
      "scan_id": "string"
    }
    ```

### 3. Get Risk Report
Retrieve the calculated financial risk report for an asset.

-   **Endpoint**: `GET /report/{asset_id}`
-   **Response**: `200 OK`
    ```json
    {
      "asset_id": "string",
      "financial_risk_exposure": number,
      "exposure_factor": number,
      "vulnerabilities": []
    }
    ```
