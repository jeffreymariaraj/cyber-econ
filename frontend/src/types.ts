export interface Vulnerability {
    cve_id: string;
    severity: number;
    description: string;
}

export interface Asset {
    id: string;
    name: string;
    ip: string;
    value: number;
}

export interface AssetCreate {
    name: string;
    ip: string;
    value: number;
}

export interface RiskReport {
    asset_id: string;
    asset_name: string;
    financial_risk_exposure: number;
    exposure_factor: number;
    vulnerabilities: Vulnerability[];
    remediation_plan?: string;
}
