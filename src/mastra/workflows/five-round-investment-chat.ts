import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// 定义消息结构
const messageSchema = z.object({
  speaker: z.string(),
  content: z.string(),
  timestamp: z.string(),
  round: z.number(),
});

// 定义工作流状态结构
const chatStateSchema = z.object({
  userQuestion: z.string(),
  messages: z.array(messageSchema),
  currentRound: z.number(),
  maxRounds: z.number(),
});

// 工具函数：获取大师图标
function getMasterIcon(masterName: string): string {
  const icons: Record<string, string> = {
    '巴菲特': '💎',
    '芒格': '🎯',
    '木头姐': '🌟',
  };
  return icons[masterName] || '💬';
}

// 工具函数：实时显示消息
function displayMessage(message: { speaker: string; content: string; round: number }) {
  const icon = getMasterIcon(message.speaker);
  console.log(`\n${icon} ${message.speaker} (第${message.round}轮):`);
  console.log('─'.repeat(50));
  console.log(message.content);
  console.log('\n' + '·'.repeat(80));
}

// 工具函数：生成大师提示词
function generateMasterPrompt(
  masterName: string,
  userQuestion: string,
  currentRound: number,
  messages: Array<{ speaker: string; content: string; round: number }>
): string {
  const previousDiscussion = messages
    .map(msg => `${msg.speaker} (第${msg.round}轮): ${msg.content}`)
    .join('\n\n');

  switch (masterName) {
    case '巴菲特': {
      if (currentRound === 1) {
        return `
作为投资大师巴菲特，你正在参加一个5轮深度投资讨论。这是第${currentRound}轮，你是第一个发言的人。

用户问题：${userQuestion}

请以巴菲特的身份回应这个问题，体现价值投资的核心理念，用简单易懂的语言解释复杂概念，结合具体的投资案例。请直接给出你的观点。
`;
      } else {
        return `
作为投资大师巴菲特，这是第${currentRound}轮讨论。基于之前${currentRound-1}轮的讨论，请继续深入分析这个投资问题。

原始问题：${userQuestion}

之前的讨论内容：
${previousDiscussion}

请在第${currentRound}轮中进一步深化你的价值投资观点，回应芒格和木头姐在之前轮次中的观点，提出新的投资角度或案例。
`;
      }
    }

    case '芒格': {
      const currentBuffettView = messages
        .filter(msg => msg.speaker === '巴菲特' && msg.round === currentRound)
        .map(msg => msg.content)
        .join('');
      
      return `
作为查理·芒格，这是第${currentRound}轮讨论。请基于之前的讨论和巴菲特本轮的观点，提供你的深刻洞察。

原始问题：${userQuestion}

巴菲特本轮观点：
${currentBuffettView}

${currentRound > 1 ? `之前的讨论历史：\n${previousDiscussion}\n` : ''}

请运用你的多元思维模型分析问题，评价巴菲特本轮的观点，指出可能的认知偏误，展现你犀利的智慧。
`;
    }

    case '木头姐': {
      const currentBuffettView = messages
        .filter(msg => msg.speaker === '巴菲特' && msg.round === currentRound)
        .map(msg => msg.content)
        .join('');
      const currentMungerView = messages
        .filter(msg => msg.speaker === '芒格' && msg.round === currentRound)
        .map(msg => msg.content)
        .join('');

      return `
作为凯瑟琳·伍德（木头姐），这是第${currentRound}轮讨论。请基于所有讨论内容，提供你的颠覆性创新投资视角。

原始问题：${userQuestion}

本轮观点：
巴菲特：${currentBuffettView}
芒格：${currentMungerView}

${currentRound > 1 ? `之前的讨论历史：\n${previousDiscussion}\n` : ''}

请从颠覆性创新角度分析问题，评价巴菲特和芒格的观点，强调技术创新和未来趋势，为讨论带来创新视角。
`;
    }

    default:
      throw new Error(`Unknown master: ${masterName}`);
  }
}

// 初始化步骤
const initializeChat = createStep({
  id: 'initialize-chat',
  description: '初始化5轮群聊讨论',
  inputSchema: z.object({
    userQuestion: z.string(),
  }),
  outputSchema: chatStateSchema,
  execute: async ({ inputData }) => {
    const { userQuestion } = inputData;
    
    console.log('\n🎯 开始5轮投资大师深度讨论');
    console.log('═'.repeat(80));
    console.log(`\n❓ 讨论主题: ${userQuestion}`);
    console.log('═'.repeat(80));
    
    return {
      userQuestion,
      messages: [],
      currentRound: 1,
      maxRounds: 5,
    };
  },
});

