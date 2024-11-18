import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ToolsGrid from './components/ToolsGrid'
import Footer from './components/Footer'
import { ThemeProvider } from './context/ThemeContext'
import Calculator from './components/tools/Calculator'
import Converter from './components/tools/Converter'
import Timer from './components/tools/Timer'
import Notes from './components/tools/Notes'
import Weather from './components/tools/Weather'
import Calendar from './components/tools/Calendar'
import PasswordGenerator from './components/tools/PasswordGenerator'
import QRGenerator from './components/tools/QRGenerator'
import ColorTool from './components/tools/ColorTool'
import TextTool from './components/tools/TextTool'
import ImageEditor from './components/tools/ImageEditor'
import CodeFormatter from './components/tools/CodeFormatter'
import MarkdownEditor from './components/tools/MarkdownEditor'
import FileConverter from './components/tools/FileConverter'
import PDFTool from './components/tools/PDFTool'
import URLShortener from './components/tools/URLShortener'
import JSONTool from './components/tools/JSONTool'
import PomodoroTimer from './components/tools/PomodoroTimer'
import DrawingTool from './components/tools/DrawingTool'
import ScreenRecorder from './components/tools/ScreenRecorder'
import Whiteboard from './components/tools/Whiteboard'
import RegexTester from './components/tools/RegexTester'

function HomePage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <div className="bg-gray-50 dark:bg-gray-900">
        <ToolsGrid />
      </div>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tools" element={<ToolsGrid />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/converter" element={<Converter />} />
              <Route path="/timer" element={<Timer />} />
              <Route path="/notes" element={<Notes />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/password" element={<PasswordGenerator />} />
              <Route path="/qr-generator" element={<QRGenerator />} />
              <Route path="/color-tools" element={<ColorTool />} />
              <Route path="/text-tools" element={<TextTool />} />
              <Route path="/image-editor" element={<ImageEditor />} />
              <Route path="/code-formatter" element={<CodeFormatter />} />
              <Route path="/markdown-editor" element={<MarkdownEditor />} />
              <Route path="/file-converter" element={<FileConverter />} />
              <Route path="/pdf-viewer" element={<PDFTool />} />
              <Route path="/url-shortener" element={<URLShortener />} />
              <Route path="/json-tools" element={<JSONTool />} />
              <Route path="/pomodoro" element={<PomodoroTimer />} />
              <Route path="/drawing" element={<DrawingTool />} />
              <Route path="/screen-recorder" element={<ScreenRecorder />} />
              <Route path="/whiteboard" element={<Whiteboard />} />
              <Route path="/regex-tester" element={<RegexTester />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App