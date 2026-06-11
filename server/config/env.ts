/**
 * Environment Variables Configuration
 * Validates and provides type-safe access to all environment variables
 */

export interface EnvConfig {
  // Database
  DATABASE_URL: string
  
  // Server
  PORT: number
  NODE_ENV: 'development' | 'production' | 'test'
  FRONTEND_URL: string
  
  // Authentication
  JWT_SECRET: string
  JWT_EXPIRES_IN: string
  
  // AI Providers
  OPENAI_API_KEY?: string
  GEMINI_API_KEY?: string
  ANTHROPIC_API_KEY?: string
  MISTRAL_API_KEY?: string
  GROQ_API_KEY?: string
  COHERE_API_KEY?: string
  PERPLEXITY_API_KEY?: string
  TOGETHER_API_KEY?: string
  HUGGINGFACE_API_KEY?: string
  DEEPSEEK_API_KEY?: string
  
  // Cloudinary
  CLOUDINARY_CLOUD_NAME?: string
  CLOUDINARY_API_KEY?: string
  CLOUDINARY_API_SECRET?: string
  
  // Whisper (Optional)
  WHISPER_API_KEY?: string
  
  // Analytics (Optional)
  ANALYTICS_ENABLED: boolean
}

/**
 * Validate and parse environment variables
 */
function validateEnv(): EnvConfig {
  const errors: string[] = []
  
  // Required variables
  const DATABASE_URL = process.env.DATABASE_URL
  if (!DATABASE_URL || typeof DATABASE_URL !== 'string') {
    errors.push('DATABASE_URL must be a non-empty string')
  }
  
  const JWT_SECRET = process.env.JWT_SECRET
  if (!JWT_SECRET || typeof JWT_SECRET !== 'string') {
    errors.push('JWT_SECRET must be a non-empty string')
  }
  
  // Optional but recommended
  if (!process.env.OPENAI_API_KEY && 
      !process.env.GEMINI_API_KEY && 
      !process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  No AI provider API keys found. At least one is recommended.')
  }
  
  if (errors.length > 0) {
    console.error('❌ Environment validation failed:')
    errors.forEach(err => console.error(`  - ${err}`))
    throw new Error('Invalid environment configuration')
  }
  
  return {
    // Database
    DATABASE_URL: DATABASE_URL!,
    
    // Server
    PORT: parseInt(process.env.PORT || '3000', 10),
    NODE_ENV: (process.env.NODE_ENV as any) || 'development',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
    
    // Authentication
    JWT_SECRET: JWT_SECRET!,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    
    // AI Providers
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    COHERE_API_KEY: process.env.COHERE_API_KEY,
    PERPLEXITY_API_KEY: process.env.PERPLEXITY_API_KEY,
    TOGETHER_API_KEY: process.env.TOGETHER_API_KEY,
    HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY,
    
    // Cloudinary
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
    
    // Whisper
    WHISPER_API_KEY: process.env.WHISPER_API_KEY,
    
    // Analytics
    ANALYTICS_ENABLED: process.env.ANALYTICS_ENABLED === 'true',
  }
}

// Validate on module load
let config: EnvConfig | null = null

export function getEnv(): EnvConfig {
  if (!config) {
    config = validateEnv()
  }
  return config
}

export default getEnv()