// 单轮讨论步骤（包含三位大师的依次发言）
const singleRoundDiscussion = createStep({
  id: 'single-round-discussion',
  description: '执行单轮讨论（三位大师依次发言）',
  inputSchema: chatStateSchema,
  outputSchema: chatStateSchema,
  execute: async ({ inputData, mastra }) => {
    const { userQuestion, messages, currentRound, maxRounds } = inputData;
    
    console.log(`\n🔥 第${currentRound}轮讨论开始`);
    console.log('━'.repeat(60));
    
    let updatedMessages = [...messages];
    
    // 三位大师按顺序发言
    const masters = [
      { name: '巴菲特', agentName: 'buffettAgent' },
      { name: '芒格', agentName: 'mungerAgent' },
      { name: '木头姐', agentName: 'cathieWoodAgent' }
    ];
    
    for (const master of masters) {
      const agent = mastra?.getAgent(master.agentName);
      if (!agent) {
        throw new Error(`${master.name} agent not found`);
      }
      
      // 实时显示状态
      console.log(`\n${getMasterIcon(master.name)} ${master.name}正在思考第${currentRound}轮发言...`);
      
      // 生成提示词（使用最新的消息列表）
      const prompt = generateMasterPrompt(master.name, userQuestion, currentRound, updatedMessages);
      
      // 获取回复
      const response = await agent.generate(prompt);
      
      // 创建新消息
      const newMessage = {
        speaker: master.name,
        content: response.text,
        timestamp: new Date().toISOString(),
        round: currentRound,
      };
      
      // 实时显示发言
      displayMessage(newMessage);
      
      // 更新消息列表
      updatedMessages = [...updatedMessages, newMessage];
    }
    
    console.log(`\n✅ 第${currentRound}轮讨论完成`);
    
    if (currentRound < maxRounds) {
      console.log(`\n⏳ 准备进入第${currentRound + 1}轮讨论...`);
      // 稍作停顿
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    return {
      userQuestion,
      messages: updatedMessages,
      currentRound: currentRound + 1,
      maxRounds,
    };
  },
});

// 最终总结步骤
const generateFinalSummary = createStep({
  id: 'generate-final-summary',
  description: '生成5轮讨论最终总结',
  inputSchema: chatStateSchema,
  outputSchema: z.object({
    userQuestion: z.string(),
    messages: z.array(messageSchema),
    summary: z.string(),
    totalRounds: z.number(),
  }),
  execute: async ({ inputData }) => {
    const { userQuestion, messages } = inputData;
    
    const summary = `
💬 5轮投资大师深度讨论总结

讨论主题: ${userQuestion}

🔄 讨论轮次回顾:
• 第1轮: 奠定各自的基本投资立场和观点
• 第2轮: 在互相了解的基础上进行观点交锋
• 第3轮: 深入挖掘分歧点和共同点
• 第4轮: 综合分析和策略优化
• 第5轮: 最终结论和实践建议

📊 三位大师观点演进:
• 💎 巴菲特: 从价值投资基础理念到具体案例分析，始终坚持长期价值创造
• 🎯 芒格: 运用多元思维模型，逐步深入认知框架和理性决策
• 🌟 木头姐: 从创新技术角度挑战传统，展现颠覆性投资趋势洞察

💡 关键洞察:
经过5轮深度讨论，我们获得了：
- 全方位的投资分析框架
- 传统智慧与创新思维的融合
- 多时间维度的投资策略思考
- 风险与机遇的平衡艺术

🎯 最终启示:
这场5轮讨论展现了投资决策的复杂性和多面性。最优的投资策略往往需要：
- 巴菲特式的价值基础（安全边际、长期持有）
- 芒格式的理性分析（多元思维、避免偏误）
- 木头姐式的创新视野（技术趋势、颠覆机会）

三种投资哲学的结合，才能在变化的市场中保持竞争优势。
`;

    console.log('\n📋 5轮讨论最终总结');
    console.log('═'.repeat(80));
    console.log(summary);

    return {
      userQuestion,
      messages,
      summary,
      totalRounds: 5,
    };
  },
});

// 创建完整的5轮投资群聊工作流
export const fiveRoundInvestmentChatWorkflow = createWorkflow({
  id: 'five-round-investment-chat',
  inputSchema: z.object({
    userQuestion: z.string().describe('用户提出的投资问题'),
  }),
  outputSchema: z.object({
    userQuestion: z.string(),
    messages: z.array(messageSchema),
    summary: z.string(),
    totalRounds: z.number(),
  }),
})
  .then(initializeChat)
  .dowhile(
    singleRoundDiscussion,
    async ({ inputData: { currentRound, maxRounds } }) => currentRound <= maxRounds
  )
  .then(generateFinalSummary)
  .commit(); 