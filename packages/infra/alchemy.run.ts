import alchemy from "alchemy";
import { config } from "dotenv";

config({ path: "./.env" });
config({ path: "../../apps/web/.env" });

const app = await alchemy("SkillSync-1");

console.log(`Web    -> ${web.url}`);

await app.finalize();
