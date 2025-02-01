 ![3](https://github.com/user-attachments/assets/40803f67-fc2d-4b14-bdf3-f98b73472cf6)



PDF-to-CSV-JSON AI Web Application
Effortlessly extract structured complex data tables from your PDF documents and convert it into clean, ready-to-use CSV or JSON files. Powered by cutting-edge AI and optimized for real-world use cases, this application simplifies data extraction like never before.

🚀 Features
AI-Driven Extraction: Intelligent algorithms ensure accurate data parsing from PDFs, even for complex layouts.
User-Friendly Interface: Upload your PDF, specify the target pages, and receive a downloadable CSV-JSON in seconds.
Advanced Error Handling: Ensures clean outputs with minimal data loss.
Powerful Integrations: Built with support for Hugging Face models, Camelot library, and vector databases.
🔧 Tech Stack
Backend: Python (FastAPI), Hugging Face Transformers
Frontend: React.js
PDF Processing: gmft, PyPDF2
Database: PostgreSQL
AI Features: Custom NER and summarization models


Use Cases
This application is tailored to handle real-world scenarios where accurate and efficient PDF data extraction is critical. Here are some specific use cases:

1. Complex Table Extraction
Extract intricate and multi-layered tables from PDFs with precision.
Handle nested headers, merged cells, and irregular column structures seamlessly.
Ideal for financial reports, research papers, and government data with complex tabular layouts.
2. RAG (Retrieval-Augmented Generation) Integration
Transform extracted data into structured formats for use in AI workflows.
Use the generated CSVs to power retrieval-based systems like chatbots, summarization tools, or decision-support applications.
Streamline document-based knowledge retrieval pipelines.
3. Large-Scale Data Processing
Process bulk PDF uploads for large-scale data extraction needs.
Generate clean CSV outputs for integration into analytics platforms or machine learning pipelines.
4. Business Intelligence
Enable data teams to quickly extract actionable insights from complex PDF reports.
Use the structured CSV outputs for dashboards, reports, and predictive modeling.
5. Automation in Operations
Automate repetitive data extraction tasks to save time and reduce manual errors.
Useful for industries such as logistics (invoice processing), healthcare (patient reports), and legal (contract analysis).
6. Compliance and Audit
Extract key financial or operational metrics for regulatory compliance and audits.
Ensure data integrity by minimizing human intervention during the extraction process.
7. Document Summarization and Analysis
Leverage the extracted data to build summaries or generate insights using advanced AI models.
Suitable for simplifying decision-making processes in research or business contexts.


## 🚀 Kurulum Adımları

### 1️⃣ Repoyu Klonlayın

Terminal veya komut istemcisinde aşağıdaki komutu çalıştırarak repoyu kendi bilgisayarınıza çekin:

```bash
git clone https://github.com/klncgty/pdfXtractor.git
```

### 2️⃣ Python Gereksinimlerini Yükleyin

Projede yer alan API için gerekli Python paketlerini yüklemek üzere, projenin kök dizininde bulunan `requirements.txt` dosyasını kullanın:

```bash
pip install -r requirements.txt
```

### 3️⃣ Frontend'i Çalıştırın

Frontend kodları `src` klasöründe bulunmaktadır. Terminalden `src` klasörüne gidin ve aşağıdaki komutu çalıştırın:

```bash
cd src
npm install
npm run dev
```

Komut çalıştıktan sonra terminalde aşağıdaki gibi bir çıktı alacaksınız:

```
➜  Local:   http://localhost:5173/
```

Tarayıcınızda [http://localhost:5173/](http://localhost:5173/) adresine tıklayarak uygulamayı web üzerinde görüntüleyebilirsiniz.

### 4️⃣ API'yi Çalıştırın

API kodları `api` klasöründe yer almaktadır. Terminalden `api` klasörüne gidin ve FastAPI uygulamasını başlatın:

```bash
cd ../api
uvicorn main:app --reload
```

## ⚠️ Önemli Uyarılar

- **📂 PDF Yüklemeleri:**  
  Yüklediğiniz PDF dosyaları yerel dizinde `uploads` klasörüne kaydedilecektir.

- **📁 Çıktılar:**  
  İşlenen PDF dosyalarından elde edilen çıktılar `outputs` klasörüne kaydedilir. Bu klasörün oluşturulduğundan ve yazma izinlerinin mevcut olduğundan emin olun.

- **🌐 CORS Hatası:**  
  Eğer tarayıcıda aşağıdaki gibi bir hata alırsanız:

  ```
  Access to XMLHttpRequest at 'http://localhost:8000/upload' from origin 'http://localhost:5173' has been blocked by CORS policy
  ```

  `api/main.py` dosyasında aşağıdaki gibi `allow_origins=["*"]` ekleyerek sorunu çözebilirsiniz:

  ```python
  from fastapi.middleware.cors import CORSMiddleware

  app.add_middleware(
      CORSMiddleware,
      allow_origins=["*"],  # Tüm domainlere izin verir
      allow_credentials=True,
      allow_methods=["*"],
      allow_headers=["*"],
  )
  ```

## 📌 Ek Bilgiler

- **Frontend ve API İletişimi:**  
  Frontend, API ile etkileşimde bulunarak PDF dosyalarını yükler ve işler. Her iki tarafın da aynı anda çalıştığından emin olun.

- **Geliştirme:**  
  Projeye katkıda bulunmadan önce, lütfen [Git Branch Rehberi](https://www.atlassian.com/git/tutorials/using-branches)'ni inceleyin.

---

🎉 Artık projeyi kendi bilgisayarınızda çalıştırmaya hazırsınız! Herhangi bir sorun yaşarsanız, lütfen GitHub Issues üzerinden bildirin.


