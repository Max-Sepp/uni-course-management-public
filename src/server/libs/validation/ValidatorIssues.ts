import { type IValidatorIssue } from "./IValidatorIssue";

type Module = {
  moduleCode: string;
  semester: number;
  year: number;
};

export class DegreeRequiredModuleIssue implements IValidatorIssue {
  public readonly type = "DegreeRequiredModuleIssue";

  private requiredModule: Module;

  constructor(requiredModule: Module) {
    this.requiredModule = requiredModule;
  }

  GetString(): string {
    return `You are missing ${this.requiredModule.moduleCode} in Semester ${this.requiredModule.semester} of Year ${this.requiredModule.year}; a module required by your degree.`;
  }
}

export class PrerequisiteModuleIssue implements IValidatorIssue {
  public readonly type = "PrerequisiteModuleIssue";

  private requiringModuleCode: string;
  private requiredModule: Module;

  constructor(requiringModuleCode: string, requiredModule: Module) {
    this.requiringModuleCode = requiringModuleCode;
    this.requiredModule = requiredModule;
  }

  GetString(): string {
    return `You are missing ${this.requiredModule.moduleCode} in Semester ${this.requiredModule.semester} of Year ${this.requiredModule.year}; a prerequisite of ${this.requiringModuleCode}`;
  }
}

export class NotSameTimeIssue implements IValidatorIssue {
  public readonly type = "NotSameTimeIssue";

  private module1Code: string;
  private module2Code: string;

  constructor(module1Code: string, module2Code: string) {
    this.module1Code = module1Code;
    this.module2Code = module2Code;
  }

  GetString(): string {
    return `You can't take ${this.module1Code} and ${this.module2Code} at the same time`;
  }
}

type Occurring = {
  semester: number;
  year: number;
};

export class CreditsIssue implements IValidatorIssue {
  public readonly type = "CreditsIssue";

  private occurring: Occurring;

  constructor(occurring: Occurring) {
    this.occurring = occurring;
  }

  GetString(): string {
    return `You have insufficient credits in semester: ${this.occurring.semester}, year: ${this.occurring.year}`;
  }
}

export class ModuleCreditTrackingIssue implements IValidatorIssue {
  public readonly type = "ModuleCreditTrackingIssue";

  private occurring: Occurring;

  constructor(occurring: Occurring) {
    this.occurring = occurring;
  }

  GetString(): string {
    return `You have too many credits backtracked/forwardtracked in semester: ${this.occurring.semester}, year: ${this.occurring.year}`;
  }
}

export class ModuleLevelTrackingIssue implements IValidatorIssue {
  public readonly type = "ModuleLevelTrackingIssue";

  private moduleCode: string;
  private occurring: Occurring;

  constructor(moduleCode: string, occurring: Occurring) {
    this.moduleCode = moduleCode;
    this.occurring = occurring;
  }

  GetString(): string {
    return `You cannot take ${this.moduleCode} in semester: ${this.occurring.semester}, year: ${this.occurring.year}`;
  }
}
