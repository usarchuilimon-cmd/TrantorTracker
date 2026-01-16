import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp, PlayCircle, FileText, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { FaqItem, TutorialItem } from '../types';

interface FaqViewProps {
  faqs: FaqItem[];
  tutorials: TutorialItem[];
}

export const FaqView = ({ faqs, tutorials }: FaqViewProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(faqs.length > 0 ? faqs[0].id : null);

  const filteredFaqs = faqs.filter(f => 
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
    f.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleFaq = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Hero / Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-900 dark:to-indigo-900 rounded-xl p-6 sm:p-10 text-white shadow-lg text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
            <BookOpen className="w-40 h-40" />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">Centro de Ayuda y Recursos</h2>
          <p className="text-blue-100 mb-6">
            Encuentre respuestas rápidas, guías paso a paso y tutoriales en video para sacar el máximo provecho de su ERP.
          </p>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="¿En qué podemos ayudarle hoy? (Ej: Facturación, Contraseña...)" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-4 focus:ring-blue-400/30 shadow-lg border-0"
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: FAQs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Preguntas Frecuentes</h3>
          </div>
          
          <div className="space-y-3">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <div 
                  key={faq.id} 
                  className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md"
                >
                  <button 
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full px-6 py-4 text-left flex justify-between items-center focus:outline-none group"
                  >
                    <div>
                        <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1 block group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors">
                            {faq.category}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white text-base sm:text-lg">
                            {faq.question}
                        </span>
                    </div>
                    {expandedId === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-blue-500" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors" />
                    )}
                  </button>
                  
                  {expandedId === faq.id && (
                    <div className="px-6 pb-5 pt-0 animate-in fade-in slide-in-from-top-1 duration-200">
                      <div className="h-px w-full bg-gray-100 dark:bg-slate-700 mb-4"></div>
                      <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-10 bg-white dark:bg-slate-800 rounded-xl border border-dashed border-gray-200 dark:border-slate-700">
                 <p className="text-gray-500">No se encontraron resultados para su búsqueda.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Tutorials */}
        <div className="space-y-6">
           <div className="flex items-center gap-2 mb-2">
            <PlayCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Tutoriales Destacados</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
             {tutorials.map(tutorial => (
                <div 
                   key={tutorial.id}
                   className="group cursor-pointer bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-1 hover:border-blue-200 dark:hover:border-blue-800"
                >
                   <div className={`h-32 w-full ${tutorial.thumbnailColor} relative flex items-center justify-center overflow-hidden`}>
                      {/* Abstract pattern overlay */}
                      <div className="absolute inset-0 bg-black/10"></div>
                      
                      <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm group-hover:scale-110 transition-transform relative z-10">
                          {tutorial.type === 'VIDEO' ? <PlayCircle className="w-8 h-8 text-white" /> : <FileText className="w-8 h-8 text-white" />}
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded font-medium backdrop-blur-sm">
                          {tutorial.duration}
                      </span>
                   </div>
                   <div className="p-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {tutorial.title}
                      </h4>
                      <div className="flex items-center mt-3 text-sm text-gray-500 dark:text-slate-400 font-medium hover:text-blue-600 dark:hover:text-blue-300 transition-colors">
                          Ver contenido <ExternalLink className="w-3 h-3 ml-1" />
                      </div>
                   </div>
                </div>
             ))}
             {tutorials.length === 0 && (
                <div className="text-center py-6 text-gray-500">No hay tutoriales disponibles.</div>
             )}
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-900/20 p-5 rounded-xl border border-indigo-100 dark:border-indigo-900/30 text-center">
             <h4 className="font-semibold text-indigo-900 dark:text-indigo-200 mb-2">¿No encuentra lo que busca?</h4>
             <p className="text-sm text-indigo-700 dark:text-indigo-300 mb-4">
                 Nuestro equipo de soporte está listo para ayudarle con cualquier duda técnica o funcional.
             </p>
             <button className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-sm">
                 Contactar Soporte
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};