import { z } from "zod";
import { type IDegreeModel } from "~/server/models/DegreeModel";
import { type IModuleModel } from "~/server/models/ModuleModel";
import { type IPathModel } from "~/server/models/TimetablesModel";
import { type IValidator } from "./IValidator";
import { type IValidatorIssue } from "./IValidatorIssue";
import {
  CreditsIssue,
  DegreeRequiredModuleIssue,
  ModuleCreditTrackingIssue,
  ModuleLevelTrackingIssue,
  NotSameTimeIssue,
  PrerequisiteModuleIssue,
} from "./ValidatorIssues";

type Module = {
  moduleID: string;
  moduleCode: string;
  moduleName: string;
  credits: number;
  semester: number;
  year: number;
  moduleLevel: number;
};

type ModulesMap = Map<string, Module>;

export class ServerValidation implements IValidator {
  private timetableModel: IPathModel;
  private moduleModel: IModuleModel;
  private degreeModel: IDegreeModel;

  constructor(
    timetableModel: IPathModel,
    moduleModel: IModuleModel,
    degreeModel: IDegreeModel,
  ) {
    this.timetableModel = timetableModel;
    this.moduleModel = moduleModel;
    this.degreeModel = degreeModel;
  }

  /**
   * Server Side Validator
   *
   * @param timetableID
   * @param degreeCode
   * @returns
   */
  public async Validate(
    timetableID: string,
    degreeID: string,
  ): Promise<{ isSuccess: boolean; failures: IValidatorIssue[] }> {
    // checks passing in of code is valid
    const validateUUID = z.string().uuid();

    const result = await validateUUID.safeParseAsync(timetableID);
    if (!result.success) {
      throw Error(result.error.message);
    }

    // used for credit validation as the module occurrences year needs to match up with the year
    const yearStarting = await this.degreeModel.GetYearStarting(degreeID);

    if (yearStarting == undefined) {
      throw new Error("Could not find the degree");
    }

    // gets the modules and constructs them into a HashMap for quick access
    const modulesArray =
      await this.timetableModel.GetModulesOfPathID(timetableID);

    const modules = new Map<string, Module>();

    for (const moduleItem of modulesArray) {
      modules.set(moduleItem.moduleID, moduleItem);
    }

    // repeated async calls to the private validation methods
    // TODO: make them perform in parallel
    const creditsFailures = await this.validateCredits(
      modulesArray,
      degreeID,
      yearStarting,
    );
    const degreeRequiredModuleFailures =
      await this.validateDegreeRequiredModule(modules, degreeID);
    const prerequisiteModuleFailures =
      await this.validatePrerequisiteModules(modules);
    const moduleNotSameTimeFailures =
      await this.validateModuleNotSameTime(modules);
    const moduleTrackingFailures = await this.validateModuleTracking(
      modulesArray,
      yearStarting,
      degreeID,
    );

    // concatenate all errors found into one list and return
    const failures = creditsFailures.concat(
      degreeRequiredModuleFailures,
      prerequisiteModuleFailures,
      moduleNotSameTimeFailures,
      moduleTrackingFailures,
    );

    return { isSuccess: failures.length == 0, failures };
  }

  private async validateDegreeRequiredModule(
    modules: ModulesMap,
    degreeID: string,
  ) {
    const errors: IValidatorIssue[] = [];

    const degreeRequiredModuleRules =
      await this.timetableModel.GetDegreeRequiredModules(degreeID);

    // goes through every degreeRequireModule and sees if it is in the modules taken list
    for (const rule of degreeRequiredModuleRules) {
      if (!modules.has(rule.moduleID)) {
        // if not in the list fetches the module and addeds the details of the module required to the errors list
        const aModule = await this.moduleModel.GetModuleByModuleID(
          rule.moduleID,
        );

        if (aModule != undefined) {
          errors.push(
            new DegreeRequiredModuleIssue({
              moduleCode: aModule.moduleCode,
              semester: aModule.semester,
              year: aModule.year,
            }),
          );
        }
      }
    }
    return errors;
  }

  private async validateCredits(
    modules: Module[],
    degreeID: string,
    yearStarting: number,
  ) {
    const errors: IValidatorIssue[] = [];

    const creditRules = await this.timetableModel.GetCreditsRequired(degreeID);

    const creditsTotal = new Map<string, number>();

    // counts up how many credits in each semester year group and stores in hashmap
    for (const moduleItem of modules) {
      let curCreditTotal = creditsTotal.get(
        `S: ${moduleItem.semester} Y: ${moduleItem.year}`,
      );

      if (curCreditTotal == undefined) {
        curCreditTotal = 0;
      }

      if (moduleItem.credits != null) {
        creditsTotal.set(
          `S: ${moduleItem.semester} Y: ${moduleItem.year}`,
          moduleItem.credits + curCreditTotal,
        );
      }
    }

    // checks if all the creditRules have been met
    for (const rule of creditRules) {
      const numCredits = creditsTotal.get(
        `S: ${rule.semester} Y: ${rule.year + yearStarting - 1}`,
      );

      // checks to see if either there are no modules in the list e.g. the get is undefined
      // or the number of credits is too low
      if (numCredits == undefined || numCredits < rule.creditsRequired) {
        errors.push(
          new CreditsIssue({ semester: rule.semester, year: rule.year }),
        );
      }
    }

    return errors;
  }

