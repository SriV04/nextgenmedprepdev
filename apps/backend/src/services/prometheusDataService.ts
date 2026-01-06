import { createSupabaseClient } from '../../supabase/config';
import { PostgrestError } from '@supabase/supabase-js';

// ============================================================================
// Type Definitions
// ============================================================================

export interface SkillDefinition {
  skill_code: string;
  display_name: string;
  is_active: boolean;
  sort_order: number;
}

export interface Tag {
  id?: string;
  tag_name: string;
}

export interface FollowUpQuestion {
  order: number;
  text: string;
}

export interface QuestionSkillCriterion {
  skill_code: string;
  skill_group: 'core' | 'extra';
  max_marks: number;
  guidance?: string;
  display_order: number;
}

export interface CreateQuestionData {
  question_text: string;
  title?: string;
  category?: string;
  difficulty?: string;
  interview_types?: string[];
  notes?: string;
  contributor_id?: string;
  follow_up_questions?: FollowUpQuestion[];
  skill_criteria?: QuestionSkillCriterion[];
  tags?: string[]; // tag names or IDs
}

export interface Question {
  id: string;
  question_text: string;
  title?: string;
  category?: string;
  difficulty?: string;
  interview_types?: string[];
  contributor_id?: string;
  is_active: boolean;
  follow_up_questions: FollowUpQuestion[];
  notes?: string;
}

export interface InterviewQuestionFeedback {
  interview_id: string;
  question_id: string;
  student_response?: string;
  general_feedback?: string;
  score?: number;
  notes?: string;
  skill_marks?: Array<{
    criterion_id: string;
    marks_awarded: number;
    examiner_comment?: string;
  }>;
}

// ============================================================================
// Skill Definitions CRUD
// ============================================================================

/**
 * Get all skill definitions
 */
export const getAllSkillDefinitions = async () => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('skill_definitions')
    .select('*')
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data;
};

/**
 * Get active skill definitions only
 */
export const getActiveSkillDefinitions = async () => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('skill_definitions')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  
  if (error) throw error;
  return data;
};

/**
 * Create a new skill definition
 */
export const createSkillDefinition = async (skillData: Omit<SkillDefinition, 'is_active'>) => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('skill_definitions')
    .insert({
      ...skillData,
      is_active: true
    })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Update a skill definition
 */
export const updateSkillDefinition = async (skillCode: string, updates: Partial<SkillDefinition>) => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('skill_definitions')
    .update(updates)
    .eq('skill_code', skillCode)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Deactivate a skill definition (soft delete)
 */
export const deactivateSkillDefinition = async (skillCode: string) => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('skill_definitions')
    .update({ is_active: false })
    .eq('skill_code', skillCode)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// ============================================================================
// Tags CRUD
// ============================================================================

/**
 * Get all tags
 */
export const getAllTags = async () => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('tags')
    .select('*')
    .order('tag_name', { ascending: true });
  
  if (error) throw error;
  return data;
};

/**
 * Get tag by name
 */
export const getTagByName = async (tagName: string) => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('tags')
    .select('*')
    .eq('tag_name', tagName)
    .single();
  
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows
  return data;
};

/**
 * Create a new tag
 */
