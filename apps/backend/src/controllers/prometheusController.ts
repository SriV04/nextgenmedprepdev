import { Request, Response } from 'express';
import * as prometheusService from '../services/prometheusDataService';

// ==================== Skill Definitions ====================

export const getAllSkills = async (req: Request, res: Response): Promise<void> => {
  try {
    const activeOnly = req.query.active === 'true';
    const skills = activeOnly 
      ? await prometheusService.getActiveSkillDefinitions()
      : await prometheusService.getAllSkillDefinitions();
    
    res.json({
      success: true,
      data: skills,
    });
  } catch (error: any) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch skills',
    });
  }
};

export const createSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skill_code, display_name, sort_order } = req.body;

    if (!skill_code || !display_name) {
      res.status(400).json({
        success: false,
        message: 'skill_code and display_name are required',
      });
      return;
    }

    const skill = await prometheusService.createSkillDefinition({
      skill_code,
      display_name,
      sort_order,
    });

    res.status(201).json({
      success: true,
      data: skill,
    });
  } catch (error: any) {
    console.error('Error creating skill:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create skill',
    });
  }
};

export const updateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skillCode } = req.params;
    const updates = req.body;

    const skill = await prometheusService.updateSkillDefinition(skillCode, updates);

    if (!skill) {
      res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
      return;
    }

    res.json({
      success: true,
      data: skill,
    });
  } catch (error: any) {
    console.error('Error updating skill:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update skill',
    });
  }
};

export const deactivateSkill = async (req: Request, res: Response): Promise<void> => {
  try {
    const { skillCode } = req.params;

    const success = await prometheusService.deactivateSkillDefinition(skillCode);

    if (!success) {
      res.status(404).json({
        success: false,
        message: 'Skill not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Skill deactivated successfully',
    });
  } catch (error: any) {
    console.error('Error deactivating skill:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to deactivate skill',
    });
  }
};

// ==================== Tags ====================

export const getAllTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const tags = await prometheusService.getAllTags();
    
    res.json({
      success: true,
      data: tags,
    });
  } catch (error: any) {
    console.error('Error fetching tags:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tags',
    });
  }
};

export const createTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tag_name } = req.body;

    if (!tag_name) {
      res.status(400).json({
        success: false,
        message: 'tag_name is required',
      });
      return;
    }

    const tag = await prometheusService.createTag(tag_name);

    res.status(201).json({
      success: true,
      data: tag,
    });
  } catch (error: any) {
    console.error('Error creating tag:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create tag',
    });
  }
};

export const deleteTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tagId } = req.params;

    await prometheusService.deleteTag(tagId);

    res.json({
      success: true,
      message: 'Tag deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting tag:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete tag',
    });
  }
};

// ==================== University Stations & Tag Configs ====================

export const getUniversityStations = async (req: Request, res: Response): Promise<void> => {
  try {
    const university = req.query.university as string | undefined;
    const field = req.query.field as string | undefined;
    const stations = await prometheusService.getUniversityStations(university, field);

    res.json({
      success: true,
      data: stations,
    });
  } catch (error: any) {
    console.error('Error fetching university stations:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch university stations',
    });
  }
};

export const createUniversityStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      question_type,
      station_index,
      station_name,
      duration_minutes,
      notes,
      is_active,
      university,
      field,
    } = req.body;

    if (!question_type || station_index === undefined || !university) {
      res.status(400).json({
        success: false,
        message: 'question_type, station_index, and university are required',
      });
      return;
    }

    const station = await prometheusService.createUniversityStation({
      question_type,
      station_index,
      station_name,
      duration_minutes,
      notes,
      is_active,
      university,
      field,
    });

    res.status(201).json({
      success: true,
      data: station,
    });
  } catch (error: any) {
    console.error('Error creating university station:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create university station',
    });
  }
};

export const deleteUniversityStation = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stationId } = req.params;

    await prometheusService.deleteUniversityStation(stationId);

    res.json({
      success: true,
      message: 'University station deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting university station:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete university station',
    });
  }
};

export const setUniversityStationTags = async (req: Request, res: Response): Promise<void> => {
  try {
    const { stationId } = req.params;
    const { tags } = req.body as {
      tags: Array<{ tag: string; notes?: Record<string, unknown> | null; field?: string | null }>;
    };

    if (!Array.isArray(tags)) {
      res.status(400).json({
        success: false,
        message: 'tags array is required',
      });
      return;
    }

    const updated = await prometheusService.setUniversityStationTags(stationId, tags);

    res.json({
      success: true,
      data: updated,
    });
  } catch (error: any) {
    console.error('Error setting university station tags:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update university station tags',
    });
  }
};

// ==================== Questions ====================

