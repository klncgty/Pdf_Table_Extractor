from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from typing import List,Union, Dict, Any
import os
import shutil
from table_format import PDFTableProcessor
from pydantic import BaseModel


class QuestionRequest(BaseModel):
        question: Union[str, int, float]
        table: Union[str, Dict[str, Any], List[Dict[str, Any]]]
        
app = FastAPI(title="PDF Table Processor API")

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create necessary directories
os.makedirs("uploads", exist_ok=True)
os.makedirs("outputs", exist_ok=True)

@app.post("/upload")
async def upload_pdf(file: UploadFile):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="Only PDF files are allowed")
    
    file_path = f"uploads/{file.filename}"
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
            
        return {"filename": file.filename, "status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/process/{filename}")
async def process_pdf(filename: str, output_format: str = "json"):
    if output_format not in ["json", "csv", "both"]:
        raise HTTPException(status_code=400, detail="Invalid output format")
    
    file_path = f"uploads/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        processor = PDFTableProcessor(file_path)
        results = []
        
        for result in processor.process_tables(output_format):
            if output_format == "both":
                json_file, csv_file, image_file = result
                results.append({
                    "json_file": os.path.basename(json_file),
                    "csv_file": os.path.basename(csv_file),
                    "image_file": os.path.basename(image_file)
                })
            else:
                data_file, image_file = result
                results.append({
                    "data_file": os.path.basename(data_file),
                    "image_file": os.path.basename(image_file)
                })
        
        return {"tables": results, "total_tables": processor.total_tables}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = f"outputs/{filename}"
    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")
    return FileResponse(file_path)

@app.post("/ask")
async def ask_question(request: QuestionRequest):
    try:
        print("Received request:", request.model_dump_json())
        
        from q_a import ask_question
        print("-----------------")
        print("-----------------")
        print("-----------------")
        print("-----------------")
        print(request.table)
        answer = ask_question(request.question, request.table)
        return {"answer": answer}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)