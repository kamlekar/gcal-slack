import { Test, TestingModule } from '@nestjs/testing';
import { DriveModule } from './drive.module';
import { DriveController } from './drive.controller';
import { DriveService } from './drive.service';

describe('DriveModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DriveModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide DriveController', () => {
    const controller = module.get<DriveController>(DriveController);
    expect(controller).toBeDefined();
  });

  it('should provide DriveService', () => {
    const service = module.get<DriveService>(DriveService);
    expect(service).toBeDefined();
  });
});
