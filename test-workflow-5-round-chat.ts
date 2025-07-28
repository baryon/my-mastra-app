import { mastra } from './src/mastra/index';
import * as readline from 'readline';

async function testWorkflowGroupChat() {
  console.log('🎯 测试基于工作流的5轮投资大师群聊');
  console.log('═'.repeat(80));
  
  // 获取工作流
  const workflow = mastra.getWorkflow('fiveRoundInvestmentChatWorkflow');
  if (!workflow) {
    console.error('❌ 工作流未找到');
    return;
  }
  
  // 创建readline接口用于交互式输入
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  // 获取用户问题
  const userQuestion = await new Promise<string>((resolve) => {
    rl.question('\n💬 请输入你想讨论的投资问题: ', (answer) => {
      resolve(answer);
    });
  });
  
  rl.close();
  
  if (!userQuestion.trim()) {
    console.log('❌ 请输入有效的问题');
    return;
  }
  
  try {
    console.log('\n🚀 启动工作流版本的5轮群聊讨论...');
    
    // 执行工作流
    const result = await (workflow as any).execute({
      inputData: {
        userQuestion: userQuestion.trim()
      }
    });
    
    console.log('\n🎉 工作流执行完成！');
    console.log('═'.repeat(80));
    console.log(`✅ 总共进行了 ${result.totalRounds} 轮讨论`);
    console.log(`📝 收集了 ${result.messages.length} 条发言`);
    
    // 显示统计信息
    const roundCounts = [1, 2, 3, 4, 5].map(round => ({
      round,
      count: result.messages.filter(msg => msg.round === round).length
    }));
    
    console.log('\n📊 各轮发言统计:');
    roundCounts.forEach(({ round, count }) => {
      console.log(`  第${round}轮: ${count}条发言`);
    });
    
  } catch (error: any) {
    console.error('\n❌ 工作流执行失败:', error.message);
    if (error.message.includes('API key')) {
      console.log('\n💡 提示: 请设置环境变量 OPENAI_API_KEY');
      console.log('   export OPENAI_API_KEY="your-api-key-here"');
    }
  }
}

// 预设问题测试函数
async function testWithPresetQuestions() {
  console.log('🎯 使用预设问题测试工作流群聊');
  console.log('═'.repeat(80));
  
  const presetQuestions = [
    "如何看待当前AI股票的投资机会？",
    "价值投资在科技股上还适用吗？",
    "如何平衡长期投资和短期机会？"
  ];
  
  const workflow = mastra.getWorkflow('fiveRoundInvestmentChatWorkflow');
  if (!workflow) {
    console.error('❌ 工作流未找到');
    return;
  }
  
  for (let i = 0; i < presetQuestions.length; i++) {
    const question = presetQuestions[i];
    console.log(`\n🔍 测试问题 ${i + 1}: ${question}`);
    console.log('─'.repeat(60));
    
    try {
      const result = await (workflow as any).execute({
        inputData: {
          userQuestion: question
        }
      });
      
      console.log(`✅ 问题 ${i + 1} 完成: ${result.messages.length} 条发言`);
      
      // 稍作停顿
      if (i < presetQuestions.length - 1) {
        console.log('\n⏳ 准备下一个问题...');
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
      
    } catch (error: any) {
      console.error(`❌ 问题 ${i + 1} 失败:`, error.message);
      break;
    }
  }
}

// 工作流信息查看函数
async function showWorkflowInfo() {
  console.log('📋 工作流信息');
  console.log('═'.repeat(80));
  
  const workflow = mastra.getWorkflow('fiveRoundInvestmentChatWorkflow');
  if (!workflow) {
    console.error('❌ 工作流未找到');
    return;
  }
  
  console.log('✅ 工作流已注册');
  console.log(`🆔 ID: fiveRoundInvestmentChatWorkflow`);
  console.log(`📝 描述: 5轮投资大师深度群聊讨论`);
  console.log(`🔧 特性:`);
  console.log(`   • 使用 .dowhile() 循环实现`);
  console.log(`   • 实时console输出`);
  console.log(`   • 状态持久化`);
  console.log(`   • 自动总结生成`);
  console.log(`   • 类型安全的schema`);
}

// 主函数
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--info')) {
    await showWorkflowInfo();
  } else if (args.includes('--preset')) {
    await testWithPresetQuestions();
  } else if (args.includes('--interactive')) {
    await testWorkflowGroupChat();
  } else {
    console.log('🎯 基于工作流的5轮投资大师群聊测试');
    console.log('═'.repeat(80));
    console.log('使用方法:');
    console.log('  --interactive  交互式输入问题');
    console.log('  --preset      使用预设问题测试');
    console.log('  --info        查看工作流信息');
    console.log('');
    console.log('示例:');
    console.log('  npx tsx test-workflow-5-round-chat.ts --interactive');
    console.log('  npx tsx test-workflow-5-round-chat.ts --preset');
    console.log('  npx tsx test-workflow-5-round-chat.ts --info');
  }
}

// 执行主函数
const isMainModule = process.argv[1]?.includes('test-workflow-5-round-chat.ts');
if (isMainModule) {
  main().catch(console.error);
} 