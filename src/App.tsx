/**
 * EIM Training Report Generator
 * Version: report v1
 * Features: Performance Radar Charts, Teacher Feedback, Project Gallery, Letter-size PDF Export.
 */
import React, { useState, useMemo, useRef } from 'react';
import { 
  Chart as ChartJS, 
  RadialLinearScale, 
  PointElement, 
  LineElement, 
  Filler, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Radar as ChartJSRadar } from 'react-chartjs-2';
import { 
  User, 
  Mail, 
  Calendar, 
  BookOpen, 
  CheckCircle2, 
  Image as ImageIcon, 
  BarChart3, 
  MessageSquare, 
  Download,
  Plus,
  X,
  GraduationCap,
  Camera
} from 'lucide-react';
// @ts-ignore
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const PROJECTS = {
  'Arduino Basic Circuit': [
    'Master fundamental electronic components and basic circuit principles.',
    'Learn breadboard prototyping techniques and circuit analysis.',
    'Understand and measure electrical parameters (voltage, current, resistance).',
    'Build and troubleshoot simple circuits including LED controls and sensors.'
  ],
  'Microcontroller Game Console': [
    'Master fundamental electronic components, circuit analysis, and diagnostic techniques.',
    'Proficient application of technical tools, including multimeters and breadboards for rapid prototyping.',
    'Understand microcontroller architecture, GPIO configuration, and peripheral communication.',
    'Develop core programming skills using MicroPython for efficient hardware control and system logic.',
    'Enhance advanced debugging strategies and real-world system troubleshooting.',
    'Integrate multiple hardware modules into a fully functional handheld game console system.'
  ],
  'ESP32 AIoT Project': [
    'Develop proficiency in Wi-Fi and Bluetooth wireless communication protocols.',
    'Master techniques for interfacing embedded systems with cloud-based IoT platforms.',
    'Implement real-time remote monitoring and control systems through web/mobile interfaces.',
    'Explore IoT architecture, cloud data synchronization, and automated system triggers.'
  ],
  'Analog Circuit Experiment': [
    'Investigate the principles of transistor amplification and analog signal processing.',
    'Master the design and application of operational amplifiers in various configurations.',
    'Perform professional signal analysis using oscilloscopes and waveform generators.',
    'Analyze and optimize analog signal paths for high-fidelity technical performance.'
  ],
  'Custom Project': []
};

const SKILLS = [
  'Circuit Building',
  'Breadboard Prototyping',
  'Microcontroller',
  'Programming',
  'Sensor Integration',
  'Debugging',
  'Problem Solving',
  'System Thinking',
  'Hardware Assembly',
  'Technical Communication'
];

const CONCEPTS = [
  "Ohm's Law",
  "Series & Parallel Circuits",
  "Digital vs Analog",
  "IoT Architecture",
  "Microcontroller Logic",
  "Signal Processing",
  "Wireless Communication",
  "Sensor Calibration",
  "Voltage Dividers",
  "PWM Control"
];

const TRAINING_NAMES = [
  'Fundamental Circuit and Microcontroller',
  'Custom Training Name'
];

