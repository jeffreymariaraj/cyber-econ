from typing import List
from app.models.schemas import Vulnerability

class RiskEngine:
    @staticmethod
    def calculate_exposure_factor(vulnerabilities: List[Vulnerability]) -> float:
        """
        Calculates the Exposure Factor (EF) based on the vulnerabilities found.
        MVP Strategy: Max Severity.
        
        EF Mapping:
        - Critical (9-10) -> 0.9
        - High (7-8.9) -> 0.6
        - Medium (4-6.9) -> 0.3
        - Low (0-3.9) -> 0.1
        """
        if not vulnerabilities:
            return 0.0

        max_severity = 0.0
        for vuln in vulnerabilities:
            if vuln.severity > max_severity:
                max_severity = vuln.severity
        
        if max_severity >= 9.0:
            return 0.9
        elif max_severity >= 7.0:
            return 0.6
        elif max_severity >= 4.0:
            return 0.3
        elif max_severity > 0.0:
            return 0.1
        else:
            return 0.0

    @staticmethod
    def calculate_single_loss_expectancy(asset_value: float, exposure_factor: float) -> float:
        """
        Calculates Single Loss Expectancy (SLE).
        SLE = Asset Value * Exposure Factor
        """
        return asset_value * exposure_factor
