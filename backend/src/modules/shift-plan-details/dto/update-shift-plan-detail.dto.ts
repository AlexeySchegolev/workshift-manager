import { PartialType } from '@nestjs/swagger';
import { CreateShiftPlanDetailDto } from './create-shift-plan-detail.dto';

export class UpdateShiftPlanDetailDto extends PartialType(CreateShiftPlanDetailDto) {}