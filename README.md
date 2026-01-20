# Cyber-Econ

**Cyber-Econ** is a financial risk quantification tool tailored for MSMEs. It translates technical vulnerability data (CVEs) into actual business impact, helping owners understand their security posture in terms of Rupees/Dollars rather than just technical scores.

## 🚀 Key Features

-   **💰 Financial Risk KPI**: Automatically calculates Single Loss Expectancy (SLE) based on asset value and vulnerability severity.
-   **✨ AI Virtual CISO**: Integrates with Groq (Llama 3.3) to provide actionable, business-friendly remediation steps.
-   **🕸️ Network Risk Topology**: Interactive 2D force-directed graph to visualize the relationship between assets and their vulnerabilities.
-   **🔍 Automated (Mock) Scanning**: Simulates Nmap vulnerability scans to identify risks in real-time.

## 🛠️ Tech Stack

-   **Frontend**: React (Vite + TypeScript), Tailwind CSS, Framer Motion, React Force Graph.
-   **Backend**: Python (FastAPI), Motor (Async MongoDB), Poetry.
-   **Database**: MongoDB.
-   **Orchestration**: Docker Compose.
-   **AI**: Groq Cloud API.

## 🏁 Quick Start

### Prerequisites
-   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.
-   A [Groq API Key](https://console.groq.com/keys).

### Installation

1.  **Clone the project**
2.  **Configure Environment**:
    Create a `.env` file in the root directory:
    ```env
    GROQ_API_KEY=your_actual_key_here
    MONGODB_URL=mongodb://mongo:27017/cyberecon
    ```
3.  **Run the application**:
    ```bash
    docker-compose up --build
    ```
4.  **Access the Dashboard**:
    Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📁 Project Structure

-   `/backend`: FastAPI application and risk calculation engine.
-   `/frontend`: React application with interactive risk visualizations.
-   `/specs`: Core documentation on risk logic and API contracts.

---
Built with ✨ by Antigravity
