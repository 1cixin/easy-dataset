import { NextResponse } from 'next/server';
import logger from '@/lib/util/logger';
import questionService from '@/lib/services/questions';

// 进化问题
export async function POST(request, { params }) {
  try {
    const { projectId, questionId } = params;

    // 验证项目ID和问题ID
    if (!projectId || !questionId) {
      return NextResponse.json({ error: '项目ID或问题ID不能为空' }, { status: 400 });
    }

    // 获取请求体
    const { model, language = '中文' } = await request.json();

    if (!model) {
      return NextResponse.json({ error: '模型名称不能为空' }, { status: 400 });
    }

    // 使用问题进化服务
    const result = await questionService.evolveQuestion(projectId, questionId, {
      model,
      language
    });

    // 返回进化后的问题
    return NextResponse.json(result);
  } catch (error) {
    logger.error('进化问题时出错:', error);
    return NextResponse.json({ error: error.message || '进化问题失败' }, { status: 500 });
  }
} 