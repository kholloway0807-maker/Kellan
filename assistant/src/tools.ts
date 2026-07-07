import { saveMemory, deleteMemory, readMemory, MEMORY_TYPES, type MemoryType } from "./memory.js";
import { recall } from "./recall.js";
import type { ToolDef, ToolCall } from "./provider.js";

export const MEMORY_TOOLS: ToolDef[] = [
  {
    name: "save_memory",
    description:
      "Save one durable fact to long-term memory as a small markdown file. " +
      "Call this when the user teaches you something lasting, corrects you, or makes a decision " +
      "on a project — the things future-you should simply know. Do NOT save transient task state, " +
      "details of the current conversation, anything derivable from files or config, or anything " +
      "secret or private (saves that look like credentials are refused). One fact per call.",
    input_schema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: [...MEMORY_TYPES],
          description:
            "user-fact: about the user/their world. preference: how they want you to work. " +
            "project: decisions/state of an active project. pointer: where an external resource lives.",
        },
        hook: { type: "string", description: "One-line searchable summary of the fact." },
        body: {
          type: "string",
          description: "The fact itself, why it matters, and how to apply it later.",
        },
      },
      required: ["type", "hook", "body"],
      additionalProperties: false,
    },
  },
  {
    name: "recall_memory",
    description:
      "Search long-term memory. Call this when the user references something from the past that " +
      "isn't in the current conversation or your core knowledge. Recalled facts are point-in-time: " +
      "treat specifics (numbers, filenames, statuses) as leads to verify, not current guarantees.",
    input_schema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "forget_memory",
    description:
      "Delete one memory by id, only when the user asks to forget something or a memory is wrong. " +
      "The user is always asked to confirm before anything is deleted.",
    input_schema: {
      type: "object",
      properties: { id: { type: "string", description: "Memory id (filename without .md)." } },
      required: ["id"],
      additionalProperties: false,
    },
  },
];

export interface ToolContext {
  /** Ask the human to confirm a deletion. Defaults to refusing. */
  confirmForget?: (hook: string) => Promise<boolean>;
}

/** Execute one memory tool call and return the string result for the model. */
export async function executeTool(call: ToolCall, ctx: ToolContext = {}): Promise<string> {
  switch (call.name) {
    case "save_memory": {
      const input = call.input as { type: MemoryType; hook: string; body: string };
      const result = saveMemory(input);
      if (result.ok) return `Saved memory ${result.memory.id} (${result.memory.type}): ${result.memory.hook}`;
      if (result.reason === "secret")
        return "Refused: that looks like a secret or credential. Memory never stores those.";
      return `Not saved: near-duplicate of existing memory ${result.duplicateOf}. Consider updating that file instead.`;
    }
    case "recall_memory": {
      const hits = await recall(String(call.input.query ?? ""));
      if (hits.length === 0) return "No matching memories.";
      return hits
        .map((h) => `[${h.memory.type}] (${h.memory.id}) ${h.memory.hook}\n${h.memory.body}`)
        .join("\n\n");
    }
    case "forget_memory": {
      const id = String(call.input.id ?? "");
      const memory = readMemory(id);
      if (!memory) return `No memory with id ${id}.`;
      const confirmed = ctx.confirmForget ? await ctx.confirmForget(memory.hook) : false;
      if (!confirmed) return "The user declined the deletion. Memory kept.";
      deleteMemory(id);
      return `Deleted memory ${id}.`;
    }
    default:
      return `Unknown tool: ${call.name}`;
  }
}

/** Prompt discipline for what deserves to be remembered. Rendered into the stable block. */
export const MEMORY_GUIDANCE = `# Memory

You have long-term memory: small markdown files the user can read, edit,
and delete by hand. Remembering is a deliberate decision, not a default.

Save (with save_memory) when the user teaches you a lasting fact, corrects
something you had wrong, states a preference about how you should work, or
makes a real decision on a project.

Never save: transient task state, blow-by-blow of the current conversation,
anything already in your core knowledge or derivable from files, and never
secrets, credentials, or other people's private details — even if asked.

Recalled memories are point-in-time: what was true when written. Verify
specifics before acting on them. When memories are surfaced to you under
"Possibly relevant memories", use them naturally — don't announce the
mechanism.`;
