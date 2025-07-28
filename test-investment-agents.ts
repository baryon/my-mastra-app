import { mastra } from './src/mastra/index.js';

// 获取投资大师agents
const buffettAgent = mastra.getAgent('buffettAgent');
const mungerAgent = mastra.getAgent('mungerAgent');
const cathieWoodAgent = mastra.getAgent('cathieWoodAgent');

async function testInvestmentAgents() {
  console.log('🎯 投资大师AI助手测试');
  console.log('===================================');
  
  // 测试巴菲特 - 价值投资理念
  console.log('\n📈 与巴菲特对话 - 价值投资专家');
  console.log('-----------------------------------');
  
  const buffettResponse = await buffettAgent.generate(
    "我想了解价值投资的基本原理，以及如何选择优质股票？"
  );
  console.log('巴菲特:', buffettResponse.text);

  // 测试芒格 - 多元思维模型
  console.log('\n🧠 与芒格对话 - 理性思维大师');
  console.log('-----------------------------------');
  
  const mungerResponse = await mungerAgent.generate(
    "投资者最容易犯哪些认知偏误？如何避免这些陷阱？"
  );
  console.log('芒格:', mungerResponse.text);

  // 测试木头姐 - 创新投资专家
  console.log('\n🚀 与木头姐对话 - 颠覆性创新投资专家');
  console.log('-----------------------------------');
  
  const cathieResponse = await cathieWoodAgent.generate(
    "人工智能行业的投资机会如何？哪些公司值得关注？"
  );
  console.log('木头姐:', cathieResponse.text);

  // 展示对比不同观点
  console.log('\n⚖️  同一问题的不同视角');
  console.log('===================================');
  
  const question = "现在市场波动很大，应该如何应对？";
  console.log(`\n问题: ${question}\n`);

  const buffettView = await buffettAgent.generate(question);
  console.log('💎 巴菲特的观点:', buffettView.text);

  const mungerView = await mungerAgent.generate(question);
  console.log('\n🎯 芒格的观点:', mungerView.text);

  const cathieView = await cathieWoodAgent.generate(question);
  console.log('\n🌟 木头姐的观点:', cathieView.text);

  console.log('\n✅ 投资大师AI助手测试完成！');
  console.log('\n💡 提示: 你可以继续与任何一位投资大师对话，获取他们独特的投资智慧。');
}

// 交互式对话函数
async function interactiveChat() {
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

  console.log('\n🎯 投资大师AI助手 - 交互模式');
  console.log('===================================');
  console.log('选择你想对话的投资大师:');
  console.log('1. 巴菲特 (价值投资)');
  console.log('2. 芒格 (理性思维)');
  console.log('3. 木头姐 (创新投资)');
  console.log('4. 退出');
  
  while (true) {
    const choice = await askQuestion('\n请选择 (1-4): ');
    
    if (choice === '4') {
      console.log('再见！');
      break;
    }
    
    if (!['1', '2', '3'].includes(choice)) {
      console.log('请选择有效的选项 (1-4)');
      continue;
    }
    
    const question = await askQuestion('\n请输入你的问题 (或输入 "back" 返回主菜单): ');
    
    if (question.toLowerCase() === 'back') {
      continue;
    }
    
    let agent: any = null;
    let name: string = '';
    
    switch (choice) {
      case '1':
        agent = buffettAgent;
        name = '巴菲特';
        break;
      case '2':
        agent = mungerAgent;
        name = '芒格';
        break;
      case '3':
        agent = cathieWoodAgent;
        name = '木头姐';
        break;
    }
    
    if (agent && name) {
      console.log(`\n${name} 正在思考...`);
      const response = await agent.generate(question);
      console.log(`\n${name}: ${response.text}`);
    }
  }
  
  rl.close();
}

// 运行测试 - ES模块兼容
const isMainModule = process.argv[1]?.includes('test-investment-agents.ts');

if (isMainModule) {
  const args = process.argv.slice(2);
  
  if (args.includes('--interactive') || args.includes('-i')) {
    interactiveChat().catch(console.error);
  } else {
    testInvestmentAgents().catch(console.error);
  }
} 