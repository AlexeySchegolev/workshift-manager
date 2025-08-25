import { PartialType } from '@nestjs/swagger';
import { CreateShiftRulesDto } from './create-shift-rules.dto';

export class UpdateShiftRulesDto extends PartialType(CreateShiftRulesDto) {}