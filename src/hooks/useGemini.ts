import { useState, useCallback } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const useGemini = () => {
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const generateStream = useCallback(async (
    promptText: string,
    systemInstruction?: string,
    overrideApiKey?: string
  ) => {
    setIsLoading(true);
    setIsStreaming(false);
    setError(null);
    setOutput('');

    // Retrieve the API key from local storage or parameter
    const apiKey = overrideApiKey || localStorage.getItem('promptforms_gemini_api_key');
    if (!apiKey) {
      setError('API Key is missing. Click the "Set Gemini API Key" button in the header to enter your Google AI Studio key.');
      setIsLoading(false);
      return;
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      
      // Gemini 2.5 Flash is super fast and perfect for this form execution
      const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash',
        ...(systemInstruction ? { systemInstruction } : {})
      });

      setIsLoading(false);
      setIsStreaming(true);

      const result = await model.generateContentStream(promptText);

      let accumulatedText = '';
      for await (const chunk of result.stream) {
        const text = chunk.text();
        accumulatedText += text;
        setOutput(accumulatedText);
      }

      setIsStreaming(false);
    } catch (err: any) {
      console.error('Gemini API Streaming Error:', err);
      let errorMsg = 'An error occurred during text generation.';
      if (err instanceof Error) {
        errorMsg = err.message;
      } else if (err && typeof err === 'object' && 'message' in err) {
        errorMsg = String(err.message);
      }
      
      if (errorMsg.includes('API_KEY_INVALID') || errorMsg.includes('API key not valid')) {
        errorMsg = 'Your Gemini API Key appears to be invalid. Please verify it in the settings modal and try again.';
      }
      
      setError(errorMsg);
      setIsLoading(false);
      setIsStreaming(false);
    }
  }, []);

  const clearOutput = useCallback(() => {
    setOutput('');
    setError(null);
  }, []);

  return {
    output,
    isLoading,
    isStreaming,
    error,
    generateStream,
    clearOutput,
  };
};
