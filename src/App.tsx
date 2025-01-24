import React, { useState } from 'react';
import { Upload, Download, Send } from 'lucide-react';
import axios from 'axios';

import HeaderImage from './3.png';
import LinkedInLogo from './4.png';

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
  type CellData = string | number;

  const [tableData, setTableData] = useState<{ [key: number]: { [column: string]: CellData } }>({});
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

      const _uploadResponse = await axios.post('/api/upload', formData);

      setUploading(false);
      setProcessing(true);

      const processResponse = await axios.get<ProcessResponse>(
        `/api/process/${file.name}?output_format=both`
      );

      setResults(processResponse.data);

      for (let i = 0; i < processResponse.data.tables.length; i++) {
        const table = processResponse.data.tables[i];
        if (table.json_file) {
          const jsonResponse = await axios.get(`/api/download/${table.json_file}`);
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
      const response = await axios.get(`/api/download/${filename}`, {
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
      const response = await axios.post('/api/ask', {
        question: tableQuestion.question,
        table: Object.values(tableData[tableIndex])
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
              src={HeaderImage}
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
                        src={`/api/download/${table.image_file}`}
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
                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ask a Question</label>
                        <input
                          type="text"
                          value={tableQuestions[index]?.question || ''}
                          onChange={(e) => handleQuestionChange(index, e.target.value)}
                          className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={() => handleSubmitQuestion(index)}
                          disabled={loadingQuestions[index]}
                          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md 
                            hover:bg-blue-700 focus:outline-none disabled:opacity-50"
                        >
                          {loadingQuestions[index] ? 'Processing...' : 'Submit Question'}
                        </button>
                        {tableQuestions[index]?.answer && (
                          <div className="mt-4">
                            <strong>Answer:</strong>
                            <p className="text-sm text-gray-800">{tableQuestions[index].answer}</p>
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
      </div>
    </div>
  );
}

export default App;