export const createQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const questionData = req.body;
    
    console.log('Received question creation request:', JSON.stringify(questionData, null, 2));

    if (!questionData.question_text || !questionData.title) {
      res.status(400).json({
        success: false,
        message: 'question_text and title are required',
      });
      return;
    }

    if (!questionData.skill_criteria || questionData.skill_criteria.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one skill criterion is required',
      });
      return;
    }

    if (!Array.isArray(questionData.field) || questionData.field.length === 0) {
      res.status(400).json({
        success: false,
        message: 'At least one field is required',
      });
      return;
    }

    const question = await prometheusService.createQuestion(questionData);

    res.status(201).json({
      success: true,
      data: question,
    });
  } catch (error: any) {
    console.error('Error creating question in controller:', {
      message: error.message,
      stack: error.stack,
      details: error.details,
      hint: error.hint,
      code: error.code,
      fullError: error
    });
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create question',
      details: error.details || undefined,
      code: error.code || undefined
    });
  }
};

export const getQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionId } = req.params;

    const question = await prometheusService.getQuestionById(questionId);

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    res.json({
      success: true,
      data: question,
    });
  } catch (error: any) {
    console.error('Error fetching question:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch question',
    });
  }
};

export const getQuestions = async (req: Request, res: Response): Promise<void> => {
  try {
    const filters: any = {};

    if (req.query.difficulty) {
      filters.difficulty = req.query.difficulty as string;
    }
    if (req.query.category) {
      filters.category = req.query.category as string;
    }
    if (req.query.interview_type) {
      filters.interview_type = req.query.interview_type as string;
    }
    if (req.query.active !== undefined) {
      filters.is_active = req.query.active === 'true';
    }
    if (req.query.status) {
      filters.status = req.query.status as string;
    }
    if (req.query.contributor_id) {
      filters.contributor_id = req.query.contributor_id as string;
    }

    const questions = await prometheusService.getQuestions(filters);

    res.json({
      success: true,
      data: questions,
    });
  } catch (error: any) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch questions',
    });
  }
};

export const updateQuestionStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionId } = req.params;
    const { status, rejection_reason, field } = req.body;

    if (!status) {
      res.status(400).json({
        success: false,
        message: 'status is required',
      });
      return;
    }

    const updates: any = { status };
    updates.rejection_reason =
      status === 'rejected' ? (rejection_reason ?? null) : null;
    if (field !== undefined) {
      updates.field = field;
    }
    const question = await prometheusService.updateQuestion(questionId, updates);

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    res.json({
      success: true,
      data: question,
    });
  } catch (error: any) {
    console.error('Error updating question status:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update question status',
    });
  }
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionId } = req.params;
    const updates = req.body;

    const question = await prometheusService.updateQuestion(questionId, updates);

    if (!question) {
      res.status(404).json({
        success: false,
        message: 'Question not found',
      });
      return;
    }

    res.json({
      success: true,
      data: question,
    });
  } catch (error: any) {
    console.error('Error updating question:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update question',
    });
  }
};

export const deactivateQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionId } = req.params;

    await prometheusService.deleteQuestion(questionId);

    res.json({
      success: true,
      message: 'Question deactivated successfully',
    });
  } catch (error: any) {
    console.error('Error deactivating question:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to deactivate question',
    });
  }
};

export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
  try {
    const { questionId } = req.params;

    await prometheusService.deleteQuestion(questionId);

    res.json({
      success: true,
      message: 'Question deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting question:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete question',
    });
  }
};

export const getQuestionsByTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const { tagName } = req.params;

    const questions = await prometheusService.getQuestionsByTag(tagName);

    res.json({
      success: true,
      data: questions,
    });
  } catch (error: any) {
    console.error('Error fetching questions by tag:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch questions by tag',
    });
  }
};

// ==================== Interview Feedback ====================

export const createInterviewFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const feedbackData = req.body;

    if (!feedbackData.interview_id || !feedbackData.question_id) {
      res.status(400).json({
        success: false,
        message: 'interview_id and question_id are required',
      });
      return;
    }

    const feedback = await prometheusService.createInterviewQuestionFeedback(feedbackData);

    res.status(201).json({
      success: true,
      data: feedback,
    });
  } catch (error: any) {
    console.error('Error creating interview feedback:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create interview feedback',
    });
  }
};

export const getInterviewQuestionFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewQuestionId } = req.params;

    const feedback = await prometheusService.getInterviewQuestionFeedback(
      interviewQuestionId
    );

    if (!feedback) {
      res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
      return;
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error: any) {
    console.error('Error fetching interview question feedback:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch feedback',
    });
  }
};

export const getInterviewFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewId } = req.params;

    const feedback = await prometheusService.getInterviewFeedback(interviewId);

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error: any) {
    console.error('Error fetching interview feedback:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch interview feedback',
    });
  }
};

export const updateInterviewFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewQuestionId } = req.params;
    const updates = req.body;

    const feedback = await prometheusService.updateInterviewQuestionFeedback(
      interviewQuestionId,
      updates
    );

    if (!feedback) {
      res.status(404).json({
        success: false,
        message: 'Feedback not found',
      });
      return;
    }

    res.json({
      success: true,
      data: feedback,
    });
  } catch (error: any) {
    console.error('Error updating interview feedback:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update feedback',
    });
  }
};

export const deleteInterviewFeedback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { interviewQuestionId } = req.params;

    await prometheusService.deleteInterviewQuestionFeedback(
      interviewQuestionId
    );

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting interview feedback:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete feedback',
    });
  }
};
