import { Test, TestingModule } from '@nestjs/testing';
import { UiChannelService } from './ui-channel.service';

describe('UiChannelService', () => {
  let service: UiChannelService;
  const uiChannelService = {};
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UiChannelService],
      exports: [UiChannelService],
    }).overrideProvider(UiChannelService).useValue(uiChannelService).compile();

    service = module.get<UiChannelService>(UiChannelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
