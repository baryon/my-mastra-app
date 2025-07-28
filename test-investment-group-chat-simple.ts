import { mastra } from './src/mastra/index.js';

// 获取三位投资大师的agents
const buffettAgent = mastra.getAgent('buffettAgent');
const mungerAgent = mastra.getAgent('mungerAgent');
const cathieWoodAgent = mastra.getAgent('cathieWoodAgent');

/**
 * 投资大师群聊模拟器
 * 让三位投资大师就同一问题进行讨论，并互相评价彼此的观点
 */
class InvestmentGroupChat {
  private messages: Array<{
    speaker: string;
    content: string;
    timestamp: string;
    round?: number;
  }> = [];

  /**
   * 格式化显示群聊对话
   */
  private displayGroupChat(userQuestion: string, summary: string) {
    console.log('\n🎯 投资大师群聊');
    console.log('═'.repeat(80));
    
    console.log(`\n❓ 用户问题: ${userQuestion}`);
    console.log('─'.repeat(80));

    // 显示每位大师的发言
    this.messages.forEach((message, index) => {
      const icons = {
        '巴菲特': '💎',
        '芒格': '🎯', 
        '木头姐': '🌟'
      };
      
      const icon = icons[message.speaker as keyof typeof icons] || '💬';
      
      console.log(`\n${icon} ${message.speaker}:`);
      console.log('─'.repeat(40));
      console.log(message.content);
      
      if (index < this.messages.length - 1) {
        console.log('\n' + '·'.repeat(80));
      }
    });

    // 显示总结
    console.log('\n📋 讨论总结');
    console.log('═'.repeat(80));
    console.log(summary);
  }

