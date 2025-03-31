
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Send, User, Bot, X } from 'lucide-react';
import { useCVContext } from '@/contexts/CVContext';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const ChatEditor: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hello! I can help you edit specific parts of the CV. For example, you can ask me to 'Change the headline to Senior Software Engineer' or 'Add Python to the skills section with Expert proficiency'.",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { cv, updateCvField } = useCVContext();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsProcessing(true);

    // In a real implementation, we would send the message to a backend API
    // and receive a response. Here we'll simulate it with a timeout.
    setTimeout(() => {
      // Parse the user message to extract intent and target field
      handleUserRequest(userMessage.content);
      setIsProcessing(false);
    }, 1500);
  };

  const handleUserRequest = (request: string) => {
    // This is a simplified implementation to demonstrate the concept
    // In a real app, you'd use more sophisticated NLP to understand the request
    
    // Sample handling for headline changes
    if (request.toLowerCase().includes('headline') || request.toLowerCase().includes('title')) {
      const match = request.match(/change\s+the\s+headline\s+to\s+(.+)/i) || 
                    request.match(/set\s+the\s+headline\s+to\s+(.+)/i) ||
                    request.match(/update\s+the\s+headline\s+to\s+(.+)/i);
      
      if (match && match[1]) {
        const newHeadline = match[1].trim();
        updateCvField('headline', newHeadline);
        
        const response: Message = {
          id: Date.now().toString(),
          content: `I've updated the headline to: "${newHeadline}"`,
          sender: 'assistant',
          timestamp: new Date(),
        };
        
        setMessages((prev) => [...prev, response]);
        return;
      }
    }
    
    // Sample handling for skill additions
    if (request.toLowerCase().includes('skill')) {
      const addMatch = request.match(/add\s+(\w+)\s+to\s+(?:the\s+)?skills?\s+(?:with\s+)?(?:proficiency\s+)?(?:of\s+)?(\w+)?/i);
      
      if (addMatch && addMatch[1]) {
        const skillName = addMatch[1].trim();
        const proficiency = addMatch[2] ? addMatch[2].trim() : 'Intermediate';
        
        // Validate proficiency level
        const validProficiencies = ['Beginner', 'Average', 'Intermediate', 'Advanced', 'Expert'];
        const normalizedProficiency = validProficiencies.find(
          p => p.toLowerCase() === proficiency.toLowerCase()
        ) || 'Intermediate';
        
        // Add the skill
        if (cv) {
          const updatedSkills = [...(cv.skills || []), {
            name: skillName,
            proficiency: normalizedProficiency as any,
            skillType: 'hard'
          }];
          
          updateCvField('skills', updatedSkills);
          
          const response: Message = {
            id: Date.now().toString(),
            content: `I've added ${skillName} with ${normalizedProficiency} proficiency to the skills section.`,
            sender: 'assistant',
            timestamp: new Date(),
          };
          
          setMessages((prev) => [...prev, response]);
          return;
        }
      }
    }
    
    // If no patterns matched, provide a generic response
    const response: Message = {
      id: Date.now().toString(),
      content: "I'm not sure how to help with that specific request. Try asking me to change a specific field like 'Change the headline to...' or 'Add a skill...'",
      sender: 'assistant',
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, response]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card className="w-full h-[400px] max-h-[80vh] flex flex-col shadow-lg">
      <div className="flex items-center justify-between p-3 border-b">
        <h3 className="font-medium">Edit with Chat</h3>
        <Button variant="ghost" size="sm" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <CardContent className="flex-1 overflow-y-auto p-3">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-2 p-2 rounded-lg",
                message.sender === 'user' ? "bg-gray-100 ml-auto max-w-[80%]" : "bg-purple-50 mr-auto max-w-[80%]"
              )}
            >
              <div className={cn(
                "rounded-full p-1 w-6 h-6 flex items-center justify-center",
                message.sender === 'user' ? "bg-gray-300" : "bg-hireable-primary"
              )}>
                {message.sender === 'user' ? (
                  <User className="h-4 w-4 text-white" />
                ) : (
                  <Bot className="h-4 w-4 text-white" />
                )}
              </div>
              <div className="text-sm">
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      
      <div className="p-3 border-t">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Type your edit request..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isProcessing}
            className="flex-1"
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isProcessing}
            className="bg-hireable-gradient hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          Example: "Change the headline to Senior Developer" or "Add Python to skills with Expert proficiency"
        </div>
      </div>
    </Card>
  );
};

export default ChatEditor;
