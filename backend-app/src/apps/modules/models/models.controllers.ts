import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../../common/auth/public.decorator';
import { ModelsService } from './models.services';

@Public()
@Controller('models')
export class ModelsController {
  constructor(private readonly modelsService: ModelsService) {}

  @Get()
  getModels(
    @Query('q') search?: string,
    @Query('category') category?: string,
    @Query('page') page = '1',
    @Query('limit') limit = '24',
  ) {
    return this.modelsService.getModels(search, category, page, limit);
  }

  @Get('home-feed')
  getHomeFeed() {
    return this.modelsService.getHomeFeed();
  }

  @Get(':id')
  getModel(@Param('id') id: string) {
    return this.modelsService.getModel(id);
  }
}
