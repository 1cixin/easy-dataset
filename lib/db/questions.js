'use server';
import { db } from '@/lib/db/index';

/**
 * 获取项目的所有问题
 * @param {string} projectId - 项目ID
 * @returns {Promise<Array>} - 问题列表
 */
export async function getQuestions(projectId) {
  try {
    return await db.questions.findMany({
      where: {
        projectId
      },
      orderBy: {
        createAt: 'desc'
      },
      include: {
        chunk: {
          select: {
            name: true
          }
        }
      }
    });
  } catch (error) {
    console.error('Failed to get questions by projectId in database');
    throw error;
  }
}

export async function getQuestionById(id) {
  try {
    return await db.questions.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Failed to get questions by name in database');
    throw error;
  }
}

export async function isExistByQuestion(question) {
  try {
    const count = await db.questions.count({
      where: { question }
    });
    return count > 0;
  } catch (error) {
    console.error('Failed to get questions by name in database');
    throw error;
  }
}

export async function getQuestionsCount(projectId) {
  try {
    return await db.questions.count({
      where: {
        projectId
      }
    });
  } catch (error) {
    console.error('Failed to get questions count in database');
    throw error;
  }
}

/**
 * 保存项目的问题列表
 * @param {string} projectId - 项目ID
 * @param {Array} questions - 问题列表
 * @param chunkId
 * @returns {Promise<Array>} - 保存后的问题列表
 */
export async function saveQuestions(projectId, questions, chunkId) {
  try {
    let data = questions.map(item => {
      return {
        projectId,
        chunkId: chunkId ? chunkId : item.chunkId,
        question: item.question,
        label: item.label
      };
    });
    return await db.questions.createMany({ data: data });
  } catch (error) {
    console.error('Failed to create questions in database');
    throw error;
  }
}

export async function updateQuestion(question) {
  try {
    return await db.questions.update({ where: { id: question.id }, data: question });
  } catch (error) {
    console.error('Failed to update questions in database');
    throw error;
  }
}

/**
 * 获取指定文本块的问题
 * @param {string} projectId - 项目ID
 * @param {string} chunkId - 文本块ID
 * @returns {Promise<Array>} - 问题列表
 */
export async function getQuestionsForChunk(projectId, chunkId) {
  const questions = await getQuestions(projectId);
  const chunkQuestions = questions.find(item => item.chunkId === chunkId);

  return chunkQuestions ? chunkQuestions.questions : [];
}

/**
 * 删除单个问题
 * @param {string} questionId - 问题ID
 */
export async function deleteQuestion(questionId) {
  try {
    console.log(questionId);
    return await db.questions.delete({
      where: {
        id: questionId
      }
    });
  } catch (error) {
    console.error('Failed to delete questions by id in database');
    throw error;
  }
}

/**
 * 批量删除问题
 * @param {Array} questionIds
 */
export async function batchDeleteQuestions(questionIds) {
  try {
    return await db.questions.deleteMany({
      where: {
        id: {
          in: questionIds
        }
      }
    });
  } catch (error) {
    console.error('Failed to delete batch questions in database');
    throw error;
  }
}
