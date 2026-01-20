from typing import List, Optional
from pydantic import BaseModel, Field

# --- Shared Models ---

class Vulnerability(BaseModel):
    cve_id: str
    severity: float
    description: Optional[str] = None

# --- Asset Models ---

class AssetBase(BaseModel):
    name: str = Field(..., description="Name of the asset, e.g., 'Billing Server'")
    ip: str = Field(..., description="IP address of the asset")
    value: float = Field(..., gt=0, description="Monetary value of the asset")

class AssetCreate(AssetBase):
    pass

class AssetResponse(AssetBase):
    id: str = Field(..., description="Unique identifier of the asset")

# --- Risk Report Models ---

class RiskReport(BaseModel):
    asset_id: str
    asset_name: str
    financial_risk_exposure: float = Field(..., description="Calculated Financial Risk Exposure (SLE)")
    exposure_factor: float = Field(..., description="Exposure Factor (EF) used in calculation")
    vulnerabilities: List[Vulnerability] = []
    remediation_plan: Optional[str] = Field(None, description="AI-generated remediation guidance")
