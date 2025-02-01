 ![3](https://github.com/user-attachments/assets/40803f67-fc2d-4b14-bdf3-f98b73472cf6)




PDF’den coplex tabloların CSV-JSON çıkarımı -  AI Web Uygulaması
PDF belgelerinizdeki karmaşık tabloları otomatik olarak çıkarın ve temiz, kullanıma hazır CSV veya JSON formatına dönüştürün. Gelişmiş AI ile desteklenen bu uygulama, veri çıkarım sürecini kolaylaştırır.

🚀  Öne Çıkan Özellikler 
AI Destekli Çıkarım: Karmaşık PDF tablolarını yüksek doğrulukla işler.
Kullanıcı Dostu Arayüz: PDF yükleyin, sayfa seçin ve anında CSV-JSON olarak indirin.
Akıllı Hata Yönetimi: Temiz ve güvenilir çıktılar sunar.
Güçlü Entegrasyonlar: Hugging Face modelleri, Camelot kütüphanesi ve vektör veritabanı desteği.
🔧 Teknoloji Yığını
Backend: Python (FastAPI), Hugging Face Transformers
Frontend: React.js
PDF İşleme: gmft, PyPDF2
Veritabanı: PostgreSQL
AI Özellikleri: Özel NER ve özetleme modelleri
🛠 Kullanım Senaryoları
Karmaşık Tablo Çıkarımı

İç içe geçmiş başlıklar, birleştirilmiş hücreler gibi yapıları doğru işler.
Finansal raporlar, akademik çalışmalar ve resmi belgeler için uygundur.
RAG (Bilgiye Dayalı AI) Entegrasyonu




##  Kurulum Adımları

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

### 3️⃣ API'yi Çalıştırın

API kodları `api` klasöründe yer almaktadır. Terminalden `api` klasörüne gidin ve FastAPI uygulamasını başlatın:

```bash
cd ../api
uvicorn main:app --reload
```

### 4️⃣ Frontend'i Çalıştırın

Frontend kodları `src` klasöründe bulunmaktadır. Terminalden `src` klasörüne gidin ve aşağıdaki komutu çalıştırın:

```bash
cd src
npm install
npm run dev
```

Komut çalıştıktan sonra terminalde aşağıdaki gibi bir çıktı alacaksınız:

```
➜  Local:   http://localhost:port/
```

Terminalde [http://localhost:port/](http://localhost:port/) adresine tıklayarak uygulamayı web üzerinde görüntüleyebilirsiniz.


## ⚠️ Önemli Uyarılar

- ** PDF Yüklemeleri:**  
  Yüklediğiniz PDF dosyaları yerel dizinde `uploads` klasörüne kaydedilecektir.

- ** Çıktılar:**  
  İşlenen PDF dosyalarından elde edilen çıktılar `outputs` klasörüne kaydedilir. Bu klasörün oluşturulduğundan ve yazma izinlerinin mevcut olduğundan emin olun.

- ** CORS Hatası:**  
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
 ....


- **Modeller:**  
   gmft : https://github.com/conjuncts/gmft  ve pandasai

---

Herhangi bir sorun yaşarsanız, lütfen GitHub Issues üzerinden bildirin.


