import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  text,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

export const admin = pgTable("admin", {
  userID: text("userID").notNull().primaryKey(),
});

export const student = pgTable("student", {
  userID: text("userID").notNull().primaryKey(),
  currentYear: integer("currentYear").notNull(),
  degreeTaken: uuid("degreeTaken").references(() => degreeOccurrence.degreeID, {
    onDelete: "set null",
  }),
  hasDegreeTimetable: boolean("hasDegreeTimetable").default(false),
});

export const degreeOccurrence = pgTable(
  "degreeOccurrence",
  {
    degreeID: uuid("degreeID").notNull().primaryKey().defaultRandom(),
    degreeCode: text("degreeCode")
      .notNull()
      .references(() => degree.degreeCode),
    yearStarting: integer("yearStarting").notNull(),
  },
  (table) => ({
    unq: unique().on(table.yearStarting, table.degreeCode),
  }),
);

export const degree = pgTable("degree", {
  degreeCode: text("degreeCode").notNull().primaryKey(),
  name: text("name").notNull(),
  departmentRunningID: uuid("departmentRunningID")
    .notNull()
    .references(() => department.departmentID),
  lengthOfDegree: integer("lengthOfDegree").notNull(),
});

export const department = pgTable("department", {
  departmentID: uuid("departmentID").notNull().primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
});

export const timetable = pgTable("timetable", {
  timetableID: uuid("timetableID").notNull().primaryKey().defaultRandom(),
  studentUserID: text("studentUserID")
    .notNull()
    .references(() => student.userID, { onDelete: "cascade" }),
  name: text("name").notNull(),
  isDegreeTimetable: boolean("isDegreePath").notNull(),
  degreeID: uuid("degreeID")
    .notNull()
    .references(() => degreeOccurrence.degreeID),
});

export const choices = pgTable(
  "choices",
  {
    timetableID: uuid("timetableID")
      .notNull()
      .references(() => timetable.timetableID, { onDelete: "cascade" }),
    moduleID: uuid("moduleID")
      .notNull()
      .references(() => moduleOccurrence.moduleID),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.moduleID, table.timetableID] }),
    };
  },
);

export const moduleOccurrence = pgTable(
  "moduleOccurrence",
  {
    moduleID: uuid("moduleID").notNull().primaryKey().defaultRandom(),
    moduleCode: text("moduleCode")
      .notNull()
      .references(() => moduleItem.moduleCode),
    semester: integer("semester").notNull(),
    year: integer("year").notNull(),
    credits: integer("credits").notNull(),
    moduleLevel: integer("moduleLevel").notNull(),
  },
  (table) => ({
    unq: unique().on(table.semester, table.year, table.moduleCode),
  }),
);

export const moduleItem = pgTable("moduleItem", {
  moduleCode: text("moduleCode").notNull().primaryKey(),
  moduleName: text("moduleName").notNull().unique(),
  moduleDescription: text("moduleDescription").notNull(),
});

// Rules

export const creditsRequired = pgTable(
  "creditsRequired",
  {
    creditRuleID: uuid("creditRuleID").notNull().primaryKey().defaultRandom(),
    degreeID: uuid("degreeID")
      .notNull()
      .references(() => degreeOccurrence.degreeID),
    creditsRequired: integer("creditsRequired").notNull(),
    semester: integer("semester").notNull(),
    year: integer("year").notNull(), // i.e. 1st, 2nd, 3rd or 4th year
    moduleLevel: integer("moduleLevel").notNull(),
  },
  (table) => ({
    unq: unique().on(table.semester, table.year, table.degreeID),
  }),
);

export const degreeRequiredModule = pgTable(
  "degreeRequiredModule",
  {
    moduleID: uuid("moduleID")
      .notNull()
      .references(() => moduleOccurrence.moduleID),
    degreeID: uuid("degreeID")
      .notNull()
      .references(() => degreeOccurrence.degreeID),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.moduleID, table.degreeID] }),
    };
  },
);

export const prerequisiteModule = pgTable(
  "prerequisiteModule",
  {
    moduleRequiring: uuid("moduleRequiring")
      .notNull()
      .references(() => moduleOccurrence.moduleID),
    prerequisiteModule: uuid("prerequisiteModule")
      .notNull()
      .references(() => moduleOccurrence.moduleID),
  },
  (table) => {
    return {
      pk: primaryKey({
        columns: [table.moduleRequiring, table.prerequisiteModule],
      }),
    };
  },
);

export const moduleNotSameTime = pgTable(
  "moduleNotSameTime",
  {
    module1: uuid("module1")
      .notNull()
      .references(() => moduleOccurrence.moduleID),
    module2: uuid("module2")
      .notNull()
      .references(() => moduleOccurrence.moduleID),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.module1, table.module2] }),
    };
  },
);

export const moduleTracking = pgTable("moduleTracking", {
  degreeID: uuid("degreeID")
    .notNull()
    .references(() => degreeOccurrence.degreeID)
    .primaryKey(),
  numberYearsTracking: integer("numberYearsTracking").notNull(), // the number of years that are back tracked/forward tracked + or -
  numberCreditsTracked: integer("numberCreditsTracked").notNull(),
});