  // similar implementation to degree required modules
  private async validatePrerequisiteModules(modules: ModulesMap) {
    const errors: IValidatorIssue[] = [];
    const moduleIDs = Array.from(modules.keys());
    const prerequisiteModules =
      await this.timetableModel.GetPrerequisiteModules(moduleIDs);

    // goes through every prerequisteModule and sees if it is in the modules taken list
    for (const rule of prerequisiteModules) {
      if (!modules.has(rule.prerequisiteModule)) {
        // if not in the list fetches the module and addeds the details of the module required to the errors list
        const prerequisiteModule = await this.moduleModel.GetModuleByModuleID(
          rule.prerequisiteModule,
        );
        const moduleRequiring = await this.moduleModel.GetModuleByModuleID(
          rule.moduleRequiring,
        );

        if (moduleRequiring != undefined && prerequisiteModule != undefined) {
          errors.push(
            new PrerequisiteModuleIssue(moduleRequiring.moduleCode, {
              moduleCode: prerequisiteModule.moduleCode,
              semester: prerequisiteModule.semester,
              year: prerequisiteModule.year,
            }),
          );
        }
      }
    }

    return errors;
  }

  private async validateModuleNotSameTime(modules: ModulesMap) {
    const errors: IValidatorIssue[] = [];
    const moduleIDs = Array.from(modules.keys());
    const moduleNotSameTime =
      await this.timetableModel.GetModuleNotSameTime(moduleIDs);

    // checks if modules are taken at same time
    for (const rule of moduleNotSameTime) {
      if (modules.has(rule.module1) && modules.has(rule.module2)) {
        // fetches the violating moduels and adds them to the error message list
        const module1 = await this.moduleModel.GetModuleByModuleID(
          rule.module1,
        );
        const module2 = await this.moduleModel.GetModuleByModuleID(
          rule.module2,
        );

        if (module1 != undefined && module2 != undefined) {
          errors.push(
            new NotSameTimeIssue(module1.moduleCode, module2.moduleCode),
          );
        }
      }
    }
    return errors;
  }

  private async validateModuleTracking(
    modules: Module[],
    yearStarting: number,
    degreeID: string,
  ) {
    const errors: IValidatorIssue[] = [];
    const trackingRule = await this.timetableModel.GetTrackingRule(degreeID);

    if (trackingRule == undefined) {
      return errors;
    }

    const moduleLevelsArray =
      await this.timetableModel.GetModuleLevels(degreeID);

    const moduleLevelsMap = new Map<string, number>(); // key is semester and year

    for (const moduleLevel of moduleLevelsArray) {
      moduleLevelsMap.set(
        JSON.stringify({
          semester: moduleLevel.semester,
          year: moduleLevel.year + yearStarting - 1,
        }),
        moduleLevel.moduleLevel,
      );
    }

    const trackedNumOfCredits = new Map<string, number>(); // key is semester and year and it stores the number of backtracked and forwardtracked credits in that year

    for (const aModule of modules) {
      const moduleLevelSlot = moduleLevelsMap.get(
        JSON.stringify({
          semester: aModule.semester,
          year: aModule.year,
        }),
      ); // i.e. the moduleLevel that is the default for the semester year of the degree taken

      if (
        moduleLevelSlot != undefined &&
        Math.abs(moduleLevelSlot - aModule.moduleLevel) >
          trackingRule.numberYearsTracking
      ) {
        errors.push(
          new ModuleLevelTrackingIssue(aModule.moduleCode, {
            semester: aModule.semester,
            year: aModule.year,
          }),
        );
      }

      if (
        moduleLevelSlot != undefined &&
        moduleLevelSlot != aModule.moduleLevel
      ) {
        const currentTrackedNumCredits = trackedNumOfCredits.get(
          JSON.stringify({
            semester: aModule.semester,
            year: aModule.year,
          }),
        );
        if (currentTrackedNumCredits == undefined) {
          trackedNumOfCredits.set(
            JSON.stringify({ semester: aModule.semester, year: aModule.year }),
            aModule.credits,
          );
        } else {
          trackedNumOfCredits.set(
            JSON.stringify({ semester: aModule.semester, year: aModule.year }),
            currentTrackedNumCredits + aModule.credits,
          );
        }
      }
    }

    for (const timeSlot of trackedNumOfCredits.entries()) {
      if (timeSlot[1] > trackingRule.numberCreditsTracked) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const occurring: { semester: number; year: number } = JSON.parse(
          timeSlot[0],
        );
        errors.push(new ModuleCreditTrackingIssue(occurring));
      }
    }

    return errors;
  }
}
