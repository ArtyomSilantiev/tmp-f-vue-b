import validator from 'validator';
import moment, { Moment, DurationInputArg2 } from 'moment';
import { getValue, AsyncLocker } from './tools';

interface ICheckParams {
  body?: any;
}

interface IConditionParams {
  body?: any;
}

interface ICheck {
  (value: any, params?: ICheckParams): boolean | Promise<boolean>;
}

interface IValidationCheck {
  check: ICheck;
  msg: string;
}

export interface IValidationRule {
  field: string;
  condition?(params: IConditionParams): boolean | Promise<boolean>;
  subRules?: IValidationRule[];
  each?(index: string): IValidationRule[];
  checks?: Array<IValidationCheck>;
}

interface IBody {
  [key: string]: any;
}

export class CustomChecks {
  public static notEmpty(value: any) {
    return value !== null && !validator.isEmpty(value);
  }

  public static inVals(value: any, vals: Array<any>) {
    return vals.indexOf(value) !== -1;
  }

  public static isRegEx(value: string, grep: RegExp) {
    return grep.test(value);
  }

  // offset format: '<int>:<'days'|'years'|'etc'>'
  public static isDate(
    value: string,
    dateFormat: string,
    params?: {
      offsetForMin?: { num: number; unit: DurationInputArg2 };
      offsetForMax?: { num: number; unit: DurationInputArg2 };
    }
  ) {
    if (value.length !== dateFormat.length) {
      return false;
    }
    const momentDate = moment(value, dateFormat);
    const isValid = momentDate.isValid();
    if (!isValid) {
      return false;
    }
    if (params) {
      if (params.offsetForMin) {
        const minDate = moment()
          .add(params.offsetForMin.num, params.offsetForMin.unit)
          .toDate();
        if (momentDate.toDate() < minDate) {
          return false;
        }
      }
      if (params.offsetForMax) {
        const maxDate = moment()
          .add(params.offsetForMax.num, params.offsetForMax.unit)
          .toDate();
        if (momentDate.toDate() > maxDate) {
          return false;
        }
      }
    }
    return true;
  }

  public static isAdultManBirtchDateFormat(value: string, dateFormat: string) {
    return this.isDate(value, dateFormat, {
      offsetForMin: { num: -100, unit: 'years' },
      offsetForMax: { num: -18, unit: 'years' }
    });
  }

  public static isBool(value: any) {
    return typeof value === 'boolean' || value === 'true' || value === 'false';
  }

  public static isOldTsYearIssued (value: any) {
    return vlChecks.isInt(value, { min: 1970, max: new Date().getFullYear() - 5 });
  }
}

export const vlChecks = Object.assign(CustomChecks, validator);

export class ValidationResult {
  public fields: { [field: string]: { errors: Array<string> } } = {};

  public getTotalErrors() {
    let errorsTotal = 0;
    for (const field of Object.values(this.fields)) {
      errorsTotal += field.errors.length;
    }
    return errorsTotal;
  }
}

export default class Validator {
  public validationResult: ValidationResult = new ValidationResult();

  protected rules: IValidationRule[] = [];
  protected body: IBody | null = null;
  protected checkFieldAsyncLocker: AsyncLocker = new AsyncLocker();
  protected fullRulesList: IValidationRule[] = [];

  constructor(rules?: IValidationRule[]) {
    if (rules) {
      this.rules = rules;
    }
  }

  public setRules(rules: IValidationRule[]) {
    this.rules = rules;
  }

  public setValidationResult(validationResult: ValidationResult) {
    this.validationResult = validationResult;
  }

  public clearValidationResult() {
    this.validationResult = new ValidationResult();
  }

  public setBody(body: IBody) {
    this.body = body;
    return this;
  }

