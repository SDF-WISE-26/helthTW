import "dotenv/config";
import { loadQuestionnaireFiles } from "../modules/questionnaires/questionnaires.files";
import { syncQuestionnaires } from "../modules/questionnaires/questionnaires.sync";
import { db } from "./index";

const added = await syncQuestionnaires(await loadQuestionnaireFiles());

console.log(added.length > 0 ? `Added: ${added.join(", ")}` : "Questionnaires are up to date");
await db.$client.end();
