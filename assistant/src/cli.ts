import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { CONFIG } from "./config.js";
import { pickProvider } from "./provider.js";
import { Session } from "./session.js";
import { runTurn } from "./chatTurn.js";
import { extractMemories } from "./extractor.js";

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

async function endSession(session: Session): Promise<void> {
  const report = await extractMemories(provider, session);
  if (report.skipped) return;
  if (report.saved.length > 0) {
    console.log(`(remembered: ${report.saved.join(", ")})`);
  }
  for (const r of report.rejected) {
    console.log(`(not saved — ${r.why}: ${r.hook})`);
  }
}

async function main(): Promise<void> {
  const rl = readline.createInterface({ input: stdin, output: stdout });
  let session = openSession();
  console.log(
    `${CONFIG.assistantName} (provider: ${provider.name}) — /quit, /new, /sessions, /resume <id>`,
  );

  const confirmForget = async (hook: string): Promise<boolean> => {
    const answer = await rl.question(`delete memory "${hook}"? [y/N] `);
    return answer.trim().toLowerCase() === "y";
  };

  for (;;) {
    const line = (await rl.question("you> ")).trim();
    if (!line) continue;

    if (line === "/quit" || line === "/exit") {
      await endSession(session);
      break;
    }
    if (line === "/new") {
      await endSession(session);
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

    stdout.write(`${CONFIG.assistantName.toLowerCase()}> `);
    await runTurn({
      provider,
      session,
      userMessage: line,
      onText: (d) => stdout.write(d),
      toolContext: { confirmForget },
    });
    stdout.write("\n");
  }

  rl.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
