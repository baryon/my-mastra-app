
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { investmentGroupChatWorkflow } from './workflows/investment-group-chat-workflow';
import { fiveRoundInvestmentChatWorkflow } from './workflows/five-round-investment-chat';
import { weatherAgent } from './agents/weather-agent';
import { codeGenerationAgent } from './agents/code-generation-agent';
import { universalCodeAgent } from './agents/universal-code-agent';
import { chainOfThoughtAgent } from './agents/chain-of-thought-agent';
import { treeOfThoughtsAgent } from './agents/tree-of-thoughts-agent';
import { buffettAgent } from './agents/buffett-agent';
import { mungerAgent } from './agents/munger-agent';
import { cathieWoodAgent } from './agents/cathie-wood-agent';

export const mastra = new Mastra({
  workflows: { 
    weatherWorkflow, 
    investmentGroupChatWorkflow,
    fiveRoundInvestmentChatWorkflow
  },
  agents: { 
    weatherAgent,
    codeGenerationAgent,
    universalCodeAgent,
    chainOfThoughtAgent,
    treeOfThoughtsAgent,
    buffettAgent,
    mungerAgent,
    cathieWoodAgent,
  },
  storage: new LibSQLStore({
    // stores telemetry, evals, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
