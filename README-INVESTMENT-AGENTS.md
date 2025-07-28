# 投资大师AI智能体系统 💎🎯🌟

基于 Mastra 框架打造的三位传奇投资大师AI智能体：**巴菲特**、**芒格**和**木头姐**。每位大师都拥有独特的投资理念和个性化的对话风格。

## 🌟 投资大师阵容

### 💎 沃伦·巴菲特 (Warren Buffett)
**"奥马哈的先知"** - 世界最成功的价值投资者
- **核心理念**：价值投资、长期持有、安全边际
- **投资原则**：投资你理解的企业、护城河理论、复利的力量
- **对话风格**：平易近人、善用比喻、简单智慧

### 🎯 查理·芒格 (Charlie Munger) 
**"巴菲特的智慧伙伴"** - 多元思维模型大师
- **核心理念**：多元思维模型、理性决策、避免认知偏误
- **思维工具**：逆向思维、跨学科思考、心理学洞察
- **对话风格**：睿智犀利、直言不讳、启发深思

### 🌟 凯瑟琳·伍德 (Cathie Wood)
**"木头姐"** - 颠覆性创新投资的引领者
- **核心理念**：颠覆性创新、技术趋势、长期增长
- **五大创新平台**：AI、储能、机器人、基因测序、区块链
- **对话风格**：前瞻性强、数据驱动、充满激情

## 🚀 功能特性

### 1. 个人咨询模式
与任意一位投资大师进行一对一深度对话
```bash
# 运行单独咨询
npx tsx test-investment-agents.ts --interactive
```

### 2. 群聊讨论模式 (类直接调用实现)
三位大师针对同一问题进行依次发言和互相评价
```bash
# 运行群聊讨论
npx tsx test-investment-group-chat-simple.ts --interactive
```

### 3. 5轮连续深度讨论 (直接调用版本)
最深入的讨论体验，每轮都在前一轮基础上深化观点
```bash
# 运行5轮深度讨论
npx tsx test-5-round-group-chat.ts --interactive
```

### 4. 🔥 工作流版本5轮讨论 (NEW!)
基于 Mastra 工作流的优雅实现，使用 `.dowhile()` 循环
```bash
# 查看工作流信息
npx tsx test-workflow-5-round-chat.ts --info

# 交互式工作流讨论
npx tsx test-workflow-5-round-chat.ts --interactive

# 预设问题批量测试
npx tsx test-workflow-5-round-chat.ts --preset
```

## 🔄 工作流版本的优势

### 为什么工作流更适合多轮对话？

1. **结构化步骤管理** 📋
   - 每轮讨论作为独立步骤
   - 清晰的数据流转和状态管理
   - 自动化的轮次控制

2. **状态持久化** 💾
   - 自动管理对话历史
   - 步骤间状态传递
   - 错误时可恢复到特定步骤

3. **循环控制** 🔄
   ```typescript
   .dowhile(
     singleRoundDiscussion,
     async ({ inputData: { currentRound, maxRounds } }) => 
       currentRound <= maxRounds
   )
   ```

4. **可观测性** 👁️
   - 每个步骤的执行状态
   - 详细的调试信息
   - 性能监控

5. **可扩展性** 🔧
   - 轻松调整轮次数量
   - 可插拔的步骤逻辑
   - 支持条件分支

### 工作流架构

```
初始化步骤 → [单轮讨论步骤] × 5轮 → 最终总结步骤
           ↗ 巴菲特发言 ↘
          ↗  芒格发言  ↘ (循环)
         ↗   木头姐发言 ↘
```

## 📖 使用指南

### 环境设置
```bash
# 1. 设置OpenAI API密钥
export OPENAI_API_KEY="your-api-key-here"

# 2. 安装依赖 (如果还没有)
pnpm install
```

### 快速开始

#### 个人咨询
```bash
# 选择与特定大师对话
npx tsx test-investment-agents.ts --interactive
```

#### 群聊讨论  
```bash
# 直接调用版本 (稳定推荐)
npx tsx test-investment-group-chat-simple.ts --interactive

# 工作流版本 (更优雅的架构)
npx tsx test-workflow-5-round-chat.ts --interactive
```

#### 综合演示
```bash
# 体验多个投资场景
npx tsx investment-agents-demo.ts
```

## 💡 示例对话主题

### 市场分析类
- "如何看待当前AI股票的投资机会？"
- "美联储加息对股市的长期影响是什么？"
- "中美贸易关系如何影响投资策略？"

### 投资策略类
- "价值投资在科技股上还适用吗？"
- "如何在通胀环境下保护资产？"
- "长期投资和短期交易的平衡点在哪里？"

### 风险管理类
- "如何识别和避免投资泡沫？"
- "投资组合多样化的最佳策略是什么？"
- "黑天鹅事件后的投资机会在哪里？"

## 🎯 核心价值

### 🧠 多元智慧融合
- **传统价值** × **理性分析** × **创新视野**
- 三种投资哲学的完美结合
- 360度全方位投资洞察

### 💬 深度讨论体验
- **5轮连续讨论**：观点逐步深化
- **互相评价**：思维碰撞与启发
- **实时输出**：沉浸式对话体验

### 📈 实用投资指导
- 基于大师真实投资理念
- 结合当前市场环境
- 提供可操作的投资建议

## 🔧 技术特性

- **Mastra 框架**：先进的AI智能体框架
- **OpenAI GPT-4o-mini**：强大的语言模型
- **TypeScript**：类型安全的开发体验
- **工作流支持**：优雅的多轮对话架构
- **内存管理**：LibSQL持久化存储
- **实时交互**：Console实时输出

## 🏗️ 架构对比

### 直接调用版本 (Current Stable)
```typescript
class FiveRoundGroupChat {
  async startMultiRoundGroupChat(question: string) {
    for (let round = 1; round <= 5; round++) {
      // 依次调用三个agent
      await this.callMasters(round);
    }
  }
}
```

### 工作流版本 (New Elegant)
```typescript
export const fiveRoundInvestmentChatWorkflow = createWorkflow({...})
  .then(initializeChat)
  .dowhile(singleRoundDiscussion, condition)
  .then(generateFinalSummary)
  .commit();
```

## 🎉 立即体验

### 快速上手
```bash
# 🔥 体验最新工作流版本
npx tsx test-workflow-5-round-chat.ts --info
npx tsx test-workflow-5-round-chat.ts --interactive

# 📊 或使用稳定的直接调用版本
npx tsx test-5-round-group-chat.ts --interactive
```

### 选择你的体验方式
- **🏃‍♂️ 快速体验**：使用预设问题测试
- **🤔 深度讨论**：输入你的投资疑问
- **🔬 技术探索**：查看工作流架构和实现

三位传奇投资大师正在等待与你分享他们的智慧！💎🎯🌟

---

*基于真实投资大师理念打造，融合传统价值投资智慧与现代创新思维。* 