export default function App() {
  const [studentName, setStudentName] = useState('');
  const [studentEmail, setStudentEmail] = useState('');
  const [teacherName, setTeacherName] = useState('');
  const [teacherEmail, setTeacherEmail] = useState('');
  const [trainingDate, setTrainingDate] = useState(new Date().toISOString().split('T')[0]);
  const [classNumber, setClassNumber] = useState('');
  
  const [selectedTrainingName, setSelectedTrainingName] = useState(TRAINING_NAMES[0]);
  const [customTrainingName, setCustomTrainingName] = useState('');
  const [selectedProject, setSelectedProject] = useState('Arduino Basic Circuit');
  const [customProjectName, setCustomProjectName] = useState('');
  const [customObjectives, setCustomObjectives] = useState('');
  
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedConcepts, setSelectedConcepts] = useState<string[]>([]);
  const [customSkill, setCustomSkill] = useState('');
  const [customConcept, setCustomConcept] = useState('');
  const [images, setImages] = useState<(string | null)[]>([null, null, null, null, null, null]);
  const [imageCaptions, setImageCaptions] = useState<string[]>(['', '', '', '', '', '']);
  const [feedback, setFeedback] = useState('');
  const [highlight, setHighlight] = useState('');
  const [challenge, setChallenge] = useState('');
  const [lessonOverview, setLessonOverview] = useState('');
  const [homework, setHomework] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportRef = useRef<HTMLDivElement>(null);
  const hiddenReportRef = useRef<HTMLDivElement>(null);

  const objectives = useMemo(() => {
    if (selectedProject === 'Custom Project') {
      return customObjectives.split('\n').filter(o => o.trim() !== '');
    }
    return PROJECTS[selectedProject as keyof typeof PROJECTS] || [];
  }, [selectedProject, customObjectives]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleConceptToggle = (concept: string) => {
    setSelectedConcepts(prev => 
      prev.includes(concept) ? prev.filter(s => s !== concept) : [...prev, concept]
    );
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !selectedSkills.includes(customSkill.trim())) {
      setSelectedSkills(prev => [...prev, customSkill.trim()]);
      setCustomSkill('');
    }
  };

  const addCustomConcept = () => {
    if (customConcept.trim() && !selectedConcepts.includes(customConcept.trim())) {
      setSelectedConcepts(prev => [...prev, customConcept.trim()]);
      setCustomConcept('');
    }
  };

  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImages = [...images];
        newImages[index] = reader.result as string;
        setImages(newImages);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages[index] = null;
    setImages(newImages);
    
    const newCaptions = [...imageCaptions];
    newCaptions[index] = '';
    setImageCaptions(newCaptions);
  };

  const generatePDF = async () => {
    const element = showPreview ? reportRef.current : hiddenReportRef.current;
    if (!element) return;

    setIsGenerating(true);
    try {
      // Create a temporary clone for measuring or use explicit window dimensions in html2canvas
      const originalScrollPos = window.scrollY;
      window.scrollTo(0, 0); // Reset scroll to avoid offset issues

      // Wait for fonts and a small buffer for layout stabilization
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'letter'
      });

      const pages = element.querySelectorAll('.report-page');
      
      for (let i = 0; i < pages.length; i++) {
        const page = pages[i] as HTMLElement;
        
        const canvas = await html2canvas(page, {
          scale: 4, // Increased scale for even better clarity
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          windowWidth: 1200, 
          windowHeight: 1600,
          width: 816, 
          height: 1056, 
          onclone: (clonedDoc) => {
            const clonedPage = clonedDoc.querySelectorAll('.report-page')[i] as HTMLElement;
            if (clonedPage) {
              clonedPage.style.display = 'flex';
              clonedPage.style.flexDirection = 'column';
              clonedPage.style.width = '215.9mm';
              clonedPage.style.height = '279.4mm';
              clonedPage.style.padding = '16mm';
              clonedPage.style.boxSizing = 'border-box';
              clonedPage.style.transform = 'none';
              clonedPage.style.position = 'relative';
              clonedPage.style.left = '0';
              clonedPage.style.top = '0';
              
              const images = clonedPage.querySelectorAll('img');
              images.forEach(img => {
                img.style.maxWidth = 'none';
              });
            }
          }
        });
        
        // Use PNG for the internal capture to eliminate compression artifacts
        const imgData = canvas.toDataURL('image/png');
        
        if (i > 0) pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, 0, 215.9, 279.4, undefined, 'SLOW');
      }

      pdf.save(`EIM_Report_${studentName.replace(/\s+/g, '_') || 'Student'}.pdf`);
      window.scrollTo(0, originalScrollPos); // Restore scroll
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('Failed to generate PDF. Please check your data or try using a desktop browser if this persists.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateImage = async () => {
    const element = showPreview ? reportRef.current : hiddenReportRef.current;
    if (!element) return;

    setIsGenerating(true);
    try {
      await document.fonts.ready;
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        width: element.offsetWidth,
        height: element.offsetHeight
      });

      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const link = document.createElement('a');
      link.download = `EIM_Report_${studentName || 'Student'}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F9FC] py-12 px-4 sm:px-6 lg:px-8 font-sans text-slate-900">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <img 
              src="https://raw.githubusercontent.com/Terback/Images/main/logo/icon_darkblue.png" 
              alt="EIM Technology Logo" 
              className="h-16 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900">EIM Training Report</h1>
          <p className="text-slate-500 text-lg">Generate professional student training evaluations</p>
        </div>

        {/* Form Sections */}
        <div className="space-y-6">
          {/* Section 1: Student Information */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Student Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Student Name</label>
                <input 
                  type="text" 
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Student Email</label>
                <input 
                  type="email" 
                  value={studentEmail}
                  onChange={(e) => setStudentEmail(e.target.value)}
                  placeholder="student@example.com"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Teacher Name</label>
                <input 
                  type="text" 
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  placeholder="Enter teacher name"
                  className="input-field"
                />
              </div>
              <div>
                <label className="label">Teacher Email</label>
                <input 
                  type="email" 
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  placeholder="teacher@example.com"
                  className="input-field"
                />
              </div>
              <div className="md:col-span-1">
                <label className="label">Training Date</label>
                <input 
                  type="date" 
                  value={trainingDate}
                  onChange={(e) => setTrainingDate(e.target.value)}
                  className="input-field"
                />
              </div>
              <div className="md:col-span-1">
                <label className="label">Class Number</label>
                <input 
                  type="text" 
                  value={classNumber}
                  onChange={(e) => setClassNumber(e.target.value)}
                  placeholder="e.g. Class 1 / 20"
                  className="input-field"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Training Information */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Training Information</h2>
            </div>
            <div className="space-y-6">
              <div>
                <label className="label">Training Name</label>
                <select 
                  value={selectedTrainingName}
                  onChange={(e) => setSelectedTrainingName(e.target.value)}
                  className="input-field bg-white"
                >
                  {TRAINING_NAMES.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>

              {selectedTrainingName === 'Custom Training Name' && (
                <div className="animate-slide-down">
                  <label className="label">Custom Training Name</label>
                  <input 
                    type="text" 
                    value={customTrainingName}
                    onChange={(e) => setCustomTrainingName(e.target.value)}
                    placeholder="Enter custom training name"
                    className="input-field"
                  />
                </div>
              )}

              <div>
                <label className="label">Training Project</label>
                <select 
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="input-field bg-white"
                >
                  {Object.keys(PROJECTS).map(project => (
                    <option key={project} value={project}>{project}</option>
                  ))}
                </select>
              </div>

              {selectedProject === 'Custom Project' && (
                <div className="space-y-4 animate-slide-down">
                  <div>
                    <label className="label">Custom Project Name</label>
                    <input 
                      type="text" 
                      value={customProjectName}
                      onChange={(e) => setCustomProjectName(e.target.value)}
                      placeholder="Enter project name"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Project Objectives (One per line)</label>
                    <textarea 
                      value={customObjectives}
                      onChange={(e) => setCustomObjectives(e.target.value)}
                      placeholder="Enter objectives..."
                      rows={3}
                      className="input-field resize-none"
                    />
                  </div>
                </div>
              )}

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h3 className="text-sm font-semibold text-slate-900 mb-2">Project Objectives</h3>
                <ul className="space-y-2">
                  {objectives.length > 0 ? (
                    objectives.map((obj, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                        {obj}
                      </li>
                    ))
                  ) : (
                    <li className="text-sm text-slate-400 italic">No objectives defined</li>
                  )}
                </ul>
              </div>
            </div>
          </section>

          {/* Section: Concepts Developed (Moved up) */}
          <section className="card">
            <div className="flex items-center gap-3 mb-2">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Concepts Developed</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Record what theoretical knowledge and contents were taught in this class.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {CONCEPTS.map(concept => (
                <label 
                  key={concept}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedConcepts.includes(concept) 
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={selectedConcepts.includes(concept)}
                    onChange={() => handleConceptToggle(concept)}
                  />
                  <span className="text-xs font-medium">{concept}</span>
                </label>
              ))}
            </div>
            
            {/* Custom Concept Input */}
            <div className="flex gap-2 mb-6">
              <input 
                type="text"
                value={customConcept}
                onChange={(e) => setCustomConcept(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomConcept()}
                placeholder="Add custom concept..."
                className="input-field py-2 text-sm"
              />
              <button 
                onClick={addCustomConcept}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedConcepts.map(concept => (
                <span key={concept} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  {concept}
                  <button onClick={() => handleConceptToggle(concept)} className="hover:text-emerald-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Section: Skills Developed (Moved down) */}
          <section className="card">
            <div className="flex items-center gap-3 mb-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Skills Developed</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6">Record what circuits were built and what hands-on skills were learned.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {SKILLS.map(skill => (
                <label 
                  key={skill}
                  className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition-all ${
                    selectedSkills.includes(skill) 
                      ? 'bg-blue-50 border-blue-200 text-blue-700' 
                      : 'bg-white border-slate-100 text-slate-600 hover:border-slate-200'
                  }`}
                >
                  <input 
                    type="checkbox" 
                    className="hidden"
                    checked={selectedSkills.includes(skill)}
                    onChange={() => handleSkillToggle(skill)}
                  />
                  <span className="text-xs font-medium">{skill}</span>
                </label>
              ))}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2 mb-6">
              <input 
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCustomSkill()}
                placeholder="Add custom skill..."
                className="input-field py-2 text-sm"
              />
              <button 
                onClick={addCustomSkill}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedSkills.map(skill => (
                <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold flex items-center gap-1">
                  {skill}
                  <button onClick={() => handleSkillToggle(skill)} className="hover:text-blue-900">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </section>

          {/* Section 4: Project Gallery (Now 6 items) */}
          <section className="card">
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Project Gallery</h2>
            </div>
            <p className="text-sm text-slate-500 mb-6 font-sans">Upload up to 6 project photos. Best for vertical (phone) photos.</p>
            
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {images.map((img, i) => (
                <div key={i} className="space-y-3">
                  <div className="relative aspect-[3/4] bg-slate-50 rounded-xl border-2 border-dashed border-slate-200 overflow-hidden group shadow-sm transition-all hover:bg-slate-100">
                    {img ? (
                      <>
                        <img 
                          src={img} 
                          alt={`Project ${i + 1}`} 
                          className="w-full h-full object-cover"
                        />
                        <button 
                          onClick={() => removeImage(i)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full shadow-lg opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity"
                          id={`remove-img-${i}`}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex flex-col touch-manipulation">
                        <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors border-b-2 border-dashed border-slate-200 group relative">
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Camera className="w-6 h-6 text-slate-300 mb-1 group-hover:text-blue-400 transition-colors" />
                            <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-500">Camera</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleImageUpload(i, e)}
                            className="hidden"
                          />
                        </label>
                        <label className="flex-1 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition-colors group relative">
                          <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <ImageIcon className="w-6 h-6 text-slate-300 mb-1 group-hover:text-blue-400 transition-colors" />
                            <span className="text-[10px] font-medium text-slate-400 group-hover:text-blue-500">Gallery</span>
                          </div>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleImageUpload(i, e)}
                            className="hidden"
                          />
                        </label>
                      </div>
                    )}
                  </div>
                  <input 
                    type="text" 
                    value={imageCaptions[i]}
                    onChange={(e) => {
                      const newCaptions = [...imageCaptions];
                      newCaptions[i] = e.target.value;
                      setImageCaptions(newCaptions);
                    }}
                    placeholder="Add comment..."
                    className="input-field text-xs py-2 px-3 bg-white"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Section: Lesson Overview */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Lesson Overview</h2>
            </div>
            <textarea 
              value={lessonOverview}
              onChange={(e) => setLessonOverview(e.target.value)}
              placeholder="Briefly describe the key topics and activities covered in this lesson..."
              rows={4}
              className="input-field resize-none"
            />
          </section>

          {/* Section: Teacher Feedback */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Teacher Feedback</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="label text-emerald-600 uppercase text-[10px] font-black tracking-widest">Highlight</label>
                <textarea 
                  value={highlight}
                  onChange={(e) => setHighlight(e.target.value)}
                  placeholder="What was the student's biggest success today?"
                  rows={3}
                  className="input-field resize-none text-sm"
                />
              </div>
              <div>
                <label className="label text-red-600 uppercase text-[10px] font-black tracking-widest">Challenge</label>
                <textarea 
                  value={challenge}
                  onChange={(e) => setChallenge(e.target.value)}
                  placeholder="What did the student struggle with today?"
                  rows={3}
                  className="input-field resize-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="label text-slate-400 uppercase text-[10px] font-black tracking-widest">Overall Feedback</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide detailed feedback on student performance..."
                rows={4}
                className="input-field resize-none text-sm"
              />
            </div>
          </section>
          
          {/* Section: Homework / Preview */}
          <section className="card">
            <div className="flex items-center gap-3 mb-6">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-semibold">Homework & Preview (Optional)</h2>
            </div>
            <textarea 
              value={homework}
              onChange={(e) => setHomework(e.target.value)}
              placeholder="Assign homework or preview next class content..."
              rows={4}
              className="input-field resize-none"
            />
          </section>

          {/* Generate & Preview Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button 
              onClick={() => setShowPreview(true)}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-slate-800 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-900 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <ImageIcon className="w-5 h-5" />
              Preview Report
            </button>
            <button 
              onClick={generatePDF}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <Download className="w-5 h-5" />
              Generate PDF Report
            </button>
            <button 
              onClick={generateImage}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 hover:-translate-y-0.5 transition-all active:scale-95"
            >
              <ImageIcon className="w-5 h-5" />
              Generate Image Report
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 sm:p-8">
          <div className="bg-slate-100 w-full max-w-5xl h-full rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="p-6 bg-white border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Report Preview</h2>
                <p className="text-sm text-slate-500">Review the 3-page layout before downloading</p>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={generateImage}
                  className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all"
                >
                  <ImageIcon className="w-4 h-4" />
                  Download PNG
                </button>
                <button 
                  onClick={generatePDF}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
                <button 
                  onClick={() => setShowPreview(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-400" />
                </button>
              </div>
            </div>
            <div className="flex-grow overflow-y-auto p-2 sm:p-12 bg-slate-200/50">
              <div className="max-w-[190mm] mx-auto shadow-2xl origin-top scale-[0.35] sm:scale-[0.8] lg:scale-100 transition-transform">
                <ReportTemplate 
                  reportRef={reportRef}
                  studentName={studentName}
                  studentEmail={studentEmail}
                  teacherName={teacherName}
                  teacherEmail={teacherEmail}
                  trainingDate={trainingDate}
                  classNumber={classNumber}
                  trainingName={selectedTrainingName === 'Custom Training Name' ? customTrainingName : selectedTrainingName}
                  selectedProject={selectedProject}
                  customProjectName={customProjectName}
                  objectives={objectives}
                  selectedConcepts={selectedConcepts}
                  selectedSkills={selectedSkills}
                  lessonOverview={lessonOverview}
                  feedback={feedback}
                  highlight={highlight}
                  challenge={challenge}
                  homework={homework}
                  images={images}
                  imageCaptions={imageCaptions}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hidden Template for PDF Generation (Always rendered but off-screen) */}
      <div style={{ 
        position: 'fixed', 
        left: '-9999px', 
        top: '0', 
        width: '215.9mm',
        visibility: 'hidden',  // 不用 opacity+height 技巧
        pointerEvents: 'none',
      }}>
        <ReportTemplate 
          reportRef={hiddenReportRef}
          studentName={studentName}
          studentEmail={studentEmail}
          teacherName={teacherName}
          teacherEmail={teacherEmail}
          trainingDate={trainingDate}
          classNumber={classNumber}
          trainingName={selectedTrainingName === 'Custom Training Name' ? customTrainingName : selectedTrainingName}
          selectedProject={selectedProject}
          customProjectName={customProjectName}
          objectives={objectives}
          selectedConcepts={selectedConcepts}
          selectedSkills={selectedSkills}
          lessonOverview={lessonOverview}
          feedback={feedback}
          highlight={highlight}
          challenge={challenge}
          homework={homework}
          images={images}
          imageCaptions={imageCaptions}
        />
      </div>

      {/* Loading Overlay */}
      {isGenerating && (
        <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-md text-white">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
          <h2 className="text-xl font-bold">Generating Report...</h2>
          <p className="text-slate-400">Please wait while we prepare your high-quality files.</p>
        </div>
      )}
    </div>
  );
}

// Reusable Report Template Component
function ReportTemplate({ 
  reportRef, studentName, studentEmail, teacherName, teacherEmail, 
  trainingDate, classNumber, trainingName, selectedProject, customProjectName, 
  objectives, selectedConcepts, selectedSkills, lessonOverview, feedback, highlight, challenge, homework, images, imageCaptions 
}: any) {
  const COMPANY_NAME = 'EIM TECHNOLOGY';
  const COMPANY_LOGO = 'https://raw.githubusercontent.com/Terback/Images/main/logo/icon_darkblue.png';

  return (
    <div ref={reportRef} className="bg-white text-slate-900 font-sans shadow-sm report-content" style={{ width: '215.9mm', margin: '0 auto' }}>
      
      {/* PAGE 1: Info, Details, Concepts, Skills */}
      <div className="p-16 flex flex-col overflow-hidden report-page" style={{ height: '279.4mm', backgroundColor: 'white' }}>
        <div className="flex justify-between items-end border-b-2 border-brand-blue pb-6 mb-8">
          <div className="flex items-center">
            <div className="mr-4">
              <img src={COMPANY_LOGO} alt="Company Logo" className="h-12 w-auto object-contain" referrerPolicy="no-referrer" />
            </div>
            <div className="flex flex-col">
              <h1 className="text-4xl font-bold font-orbitron text-brand-blue" style={{ marginBottom: '2px' }}>{COMPANY_NAME}</h1>
              <p className="text-slate-500 uppercase tracking-widest text-xs font-bold">Training Report</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-black text-slate-900">{trainingDate}</p>
            {classNumber && <p className="text-sm font-bold text-brand-blue uppercase">{classNumber}</p>}
            <p className="text-[10px] text-slate-400 font-bold">REPORT ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</p>
          </div>
        </div>

        {/* Student & Teacher Info - Side by Side */}
        <div className="flex mb-10">
          <div className="w-1/2 pr-4">
            <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-1">Student Info</h3>
            <p className="text-lg font-bold">{studentName || 'N/A'}</p>
            <p className="text-sm text-slate-500">{studentEmail || 'N/A'}</p>
          </div>
          <div className="w-1/2 pl-4">
            <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-1">Teacher Info</h3>
            <p className="text-lg font-bold">{teacherName || 'N/A'}</p>
            <p className="text-sm text-slate-500">{teacherEmail || 'N/A'}</p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-4">Training Details</h3>
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <p className="text-xl font-bold mb-4">{trainingName || 'N/A'}</p>
            <div className="space-y-4">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Project Name</p>
                <p className="font-semibold text-lg">{selectedProject === 'Custom Project' ? customProjectName : selectedProject}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Objectives</p>
                <ul className="list-none p-0 m-0">
                  {objectives.map((obj: string, i: number) => (
                    <li key={i} className="text-sm text-slate-600 flex items-center mb-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full shrink-0 mr-2" />
                      {obj}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-black text-emerald-600 uppercase tracking-widest mb-4 text-center">Concepts Developed</h3>
          <div className="flex flex-wrap justify-center">
            {selectedConcepts.map((concept: string) => (
              <span 
                key={concept} 
                className="inline-block px-5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold border border-emerald-100 whitespace-nowrap text-center m-1"
                style={{ height: '34px', lineHeight: '32px' }}
              >
                {concept}
              </span>
            ))}
            {selectedConcepts.length === 0 && <p className="text-sm text-slate-400 italic">No concepts selected</p>}
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-4 text-center">Skills Developed</h3>
          <div className="flex flex-wrap justify-center">
            {selectedSkills.map((skill: string) => (
              <span 
                key={skill} 
                className="inline-block px-5 bg-blue-50 text-brand-blue rounded-full text-sm font-bold border border-blue-100 whitespace-nowrap text-center m-1"
                style={{ height: '34px', lineHeight: '32px' }}
              >
                {skill}
              </span>
            ))}
            {selectedSkills.length === 0 && <p className="text-sm text-slate-400 italic">No skills selected</p>}
          </div>
        </div>

        <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-[9px] uppercase tracking-widest font-bold">
          <p>© EIM TECHNOLOGY TRAINING</p>
          <p>Page 1 of 3</p>
        </div>
      </div>

      {/* PAGE 2: Lesson Overview, Teacher Feedback & Homework */}
      <div className="p-16 flex flex-col overflow-hidden report-page" style={{ height: '279.4mm', backgroundColor: 'white' }}>
        {lessonOverview && (
          <div className="mb-6 flex flex-col min-h-0 flex-grow-[2] basis-0">
            <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-3">Lesson Overview</h3>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 overflow-hidden flex-grow">
              <p className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                {lessonOverview}
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 flex flex-col min-h-0 flex-grow-[3] basis-0">
          <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-3">Student Performance & Feedback</h3>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
              <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-1 font-sans">Highlight</p>
              <p className="text-[11px] text-emerald-900 leading-snug">{highlight || 'Ongoing progress...'}</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <p className="text-[9px] font-black text-red-600 uppercase tracking-widest mb-1 font-sans">Challenge</p>
              <p className="text-[11px] text-red-900 leading-snug">{challenge || 'Continuing development...'}</p>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 overflow-hidden flex-grow">
            <p className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap italic">
              "{feedback || 'No specific feedback provided for this session.'}"
            </p>
          </div>
        </div>

        {homework && (
          <div className="mb-6 flex flex-col min-h-0 flex-grow-[1.2] basis-0">
            <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-3">Homework / Preview</h3>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 overflow-hidden flex-grow">
              <p className="text-[13px] leading-relaxed text-slate-700 whitespace-pre-wrap">
                {homework}
              </p>
            </div>
          </div>
        )}

        <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-[9px] uppercase tracking-widest font-bold">
          <p>© EIM TECHNOLOGY TRAINING</p>
          <p>Page 2 of 3</p>
        </div>
      </div>

      {/* PAGE 3: Gallery */}
      <div className="p-16 flex flex-col overflow-hidden report-page" style={{ height: '279.4mm', backgroundColor: 'white' }}>
        <h3 className="text-sm font-black text-brand-blue uppercase tracking-widest mb-8">Project Gallery</h3>
        <div className="flex-grow">
          <div className="flex flex-wrap -mx-2 -my-4">
            {images.map((img: string | null, i: number) => img && (
              <div key={i} className="w-1/3 px-2 py-4">
                <div className="flex flex-col h-full">
                  <div className="w-full aspect-[3/4] bg-slate-50 rounded-xl overflow-hidden border border-slate-100 mb-2">
                    <img 
                      src={img} 
                      alt="" 
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>
                  {imageCaptions[i] && (
                    <p className="text-center text-slate-600 font-bold italic text-[9px] leading-tight px-1 line-clamp-3">
                      {imageCaptions[i]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!images.some((img: any) => img !== null) && (
            <div className="w-full h-64 flex items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400 text-xs">
              No Images Provided
            </div>
          )}
        </div>

        <div className="mt-auto pt-8 border-t border-slate-100 flex justify-between items-center text-slate-400 text-[9px] uppercase tracking-widest font-bold">
          <p>© EIM TECHNOLOGY TRAINING</p>
          <p>Page 3 of 3</p>
        </div>
      </div>
    </div>
  );
}
