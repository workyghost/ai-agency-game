import os
import sys

def extract_text():
    pdf_path = "ai-ajansi-framework-30-musteri-40k-mrr.pdf"
    output_path = "framework_text.txt"
    
    if not os.path.exists(pdf_path):
        print(f"Error: {pdf_path} not found.")
        return
        
    print(f"Attempting to extract text from {pdf_path}...")
    
    # Try pypdf
    try:
        import pypdf
        print("Using pypdf...")
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for i, page in enumerate(reader.pages):
            text += f"\n--- Page {i+1} ---\n"
            text += page.extract_text() or ""
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print("Success with pypdf!")
        return
    except ImportError:
        print("pypdf not available.")
        
    # Try PyPDF2
    try:
        import PyPDF2
        print("Using PyPDF2...")
        reader = PyPDF2.PdfReader(pdf_path)
        text = ""
        for i, page in enumerate(reader.pages):
            text += f"\n--- Page {i+1} ---\n"
            text += page.extract_text() or ""
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print("Success with PyPDF2!")
        return
    except ImportError:
        print("PyPDF2 not available.")

    # Try pdfplumber
    try:
        import pdfplumber
        print("Using pdfplumber...")
        with pdfplumber.open(pdf_path) as pdf:
            text = ""
            for i, page in enumerate(pdf.pages):
                text += f"\n--- Page {i+1} ---\n"
                text += page.extract_text() or ""
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print("Success with pdfplumber!")
        return
    except ImportError:
        print("pdfplumber not available.")

    # Try fitz (PyMuPDF)
    try:
        import fitz
        print("Using fitz...")
        doc = fitz.open(pdf_path)
        text = ""
        for i, page in enumerate(doc):
            text += f"\n--- Page {i+1} ---\n"
            text += page.get_text() or ""
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print("Success with fitz!")
        return
    except ImportError:
        print("fitz not available.")

    # If all fail, let's see if we can use a subprocess or check if we can install one
    print("No standard PDF libraries found. Attempting to install pypdf...")
    import subprocess
    try:
        subprocess.run([sys.executable, "-m", "pip", "install", "pypdf"], check=True)
        # Try again
        import pypdf
        reader = pypdf.PdfReader(pdf_path)
        text = ""
        for i, page in enumerate(reader.pages):
            text += f"\n--- Page {i+1} ---\n"
            text += page.extract_text() or ""
        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)
        print("Success with pypdf after installation!")
        return
    except Exception as e:
        print(f"Failed to install/use pypdf: {e}")

if __name__ == "__main__":
    extract_text()