  private async parseRules(
    validationResult: ValidationResult,
    rules: IValidationRule[],
    fildsFilter?: Array<string>
  ) {
    const body = this.body;

    if (!this.validationResult) {
      return;
    }

    for (const rule of rules) {
      const field = rule.field || '';
      let allowFlag = false;
      if (!fildsFilter) {
        allowFlag = true;
      } else {
        for (const filt of fildsFilter) {
          if (filt.endsWith('*') && field.startsWith(filt.replace('*', ''))) {
            allowFlag = true;
            break;
          } else if (filt === field) {
            allowFlag = true;
            break;
          }
        }
      }
      if (!allowFlag) {
        continue;
      }

      Validator.initOrClearErrorField(validationResult, field);
      if (typeof rule.condition === 'function' && !rule.condition({ body })) {
        continue;
      }

      const value = getValue(body, field);

      if (rule.subRules) {
        if (Array.isArray(rule.subRules)) {
          const subRules = rule.subRules;
          await this.parseRules(validationResult, subRules, fildsFilter);
        } else {
          Validator.addErrorToField(
            validationResult,
            field,
            'badValidatorFormatField'
          );
          continue;
        }
      } else if (typeof rule.each === 'function') {
        if (Array.isArray(value)) {
          for (const index in value) {
            const subRules = rule.each(index);
            await this.parseRules(validationResult, subRules, fildsFilter);
          }
        } else {
          Validator.addErrorToField(
            validationResult,
            field,
            'badValidatorFormatField'
          );
          continue;
        }
      } else if (rule.checks && Array.isArray(rule.checks)) {
        for (const check of rule.checks) {
          const checkResult = await check.check(value, { body });
          if (!checkResult) {
            Validator.addErrorToField(
              validationResult,
              field,
              check.msg || 'invalid'
            );
          }
        }
      } else {
        Validator.addErrorToField(
          validationResult,
          field,
          'badValidatorFormatField'
        );
      }
    }
  }

  public async validation(fildsFilter?: Array<string>) {
    const validationResult = new ValidationResult();

    await this.parseRules(validationResult, this.rules, fildsFilter);

    for (const validationField of Object.keys(validationResult.fields)) {
      this.validationResult.fields[validationField] =
        validationResult.fields[validationField];
    }

    return validationResult;
  }

  public clearFullRulesList() {
    this.fullRulesList = [];
  }

  public generateFullRulesList() {
    const body = this.body;
    const fullRulesList = <IValidationRule[]>[];
    let allFieldsStr = '';

    if (!body) {
      throw new Error('not found body for generate full rules list');
    }

    function parseRulesForFullRulesList(rules: IValidationRule[]) {
      for (const rule of rules) {
        const field = rule.field || '';
        allFieldsStr += field;
        fullRulesList.push(rule);

        if (rule.subRules) {
          if (Array.isArray(rule.subRules)) {
            parseRulesForFullRulesList(rule.subRules);
          }
        } else if (typeof rule.each === 'function') {
          const value = getValue(body, field);

          if (Array.isArray(value)) {
            for (const index in value) {
              const subRules = rule.each(index);
              parseRulesForFullRulesList(subRules);
            }
          }
        }
      }
    }
    parseRulesForFullRulesList(this.rules);

    this.fullRulesList = fullRulesList;
  }

  public async checkField(field: string) {
    await this.checkFieldAsyncLocker.join();

    if (!this.validationResult) {
      this.validationResult = new ValidationResult();
    }

    if (this.fullRulesList.length === 0) {
      this.generateFullRulesList();
    }

    const fieldRules = [];
    for (const rule of this.fullRulesList) {
      if (rule.field === field) {
        fieldRules.push(rule);
      }
    }
    if (fieldRules.length === 0) {
      return;
    }

    const validationResult = new ValidationResult();
    await this.parseRules(validationResult, fieldRules);
    for (const validationField of Object.keys(validationResult.fields)) {
      this.validationResult.fields[validationField] =
        validationResult.fields[validationField];
    }

    this.checkFieldAsyncLocker.leave();

    return validationResult;
  }

  public clearFieldsFromValidationResult(fildsFilter?: Array<string>) {
    const fieldKeysForClear = [];

    for (const fieldKey of Object.keys(this.validationResult.fields)) {
      let removeFlag = false;
      if (!fildsFilter) {
        removeFlag = true;
      } else {
        for (const filt of fildsFilter) {
          if (
            filt.endsWith('*') &&
            fieldKey.startsWith(filt.replace('*', ''))
          ) {
            removeFlag = true;
            break;
          } else if (filt === fieldKey) {
            removeFlag = true;
            break;
          }
        }
      }
      if (removeFlag) {
        fieldKeysForClear.push(fieldKey);
      }
    }

    for (const fieldKey of fieldKeysForClear) {
      delete this.validationResult.fields[fieldKey];
    }
  }

  private static initOrClearErrorField(
    validationResult: ValidationResult,
    field: string
  ) {
    validationResult.fields[field] = {
      errors: []
    };
  }

  private static addErrorToField(
    validationResult: ValidationResult,
    field: string,
    errorMsg: string
  ) {
    validationResult.fields[field].errors.push(errorMsg);
  }

  public static singleError(field: string, errorMsg: string) {
    const validationResult = new ValidationResult();
    Validator.initOrClearErrorField(validationResult, field);
    Validator.addErrorToField(validationResult, field, errorMsg || 'invalid');
    return validationResult;
  }
}
