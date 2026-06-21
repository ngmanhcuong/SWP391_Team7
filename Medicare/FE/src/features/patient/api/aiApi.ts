import { AxiosError } from 'axios';
import api from '../../../services/api';
import { AiSymptomAnalysis } from '../types';

const DEFAULT_AI_ERROR =
  'Không thể kết nối tới trợ lý AI lúc này. Vui lòng thử lại sau hoặc tự chọn chuyên khoa.';

export class AiAnalysisError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AiAnalysisError';
  }
}

interface AnalyzeSymptomsResponse {
  success: boolean;
  data: { analysis: AiSymptomAnalysis };
}

export type AiChatRole = 'user' | 'model';

export interface AiChatMessage {
  role: AiChatRole;
  text: string;
}

interface ChatResponse {
  success: boolean;
  data: { reply: string };
}

const DEFAULT_CHAT_ERROR = 'Trợ lý AI hiện không phản hồi được. Vui lòng thử lại sau ít phút.';

const extractMessage = (error: unknown, fallback: string): string =>
  (error as AxiosError<{ message?: string }>)?.response?.data?.message ?? fallback;

export const aiApi = {
  analyzeSymptoms: async (symptoms: string): Promise<AiSymptomAnalysis> => {
    try {
      const response = await api.post<AnalyzeSymptomsResponse>('/ai/analyze-symptoms', {
        symptoms,
      });
      return response.data.data.analysis;
    } catch (error) {
      throw new AiAnalysisError(extractMessage(error, DEFAULT_AI_ERROR));
    }
  },

  chat: async (messages: AiChatMessage[]): Promise<string> => {
    try {
      const response = await api.post<ChatResponse>('/ai/chat', { messages });
      return response.data.data.reply;
    } catch (error) {
      throw new AiAnalysisError(extractMessage(error, DEFAULT_CHAT_ERROR));
    }
  },
};