export const createTag = async (tagName: string) => {
  const supabase = createSupabaseClient();
  
  // Check if tag already exists
  const existing = await getTagByName(tagName);
  if (existing) return existing;
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('tags')
    .insert({ tag_name: tagName })
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Delete a tag
 */
export const deleteTag = async (tagId: string) => {
  const supabase = createSupabaseClient();
  
  // First remove question associations
  await supabase
    .schema('prometheus')
    .from('question_tags')
    .delete()
    .eq('tag_id', tagId);
  
  // Then delete the tag
  const { error } = await supabase
    .schema('prometheus')
    .from('tags')
    .delete()
    .eq('id', tagId);
  
  if (error) throw error;
};

// ============================================================================
// Questions CRUD
// ============================================================================

/**
 * Create a comprehensive question with all associated data
 */
export const createQuestion = async (questionData: CreateQuestionData) => {
  const supabase = createSupabaseClient();
  
  console.log('Creating question with data:', JSON.stringify(questionData, null, 2));
  
  // 1. Insert the main question
  const insertData = {
    question_text: questionData.question_text,
    title: questionData.title,
    category: questionData.category,
    difficulty: questionData.difficulty,
    interview_types: questionData.interview_types || [],
    contributor_id: questionData.contributor_id,
    follow_up_questions: questionData.follow_up_questions || [],
    notes: questionData.notes,
    is_active: true
  };
  
  console.log('Inserting question into database:', JSON.stringify(insertData, null, 2));
  
  const { data: question, error: questionError } = await supabase
    .schema('prometheus')
    .from('questions')
    .insert(insertData)
    .select()
    .single();
  
  if (questionError) {
    console.error('Error inserting question:', {
      message: questionError.message,
      details: questionError.details,
      hint: questionError.hint,
      code: questionError.code
    });
    throw questionError;
  }
  
  console.log('Question inserted successfully with ID:', question.id);
  console.log('Question inserted successfully with ID:', question.id);
  
  // 2. Add skill criteria if provided
  if (questionData.skill_criteria && questionData.skill_criteria.length > 0) {
    console.log('Adding skill criteria:', questionData.skill_criteria.length, 'criteria');
    
    const skillCriteriaToInsert = questionData.skill_criteria.map(sc => ({
      question_id: question.id,
      skill_code: sc.skill_code,
      skill_group: sc.skill_group,
      max_marks: sc.max_marks,
      guidance: sc.guidance,
      display_order: sc.display_order
    }));
    
    console.log('Skill criteria to insert:', JSON.stringify(skillCriteriaToInsert, null, 2));
    
    const { error: skillError } = await supabase
      .schema('prometheus')
      .from('question_skill_criteria')
      .insert(skillCriteriaToInsert);
    
    if (skillError) {
      console.error('Error inserting skill criteria:', {
        message: skillError.message,
        details: skillError.details,
        hint: skillError.hint,
        code: skillError.code
      });
      throw skillError;
    }
    
    console.log('Skill criteria inserted successfully');
  } else {
    console.log('No skill criteria to add');
  }
  
  // 3. Add tags if provided
  if (questionData.tags && questionData.tags.length > 0) {
    console.log('Adding tags:', questionData.tags);
    
    const tagIds: string[] = [];
    
    for (const tagName of questionData.tags) {
      console.log('Creating/getting tag:', tagName);
      const tag = await createTag(tagName); // Creates or gets existing
      console.log('Tag result:', tag);
      tagIds.push(tag.id);
    }
    
    const questionTagsToInsert = tagIds.map(tagId => ({
      question_id: question.id,
      tag_id: tagId
    }));
    
    console.log('Question tags to insert:', JSON.stringify(questionTagsToInsert, null, 2));
    
    const { error: tagError } = await supabase
      .schema('prometheus')
      .from('question_tags')
      .insert(questionTagsToInsert);
    
    if (tagError) {
      console.error('Error inserting question tags:', {
        message: tagError.message,
        details: tagError.details,
        hint: tagError.hint,
        code: tagError.code
      });
      throw tagError;
    }
    
    console.log('Tags inserted successfully');
  } else {
    console.log('No tags to add');
  }
  
  // 4. Return the complete question with all associations
  console.log('Fetching complete question data for ID:', question.id);
  return getQuestionById(question.id);
};

/**
 * Get question by ID with all associated data
 */
export const getQuestionById = async (questionId: string) => {
  const supabase = createSupabaseClient();
  
  const { data: question, error: questionError } = await supabase
    .schema('prometheus')
    .from('questions')
    .select(`
      *,
      question_skill_criteria (
        id,
        skill_code,
        skill_group,
        max_marks,
        guidance,
        display_order,
        skill_definitions (
          skill_code,
          display_name,
          sort_order
        )
      ),
      question_tags (
        tags (
          id,
          tag_name
        )
      )
    `)
    .eq('id', questionId)
    .single();
  
  if (questionError) throw questionError;
  return question;
};

/**
 * Get all questions with optional filters
 */
export const getQuestions = async (filters?: {
  category?: string;
  difficulty?: string;
  interview_type?: string;
  is_active?: boolean;
  tags?: string[];
}) => {
  const supabase = createSupabaseClient();
  
  let query = supabase
    .schema('prometheus')
    .from('questions')
    .select(`
      *,
      question_skill_criteria (
        id,
        skill_code,
        skill_group,
        max_marks,
        guidance,
        display_order,
        skill_definitions (
          skill_code,
          display_name
        )
      ),
      question_tags (
        tags (
          id,
          tag_name
        )
      )
    `);
  
  if (filters?.category) {
    query = query.eq('category', filters.category);
  }
  
  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }
  
  if (filters?.interview_type) {
    query = query.eq('interview_type', filters.interview_type);
  }
  
  if (filters?.is_active !== undefined) {
    query = query.eq('is_active', filters.is_active);
  }
  
  const { data, error } = await query;
  
  if (error) throw error;
  
  // Filter by tags if provided
  if (filters?.tags && filters.tags.length > 0) {
    return data.filter(question => {
      const questionTags = question.question_tags.map((qt: any) => qt.tags.tag_name);
      return filters.tags!.some(tag => questionTags.includes(tag));
    });
  }
  
  return data;
};

/**
 * Update a question
 */
