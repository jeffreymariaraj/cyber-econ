# Risk Logic

## Single Loss Expectancy (SLE)

The core financial risk metric is the Single Loss Expectancy (SLE), calculated as:

$$
\text{Risk Score (SLE)} = \text{Asset Value} \times \text{Exposure Factor (EF)}
$$

-   **Asset Value**: User-provided monetary value of the asset (e.g., in Rupees or Dollars).
-   **Exposure Factor (EF)**: The percentage of loss a realized threat could cause to the asset.

## Exposure Factor (EF) Heuristic

We derive the Exposure Factor based on the severity of vulnerabilities found (CVSS scores).

| Severity Level | CVSS Score Range | Exposure Factor (EF) |
| :--- | :--- | :--- |
| **Critical** | 9.0 - 10.0 | **0.9** (90% loss) |
| **High** | 7.0 - 8.9 | **0.6** (60% loss) |
| **Medium** | 4.0 - 6.9 | **0.3** (30% loss) |
| **Low** | 0.0 - 3.9 | **0.1** (10% loss) |

## Risk Aggregation

When an asset has multiple vulnerabilities, we need to determine the aggregate Exposure Factor.

**MVP Approach:**
For the MVP, we will simply take the **Max Severity** found on the asset.
-   *Example*: If an asset has one Critical vuln and three Medium vulns, the EF is 0.9.

**Future/Robust Approach:**
Calculate the probability of at least one exploit occurring.
$$
P(\text{breach}) = 1 - \prod (1 - P_i)
$$
Where $P_i$ is the probability of exploitation for each vulnerability.
