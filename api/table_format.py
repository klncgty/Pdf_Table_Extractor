import importlib
import gmft
import gmft.table_detection
import gmft.table_visualization
import gmft.table_function
import gmft.table_function_algorithm
import gmft.table_captioning
import gmft.pdf_bindings.bindings_pdfium
import gmft.pdf_bindings
import gmft.common
import matplotlib.pyplot as plt
import os
import json
from gmft import AutoTableFormatter
from gmft.detectors.tatr import TATRDetector
from gmft.formatters.common import FormattedTable, TableFormatter
from gmft.table_visualization import display_html_and_image
from gmft.auto import AutoFormatConfig

from gmft.pdf_bindings import PyPDFium2Document
from gmft.auto import CroppedTable, AutoTableDetector
from PIL import Image

importlib.reload(gmft)
importlib.reload(gmft.common)
importlib.reload(gmft.table_captioning)
importlib.reload(gmft.table_detection)
importlib.reload(gmft.table_visualization)
importlib.reload(gmft.table_function)
importlib.reload(gmft.table_function_algorithm)
importlib.reload(gmft.pdf_bindings.bindings_pdfium)
importlib.reload(gmft.pdf_bindings)


detector = AutoTableDetector()
config_hdr = AutoFormatConfig() # config may be passed like so
config_hdr.verbosity = 3
config_hdr.enable_multi_header = True
config_hdr.semantic_spanning_cells = True 
formatter = AutoTableFormatter()



class PDFTableProcessor:
    def __init__(self, pdf_path):
        self.pdf_path = pdf_path
        self.config_hdr = config_hdr
        self.tables, _ = self.ingest_pdf(pdf_path)
        self.total_tables = len(self.tables)

    def ingest_pdf(self, pdf_path) -> list:
        doc = PyPDFium2Document(pdf_path)

        tables = []
        for page in doc:
            tables += detector.extract(page)
        return tables, doc

    def tablo_sayisi(self, input_path):
        tables, doc = self.ingest_pdf(input_path)
        return len(tables)
    


    def save_as_json(self,df, output_dir, table_index):
        """DataFrame'i JSON formatında kaydeder."""
        json_output = df.to_json(orient='records', force_ascii=False)
        os.makedirs(output_dir, exist_ok=True)
        output_file = os.path.join(output_dir, f'output_{table_index}.json')
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(json.loads(json_output), f, ensure_ascii=False, indent=4)
        print(f"JSON dosyası {output_file} olarak kaydedildi.")
        return output_file

    def save_as_csv(self,df, output_dir, table_index):
        """DataFrame'i CSV formatında kaydeder."""
        os.makedirs(output_dir, exist_ok=True)
        output_file = os.path.join(output_dir, f'output_{table_index}.csv')
        df.to_csv(output_file, index=False, encoding='utf-8-sig')
        print(f"CSV dosyası {output_file} olarak kaydedildi.")
        return output_file

    def process_single_table(self, table_index, output_format='json'):
        """
        Args:
            table_index (int): İşlenecek tablonun indeksi.
            output_format (str): 'json', 'csv' veya her ikisini de belirlemek için 'both'.
        """
        ft = formatter.extract(self.tables[table_index], margin='auto', padding=None)
        image = ft.visualize()
        output_dir = 'outputs'
        os.makedirs(output_dir, exist_ok=True)
        image_output_path = os.path.join(output_dir, f'table_{table_index}.png')
        image.save(image_output_path)
        print(f"Görsel dosyası {image_output_path} olarak kaydedildi.")

        df = ft.df(config_overrides=config_hdr).fillna("")
        df.columns = [
            f"{col}_{i}" if df.columns.tolist().count(col) > 1 else col 
            for i, col in enumerate(df.columns)
        ]

        if output_format == 'json':
            json_file = self.save_as_json(df, output_dir, table_index)
            return json_file, image_output_path
        elif output_format == 'csv':
            csv_file = self.save_as_csv(df, output_dir, table_index)
            return csv_file, image_output_path
        elif output_format == 'both':
            json_file = self.save_as_json(df, output_dir, table_index)
            csv_file = self.save_as_csv(df, output_dir, table_index)
            return json_file, csv_file, image_output_path
        else:
            raise ValueError("Geçersiz output_format. 'json', 'csv' veya 'both' olmalı.")

    def process_tables(self, output_format):
        for idx in range(self.total_tables):
            yield self.process_single_table(idx, output_format)


if __name__ == "__main__":
    pdf_path = input("Lütfen PDF dosyasının tam yolunu girin: ")


    processor = PDFTableProcessor(pdf_path)
    output_format = input("Lütfen formatı girin (json, csv, both): ")
    table_processor = processor.process_tables(output_format=output_format)

    for table_file, image_file in table_processor:
        print(f"İşlenen dosya: {table_file}")
        print(f"Görsel dosyası: {image_file}")
        input("Sonraki tabloyu işlemek için Enter'a basın...")