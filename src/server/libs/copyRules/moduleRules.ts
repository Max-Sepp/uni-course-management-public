import { sql } from "drizzle-orm";

/**
 * This function requires that there are actually modules passed and that the list passed in is not empty
 *
 * Preconditions:
 *  - do not pass in empty modules
 */
export function generateRules({
  modules,
  moduleYearDifference,
}: {
  modules: {
    moduleCode: string;
    semester: number;
    year: number;
  }[];
  moduleYearDifference: number;
}) {
  const query = sql<
    { moduleID: string }[]
  >`SELECT "moduleID" FROM "moduleOccurrence" WHERE `;

  // add each module search parameters to query
  for (let i = 0; i < modules.length; i++) {
    const aModule = modules[i];

    if (aModule == undefined) {
      continue;
    }

    query.append(
      sql`("moduleOccurrence"."semester" = ${
        aModule.semester
      } AND "moduleOccurrence"."year" = ${
        aModule.year + moduleYearDifference
      } AND "moduleOccurrence"."moduleCode" = ${aModule.moduleCode})`,
    );

    if (i + 1 < modules.length) {
      query.append(sql` or `);
    }
  }

  return query;
}
