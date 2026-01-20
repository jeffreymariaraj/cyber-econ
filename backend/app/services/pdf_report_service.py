from fpdf import FPDF
from datetime import datetime
from app.models.schemas import RiskReport
import io

class RiskPDFReport(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 12)
        self.set_text_color(67, 56, 202) # Indigo-700
        self.cell(0, 10, 'Cyber-Econ | Financial Risk Intelligence', 0, 1, 'R')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(128, 128, 128)
        self.cell(0, 10, f'Page {self.page_no()} | Generated on {datetime.now().strftime("%Y-%m-%d %H:%M")}', 0, 0, 'C')

class PDFReportService:
    @staticmethod
    def clean_text(text: str) -> str:
        if not text:
            return ""
        # Standardize characters that cause encoding issues in Helvetica
        replacements = {
            "₹": "Rs.",
            "—": "-",
            "–": "-",
            "“": "\"",
            "”": "\"",
            "‘": "'",
            "’": "'"
        }
        for old, new in replacements.items():
            text = text.replace(old, new)
        return text

    @staticmethod
    def generate_report(report: RiskReport) -> bytes:
        pdf = RiskPDFReport()
        pdf.add_page()
        
        # --- Clean all dynamic inputs ---
        asset_name = PDFReportService.clean_text(report.asset_name)
        remediation_plan = PDFReportService.clean_text(report.remediation_plan or "")
        
        # --- Cover Page Content ---
        pdf.set_font('Helvetica', 'B', 24)
        pdf.set_y(60)
        pdf.cell(0, 20, 'Executive Risk Report', 0, 1, 'C')
        
        pdf.set_font('Helvetica', '', 14)
        pdf.ln(10)
        pdf.cell(0, 10, f'Asset: {asset_name}', 0, 1, 'C')
        pdf.cell(0, 10, f'Target ID: {report.asset_id}', 0, 1, 'C')
        
        # --- Financial Risk Box ---
        pdf.set_y(120)
        pdf.set_fill_color(249, 250, 251) # Gray-50
        pdf.set_draw_color(67, 56, 202) # Indigo-700
        pdf.rect(40, 120, 130, 40, 'FD')
        
        pdf.set_y(130)
        pdf.set_font('Helvetica', 'B', 12)
        pdf.set_text_color(67, 56, 202)
        pdf.cell(0, 10, 'ESTIMATED FINANCIAL EXPOSURE (SLE)', 0, 1, 'C')
        
        pdf.set_font('Helvetica', 'B', 20)
        pdf.set_text_color(239, 68, 68) # Red-500
        pdf.cell(0, 15, f'Rs. {report.financial_risk_exposure:,.2f}', 0, 1, 'C')
        
        pdf.add_page()
        
        # --- Executive Summary (AI Content) ---
        pdf.set_text_color(0, 0, 0)
        pdf.set_font('Helvetica', 'B', 16)
        pdf.cell(0, 10, 'Executive Summary', 0, 1, 'L')
        pdf.ln(5)
        
        pdf.set_font('Helvetica', '', 11)
        if remediation_plan:
            # Simple markdown-to-pdf conversion (manual for now as fpdf2 doesn't native parse MD fully)
            summary_text = remediation_plan.split('---')[0]
            pdf.multi_cell(0, 7, summary_text)
        else:
            pdf.cell(0, 10, 'No AI summary available.', 0, 1, 'L')
            
        pdf.ln(10)
        
        # --- Vulnerability Table ---
        pdf.set_font('Helvetica', 'B', 16)
        pdf.cell(0, 10, 'Technical Vulnerability Breakdown', 0, 1, 'L')
        pdf.ln(5)
        
        # Table Header
        pdf.set_font('Helvetica', 'B', 10)
        pdf.set_fill_color(67, 56, 202)
        pdf.set_text_color(255, 255, 255)
        
        pdf.cell(40, 10, 'CVE ID', 1, 0, 'C', True)
        pdf.cell(30, 10, 'Severity', 1, 0, 'C', True)
        pdf.cell(80, 10, 'Description', 1, 0, 'C', True)
        pdf.cell(40, 10, 'Fin. Impact', 1, 1, 'C', True)
        
        # Table Rows
        pdf.set_font('Helvetica', '', 9)
        pdf.set_text_color(0, 0, 0)
        for vuln in report.vulnerabilities:
            # Estimate per-vuln impact (heuristic: value * (severity/10))
            vuln_impact = (report.financial_risk_exposure / len(report.vulnerabilities)) if report.vulnerabilities else 0
            
            pdf.cell(40, 10, vuln.cve_id, 1, 0, 'C')
            pdf.cell(30, 10, str(vuln.severity), 1, 0, 'C')
            
            # Truncated description
            vuln_desc = PDFReportService.clean_text(vuln.description or "N/A")
            desc = (vuln_desc[:45] + '...') if len(vuln_desc) > 45 else vuln_desc
            pdf.cell(80, 10, desc, 1, 0, 'L')
            
            pdf.cell(40, 10, f'Rs. {vuln_impact:,.2f}', 1, 1, 'R')
            
        pdf.ln(10)
        
        # --- Remediation Strategy ---
        if remediation_plan:
            pdf.add_page()
            pdf.set_font('Helvetica', 'B', 16)
            pdf.cell(0, 10, 'Virtual CISO Remediation Strategy', 0, 1, 'L')
            pdf.ln(5)
            pdf.set_font('Helvetica', '', 10)
            pdf.multi_cell(0, 6, remediation_plan)

        # Return as bytes
        return bytes(pdf.output())
