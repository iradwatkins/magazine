/**
 * Article Templates Library
 *
 * Pre-built article templates with structured content blocks
 * to help writers get started quickly with different article types
 *
 * @module lib/article-templates
 */

// Simplified block type for templates (flat structure used by editor)
type TemplateBlock = {
  id: string
  type: string
  content?: string
  level?: number
  order: number
  url?: string
  alt?: string
  caption?: string
}

/**
 * Generate a unique ID that works in both Node and browser
 */
function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export interface ArticleTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: string
  blocks: TemplateBlock[]
  excerpt: string
}

/**
 * Blank Canvas Template - Start from scratch
 */
const blankTemplate: ArticleTemplate = {
  id: 'blank',
  name: 'Blank Canvas',
  description: 'Start with a clean slate and build your article from scratch',
  icon: '📝',
  category: 'OTHER',
  blocks: [
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Start writing your article here...',
      order: 0,
    },
  ],
  excerpt: '',
}

/**
 * Interview Template - Structured Q&A format
 */
const interviewTemplate: ArticleTemplate = {
  id: 'interview',
  name: 'Interview',
  description: 'Pre-structured interview format with Q&A sections',
  icon: '🎤',
  category: 'INTERVIEWS',
  blocks: [
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Introduce your interview subject and provide context about who they are and why they\'re being interviewed.',
      order: 0,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Q: Tell us about yourself and your background in stepping.',
      level: 3,
      order: 1,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: '[Interview response]',
      order: 2,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Q: What inspired you to start stepping?',
      level: 3,
      order: 3,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: '[Interview response]',
      order: 4,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Q: What advice would you give to aspiring steppers?',
      level: 3,
      order: 5,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: '[Interview response]',
      order: 6,
    },
  ],
  excerpt: 'An exclusive interview with [Name], discussing their journey in the stepping community.',
}

/**
 * Tutorial Template - Step-by-step instructional format
 */
const tutorialTemplate: ArticleTemplate = {
  id: 'tutorial',
  name: 'Tutorial',
  description: 'Step-by-step guide with clear instructions and examples',
  icon: '📚',
  category: 'TUTORIALS',
  blocks: [
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Introduce what readers will learn from this tutorial and why it\'s important.',
      order: 0,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Prerequisites',
      level: 2,
      order: 1,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'List what readers need to know or have before starting this tutorial.',
      order: 2,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Step 1: [First Step]',
      level: 2,
      order: 3,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Explain the first step in detail.',
      order: 4,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Step 2: [Second Step]',
      level: 2,
      order: 5,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Explain the second step in detail.',
      order: 6,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Conclusion',
      level: 2,
      order: 7,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Summarize what was learned and suggest next steps.',
      order: 8,
    },
  ],
  excerpt: 'A comprehensive step-by-step guide to [topic].',
}

/**
 * Event Coverage Template - Event reporting structure
 */
const eventTemplate: ArticleTemplate = {
  id: 'event',
  name: 'Event Coverage',
  description: 'Report on events with structured sections for details, highlights, and impact',
  icon: '🎉',
  category: 'EVENTS',
  blocks: [
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Write a compelling lead that captures the essence of the event.',
      order: 0,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Event Details',
      level: 2,
      order: 1,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: '• Date: [Date]\n• Location: [Location]\n• Attendance: [Number of attendees]\n• Organizers: [Organizers]',
      order: 2,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Highlights',
      level: 2,
      order: 3,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Describe the key moments and performances from the event.',
      order: 4,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Community Impact',
      level: 2,
      order: 5,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Discuss the significance of this event for the stepping community.',
      order: 6,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Looking Ahead',
      level: 2,
      order: 7,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Mention upcoming related events or what this means for the future.',
      order: 8,
    },
  ],
  excerpt: 'Coverage of [Event Name], featuring highlights and community impact.',
}

/**
 * News Article Template - Inverted pyramid structure
 */
const newsTemplate: ArticleTemplate = {
  id: 'news',
  name: 'News Article',
  description: 'Traditional news format with inverted pyramid structure',
  icon: '📰',
  category: 'NEWS',
  blocks: [
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Lead paragraph: Answer who, what, when, where, why, and how. This should be a complete summary that could stand alone.',
      order: 0,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Background',
      level: 2,
      order: 1,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Provide context and background information that helps readers understand the significance.',
      order: 2,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Key Details',
      level: 2,
      order: 3,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Add supporting details, quotes, and additional information.',
      order: 4,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'What\'s Next',
      level: 2,
      order: 5,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Discuss implications and what comes next.',
      order: 6,
    },
  ],
  excerpt: 'Breaking news about [topic] in the stepping community.',
}

/**
 * Photo Essay Template - Image-heavy layout
 */
const photoEssayTemplate: ArticleTemplate = {
  id: 'photo-essay',
  name: 'Photo Essay',
  description: 'Visual storytelling with images and captions',
  icon: '📸',
  category: 'LIFESTYLE',
  blocks: [
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Introduce your photo essay and explain the story you\'re telling through images.',
      order: 0,
    },
    {
      id: generateId(),
      type: 'image',
      url: '',
      alt: 'First image description',
      caption: 'Add a compelling caption that enhances the story',
      order: 1,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Provide context or story for this image.',
      order: 2,
    },
    {
      id: generateId(),
      type: 'image',
      url: '',
      alt: 'Second image description',
      caption: 'Add a compelling caption that enhances the story',
      order: 3,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Provide context or story for this image.',
      order: 4,
    },
    {
      id: generateId(),
      type: 'heading',
      content: 'Reflection',
      level: 2,
      order: 5,
    },
    {
      id: generateId(),
      type: 'paragraph',
      content: 'Conclude with your thoughts and the message you want readers to take away.',
      order: 6,
    },
  ],
  excerpt: 'A visual journey exploring [topic] through powerful imagery.',
}

/**
 * Get all available templates
 */
export function getAllTemplates(): ArticleTemplate[] {
  return [
    blankTemplate,
    interviewTemplate,
    tutorialTemplate,
    eventTemplate,
    newsTemplate,
    photoEssayTemplate,
  ]
}

/**
 * Get template by ID
 */
export function getTemplateById(id: string): ArticleTemplate | undefined {
  return getAllTemplates().find((template) => template.id === id)
}

/**
 * Get templates by category
 */
export function getTemplatesByCategory(category: string): ArticleTemplate[] {
  return getAllTemplates().filter((template) => template.category === category)
}
