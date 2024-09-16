import { sql } from "drizzle-orm";

/**
 * Pass in the modules and degreeYearDifference and will construct the query to get the moduleIDs of next years moduleOccurrences
 *
 * Preconditions:
 *  - do not pass in empty modules
 */
export function generateDegreeRequiredRules({
  modules,
  degreeYearDifference,
}: {
  modules: {
    moduleCode: string;
    semester: number;
    year: number;
  }[];
  degreeYearDifference: number;
}) {
  const query = sql<
    { moduleID: string }[]
  >`SELECT "moduleID" FROM "moduleOccurrence" WHERE `;

  // add each module to the query
  for (let i = 0; i < modules.length; i++) {
    const aModule = modules[i];

    if (aModule == undefined) {
      continue;
    }

    query.append(
      sql`("moduleOccurrence"."semester" = ${
        aModule.semester
      } AND "moduleOccurrence"."year" = ${
        aModule.year + degreeYearDifference
      } AND "moduleOccurrence"."moduleCode" = ${aModule.moduleCode})`,
    );

    if (i + 1 < modules.length) {
      query.append(sql` or `);
    }
  }

  return query;
}
