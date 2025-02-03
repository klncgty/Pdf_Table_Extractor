import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Upload, Download, Send, FileUp, Sparkles, ArrowRight, Coffee } from 'lucide-react';
import axios from 'axios';

// Landing Page Component
const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Sparkles className="w-24 h-24 text-blue-500 mx-auto mb-8 animate-pulse" />
        <h1 className="text-7xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-500 to-lime-600 mb-6 animate-fade-in [animation-delay:500ms] opacity-0">
          pdfXtractor
        </h1>
        <h1 className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-red-600 mb-6 shadow-lg animate-fade-in [animation-delay:1000ms] opacity-0">
          AI-Powered PDF Processing
        </h1>
        <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto animate-fade-in [animation-delay:1500ms] opacity-0">
          Transform your PDF documents into actionable data with advanced AI processing.
        </p>
        <Link
          to="/process"
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-lg font-medium transition-colors animate-fade-in [animation-delay:2000ms] opacity-0"
        >
          Get Started
        </Link>
        
        {/* Added GIF section */}
        <video  autoPlay loop muted mediaGroup='false' className="mt-8 w-full max-w-3xl mx-auto">
          <source src="/0203.mp4" type="video/mp4" />
        </video>
      </main>
    </div>
  );
};

// PDF Processing Page Component
const ProcessPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [processing, setProcessing] = useState(false);
  const [results, setResults] = useState<ProcessResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [tableQuestions, setTableQuestions] = useState<{ [key: number]: TableQuestion }>({});
  const [tableData, setTableData] = useState<{ [key: number]: any }>({});
  const [loadingQuestions, setLoadingQuestions] = useState<{ [key: number]: boolean }>({});
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setError(null);
    }
  };

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
      const response = await axios.post('http://localhost:8000/ask', {
        question: tableQuestion.question,
        table: Array.isArray(tableData[tableIndex]) 
          ? tableData[tableIndex] 
          : [tableData[tableIndex]]
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
    <div className="min-h-screen bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A]">
      <nav className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center">
              <Sparkles className="w-8 h-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-white">pdfXtractor</span>
            </Link>
            <div className="flex items-center gap-6">
              <a
                href="https://buymeacoffee.com/cgtyklnc1t"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-amber-400 transition-colors flex items-center gap-2"
              >
                <Coffee className="w-5 h-5" />
                <span>buy me cup of coffee :)</span>
              </a>
              <a
                href="https://github.com/klncgty"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!results ? (
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight overflow-hidden">
                <span className="animate-slide-in-left-right inline-block [animation-delay:500ms]">
                  Transform Your PDF Tables
                </span>{' '}
                <span className="animate-slide-in-right-left inline-block [animation-delay:800ms]">
                  with AI
                </span>
              </h1>
              <p className="text-xl text-gray-400 mb-8">
                Extract, analyze, and get insights from your PDF tables instantly
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/10">
              <div className="flex flex-col items-center">
                <div className="mb-8">
                  <div className="p-4 bg-blue-500/10 rounded-full">
                    <FileUp className="w-8 h-8 text-blue-500" />
                  </div>
                </div>

                <div 
                  className={`w-full border-2 border-dashed rounded-xl p-8 mb-6 text-center
                    ${dragActive ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 hover:border-white/20'}
                    transition-all duration-200`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                  />
                  <label 
                    htmlFor="file-upload"
                    className="cursor-pointer"
                  >
                    <p className="text-gray-400">
                      {file ? file.name : 'Drop your PDF here or click to browse'}
                    </p>
                  </label>
                </div>

                <button
                  onClick={handleUpload}
                  disabled={!file || uploading || processing}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 
                    hover:to-blue-800 disabled:from-blue-800 disabled:to-blue-900 disabled:cursor-not-allowed 
                    rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2"
                >
                  {uploading ? 'Uploading...' : processing ? 'Processing...' : (
                    <>
                      Process Tables
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {error && (
                  <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl w-full">
                    <p className="text-red-400 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Upload className="w-6 h-6 text-blue-500" />,
                  title: 'Easy Upload',
                  description: 'Drag & drop your PDF files or browse to upload'
                },
                {
                  icon: <Sparkles className="w-6 h-6 text-purple-500" />,
                  title: 'AI-Powered',
                  description: 'Advanced AI processing for accurate table extraction'
                },
                {
                  icon: <Download className="w-6 h-6 text-green-500" />,
                  title: 'Multiple Formats',
                  description: 'Download results in JSON or CSV format'
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                  <div className="p-3 bg-white/5 rounded-lg inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-white text-center mb-8">
              Processed Tables ({results.total_tables})
            </h2>
            
            {results.tables.map((table, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10">
                <h3 className="text-xl font-semibold mb-6 text-white">Table {index + 1}</h3>
                <div className="space-y-6">
                  <img
                    src={`http://localhost:8000/download/${table.image_file}`}
                    alt={`Table ${index + 1}`}
                    className="w-full rounded-lg border border-white/10"
                  />
                  
                  <div className="flex gap-4">
                    {table.json_file && (
                      <button
                        onClick={() => handleDownload(table.json_file!)}
                        className="flex items-center px-4 py-2 bg-green-500/20 hover:bg-green-500/30 
                          text-green-400 rounded-lg transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        JSON
                      </button>
                    )}
                    {table.csv_file && (
                      <button
                        onClick={() => handleDownload(table.csv_file!)}
                        className="flex items-center px-4 py-2 bg-purple-500/20 hover:bg-purple-500/30 
                          text-purple-400 rounded-lg transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        CSV
                      </button>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={tableQuestions[index]?.question || ''}
                        onChange={(e) => handleQuestionChange(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-black/20 border border-white/10 rounded-lg
                          focus:outline-none focus:border-blue-500/50 text-white placeholder-gray-500"
                        placeholder="Ask a question about this table..."
                      />
                      <button
                        onClick={() => handleSubmitQuestion(index)}
                        disabled={!tableData[index] || loadingQuestions[index]}
                        className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400
                          disabled:bg-blue-500/10 disabled:text-blue-500/50 disabled:cursor-not-allowed 
                          rounded-lg transition-colors duration-200 flex items-center"
                      >
                        {loadingQuestions[index] ? (
                          <Upload className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    
                    {tableQuestions[index]?.answer && (
                      <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <p className="text-blue-300">{tableQuestions[index].answer}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

// Interfaces
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

// Main App Component
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/process" element={<ProcessPage />} />
      </Routes>
    </Router>
  );
}

export default App;
