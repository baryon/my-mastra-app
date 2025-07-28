/**
 * 投资大师AI助手使用演示
 * 
 * 本文件展示如何使用三位投资大师的AI助手：
 * - 巴菲特：价值投资专家
 * - 芒格：理性思维大师  
 * - 木头姐：颠覆性创新投资专家
 */

import { mastra } from './src/mastra/index.js';

// 获取三位投资大师的agents
const buffettAgent = mastra.getAgent('buffettAgent');
const mungerAgent = mastra.getAgent('mungerAgent');
const cathieWoodAgent = mastra.getAgent('cathieWoodAgent');

/**
 * 示例1: 单独与每位投资大师对话
 */
async function individualConsultation() {
  console.log('💼 个人投资咨询演示\n');

  // 与巴菲特讨论价值投资
  const buffettQuestion = "我是投资新手，应该如何开始价值投资？有哪些必须要了解的基本原则？";
  console.log(`📈 问巴菲特: ${buffettQuestion}`);
  
  const buffettAnswer = await buffettAgent.generate(buffettQuestion);
  console.log(`巴菲特: ${buffettAnswer.text}\n`);

  // 与芒格讨论投资心理学
  const mungerQuestion = "投资中最容易犯的心理错误有哪些？如何建立理性的投资思维？";
  console.log(`🧠 问芒格: ${mungerQuestion}`);
  
  const mungerAnswer = await mungerAgent.generate(mungerQuestion);
  console.log(`芒格: ${mungerAnswer.text}\n`);

  // 与木头姐讨论创新投资
  const cathieQuestion = "当前AI和新能源领域有哪些值得关注的投资机会？";
  console.log(`🚀 问木头姐: ${cathieQuestion}`);
  
  const cathieAnswer = await cathieWoodAgent.generate(cathieQuestion);
  console.log(`木头姐: ${cathieAnswer.text}\n`);
}

/**
 * 示例2: 同一问题获取多个专家观点
 */
async function multiPerspectiveAnalysis() {
  console.log('🔍 多角度分析演示\n');
  
  const question = "面对当前市场的高通胀环境，投资者应该如何调整投资组合？";
  console.log(`❓ 共同问题: ${question}\n`);

  // 并行获取三位大师的观点
  const [buffettView, mungerView, cathieView] = await Promise.all([
    buffettAgent.generate(question),
    mungerAgent.generate(question),
    cathieWoodAgent.generate(question)
  ]);

  console.log(`💎 巴菲特的观点:\n${buffettView.text}\n`);
  console.log(`🎯 芒格的观点:\n${mungerView.text}\n`);
  console.log(`🌟 木头姐的观点:\n${cathieView.text}\n`);
}

/**
 * 示例3: 连续对话和深度讨论
 */
async function deepConversation() {
  console.log('💬 深度对话演示\n');

  // 与巴菲特进行多轮对话
  console.log('📈 与巴菲特的深度对话:');
  
  const initialQuestion = "特斯拉的股票现在估值很高，您如何看待？";
  console.log(`用户: ${initialQuestion}`);
  
  const response1 = await buffettAgent.generate(initialQuestion, {
    memory: { resource: 'user-consultation', thread: 'tesla-discussion' }
  });
  console.log(`巴菲特: ${response1.text}\n`);

  const followUpQuestion = "那您认为什么时候是投资特斯拉的好时机？";
  console.log(`用户: ${followUpQuestion}`);
  
  const response2 = await buffettAgent.generate(followUpQuestion, {
    memory: { resource: 'user-consultation', thread: 'tesla-discussion' }
  });
  console.log(`巴菲特: ${response2.text}\n`);
}

/**
 * 示例4: 针对性投资建议
 */
async function targetedAdvice() {
  console.log('🎯 针对性建议演示\n');

  // 根据不同投资目标选择合适的专家
  const scenarios = [
    {
      expert: buffettAgent,
      name: '巴菲特',
      scenario: '退休规划',
      question: '我今年45岁，想为20年后的退休做投资规划，应该如何配置资产？'
    },
    {
      expert: mungerAgent, 
      name: '芒格',
      scenario: '投资决策',
      question: '我在考虑投资一家生物技术公司，但不确定如何评估其风险，您有什么建议？'
    },
    {
      expert: cathieWoodAgent,
      name: '木头姐',
      scenario: '科技投资',
      question: '量子计算领域的投资前景如何？有哪些公司值得关注？'
    }
  ];

  for (const { expert, name, scenario, question } of scenarios) {
    console.log(`📋 ${scenario}场景 - 咨询${name}:`);
    console.log(`问题: ${question}`);
    
    const advice = await expert.generate(question);
    console.log(`${name}: ${advice.text}\n`);
  }
}

/**
 * 示例5: 投资组合评估
 */
async function portfolioReview() {
  console.log('📊 投资组合评估演示\n');

  const portfolio = `
  我目前的投资组合如下：
  - 40% 标普500指数基金
  - 20% 科技股（苹果、微软、亚马逊）
  - 15% 新能源股（特斯拉、比亚迪）
  - 10% 价值股（伯克希尔、强生）
  - 10% 债券
  - 5% 现金
  
  我32岁，风险承受能力中等偏高，投资期限10-15年。
  `;

  // 请三位专家分别评估投资组合
  console.log('📈 投资组合详情:');
  console.log(portfolio);

  const evaluations = await Promise.all([
    buffettAgent.generate(`请从价值投资角度评估以下投资组合：${portfolio}`),
    mungerAgent.generate(`请从风险管理和理性投资角度评估以下投资组合：${portfolio}`),
    cathieWoodAgent.generate(`请从创新投资角度评估以下投资组合：${portfolio}`)
  ]);

  console.log(`💎 巴菲特的评估:\n${evaluations[0].text}\n`);
  console.log(`🎯 芒格的评估:\n${evaluations[1].text}\n`);
  console.log(`🌟 木头姐的评估:\n${evaluations[2].text}\n`);
}

/**
 * 主演示函数
 */
async function runDemo() {
  console.log('🎯 投资大师AI助手完整演示');
  console.log('=' .repeat(50));
  
  try {
    console.log('\n🚀 检查环境配置...');
    
    // 检查是否配置了API密钥
    if (!process.env.OPENAI_API_KEY) {
      console.log('⚠️  请先配置OPENAI_API_KEY环境变量');
      console.log('💡 设置方法: export OPENAI_API_KEY=your-api-key');
      return;
    }

    console.log('✅ 环境配置正常，开始演示...\n');

    // 运行各种演示
    await individualConsultation();
    await multiPerspectiveAnalysis();
    await deepConversation();
    await targetedAdvice();
    await portfolioReview();

    console.log('🎉 演示完成！');
    console.log('\n💡 提示：');
    console.log('- 每个agent都有独立的记忆，支持多轮对话');
    console.log('- 可以根据具体需求选择最合适的专家咨询');
    console.log('- 同时咨询多位专家可以获得更全面的视角');

  } catch (error) {
    console.error('❌ 演示过程中出现错误:', error);
  }
}

// 如果直接运行此文件，则执行演示
const isMainModule = process.argv[1]?.includes('investment-agents-demo.ts');
if (isMainModule) {
  runDemo();
}

// 导出演示函数供其他文件使用
export {
  individualConsultation,
  multiPerspectiveAnalysis,
  deepConversation,
  targetedAdvice,
  portfolioReview,
  runDemo
}; 