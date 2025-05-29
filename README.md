# LangChain Chat Bot with LangGraph and Groq

This project demonstrates how to build conversational workflows using [LangChain](https://js.langchain.com/docs/) and [LangGraph](https://github.com/langchain-ai/langgraphjs) with the Groq LLM API. It showcases multiple graph-based conversational flows, memory management, and prompt engineering.

## Features
- Multiple LangGraph workflows for different conversational behaviors
- Integration with Groq LLM (Llama-3.3-70b-versatile)
- Memory management for chat history
- Prompt templates for persona and language control
- Message trimming for context management

## Requirements
- Node.js v18 or higher (ESM support required)
- [pnpm](https://pnpm.io/) (or npm/yarn)
- A Groq API key ([get one here](https://console.groq.com/))

## Installation
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd langchain-chat-bot
   ```
2. Install dependencies:
   ```sh
   pnpm install
   # or
   npm install
   ```
3. Create a `.env` file in the project root and add your API keys and settings:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   LANGSMITH_TRACING=true
   LANGSMITH_API_KEY=your_langsmith_api_key_here
   ```

## Usage
Run the main script:
```sh
pnpm start
# or
node index.ts
```

## Project Structure
- `index.ts` — Main entry point. Defines several LangGraph workflows:
  - **Basic LLM Chat**: Simple message passing with memory.
  - **Pirate Persona**: Uses a prompt template to make the bot talk like a pirate.
  - **Language-Specific Assistant**: Responds in a specified language.
  - **Trimmed Memory Chat**: Maintains a limited message history for context.

## Example Output
The script will log the last message of each conversation, e.g.:
```
AIMessage { content: 'Hi! How can I help you today?' }
AIMessage { content: 'Your name is Bob.' }
AIMessage { content: 'Your name is Bob.' }
AIMessage { content: 'Your name is Bob.' }
AIMessage { content: 'Ahoy! What be yer name, matey?' }
AIMessage { content: 'Ye be Bob, matey!' }
AIMessage { content: 'こんにちは！どのようにお手伝いできますか？' }
AIMessage { content: 'Your name is Bob.' }
AIMessage { content: 'You asked: "whats 2 + 2".' }
```

## Customization
- Modify `index.ts` to add new workflows, change prompts, or adjust memory settings.
- Use different models by changing the `model` parameter in the `ChatGroq` constructor.

## References
- [LangChainJS Documentation](https://js.langchain.com/docs/)
- [LangGraphJS Documentation](https://langchain-ai.github.io/langgraphjs/)
- [Groq API](https://console.groq.com/)

---
Feel free to fork and extend this project for your own conversational AI experiments! 