// src/lib/moveToPublishing.ts
import api from '@/lib/api';
import { Draft } from '@/types';
import { ArticleInput } from '@/hooks/publishing/useArticles';

/**
 * Moves a draft to the publishing section by creating an article
 * @param draft The draft to move to publishing
 * @param status The initial status of the article ('draft', 'review', or 'published')
 * @returns The created article
 */
export async function moveDraftToPublishing(
  draft: Draft, 
  status: 'draft' | 'review' | 'published' = 'draft'
) {
  try {
    console.log('Starting publishing process for draft:', draft);
    
    // Convert draft data to article format
    const articleData: ArticleInput = {
      title: draft.title || 'Untitled',
      excerpt: draft.summary || '',
      content: draft.body || '',
      featured_image: '',
      status: status,
      persona_id: draft.task?.assigned_persona_id || '',
      // Add any other necessary fields
      categories: [],
      tags: [] // Draft has string[] tags, but ArticleInput expects number[] tags
    };
    
    console.log('Prepared article data:', articleData);

    // Create the article in the publishing section
    try {
      const response = await api.post('/articles', articleData);
      console.log('Publish success! Response:', response.data);
      
      // Note: Draft interface doesn't have status, so we skip updating draft
      // The draft is now represented as an article in the publishing section
      console.log(`Draft ${draft.id} moved to publishing as article ${response.data.id}`);

      return response.data;
    } catch (error) {
      console.error('API error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers,
        config: error.config
      });
      throw error;
    }
  } catch (error) {
    console.error('Failed to move draft to publishing:', error);
    throw error;
  }
}

/**
 * Gets a draft by task ID
 * @param taskId The task ID to find a draft for
 * @returns The draft associated with the task
 */
export async function getDraftByTaskId(taskId: string) {
  try {
    const response = await api.get(`/drafts`, { params: { task_id: taskId } });
    if (response.data && response.data.length > 0) {
      return response.data[0];
    }
    throw new Error('No draft found for this task');
  } catch (error) {
    console.error('Failed to get draft for task:', error);
    throw error;
  }
}