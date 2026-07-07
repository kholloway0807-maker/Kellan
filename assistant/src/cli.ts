import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { CONFIG } from "./config.js";
import { pickProvider } from "./provider.js";
import { buildSystem } from "./promptBuilder.js";
import { Session } from "./session.js";

const provider = pickProvider();

function openSession(): Session {
  const resumable = Session.resumable();
  if (resumable) {
    const session = Session.load(resumable.id);
    console.log(`(picking back up: session ${session.id}, ${session.turns.length} turns)`);
    return session;
  }
  return Session.create();
}

async function main(): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  let session = openSession();
  console.log(
    `${CONFIG.assistantName} (provider: ${provider.name}) — /quit, /new, /sessions, /resume <id>`,
  );

  for (;;) {
    const line = (await rl.question("you> ")).trim();
    if (!line) continue;

    if (line === "/quit" || line === "/exit") break;
    if (line === "/new") {
      session = Session.create();
      console.log(`(new session ${session.id})`);
      continue;
    }
    if (line === "/sessions") {
      for (const meta of Session.list().slice(0, 10)) {
        console.log(
          `  ${meta.id}  ${meta.turnCount} turns  ${new Date(meta.mtimeMs).toLocaleString()}  ${meta.preview}`,
        );
      }
      continue;
    }
    if (line.startsWith("/resume")) {
      const id = line.split(/\s+/)[1] ?? Session.latest()?.id;
      if (!id) {
        console.log("(no sessions to resume)");
        continue;
      }
      try {
        session = Session.load(id);
        console.log(`(resumed ${session.id}, ${session.turns.length} turns)`);
      } catch {
        console.log(`(no session named ${id})`);
      }
      continue;
    }

    session.append("user", line);
    const turnCount = session.turns.filter((t) => t.role === "user").length;

    stdout.write(`${CONFIG.assistantName.toLowerCase()}> `);
    const result = await provider.chat({
      system: buildSystem({ turnCount }),
      messages: session.windowMessages(),
      onText: (d) => stdout.write(d),
    });
    stdout.write("\n");
    session.append("assistant", result.text);
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
