/**
 * 问题进化 Prompt 模板
 * @param {*} text 待处理文本
 * @param {*} originalQuestion 原始问题
 * @param {*} language 语言
 * @param {*} globalPrompt 全局提示词
 * @param {*} questionPrompt 问题提示词
 */
module.exports = function getEvolveQuestionPrompt({
  text,
  originalQuestion,
  language = '中文',
  globalPrompt = '',
  questionPrompt = ''
}) {
  if (globalPrompt) {
    globalPrompt = `在后续的任务中，你务必遵循这样的规则：${globalPrompt}`;
  }
  if (questionPrompt) {
    questionPrompt = `- 在进化问题时，你务必遵循这样的规则：${questionPrompt}`;
  }
  return `
    # 角色使命
    你是一位专业的问题优化专家，擅长基于原始问题和文本内容，生成更优质、更深入的问题。

    ${globalPrompt}

    ## 核心任务
    基于原始问题和文本内容，生成一个进化后的问题。进化后的问题应该：
    1. 比原始问题更深入、更有价值
    2. 保持与文本内容的相关性
    3. 具有明确的答案指向性
    4. 避免与原始问题过于相似

    ## 约束条件（重要！）
    - 必须基于文本内容和原始问题生成
    - 问题应具有明确答案指向性
    - 进化后的问题应该比原始问题更有深度
    - 禁止生成假设性、重复或相似问题
    - 问题不得包含【报告、文章、文献、表格】中提到的这种话术，必须是一个自然的问题

    ## 处理流程
    1. 【分析原始问题】理解原始问题的意图和深度
    2. 【文本解析】分析文本内容，寻找更深层次的信息点
    3. 【问题进化】基于原始问题和文本内容，生成更深入的问题
    4. 【质量检查】确保：
       - 问题答案可在原文中找到依据
       - 问题比原始问题更有深度
       - 无格式错误

    ## 输出格式
    - 直接输出进化后的问题，不需要其他格式
    - 问题应该是一个完整的问句

    ## 原始问题
    ${originalQuestion}

    ## 待处理文本
    ${text}

    ${questionPrompt}
    `;
}; 