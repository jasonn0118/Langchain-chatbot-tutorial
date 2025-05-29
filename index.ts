import {
  AIMessage,
  HumanMessage,
  SystemMessage,
  trimMessages,
} from "@langchain/core/messages";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ChatGroq } from "@langchain/groq";
import {
  END,
  MemorySaver,
  MessagesAnnotation,
  START,
  StateGraph,
} from "@langchain/langgraph";
import { Annotation } from "@langchain/langgraph/web";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const trimmer = trimMessages({
  maxTokens: 10,
  strategy: "last",
  tokenCounter: (msgs) => msgs.length,
  includeSystem: true,
  allowPartial: false,
  startOn: "human",
});

const messages = [
  new SystemMessage("you're a good assistant"),
  new HumanMessage("hi! I'm bob"),
  new AIMessage("hi!"),
  new HumanMessage("I like vanilla ice cream"),
  new AIMessage("nice"),
  new HumanMessage("whats 2 + 2"),
  new AIMessage("4"),
  new HumanMessage("thanks"),
  new AIMessage("no problem!"),
  new HumanMessage("having fun?"),
  new AIMessage("yes!"),
];

await trimmer.invoke(messages);

const promptTemplate = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You talk like a pirate. Answer all questions to the best of your ability.",
  ],
  ["placeholder", "{messages}"],
]);

const promptTemplate2 = ChatPromptTemplate.fromMessages([
  [
    "system",
    "You are a helpful assistant. Answer all questions to the best of your ability in {language}.",
  ],
  ["placeholder", "{messages}"],
]);

const llm = new ChatGroq({
  model: "llama-3.3-70b-versatile",
  temperature: 0,
  apiKey: process.env.GROQ_API_KEY,
});

// Define the function that calls the model
const callModel = async (state: typeof MessagesAnnotation.State) => {
  const response = await llm.invoke(state.messages);
  return { messages: [response] };
};

// Define a new graph
const workflow = new StateGraph(MessagesAnnotation)
  // Define the node and edge
  .addNode("model", callModel)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const memory = new MemorySaver();
const app = workflow.compile({ checkpointer: memory });

// Define the function that calls the model
const callModel2 = async (state: typeof MessagesAnnotation.State) => {
  const prompt = await promptTemplate.invoke(state);
  const response = await llm.invoke(prompt);
  // Update message history with response:
  return { messages: [response] };
};

// Define a new graph
const workflow2 = new StateGraph(MessagesAnnotation)
  // Define the (single) node in the graph
  .addNode("model", callModel2)
  .addEdge(START, "model")
  .addEdge("model", END);

// Add memory
const app2 = workflow2.compile({ checkpointer: new MemorySaver() });

// Define the State
const GraphAnnotation = Annotation.Root({
  ...MessagesAnnotation.spec,
  language: Annotation<string>(),
});

// Define the function that calls the model
const callModel3 = async (state: typeof GraphAnnotation.State) => {
  const prompt = await promptTemplate2.invoke(state);
  const response = await llm.invoke(prompt);
  return { messages: [response] };
};

const workflow3 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel3)
  .addEdge(START, "model")
  .addEdge("model", END);

const app3 = workflow3.compile({ checkpointer: new MemorySaver() });

const callModel4 = async (state: typeof GraphAnnotation.State) => {
  const trimmedMessage = await trimmer.invoke(state.messages);
  const prompt = await promptTemplate2.invoke({
    messages: trimmedMessage,
    language: state.language,
  });
  const response = await llm.invoke(prompt);
  return { messages: [response] };
};

const workflow4 = new StateGraph(GraphAnnotation)
  .addNode("model", callModel4)
  .addEdge(START, "model")
  .addEdge("model", END);

const app4 = workflow4.compile({ checkpointer: new MemorySaver() });

const config = { configurable: { thread_id: uuidv4() } };
const input = [
  {
    role: "user",
    content: "Hi! I'm Bob.",
  },
];
const output = await app.invoke({ messages: input }, config);
// The output contains all messages in the state.
// This will log the last message in the conversation.
console.log(output.messages[output.messages.length - 1]);

const input2 = [
  {
    role: "user",
    content: "What's my name?",
  },
];
const output2 = await app.invoke({ messages: input2 }, config);
console.log(output2.messages[output2.messages.length - 1]);

const config2 = { configurable: { thread_id: uuidv4() } };
const input3 = [
  {
    role: "user",
    content: "What's my name?",
  },
];
const output3 = await app.invoke({ messages: input3 }, config2);
console.log(output3.messages[output3.messages.length - 1]);

const output4 = await app.invoke({ messages: input2 }, config);
console.log(output4.messages[output4.messages.length - 1]);

const config3 = { configurable: { thread_id: uuidv4() } };
const input4 = [
  {
    role: "user",
    content: "Hi! I'm Jim.",
  },
];
const output5 = await app2.invoke({ messages: input4 }, config3);
console.log(output5.messages[output5.messages.length - 1]);

const input5 = [
  {
    role: "user",
    content: "What is my name?",
  },
];
const output6 = await app2.invoke({ messages: input5 }, config3);
console.log(output6.messages[output6.messages.length - 1]);

const config4 = { configurable: { thread_id: uuidv4() } };
const input6 = {
  messages: [
    {
      role: "user",
      content: "Hi im bob",
    },
  ],
  language: "Japanese",
};
const output7 = await app3.invoke(input6, config4);
console.log(output7.messages[output7.messages.length - 1]);

const config5 = { configurable: { thread_id: uuidv4() } };
const input8 = {
  messages: [...messages, new HumanMessage("What is my name?")],
  language: "English",
};

const output9 = await app4.invoke(input8, config5);
console.log(output9.messages[output9.messages.length - 1]);

const config6 = { configurable: { thread_id: uuidv4() } };
const input9 = {
  messages: [...messages, new HumanMessage("What math problem did I ask?")],
  language: "English",
};

const output10 = await app4.invoke(input9, config6);
console.log(output10.messages[output10.messages.length - 1]);