  /**
   * 生成讨论总结
   */
  private generateSummary(userQuestion: string): string {
    return `
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
  }

  /**
   * 实时显示单个发言
   */
  private displaySingleMessage(message: any, roundNumber?: number) {
    const icons = {
      '巴菲特': '💎',
      '芒格': '🎯', 
      '木头姐': '🌟'
    };
    
    const icon = icons[message.speaker as keyof typeof icons] || '💬';
    const roundInfo = roundNumber ? ` (第${roundNumber}轮)` : '';
    
    console.log(`\n${icon} ${message.speaker}${roundInfo}:`);
    console.log('─'.repeat(50));
    console.log(message.content);
    console.log('\n' + '·'.repeat(80));
  }

  /**
   * 启动多轮群聊讨论
   */
  async startMultiRoundGroupChat(userQuestion: string, rounds: number = 5) {
    this.messages = []; // 清空之前的消息
    
    console.log(`\n🎯 开始${rounds}轮投资大师群聊讨论`);
    console.log('═'.repeat(80));
    console.log(`\n❓ 讨论主题: ${userQuestion}`);
    console.log('═'.repeat(80));
    
    try {
      for (let round = 1; round <= rounds; round++) {
        console.log(`\n🔥 第${round}轮讨论开始`);
        console.log('━'.repeat(60));
        
                 // 获取之前的对话历史（用于后续轮次的上下文）
         const previousDiscussion = this.messages.map((msg) => 
           `${msg.speaker}: ${msg.content}`
         ).join('\n\n');

        // 巴菲特发言
        console.log(`💎 巴菲特正在思考第${round}轮发言...`);
        const buffettPrompt = this.generateBuffettPrompt(userQuestion, round, previousDiscussion);
        const buffettResponse = await buffettAgent.generate(buffettPrompt);
        
        const buffettMessage = {
          speaker: '巴菲特',
          content: buffettResponse.text,
          timestamp: new Date().toISOString(),
          round: round
        };
        this.messages.push(buffettMessage);
        this.displaySingleMessage(buffettMessage, round);

        // 芒格发言
        console.log(`🎯 芒格正在分析第${round}轮...`);
        const mungerPrompt = this.generateMungerPrompt(userQuestion, round, previousDiscussion, buffettResponse.text);
        const mungerResponse = await mungerAgent.generate(mungerPrompt);
        
        const mungerMessage = {
          speaker: '芒格',
          content: mungerResponse.text,
          timestamp: new Date().toISOString(),
          round: round
        };
        this.messages.push(mungerMessage);
        this.displaySingleMessage(mungerMessage, round);

        // 木头姐发言
        console.log(`🌟 木头姐正在创新思考第${round}轮...`);
        const cathiePrompt = this.generateCathiePrompt(userQuestion, round, previousDiscussion, buffettResponse.text, mungerResponse.text);
        const cathieResponse = await cathieWoodAgent.generate(cathiePrompt);
        
        const cathieMessage = {
          speaker: '木头姐',
          content: cathieResponse.text,
          timestamp: new Date().toISOString(),
          round: round
        };
        this.messages.push(cathieMessage);
        this.displaySingleMessage(cathieMessage, round);

        console.log(`\n✅ 第${round}轮讨论完成`);
        
        // 如果不是最后一轮，稍作停顿
        if (round < rounds) {
          console.log(`\n⏳ 准备进入第${round + 1}轮讨论...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // 生成并显示最终总结
      const summary = this.generateMultiRoundSummary(userQuestion, rounds);
      console.log('\n📋 ' + rounds + '轮讨论总结');
      console.log('═'.repeat(80));
      console.log(summary);

      return {
        userQuestion,
        messages: this.messages,
        summary,
        totalRounds: rounds
      };

    } catch (error) {
      console.error('❌ 多轮群聊讨论出现错误:', error);
      throw error;
    }
  }

  /**
   * 生成巴菲特的提示词
   */
  private generateBuffettPrompt(userQuestion: string, round: number, previousDiscussion: string): string {
    if (round === 1) {
      return `
作为投资大师巴菲特，你正在参加一个投资讨论群聊。这是第${round}轮讨论，你是第一个发言的人。

用户问题：${userQuestion}

请以巴菲特的身份回应这个问题。你的回答应该：
1. 体现价值投资的核心理念
2. 用简单易懂的语言解释复杂概念
3. 结合具体的投资案例或经验
4. 展现你独特的投资智慧和幽默感
5. 保持谦逊但权威的语调

请直接给出你的观点，不需要问候语。
`;
    } else {
      return `
作为投资大师巴菲特，这是第${round}轮讨论。基于之前的讨论内容，请继续深入分析这个投资问题。

原始问题：${userQuestion}

之前的讨论内容：
${previousDiscussion}

请在第${round}轮中：
1. 进一步深化你的价值投资观点
2. 回应芒格和木头姐在之前轮次中的观点
3. 提出新的投资角度或案例
4. 保持你一贯的投资哲学
5. 如果观点有变化，请说明原因

继续以你的智慧推进这个讨论。
`;
    }
  }

  /**
   * 生成芒格的提示词
   */
  private generateMungerPrompt(userQuestion: string, round: number, previousDiscussion: string, currentBuffettView: string): string {
    return `
作为查理·芒格，这是第${round}轮讨论。请基于之前的讨论和巴菲特本轮的观点，提供你的深刻洞察。

原始问题：${userQuestion}

巴菲特本轮观点：
${currentBuffettView}

${round > 1 ? `之前的讨论历史：\n${previousDiscussion}\n` : ''}

请在第${round}轮中：
1. 运用你的多元思维模型分析问题
2. 评价巴菲特本轮的观点，提出补充或不同角度
3. ${round > 1 ? '回应木头姐在之前轮次中的创新观点' : ''}
4. 指出可能存在的认知偏误或思维陷阱
5. 展现你犀利的智慧和跨学科思维
6. 保持你直言不讳但睿智的风格

继续推进这个有价值的讨论。
`;
  }

  /**
   * 生成木头姐的提示词
   */
  private generateCathiePrompt(userQuestion: string, round: number, previousDiscussion: string, currentBuffettView: string, currentMungerView: string): string {
    return `
作为凯瑟琳·伍德（木头姐），这是第${round}轮讨论。请基于所有讨论内容，提供你的颠覆性创新投资视角。

原始问题：${userQuestion}

本轮观点：
巴菲特：${currentBuffettView}

芒格：${currentMungerView}

${round > 1 ? `之前的讨论历史：\n${previousDiscussion}\n` : ''}

请在第${round}轮中：
1. 从颠覆性创新角度深入分析问题
2. 评价巴菲特和芒格本轮的观点
3. ${round > 1 ? '进一步发展你在之前轮次中的创新理念' : ''}
4. 强调技术创新和未来趋势的重要性
5. 分享具体的创新投资洞察
6. 挑战传统思维，展现前瞻性
7. 既要尊重前辈，也要坚持创新理念

为这个讨论带来更多创新视角。
`;
  }

  /**
   * 生成多轮讨论总结
   */
  private generateMultiRoundSummary(userQuestion: string, rounds: number): string {
    const roundSummaries = [];
    
         for (let i = 1; i <= rounds; i++) {
       const roundMessages = this.messages.filter(msg => msg.round === i);
       if (roundMessages.length > 0) {
         roundSummaries.push(`第${i}轮: 深入探讨了${userQuestion}的不同层面`);
       }
     }

    return `
💬 ${rounds}轮投资大师深度讨论总结

讨论主题: ${userQuestion}

🔄 讨论进程:
${roundSummaries.map(summary => `• ${summary}`).join('\n')}

📊 核心观点演进:
• 巴菲特: 从价值投资基础到深度案例分析，始终坚持长期价值理念
• 芒格: 运用多元思维模型，逐步揭示认知陷阱和理性分析框架
• 木头姐: 从创新技术角度挑战传统观念，展现未来投资趋势洞察

💡 讨论收获:
经过${rounds}轮深度讨论，三位大师的观点相互碰撞、补充和深化，为投资者提供了：
- 多维度的投资分析框架
- 传统与创新的思维融合
- 风险控制与机会把握的平衡
- 长期价值与短期趋势的权衡

🎯 最终启示:
这场${rounds}轮讨论充分展现了投资智慧的多样性和复杂性，每一种投资理念都有其价值和局限性。
最佳的投资策略往往需要综合考虑价值投资的稳健、理性分析的客观、以及创新视野的前瞻性。
`;
  }

  /**
   * 启动单轮群聊讨论（保留原有功能）
   */
  async startGroupChat(userQuestion: string) {
    return this.startMultiRoundGroupChat(userQuestion, 1);
  }
}

