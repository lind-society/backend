import { PartialType } from '@nestjs/mapped-types';
import { CreatePackageBenefitPivotDto } from './create-package-benefit-pivot.dto';

export class UpdatePackageBenefitPivotDto extends PartialType(
  CreatePackageBenefitPivotDto,
) {}
