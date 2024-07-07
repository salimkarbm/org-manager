import { Expose, Transform } from 'class-transformer';
import { Organisation } from '../organization.entity';

export class UserOrganisationsDto {
  @Expose()
  @Transform(({ obj }) => {
    return obj.organisations.map((org) => ({
      orgId: org.orgId,
      name: org.name,
      description: org.description,
    }));
  })
  organisations: Organisation[];
}

export class OrganisationDto {
  @Expose()
  orgId: string;

  @Expose()
  name: string;

  @Expose()
  description: string;
}
