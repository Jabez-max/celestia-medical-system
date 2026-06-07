'use client';

import { useChat } from '@ai-sdk/react';
import { Send, Bot, User } from 'lucide-react';

// Gagawa tayo ng sariling 'Message' type para hindi na tayo umasa sa sirang type ng library
type ChatMessage = {
  id: string;
  role: string;
  content: string;
};

export default function SymptomChecker() {
  // Gagamit tayo ng "as any" dito para patahimikin ang TypeScript sa bug ng library nila, 
  // pero malinis pa rin itong tingnan sa code mo!
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat() as any;

  return (
    <div className="max-w-3xl mx-auto p-4 h-[80vh] flex flex-col">
      <div className="bg-blue-600 text-white p-4 rounded-t-xl shadow-md">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bot size={24} />
          Celestia AI Symptom Checker
        </h2>
        <p className="text-sm opacity-80">I-type ang iyong nararamdaman para malaman kung saang department ka dapat pumunta.</p>
      </div>

      <div className="flex-1 bg-white border-x border-gray-200 p-4 overflow-y-auto shadow-inner">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-400 text-center">
            <p>Wala pang mensahe. <br/> Subukang i-type: "Masakit ang tiyan ko at parang sinisikmura ako."</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Gagamitin natin yung ginawa nating malinis na ChatMessage type */}
            {messages.map((m: ChatMessage) => (
              <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 max-w-[80%] ${m.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`p-2 rounded-full h-10 w-10 flex items-center justify-center shrink-0 ${m.role === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                    {m.role === 'user' ? <User size={20} /> : <Bot size={20} />}
                  </div>
                  <div className={`p-3 rounded-2xl ${m.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'}`}>
                    {m.content}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-500 p-3 rounded-2xl rounded-tl-none animate-pulse">
                  Nag-iisip ang AI...
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-4 border rounded-b-xl shadow-md flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={input}
          placeholder="Ano ang nararamdaman mo ngayon?"
          onChange={handleInputChange}
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={isLoading || !input}
          className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
        >
          <Send size={20} />
        </button>
      </form>
    </div>
  );
}