export const updateQuestion = async (questionId: string, updates: Partial<CreateQuestionData>) => {
  const supabase = createSupabaseClient();
  
  // Update main question data
  const questionUpdates: any = {};
  if (updates.question_text) questionUpdates.question_text = updates.question_text;
  if (updates.title !== undefined) questionUpdates.title = updates.title;
  if (updates.category !== undefined) questionUpdates.category = updates.category;
  if (updates.difficulty !== undefined) questionUpdates.difficulty = updates.difficulty;
  if (updates.interview_types !== undefined) questionUpdates.interview_type = updates.interview_types;
  if (updates.notes !== undefined) questionUpdates.notes = updates.notes;
  if (updates.follow_up_questions !== undefined) questionUpdates.follow_up_questions = updates.follow_up_questions;
  
  if (Object.keys(questionUpdates).length > 0) {
    const { error } = await supabase
      .schema('prometheus')
      .from('questions')
      .update(questionUpdates)
      .eq('id', questionId);
    
    if (error) throw error;
  }
  
  // Update skill criteria if provided
  if (updates.skill_criteria) {
    // Delete existing criteria
    await supabase
      .schema('prometheus')
      .from('question_skill_criteria')
      .delete()
      .eq('question_id', questionId);
    
    // Insert new criteria
    const skillCriteriaToInsert = updates.skill_criteria.map(sc => ({
      question_id: questionId,
      skill_code: sc.skill_code,
      skill_group: sc.skill_group,
      max_marks: sc.max_marks,
      guidance: sc.guidance,
      display_order: sc.display_order
    }));
    
    const { error: skillError } = await supabase
      .schema('prometheus')
      .from('question_skill_criteria')
      .insert(skillCriteriaToInsert);
    
    if (skillError) throw skillError;
  }
  
  // Update tags if provided
  if (updates.tags) {
    // Delete existing tag associations
    await supabase
      .schema('prometheus')
      .from('question_tags')
      .delete()
      .eq('question_id', questionId);
    
    // Create new tag associations
    const tagIds: string[] = [];
    for (const tagName of updates.tags) {
      const tag = await createTag(tagName);
      tagIds.push(tag.id);
    }
    
    const questionTagsToInsert = tagIds.map(tagId => ({
      question_id: questionId,
      tag_id: tagId
    }));
    
    const { error: tagError } = await supabase
      .schema('prometheus')
      .from('question_tags')
      .insert(questionTagsToInsert);
    
    if (tagError) throw tagError;
  }
  
  return getQuestionById(questionId);
};

/**
 * Deactivate a question (soft delete)
 */
export const deactivateQuestion = async (questionId: string) => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('questions')
    .update({ is_active: false })
    .eq('id', questionId)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Permanently delete a question and all associations
 */
export const deleteQuestion = async (questionId: string) => {
  const supabase = createSupabaseClient();
  
  // Delete skill criteria
  await supabase
    .schema('prometheus')
    .from('question_skill_criteria')
    .delete()
    .eq('question_id', questionId);
  
  // Delete tag associations
  await supabase
    .schema('prometheus')
    .from('question_tags')
    .delete()
    .eq('question_id', questionId);
  
  // Delete the question
  const { error } = await supabase
    .schema('prometheus')
    .from('questions')
    .delete()
    .eq('id', questionId);
  
  if (error) throw error;
};

// ============================================================================
// Interview Question Feedback
// ============================================================================

/**
 * Create interview question feedback with skill marks
 */
export const createInterviewQuestionFeedback = async (feedback: InterviewQuestionFeedback) => {
  const supabase = createSupabaseClient();
  
  // 1. Insert the interview question record
  const { data: interviewQuestion, error: iqError } = await supabase
    .schema('prometheus')
    .from('interview_questions')
    .insert({
      interview_id: feedback.interview_id,
      question_id: feedback.question_id,
      student_response: feedback.student_response,
      general_feedback: feedback.general_feedback,
      score: feedback.score,
      notes: feedback.notes
    })
    .select()
    .single();
  
  if (iqError) throw iqError;
  
  // 2. Insert skill marks if provided
  if (feedback.skill_marks && feedback.skill_marks.length > 0) {
    const skillMarksToInsert = feedback.skill_marks.map(sm => ({
      interview_question_id: interviewQuestion.id,
      criterion_id: sm.criterion_id,
      marks_awarded: sm.marks_awarded,
      examiner_comment: sm.examiner_comment
    }));
    
    const { error: smError } = await supabase
      .from('interview_question_skill_marks')
      .insert(skillMarksToInsert);
    
    if (smError) throw smError;
  }
  
  return getInterviewQuestionFeedback(interviewQuestion.id);
};

/**
 * Get interview question feedback by ID
 */
