/**
 * API Response Types
 * 
 * This file contains frontend-specific types for API responses and client-side data structures.
 * These types extend or wrap the base types from shared/schema.ts with additional client-side properties.
 */

import type {
  Project,
  Skill,
  Testimonial,
  ContactMessage,
  AboutInfo,
  User,
} from "@shared";

/**
 * API Response wrapper for successful responses
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

/**
 * API Error response structure
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Upload response for file uploads
 */
export interface UploadResponse {
  url: string;
  filename: string;
  size: number;
}

/**
 * Authentication response
 */
export interface AuthResponse {
  user: User;
  message: string;
}

/**
 * User session response
 */
export interface SessionResponse {
  user: User | null;
  authenticated: boolean;
}

/**
 * Legal document response (privacy policy, terms of service)
 */
export interface LegalDocumentResponse {
  content: string;
}

/**
 * Reorder skills payload
 */
export interface ReorderSkillsPayload {
  skills: Array<{
    id: string;
    category: string;
    order: number;
  }>;
}

/**
 * Message update responses
 */
export interface MessageUpdateResponse {
  message: ContactMessage;
  success: boolean;
}

/**
 * Re-export shared types for convenience
 * These are the base entity types used throughout the application
 */
export type {
  Project,
  Skill,
  Testimonial,
  ContactMessage,
  AboutInfo,
  User,
};

/**
 * Client-side extended types (if needed in the future)
 * Example: types with computed properties, UI state, etc.
 */

// Example: Project with computed properties for UI
export interface ProjectWithStats extends Project {
  techCount?: number;
  hasLinks?: boolean;
}

// Example: Skill with UI state
export interface SkillWithState extends Skill {
  isEditing?: boolean;
  isDragging?: boolean;
}

// Example: Message with UI formatting
export interface MessageWithFormatting extends ContactMessage {
  formattedDate?: string;
  isSelected?: boolean;
}
