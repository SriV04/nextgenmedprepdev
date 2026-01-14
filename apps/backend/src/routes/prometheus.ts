import { Router } from 'express';
import * as prometheusController from '../controllers/prometheusController';

const router = Router();

// ==================== Skill Definitions Routes ====================

// GET /api/v1/prometheus/skills - Get all skills (optionally active only)
router.get('/skills', prometheusController.getAllSkills);

// POST /api/v1/prometheus/skills - Create new skill
router.post('/skills', prometheusController.createSkill);

// PUT /api/v1/prometheus/skills/:skillCode - Update skill
router.put('/skills/:skillCode', prometheusController.updateSkill);

// DELETE /api/v1/prometheus/skills/:skillCode - Deactivate skill
router.delete('/skills/:skillCode', prometheusController.deactivateSkill);

// ==================== Tags Routes ====================

// GET /api/v1/prometheus/tags - Get all tags
router.get('/tags', prometheusController.getAllTags);

// POST /api/v1/prometheus/tags - Create new tag
router.post('/tags', prometheusController.createTag);

// DELETE /api/v1/prometheus/tags/:tagId - Delete tag
router.delete('/tags/:tagId', prometheusController.deleteTag);

// ==================== University Stations & Tag Configs ====================

// GET /api/v1/prometheus/university-stations - Get university stations (optionally filtered by university)
router.get('/university-stations', prometheusController.getUniversityStations);

// POST /api/v1/prometheus/university-stations - Create university station
router.post('/university-stations', prometheusController.createUniversityStation);

// DELETE /api/v1/prometheus/university-stations/:stationId - Delete university station
router.delete('/university-stations/:stationId', prometheusController.deleteUniversityStation);

// PUT /api/v1/prometheus/university-stations/:stationId/tags - Set station tags
router.put('/university-stations/:stationId/tags', prometheusController.setUniversityStationTags);

// ==================== Questions Routes ====================

// POST /api/v1/prometheus/questions - Create new question
router.post('/questions', prometheusController.createQuestion);

// GET /api/v1/prometheus/questions - Get all questions with optional filters
router.get('/questions', prometheusController.getQuestions);

// GET /api/v1/prometheus/questions/:questionId - Get specific question
router.get('/questions/:questionId', prometheusController.getQuestion);

// PUT /api/v1/prometheus/questions/:questionId - Update question
router.put('/questions/:questionId', prometheusController.updateQuestion);

// PATCH /api/v1/prometheus/questions/:questionId/status - Update question status
router.patch('/questions/:questionId/status', prometheusController.updateQuestionStatus);

// PATCH /api/v1/prometheus/questions/:questionId/deactivate - Deactivate question
router.patch('/questions/:questionId/deactivate', prometheusController.deactivateQuestion);

// DELETE /api/v1/prometheus/questions/:questionId - Delete question
router.delete('/questions/:questionId', prometheusController.deleteQuestion);

// GET /api/v1/prometheus/questions/by-tag/:tagName - Get questions by tag
router.get('/questions/by-tag/:tagName', prometheusController.getQuestionsByTag);

// ==================== Interview Feedback Routes ====================

// POST /api/v1/prometheus/interviews/:interviewId/feedback - Create interview feedback
router.post('/interviews/:interviewId/feedback', prometheusController.createInterviewFeedback);

// GET /api/v1/prometheus/interviews/:interviewId/feedback - Get all feedback for interview
router.get('/interviews/:interviewId/feedback', prometheusController.getInterviewFeedback);

// GET /api/v1/prometheus/interviews/:interviewId/feedback/:questionId - Get specific question feedback
router.get('/interviews/:interviewId/feedback/:questionId', prometheusController.getInterviewQuestionFeedback);

// PUT /api/v1/prometheus/interviews/:interviewId/feedback/:questionId - Update feedback
router.put('/interviews/:interviewId/feedback/:questionId', prometheusController.updateInterviewFeedback);

// DELETE /api/v1/prometheus/interviews/:interviewId/feedback/:questionId - Delete feedback
router.delete('/interviews/:interviewId/feedback/:questionId', prometheusController.deleteInterviewFeedback);

export default router;
