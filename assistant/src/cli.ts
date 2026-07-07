import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { CONFIG } from "./config.js";
import { pickProvider, type ChatMessage } from "./provider.js";
import { buildSystem } from "./promptBuilder.js";

const provider = pickProvider();
const history: ChatMessage[] = [];
let turnCount = 0;

async function main(): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  console.log(`${CONFIG.assistantName} (provider: ${provider.name}) — /quit to exit`);

  for (;;) {
    const line = (await rl.question("you> ")).trim();
    if (!line) continue;
    if (line === "/quit" || line === "/exit") break;

    history.push({ role: "user", content: line });
    turnCount += 1;
    stdout.write(`${CONFIG.assistantName.toLowerCase()}> `);
    const result = await provider.chat({
      system: buildSystem({ turnCount }),
      messages: history,
      onText: (d) => stdout.write(d),
    });
    stdout.write("\n");
    history.push({ role: "assistant", content: result.text });
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