/**
 * 运行预设的群聊测试案例
 */
async function runGroupChatTests() {
  console.log('🚀 投资大师群聊模拟测试');
  console.log('本测试将展示三位投资大师如何就同一问题进行深度讨论\n');

  const groupChat = new InvestmentGroupChat();

  const testQuestions = [
    {
      category: '市场分析',
      question: '当前美股估值处于历史高位，我们应该如何看待这个现象？是继续投资还是保持谨慎？'
    },
    {
      category: '新兴技术',
      question: 'ChatGPT和AI技术的兴起对投资市场有什么影响？哪些公司会受益？'
    },
    {
      category: '投资策略',
      question: '年轻投资者应该如何在成长股和价值股之间分配资金？'
    },
    {
      category: '风险管理',
      question: '面对地缘政治风险和通胀压力，投资组合应该如何调整？'
    }
  ];

  for (let i = 0; i < testQuestions.length; i++) {
    const { category, question } = testQuestions[i];
    
    console.log(`\n🔍 测试 ${i + 1}: ${category}`);
    console.log('═'.repeat(100));
    
    try {
      console.log('⏳ 启动投资大师5轮群聊讨论...\n');
      
      await groupChat.startMultiRoundGroupChat(question, 5);

      // 如果不是最后一个测试，等待一下
      if (i < testQuestions.length - 1) {
        console.log('\n⏸️  等待5秒后进行下一个测试...');
        await new Promise(resolve => setTimeout(resolve, 5000));
      }

    } catch (error) {
      console.error(`❌ 测试 ${i + 1} 失败:`, error);
    }
  }

  console.log('\n🎉 所有群聊测试完成！');
}

/**
 * 交互式群聊模式
 */
