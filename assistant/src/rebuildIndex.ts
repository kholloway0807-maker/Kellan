/** CLI entry: rebuild the derived memory index from the markdown files. */
import { rebuildIndex } from "./memory.js";
import { pickEmbedder, embedIndex } from "./recall.js";
import { CONFIG } from "./config.js";

const index = rebuildIndex();
console.log(`rebuilt ${CONFIG.indexPath} from files: ${index.entries.length} memories`);

const embedder = pickEmbedder();
if (embedder) {
  await embedIndex(embedder);
  console.log(`embedded with ${embedder.id}`);
} else {
  console.log("no embedding key found — keyword recall only (fully functional)");
}
