from setuptools import setup, find_packages

setup(
    name="pdf_table_processor",  # Paket adı
    author='Çağatay',
    description='A library to process tables from PDFs into csv and json formats.',
    author_email='cgtyklnc@gmail.com',
    url='https://github.com/klncgty/Pdf_Table_Extractor',
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "fastapi",
        "uvicorn",
        "pandas",
        "pandasai",
        "gmft",
        "matplotlib",
        "pillow",
        "PyPDF2",
        "torch",
    ],
    entry_points={
        'console_scripts': [
            'pdf-table-processor = api.main:main',  # Komut satırı aracı
        ],
    },
)