async function interactiveGroupChat() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  const askQuestion = (question: string): Promise<string> => {
    return new Promise((resolve) => {
      rl.question(question, resolve);
    });
  };

  const groupChat = new InvestmentGroupChat();

  console.log('\n🎯 投资大师群聊 - 交互模式');
  console.log('═'.repeat(80));
  console.log('💡 输入你的投资问题，三位大师将进行深度讨论');
  console.log('💡 输入 "exit" 或 "quit" 退出');
  console.log('💡 输入 "examples" 查看示例问题\n');

  const exampleQuestions = [
    '比特币值得长期投资吗？',
    '如何看待新能源汽车行业的投资前景？',
    '现在买房还是投资股市更好？',
    '科技股的泡沫何时会破裂？',
    '价值投资策略还适用于当今市场吗？',
  ];

  while (true) {
    try {
      const userInput = await askQuestion('\n🤔 请输入你的问题: ');
      
      if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
        console.log('\n👋 感谢使用投资大师群聊！再见！');
        break;
      }

      if (userInput.toLowerCase() === 'examples') {
        console.log('\n📝 示例问题：');
        exampleQuestions.forEach((q, i) => {
          console.log(`${i + 1}. ${q}`);
        });
        continue;
      }

      if (!userInput.trim()) {
        console.log('⚠️  请输入一个有效的问题');
        continue;
      }

      console.log('\n⏳ 投资大师们正在进行5轮深度讨论...');
      
      const startTime = Date.now();
      await groupChat.startMultiRoundGroupChat(userInput, 5);
      const endTime = Date.now();
      
      console.log(`\n⏱️  讨论用时: ${((endTime - startTime) / 1000).toFixed(1)}秒`);
      console.log('\n' + '═'.repeat(80));

    } catch (error) {
      console.error('\n❌ 群聊讨论出现错误:', error);
      console.log('\n请重新输入问题或检查网络连接');
    }
  }

  rl.close();
}

/**
 * 单个问题快速测试
 */
async function quickTest() {
  console.log('⚡ 快速测试投资大师群聊功能\n');

  const groupChat = new InvestmentGroupChat();
  const question = '特斯拉股票现在还值得投资吗？请分析其投资价值。';
  
  try {
    console.log('⏳ 启动5轮群聊讨论...\n');
    
    await groupChat.startMultiRoundGroupChat(question, 5);

    console.log('\n✅ 快速测试完成！');
    
  } catch (error) {
    console.error('❌ 快速测试失败:', error);
  }
}

/**
 * 检查环境配置
 */
function checkEnvironment() {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  请先配置OPENAI_API_KEY环境变量');
    console.log('💡 设置方法: export OPENAI_API_KEY=your-api-key');
    console.log('💡 或创建.env文件并添加: OPENAI_API_KEY=your-api-key\n');
    return false;
  }
  
  console.log('✅ 环境配置检查通过\n');
  return true;
}

/**
 * 显示使用说明
 */
function showUsage() {
  console.log('📖 投资大师群聊模拟器使用说明');
  console.log('═'.repeat(50));
  console.log('');
  console.log('🎯 功能特点:');
  console.log('  • 三位投资大师按顺序讨论同一问题');
  console.log('  • 每位大师都会评价前面发言者的观点');
  console.log('  • 自动生成讨论总结和核心观点');
  console.log('  • 模拟真实的投资专家圆桌讨论');
  console.log('');
  console.log('💬 参与者:');
  console.log('  💎 巴菲特: 价值投资专家，强调长期价值');
  console.log('  🎯 芒格: 理性思维大师，提供多元视角');
  console.log('  🌟 木头姐: 创新投资专家，关注颠覆性技术');
  console.log('');
  console.log('🚀 运行方式:');
  console.log('  npx tsx test-investment-group-chat-simple.ts [选项]');
  console.log('');
  console.log('📋 可用选项:');
  console.log('  --interactive, -i    进入交互式对话模式');
  console.log('  --quick, -q         运行快速测试');
  console.log('  --help, -h          显示此帮助信息');
  console.log('  (无参数)             运行完整测试套件');
  console.log('');
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  // 显示帮助
  if (args.includes('--help') || args.includes('-h')) {
    showUsage();
    return;
  }

  console.log('🎯 投资大师群聊模拟器');
  console.log('═'.repeat(50));
  
  // 检查环境
  if (!checkEnvironment()) {
    return;
  }

  try {
    if (args.includes('--interactive') || args.includes('-i')) {
      await interactiveGroupChat();
    } else if (args.includes('--quick') || args.includes('-q')) {
      await quickTest();
    } else {
      await runGroupChatTests();
    }
  } catch (error) {
    console.error('❌ 程序运行出错:', error);
  }
}

// 如果直接运行此文件，则执行主函数
const isMainModule = process.argv[1]?.includes('test-investment-group-chat-simple.ts');
if (isMainModule) {
  main();
}

// 导出类和函数供其他文件使用
export {
  InvestmentGroupChat,
  runGroupChatTests,
  interactiveGroupChat,
  quickTest
}; 