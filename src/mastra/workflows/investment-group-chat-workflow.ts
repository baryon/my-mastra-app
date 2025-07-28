import { createStep, createWorkflow } from '@mastra/core/workflows';
import { z } from 'zod';

// 定义对话消息的数据结构
const messageSchema = z.object({
  speaker: z.string(),
  content: z.string(),
  timestamp: z.string(),
});

const conversationSchema = z.object({
  userQuestion: z.string(),
  messages: z.array(messageSchema),
});

// 第一步：巴菲特回应用户问题
const buffettResponse = createStep({
  id: 'buffett-response',
  description: '巴菲特作为第一位发言者回应用户问题',
  inputSchema: z.object({
    userQuestion: z.string().describe('用户提出的投资问题'),
  }),
  outputSchema: z.object({
    userQuestion: z.string(),
    messages: z.array(messageSchema),
  }),
  execute: async ({ inputData, mastra }) => {
    const { userQuestion } = inputData;

    const buffettAgent = mastra?.getAgent('buffettAgent');
    if (!buffettAgent) {
      throw new Error('Buffett agent not found');
    }

    const prompt = `
作为投资大师巴菲特，你正在参加一个投资讨论群聊。现在有一位投资者提出了问题，你是第一个回应的人。

用户问题：${userQuestion}

请以巴菲特的身份回应这个问题。你的回答应该：
1. 体现价值投资的核心理念
2. 用简单易懂的语言解释复杂概念
3. 结合具体的投资案例或经验
4. 展现你独特的投资智慧和幽默感
5. 保持谦逊但权威的语调

请直接给出你的观点，不需要问候语。
`;

    const response = await buffettAgent.generate(prompt);

    return {
      userQuestion,
      messages: [{
        speaker: '巴菲特',
        content: response.text,
        timestamp: new Date().toISOString(),
      }],
    };
  },
});

// 第二步：芒格回应并评价巴菲特的观点
const mungerResponse = createStep({
  id: 'munger-response',
  description: '芒格回应用户问题并评价巴菲特的观点',
  inputSchema: z.object({
    userQuestion: z.string(),
    messages: z.array(messageSchema),
  }),
  outputSchema: conversationSchema,
  execute: async ({ inputData, mastra }) => {
    const { userQuestion, messages } = inputData;

    const mungerAgent = mastra?.getAgent('mungerAgent');
    if (!mungerAgent) {
      throw new Error('Munger agent not found');
    }

    const buffettMessage = messages.find(m => m.speaker === '巴菲特');
    
    const prompt = `
作为查理·芒格，你正在参加投资讨论群聊。巴菲特刚刚回应了一个投资问题，现在轮到你发言。

用户问题：${userQuestion}

巴菲特的观点：
${buffettMessage?.content}

请以芒格的身份：
1. 对用户问题给出你的独特见解（运用多元思维模型）
2. 评价和补充巴菲特的观点 - 你可以赞同、质疑或提供不同角度
3. 指出可能存在的认知偏误或思维陷阱
4. 展现你犀利的智慧和跨学科思维
5. 保持你直言不讳但睿智的风格

你的回应应该既回答用户问题，也与巴菲特进行智慧的交流。
`;

    const response = await mungerAgent.generate(prompt);

    const newMessages = [...messages, {
      speaker: '芒格',
      content: response.text,
      timestamp: new Date().toISOString(),
    }];

    return {
      userQuestion,
      messages: newMessages,
    };
  },
});

// 第三步：木头姐回应并评价前两位的观点
const cathieResponse = createStep({
  id: 'cathie-response',
  description: '木头姐回应用户问题并评价前面两位大师的观点',
  inputSchema: conversationSchema,
  outputSchema: conversationSchema,
  execute: async ({ inputData, mastra }) => {
    const { userQuestion, messages } = inputData;

    const cathieAgent = mastra?.getAgent('cathieWoodAgent');
    if (!cathieAgent) {
      throw new Error('Cathie Wood agent not found');
    }

    const buffettMessage = messages.find(m => m.speaker === '巴菲特');
    const mungerMessage = messages.find(m => m.speaker === '芒格');
    
    const prompt = `
作为凯瑟琳·伍德（木头姐），你正在参加投资讨论群聊。巴菲特和芒格已经就一个投资问题发表了他们的观点，现在轮到你发言。

用户问题：${userQuestion}

巴菲特的观点：
${buffettMessage?.content}

芒格的观点：
${mungerMessage?.content}

请以木头姐的身份：
1. 对用户问题给出你的颠覆性创新投资视角
2. 评价巴菲特和芒格的观点 - 指出传统投资思维的局限性
3. 强调技术创新和未来趋势的重要性
4. 分享你对颠覆性技术的独特洞察
5. 展现你对创新投资的激情和前瞻性思维
6. 既要尊重两位前辈，也要坚持你的创新理念

你的回应应该为这个讨论带来全新的视角，展现新一代投资思维。
`;

    const response = await cathieAgent.generate(prompt);

    const newMessages = [...messages, {
      speaker: '木头姐',
      content: response.text,
      timestamp: new Date().toISOString(),
    }];

    return {
      userQuestion,
      messages: newMessages,
    };
  },
});

// 第四步：生成讨论总结
const generateSummary = createStep({
  id: 'generate-summary',
  description: '生成三位投资大师讨论的总结',
  inputSchema: conversationSchema,
  outputSchema: z.object({
    userQuestion: z.string(),
    messages: z.array(messageSchema),
    summary: z.string(),
  }),
  execute: async ({ inputData }) => {
    const { userQuestion, messages } = inputData;

    // 生成简要总结
    const summary = `
💬 投资大师群聊总结

用户问题: ${userQuestion}

🔄 讨论要点:
• 巴菲特强调了价值投资的重要性和长期持有策略
• 芒格从理性思维和多元模型角度提供了深度分析
• 木头姐带来了颠覆性创新投资的前瞻视角

📊 观点对比:
- 传统价值投资 vs 创新成长投资
- 长期稳健策略 vs 颠覆性机会捕捉
- 风险控制思维 vs 技术趋势洞察

💡 核心启示:
三位大师的不同观点为投资者提供了全面的思维框架，结合传统智慧与创新视野，有助于做出更好的投资决策。
`;

    return {
      userQuestion,
      messages,
      summary,
    };
  },
});

// 创建投资大师群聊工作流
const investmentGroupChatWorkflow = createWorkflow({
  id: 'investment-group-chat',
  inputSchema: z.object({
    userQuestion: z.string().describe('用户提出的投资问题'),
  }),
  outputSchema: z.object({
    userQuestion: z.string(),
    messages: z.array(messageSchema),
    summary: z.string(),
  }),
})
  .then(buffettResponse)
  .then(mungerResponse)
  .then(cathieResponse)
  .then(generateSummary);

investmentGroupChatWorkflow.commit();

export { investmentGroupChatWorkflow }; 