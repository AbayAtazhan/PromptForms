export interface PromptTemplate {
  id: string;
  title: string;
  description: string;
  systemInstruction: string;
  variables: string[];
  createdAt: string;
}

export interface WaitlistSubmission {
  email: string;
  role: 'owner' | 'freelancer' | 'manager';
  businessName?: string;
  submittedAt: string;
}
