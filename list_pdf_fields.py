import fitz
import sys

def list_fields(pdf_path):
    doc = fitz.open(pdf_path)
    for page in doc:
        for field in page.widgets():
            print(f"Field: {field.field_name}, Type: {field.field_type}, Value: {field.field_value}")

if __name__ == "__main__":
    list_fields(sys.argv[1])
