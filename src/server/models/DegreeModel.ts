import { eq } from "drizzle-orm";
import { type db } from "~/server/db/db";
import { degree, degreeOccurrence } from "~/server/db/schema";

export interface IDegreeModel {
  GetYearStarting(degreeID: string): Promise<number | undefined>;
  GetDegreeLength(degreeID: string): Promise<number | undefined>;
}

export class DegreeModel implements IDegreeModel {
  private db: db;

  public constructor(db: db) {
    this.db = db;
  }

  public async GetYearStarting(degreeID: string): Promise<number | undefined> {
    const output = await this.db
      .select()
      .from(degreeOccurrence)
      .where(eq(degreeOccurrence.degreeID, degreeID));

    return output[0]?.yearStarting;
  }

  public async GetDegreeLength(degreeID: string) {
    const output = await this.db
      .select({ lengthOfDegree: degree.lengthOfDegree })
      .from(degreeOccurrence)
      .innerJoin(degree, eq(degree.degreeCode, degreeOccurrence.degreeCode))
      .where(eq(degreeOccurrence.degreeID, degreeID));

    return output[0]?.lengthOfDegree;
  }
}
