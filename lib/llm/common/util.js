// 从 LLM 输出中提取 JSON
function extractJsonFromLLMOutput(output) {
  // 情况1：直接就是合法 JSON
  try {
    return JSON.parse(output);
  } catch {}

  // 情况2：包含 ```json 标记
  const jsonStart = output.indexOf('```json');
  const jsonEnd = output.lastIndexOf('```');
  if (jsonStart !== -1 && jsonEnd !== -1) {
    try {
      return JSON.parse(output.substring(jsonStart + 7, jsonEnd));
    } catch (error) {
      console.error('解析 JSON 时出错:', { error, llmResponse: output });
    }
  }

  // 情况3：尝试提取最外层的 [...]
  const arrayStart = output.indexOf('[');
  const arrayEnd = output.lastIndexOf(']');
  if (arrayStart !== -1 && arrayEnd !== -1) {
    try {
      return JSON.parse(output.substring(arrayStart, arrayEnd + 1));
    } catch (error) {
      console.error('解析数组时出错:', { error, llmResponse: output });
    }
  }
}

function extractThinkChain(text) {
  const startTags = ['<think>', '<thinking>'];
  const endTags = ['</think>', '</thinking>'];
  let startIndex = -1;
  let endIndex = -1;
  let usedStartTag = '';
  let usedEndTag = '';

  for (let i = 0; i < startTags.length; i++) {
    const currentStartIndex = text.indexOf(startTags[i]);
    if (currentStartIndex !== -1) {
      startIndex = currentStartIndex;
      usedStartTag = startTags[i];
      usedEndTag = endTags[i];
      break;
    }
  }

  if (startIndex === -1) {
    return '';
  }

  endIndex = text.indexOf(usedEndTag, startIndex + usedStartTag.length);

  if (endIndex === -1) {
    return '';
  }

  return text.slice(startIndex + usedStartTag.length, endIndex).trim();
}

function extractAnswer(text) {
  const startTags = ['<think>', '<thinking>'];
  const endTags = ['</think>', '</thinking>'];
  for (let i = 0; i < startTags.length; i++) {
    const start = startTags[i];
    const end = endTags[i];
    if (text.includes(start) && text.includes(end)) {
      const partsBefore = text.split(start);
      const partsAfter = partsBefore[1].split(end);
      return (partsBefore[0].trim() + ' ' + partsAfter[1].trim()).trim();
    }
  }
  return text;
}

module.exports = {
  extractJsonFromLLMOutput,
  extractThinkChain,
  extractAnswer
};
