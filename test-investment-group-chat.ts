import { mastra } from './src/mastra/index.js';

// 获取投资群聊工作流
const groupChatWorkflow = mastra.getWorkflow('investmentGroupChatWorkflow');

/**
 * 格式化显示群聊对话
 */
function displayGroupChat(result: any) {
  console.log('\n🎯 投资大师群聊');
  console.log('═'.repeat(80));
  
  console.log(`\n❓ 用户问题: ${result.userQuestion}`);
  console.log('─'.repeat(80));

  // 显示每位大师的发言
  result.messages.forEach((message: any, index: number) => {
    const icons = {
      '巴菲特': '💎',
      '芒格': '🎯', 
      '木头姐': '🌟'
    };
    
    const icon = icons[message.speaker as keyof typeof icons] || '💬';
    
    console.log(`\n${icon} ${message.speaker}:`);
    console.log('─'.repeat(40));
    console.log(message.content);
    
    if (index < result.messages.length - 1) {
      console.log('\n' + '·'.repeat(80));
    }
  });

  // 显示总结
  console.log('\n📋 讨论总结');
  console.log('═'.repeat(80));
  console.log(result.summary);
}

/**
 * 运行预设的群聊测试案例
 */
async function runGroupChatTests() {
  console.log('🚀 投资大师群聊工作流测试');
  console.log('本测试将展示三位投资大师如何就同一问题进行深度讨论\n');

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
      console.log('⏳ 启动投资大师群聊讨论...\n');
      
      const result = await groupChatWorkflow.execute({
        inputData: {
          userQuestion: question
        }
      });

      displayGroupChat(result);

      // 如果不是最后一个测试，等待一下
      if (i < testQuestions.length - 1) {
        console.log('\n⏸️  等待3秒后进行下一个测试...');
        await new Promise(resolve => setTimeout(resolve, 3000));
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

      console.log('\n⏳ 投资大师们正在讨论中...');
      
      const startTime = Date.now();
             const result = await groupChatWorkflow.execute({
         inputData: {
           userQuestion: userInput
         }
       });
      const endTime = Date.now();

      displayGroupChat(result);
      
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

  const question = '特斯拉股票现在还值得投资吗？请分析其投资价值。';
  
  try {
    console.log('⏳ 启动群聊讨论...\n');
    
    const result = await groupChatWorkflow.execute({
      inputData: {
        userQuestion: question
      }
    });

    displayGroupChat(result);

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
  console.log('📖 投资大师群聊工作流使用说明');
  console.log('═'.repeat(50));
  console.log('');
  console.log('🎯 功能特点:');
  console.log('  • 三位投资大师按顺序讨论同一问题');
  console.log('  • 每位大师都会评价前面发言者的观点');
  console.log('  • 自动生成讨论总结和核心观点');
  console.log('');
  console.log('💬 参与者:');
  console.log('  💎 巴菲特: 价值投资专家，强调长期价值');
  console.log('  🎯 芒格: 理性思维大师，提供多元视角');
  console.log('  🌟 木头姐: 创新投资专家，关注颠覆性技术');
  console.log('');
  console.log('🚀 运行方式:');
  console.log('  npx tsx test-investment-group-chat.ts [选项]');
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

  console.log('🎯 投资大师群聊工作流');
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
const isMainModule = process.argv[1]?.includes('test-investment-group-chat.ts');
if (isMainModule) {
  main();
}

// 导出函数供其他文件使用
export {
  runGroupChatTests,
  interactiveGroupChat,
  quickTest,
  displayGroupChat
}; 