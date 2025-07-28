import { mastra } from './src/mastra/index.js';

// 获取三位投资大师的agents
const buffettAgent = mastra.getAgent('buffettAgent');
const mungerAgent = mastra.getAgent('mungerAgent');
const cathieWoodAgent = mastra.getAgent('cathieWoodAgent');

/**
 * 5轮连续群聊讨论类
 */
class FiveRoundGroupChat {
  private messages: Array<{
    speaker: string;
    content: string;
    timestamp: string;
    round: number;
  }> = [];

  /**
   * 实时显示单个发言
   */
  private displaySingleMessage(message: { speaker: string; content: string; round: number }) {
    const icons = {
      '巴菲特': '💎',
      '芒格': '🎯', 
      '木头姐': '🌟'
    };
    
    const icon = icons[message.speaker as keyof typeof icons] || '💬';
    
    console.log(`\n${icon} ${message.speaker} (第${message.round}轮):`);
    console.log('─'.repeat(50));
    console.log(message.content);
    console.log('\n' + '·'.repeat(80));
  }

  /**
   * 启动5轮群聊讨论
   */
  async start5RoundGroupChat(userQuestion: string) {
    this.messages = [];
    const rounds = 5;
    
    console.log(`\n🎯 开始${rounds}轮投资大师深度讨论`);
    console.log('═'.repeat(80));
    console.log(`\n❓ 讨论主题: ${userQuestion}`);
    console.log('═'.repeat(80));
    
    try {
      for (let round = 1; round <= rounds; round++) {
        console.log(`\n🔥 第${round}轮讨论开始`);
        console.log('━'.repeat(60));
        
        // 获取之前的对话历史
        const previousDiscussion = this.messages.map(msg => 
          `${msg.speaker} (第${msg.round}轮): ${msg.content}`
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
        this.displaySingleMessage(buffettMessage);

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
        this.displaySingleMessage(mungerMessage);

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
        this.displaySingleMessage(cathieMessage);

        console.log(`\n✅ 第${round}轮讨论完成`);
        
        // 如果不是最后一轮，稍作停顿
        if (round < rounds) {
          console.log(`\n⏳ 准备进入第${round + 1}轮讨论...`);
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }

      // 生成最终总结
      const summary = this.generateFinalSummary(userQuestion, rounds);
      console.log('\n📋 5轮讨论最终总结');
      console.log('═'.repeat(80));
      console.log(summary);

      return {
        userQuestion,
        messages: this.messages,
        summary,
        totalRounds: rounds
      };

    } catch (error) {
      console.error('❌ 5轮群聊讨论出现错误:', error);
      throw error;
    }
  }

  /**
   * 生成巴菲特的提示词
   */
  private generateBuffettPrompt(userQuestion: string, round: number, previousDiscussion: string): string {
    if (round === 1) {
      return `
作为投资大师巴菲特，你正在参加一个5轮深度投资讨论。这是第${round}轮，你是第一个发言的人。

用户问题：${userQuestion}

请以巴菲特的身份回应这个问题，体现价值投资的核心理念，用简单易懂的语言解释复杂概念，结合具体的投资案例。请直接给出你的观点。
`;
    } else {
      return `
作为投资大师巴菲特，这是第${round}轮讨论。基于之前${round-1}轮的讨论，请继续深入分析这个投资问题。

原始问题：${userQuestion}

之前的讨论内容：
${previousDiscussion}

请在第${round}轮中进一步深化你的价值投资观点，回应芒格和木头姐在之前轮次中的观点，提出新的投资角度或案例。
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

请运用你的多元思维模型分析问题，评价巴菲特本轮的观点，指出可能的认知偏误，展现你犀利的智慧。
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

请从颠覆性创新角度分析问题，评价巴菲特和芒格的观点，强调技术创新和未来趋势，为讨论带来创新视角。
`;
  }

  /**
   * 生成最终总结
   */
  private generateFinalSummary(userQuestion: string, rounds: number): string {
    return `
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
  }
}

/**
 * 运行5轮群聊测试
 */
async function test5RoundGroupChat() {
  console.log('🚀 5轮投资大师群聊测试');
  console.log('本测试展示三位投资大师进行5轮连续深度讨论\n');

  const groupChat = new FiveRoundGroupChat();

  const testQuestion = '面对人工智能革命，传统投资策略需要如何调整？哪些行业和公司将成为最大的受益者？';
  
  try {
    await groupChat.start5RoundGroupChat(testQuestion);
    console.log('\n🎉 5轮群聊讨论圆满完成！');
    
  } catch (error) {
    console.error('❌ 5轮群聊测试失败:', error);
  }
}

/**
 * 交互式5轮群聊
 */
async function interactive5RoundGroupChat() {
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

  const groupChat = new FiveRoundGroupChat();

  console.log('\n🎯 5轮投资大师群聊 - 交互模式');
  console.log('═'.repeat(80));
  console.log('💡 输入你的投资问题，三位大师将进行5轮深度讨论');
  console.log('💡 输入 "exit" 退出\n');

  while (true) {
    try {
      const userInput = await askQuestion('\n🤔 请输入你想深度讨论的投资问题: ');
      
      if (userInput.toLowerCase() === 'exit') {
        console.log('\n👋 感谢使用5轮投资大师群聊！再见！');
        break;
      }

      if (!userInput.trim()) {
        console.log('⚠️  请输入一个有效的问题');
        continue;
      }

      console.log('\n⏳ 投资大师们正在进行5轮深度讨论...');
      
      const startTime = Date.now();
      await groupChat.start5RoundGroupChat(userInput);
      const endTime = Date.now();
      
      console.log(`\n⏱️  5轮讨论用时: ${((endTime - startTime) / 1000).toFixed(1)}秒`);
      console.log('\n' + '═'.repeat(80));

    } catch (error) {
      console.error('\n❌ 5轮群聊讨论出现错误:', error);
      console.log('\n请重新输入问题或检查网络连接');
    }
  }

  rl.close();
}

/**
 * 检查环境配置
 */
function checkEnvironment() {
  if (!process.env.OPENAI_API_KEY) {
    console.log('⚠️  请先配置OPENAI_API_KEY环境变量');
    console.log('💡 设置方法: export OPENAI_API_KEY=your-api-key\n');
    return false;
  }
  
  console.log('✅ 环境配置检查通过\n');
  return true;
}

/**
 * 主函数
 */
async function main() {
  const args = process.argv.slice(2);
  
  console.log('🎯 5轮投资大师群聊系统');
  console.log('═'.repeat(50));
  
  if (!checkEnvironment()) {
    return;
  }

  try {
    if (args.includes('--interactive') || args.includes('-i')) {
      await interactive5RoundGroupChat();
    } else {
      await test5RoundGroupChat();
    }
  } catch (error) {
    console.error('❌ 程序运行出错:', error);
  }
}

// 运行主函数
const isMainModule = process.argv[1]?.includes('test-5-round-group-chat.ts');
if (isMainModule) {
  main();
}

export { FiveRoundGroupChat }; 