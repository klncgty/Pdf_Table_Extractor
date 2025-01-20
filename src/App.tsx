import React, { useState } from 'react';
import { Upload, Download, Send } from 'lucide-react';
import axios from 'axios';

interface ProcessedTable {
  data_file?: string;
  json_file?: string;
  csv_file?: string;
  image_file: string;
}

interface ProcessResponse {
  tables: ProcessedTable[];
  total_tables: number;
}

interface TableQuestion {
  question: string;
  answer: string | null;
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ProcessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [tableQuestions, setTableQuestions] = useState<{ [key: number]: TableQuestion }>({});
  const [tableData, setTableData] = useState<{ [key: number]: any }>({});
  const [loadingQuestions, setLoadingQuestions] = useState<{ [key: number]: boolean }>({});

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a PDF file');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const uploadResponse = await axios.post('http://localhost:8000/upload', formData);

      setUploading(false);
      setProcessing(true);

      const processResponse = await axios.get<ProcessResponse>(
        `http://localhost:8000/process/${file.name}?output_format=both`
      );

      setResults(processResponse.data);

      // Load JSON data for each table
      for (let i = 0; i < processResponse.data.tables.length; i++) {
        const table = processResponse.data.tables[i];
        if (table.json_file) {
          const jsonResponse = await axios.get(`http://localhost:8000/download/${table.json_file}`);
          setTableData(prev => ({
            ...prev,
            [i]: jsonResponse.data
          }));
        }
      }
    } catch (err) {
      setUploading(false);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setProcessing(false);
    }
  };
  

  const handleDownload = async (filename: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/download/${filename}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Download failed');
    }
  };

  const handleQuestionChange = (tableIndex: number, value: string) => {
    setTableQuestions(prev => ({
      ...prev,
      [tableIndex]: {
        question: value,
        answer: null
      }
    }));
  };

  const handleSubmitQuestion = async (tableIndex: number) => {
    const tableQuestion = tableQuestions[tableIndex];
    if (!tableQuestion?.question || !tableData[tableIndex]) return;

    setLoadingQuestions(prev => ({ ...prev, [tableIndex]: true }));

    try {
      console.log('Sending request with:', {
        question: tableQuestion.question,
        table: tableData[tableIndex]
      });
      
      const response = await axios.post('http://localhost:8000/ask', {
        question: tableQuestion.question,
        table: Array.isArray(tableData[tableIndex]) 
          ? tableData[tableIndex] 
          : [tableData[tableIndex]] // Ensure table data is an array
      });

      setTableQuestions(prev => ({
        ...prev,
        [tableIndex]: {
          ...prev[tableIndex],
          answer: response.data.answer
        }
      }));
    } catch (err) {
      console.error('Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to get answer');
    } finally {
      setLoadingQuestions(prev => ({ ...prev, [tableIndex]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white text-gray-800 rounded-lg shadow-xl p-8 mb-8">
          <div className="mb-6">
            <img
              src="src/3.png"
              alt="Header Image"
              className="w-full h-auto rounded-lg shadow-md mb-4"
            />
            <p className="text-center text-gray-600">Kompleks tablolar içeren PDF yükle ve tabloları kolayca csv ve json olarak indir</p>
          </div>

          <div className="mb-8">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              Upload PDF File
            </label>
            <div className="flex items-center gap-4">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-blue-50 file:text-blue-700
                  hover:file:bg-blue-100 transition duration-300"
              />
              <button
                onClick={handleUpload}
                disabled={!file || uploading || processing}
                className="inline-flex items-center px-6 py-3 border border-transparent
                  text-base font-medium rounded-full shadow-sm text-white bg-blue-600 
                  hover:bg-blue-700 focus:outline-none focus:ring-2 
                  focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50
                  transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <Upload className="w-5 h-5 mr-2" />
                {uploading ? 'Uploading...' : processing ? 'Processing...' : 'Generate Tables'}
              </button>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8 rounded-r-lg">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {results && (
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {results.total_tables} tables processed
              </h2>
              <div className="space-y-8">
                {results.tables.map((table, index) => (
                  <div key={index} className="border rounded-lg p-6 shadow-md bg-gray-50">
                    <h3 className="text-xl font-semibold mb-4 text-gray-900">Table {index + 1}</h3>
                    <div className="grid grid-cols-1 gap-6">
                      <img
                        src={`http://localhost:8000/download/${table.image_file}`}
                        alt={`Table ${index + 1}`}
                        className="max-w-full h-auto rounded-lg shadow-sm border border-gray-200"
                      />
                      <div className="flex gap-4">
                        {table.json_file && (
                          <button
                            onClick={() => handleDownload(table.json_file!)}
                            className="flex items-center text-sm px-4 py-2 bg-green-500 text-white 
                              rounded-full hover:bg-green-600 transition duration-300"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download JSON
                          </button>
                        )}
                        {table.csv_file && (
                          <button
                            onClick={() => handleDownload(table.csv_file!)}
                            className="flex items-center text-sm px-4 py-2 bg-purple-500 text-white 
                              rounded-full hover:bg-purple-600 transition duration-300"
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download CSV
                          </button>
                        )}
                      </div>

                      {/* Question and Answer Section for each table */}
                      <div className="mt-6 space-y-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={tableQuestions[index]?.question || ''}
                            onChange={(e) => handleQuestionChange(index, e.target.value)}
                            className="flex-1 p-3 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            placeholder={"Tablo " + (index + 1) + "'e bir soru sorun"}

                          />
                          <button
                            onClick={() => handleSubmitQuestion(index)}
                            disabled={!tableData[index] || loadingQuestions[index]}
                            className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 transition duration-300 flex items-center"
                          >
                            {loadingQuestions[index] ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading...
                              </>
                            ) : (
                              <>
                                <Send className="w-4 h-4 mr-2" />
                                Sor
                              </>
                            )}
                          </button>
                        </div>
                        
                        {/* Display answer if exists */}
                        {tableQuestions[index]?.answer && (
                          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <p className="font-medium text-blue-800 mb-2">Cevap:</p>
                            <p className="text-blue-700">{tableQuestions[index].answer}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* LinkedIn Logo */}
        <div className="fixed bottom-4 right-4">
          <a
            href="https://www.linkedin.com/in/klncgty/"
            target="_blank"
            rel="noopener noreferrer"
            className="transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110"
          >
            <img
              src="src/4.png"
              alt="LinkedIn Logo"
              className="w-12 h-12 rounded-full shadow-lg"
            />
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;

