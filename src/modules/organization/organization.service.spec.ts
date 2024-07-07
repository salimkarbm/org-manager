import { Test, TestingModule } from '@nestjs/testing';
import { OrganisationService } from './organization.service';

describe('OrganizationService', () => {
  let service: OrganisationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrganisationService],
    }).compile();

    service = module.get<OrganisationService>(OrganisationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
