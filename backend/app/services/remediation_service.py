import os
from typing import List
from groq import Groq
from app.models.schemas import Vulnerability

class RemediationService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY", "")
        self.client = Groq(api_key=self.api_key) if self.api_key else None
        self.model = "llama-3.3-70b-versatile"

    async def generate_remediation_plan(self, vulnerabilities: List[Vulnerability], financial_risk: float) -> str:
        if not self.client:
            return "Groq API Key not configured. Remediation plan unavailable."

        if not vulnerabilities:
            return "No vulnerabilities detected. No remediation required."

        vuln_details = "\n".join([f"- {v.cve_id}: {v.description} (Severity: {v.severity})" for v in vulnerabilities])
        
        prompt = f"""
        Act as a Virtual CISO for an MSME. 
        We have detected the following vulnerabilities:
        {vuln_details}

        The total financial risk (Single Loss Expectancy) is estimated at ₹{financial_risk:,.2f}.

        1. Explain in simple terms why this financial risk is high/concerning.
        2. Provide exactly three actionable, prioritized steps to fix these vulnerabilities or mitigate the risk immediately.
        
        Keep the tone professional yet accessible for a business owner who is not tech-savvy.
        """

        try:
            completion = self.client.chat.completions.create(
                messages=[
                    {"role": "system", "content": "You are a professional Virtual CISO for small and medium businesses."},
                    {"role": "user", "content": prompt}
                ],
                model=self.model,
            )
            return completion.choices[0].message.content
        except Exception as e:
            return f"Error generating remediation plan: {str(e)}"
