import uuid
from fastapi import APIRouter, HTTPException, Depends
from typing import List
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.models.schemas import AssetCreate, AssetResponse, RiskReport
from app.core.database import get_database
from app.services.nmap_scanner import NmapScanner
from app.services.risk_calculator import RiskEngine
from app.services.remediation_service import RemediationService

router = APIRouter()
remediation_service = RemediationService()

@router.post("/assets", response_model=AssetResponse, status_code=201)
async def create_asset(asset: AssetCreate, db: AsyncIOMotorDatabase = Depends(get_database)):
    new_asset = asset.dict()
    new_asset["id"] = str(uuid.uuid4())
    
    # Check if asset already exists? Skipping for MVP simplicity
    
    await db["assets"].insert_one(new_asset)
    return AssetResponse(**new_asset)

@router.get("/scan/{asset_id}", status_code=202)
async def scan_asset(asset_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    asset = await db["assets"].find_one({"id": asset_id})
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")

    # In a real app, this would be a background task (Celery/BullMQ)
    # For MVP, we'll await it (it's mocked anyway) and store results
    
    # 1. Scan
    vulnerabilities = await NmapScanner.scan_asset(asset["ip"])
    vuln_dicts = [v.dict() for v in vulnerabilities]
    
    # 2. Store vulnerabilities
    await db["vulnerabilities"].update_one(
        {"asset_id": asset_id},
        {"$set": {"vulnerabilities": vuln_dicts}},
        upsert=True
    )
    
    return {"message": "Scan started/completed (Mock)", "scan_id": str(uuid.uuid4())}

@router.get("/report/{asset_id}", response_model=RiskReport)
async def get_risk_report(asset_id: str, db: AsyncIOMotorDatabase = Depends(get_database)):
    asset = await db["assets"].find_one({"id": asset_id})
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
        
    vuln_record = await db["vulnerabilities"].find_one({"asset_id": asset_id})
    
    vulns_data = vuln_record.get("vulnerabilities", []) if vuln_record else []
    # Convert dicts back to Vulnerability objects
    from app.models.schemas import Vulnerability
    vulnerabilities = [Vulnerability(**v) for v in vulns_data]
    
    # Calculate Risk
    ef = RiskEngine.calculate_exposure_factor(vulnerabilities)
    sle = RiskEngine.calculate_single_loss_expectancy(asset["value"], ef)
    
    # Generate Remediation Plan
    remediation_plan = await remediation_service.generate_remediation_plan(vulnerabilities, sle)
    
    return RiskReport(
        asset_id=asset_id,
        asset_name=asset["name"],
        financial_risk_exposure=sle,
        exposure_factor=ef,
        vulnerabilities=vulnerabilities,
        remediation_plan=remediation_plan
    )
