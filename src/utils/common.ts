import { Request } from "express";
import { AuthenticatedUser } from "../types/authenticatedUser";
import constants from "./constants";
import { FindManyOptions, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual } from "typeorm";
import { FilterDto } from "../types/filterDto";

export const getAuthUserId = (req: Request) : number => {
    return (req.user as AuthenticatedUser).user_id;
  };

  export const isFilterParamsValid = (
    queryObj: FilterDto,
    filterParams: string[]
  ) : boolean  => {
    filterParams = filterParams.concat(constants.DEFAULT_QUERY_PARAMS);
    const filterObj = Object.keys(queryObj);
    const invalidParams = filterObj.filter(param => !filterParams.includes(param));
    return invalidParams.length > 0 ? false : true;
  };

  export const applyFilters = (filterDto: FilterDto): FindManyOptions<unknown> =>  {
    const options: FindManyOptions<unknown> = {};
    for (const field in filterDto) {
      if (typeof filterDto[field] === 'object') {
        const conditions = filterDto[field] as Record<string, unknown>;
        for (const condition in conditions) {
          const conditionValue = conditions[condition];
          switch (condition) {
            case 'eq':
              options.where = { ...options.where, [field]: conditionValue };
              break;
            case 'like':
              options.where = { ...options.where, [field]: Like(`%${conditionValue}%`) };
              break;
            case 'gte':
              options.where = { ...options.where, [field]: MoreThanOrEqual(conditionValue) };
              break;
            case 'lte':
              options.where = { ...options.where, [field]: LessThanOrEqual(conditionValue) };
              break;
            case 'gt':
              options.where = { ...options.where, [field]: MoreThan(conditionValue) };
              break;
            case 'lt':
              options.where = { ...options.where, [field]: LessThan(conditionValue) };
              break;
            default:
              break;
          }
        }
      }
    }

    if (filterDto.limit) {
      options.take = filterDto.limit;
    }else{
      filterDto.limit = 10;
      options.take = 10;
    }

    if (filterDto.offset) {
      options.skip = filterDto.offset * filterDto.limit;
    }else{
      options.skip = 0;
    }

    if (filterDto.sortBy) {
      const order: 'ASC' | 'DESC' = filterDto.sortOrder === 'asc' ? 'ASC' : 'DESC';
      options.order = { [filterDto.sortBy]: order } as Record<string, 'ASC' | 'DESC'>;
    }

    return options;
  }