export const getInterviewQuestionFeedback = async (interviewQuestionId: string) => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('interview_questions')
    .select(`
      *,
      questions (
        id,
        question_text,
        title,
        category,
        difficulty,
        interview_type,
        follow_up_questions
      ),
      interview_question_skill_marks (
        id,
        marks_awarded,
        examiner_comment,
        question_skill_criteria (
          id,
          skill_code,
          skill_group,
          max_marks,
          guidance,
          display_order,
          skill_definitions (
            skill_code,
            display_name
          )
        )
      )
    `)
    .eq('id', interviewQuestionId)
    .single();
  
  if (error) throw error;
  return data;
};

/**
 * Get all feedback for an interview
 */
export const getInterviewFeedback = async (interviewId: string) => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('interview_questions')
    .select(`
      *,
      questions (
        id,
        question_text,
        title,
        category,
        difficulty,
        interview_type,
        follow_up_questions
      ),
      interview_question_skill_marks (
        id,
        marks_awarded,
        examiner_comment,
        question_skill_criteria (
          id,
          skill_code,
          skill_group,
          max_marks,
          guidance,
          display_order,
          skill_definitions (
            skill_code,
            display_name
          )
        )
      )
    `)
    .eq('interview_id', interviewId);
  
  if (error) throw error;
  return data;
};

/**
 * Update interview question feedback
 */
export const updateInterviewQuestionFeedback = async (
  interviewQuestionId: string,
  updates: Partial<InterviewQuestionFeedback>
) => {
  const supabase = createSupabaseClient();
  
  // Update interview question
  const iqUpdates: any = {};
  if (updates.student_response !== undefined) iqUpdates.student_response = updates.student_response;
  if (updates.general_feedback !== undefined) iqUpdates.general_feedback = updates.general_feedback;
  if (updates.score !== undefined) iqUpdates.score = updates.score;
  if (updates.notes !== undefined) iqUpdates.notes = updates.notes;
  
  if (Object.keys(iqUpdates).length > 0) {
    const { error } = await supabase
      .schema('prometheus')
      .from('interview_questions')
      .update(iqUpdates)
      .eq('id', interviewQuestionId);
    
    if (error) throw error;
  }
  
  // Update skill marks if provided
  if (updates.skill_marks) {
    // Delete existing marks
    await supabase
      .schema('prometheus')
      .from('interview_question_skill_marks')
      .delete()
      .eq('interview_question_id', interviewQuestionId);
    
    // Insert new marks
    const skillMarksToInsert = updates.skill_marks.map(sm => ({
      interview_question_id: interviewQuestionId,
      criterion_id: sm.criterion_id,
      marks_awarded: sm.marks_awarded,
      examiner_comment: sm.examiner_comment
    }));
    
    const { error: smError } = await supabase
      .schema('prometheus')
      .from('interview_question_skill_marks')
      .insert(skillMarksToInsert);
    
    if (smError) throw smError;
  }
  
  return getInterviewQuestionFeedback(interviewQuestionId);
};

/**
 * Delete interview question feedback
 */
export const deleteInterviewQuestionFeedback = async (interviewQuestionId: string) => {
  const supabase = createSupabaseClient();
  
  // Delete skill marks first
  await supabase
    .schema('prometheus')
    .from('interview_question_skill_marks')
    .delete()
    .eq('interview_question_id', interviewQuestionId);
  
  // Delete the interview question
  const { error } = await supabase
    .schema('prometheus')
    .from('interview_questions')
    .delete()
    .eq('id', interviewQuestionId);
  
  if (error) throw error;
};

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get questions by tag
 */
export const getQuestionsByTag = async (tagName: string) => {
  const supabase = createSupabaseClient();
  
  // First get the tag
  const tag = await getTagByName(tagName);
  if (!tag) return [];
  
  // Get question IDs associated with this tag
  const { data: questionTags, error: qtError } = await supabase
    .schema('prometheus')
    .from('question_tags')
    .select('question_id')
    .eq('tag_id', tag.id);
  
  if (qtError) throw qtError;
  
  const questionIds = questionTags.map(qt => qt.question_id);
  
  if (questionIds.length === 0) return [];
  
  // Get the questions
  const { data, error } = await supabase
    .schema('prometheus')
    .from('questions')
    .select(`
      *,
      question_skill_criteria (
        id,
        skill_code,
        skill_group,
        max_marks,
        guidance,
        display_order,
        skill_definitions (
          skill_code,
          display_name
        )
      ),
      question_tags (
        tags (
          id,
          tag_name
        )
      )
    `)
    .in('id', questionIds);
  
  if (error) throw error;
  return data;
};

/**
 * Get skill criteria for a question
 */
export const getQuestionSkillCriteria = async (questionId: string) => {
  const supabase = createSupabaseClient();
  
  const { data, error } = await supabase
    .schema('prometheus')
    .from('question_skill_criteria')
    .select(`
      *,
      skill_definitions (
        skill_code,
        display_name,
        sort_order
      )
    `)
    .eq('question_id', questionId)
    .order('skill_group', { ascending: true })
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data;
}; 