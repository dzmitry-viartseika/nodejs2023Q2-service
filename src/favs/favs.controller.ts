import {
    Controller,
    Get,
    Post,
    Param,
    Delete,
    Header,
    ParseUUIDPipe,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { FavsService } from './favs.service';
import {
    ApiBadRequestResponse,
    ApiCreatedResponse,
    ApiNoContentResponse,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiOperation,
    ApiParam,
    ApiTags,
    ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { FavoritesEntity } from './entities/fav.entity';
import { CreateResponseDto } from './dto/create-response.dto';

@ApiTags('Favorites')
@Controller('favs')
export class FavsController {
    constructor(private readonly favsService: FavsService) {}

    @Header('Content-Type', 'application/json')
    @ApiOperation({
        summary: 'Get all favorites',
        description: 'Gets all favorites artists, tracks and albums',
    })
    @ApiOkResponse({
        description: 'The favorites were returned successfully',
        type: FavoritesEntity,
    })
    @Get()
    async findAll() {
        return this.favsService.findAll();
    }

    @Header('Content-Type', 'application/json')
    @ApiOperation({
        summary: 'Add track to the favorites',
        description: 'Add track to the favorites',
    })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiCreatedResponse({
        description: 'Added track "id" to the favorites',
        type: CreateResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Bad Request, track "id" is invalid (not uuid)',
    })
    @ApiUnprocessableEntityResponse({
        description: "Track with id doesn't exist",
    })
    @Post('/track/:id')
    async createTrack(@Param('id', ParseUUIDPipe) id: string) {
        const message = await this.favsService.create(id, 'tracks');
        const response = { message };
        return response;
    }

    @Header('Content-Type', 'application/json')
    @ApiOperation({
        summary: 'Add album to the favorites',
        description: 'Add album to the favorites',
    })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiCreatedResponse({
        description: 'Added album "id" to the favorites',
        type: CreateResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Bad Request, album "id" is invalid (not uuid)',
    })
    @ApiUnprocessableEntityResponse({
        description: "Album with id doesn't exist",
    })
    @Post('/album/:id')
    async createAlbum(@Param('id', ParseUUIDPipe) id: string) {
        const message = await this.favsService.create(id, 'albums');
        const response = { message };

        return response;
    }

    @Header('Content-Type', 'application/json')
    @ApiOperation({
        summary: 'Add artist to the favorites',
        description: 'Add artist to the favorites',
    })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @ApiCreatedResponse({
        description: 'Added artist "id" to the favorites',
        type: CreateResponseDto,
    })
    @ApiBadRequestResponse({
        description: 'Bad Request, artist "id" is invalid (not uuid)',
    })
    @ApiUnprocessableEntityResponse({
        description: "Artist with id doesn't exist",
    })
    @Post('/artist/:id')
    async createArtist(@Param('id', ParseUUIDPipe) id: string) {
        const message = await this.favsService.create(id, 'artists');
        const response = { message };

        return response;
    }

    @Header('Content-Type', 'application/json')
    @ApiOperation({
        summary: 'Delete track from favorites',
        description: ' Delete track from favorites',
    })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description: 'Deleted track successfully',
    })
    @ApiNotFoundResponse({ description: 'Track was not found' })
    @ApiBadRequestResponse({
        description: 'Bad Request, track "id" is invalid (not uuid)',
    })
    @Delete('track/:id')
    async removeTrack(@Param('id') id: string) {
        return this.favsService.remove(id, 'tracks');
    }

    @Header('Content-Type', 'application/json')
    @ApiOperation({
        summary: 'Delete album from favorites',
        description: 'Delete album from favorites',
    })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description: 'Deleted album successfully',
    })
    @ApiNotFoundResponse({ description: 'Album was not found' })
    @ApiBadRequestResponse({
        description: 'Bad Request, album "id" is invalid (not uuid)',
    })
    @Delete('album/:id')
    async removeAlbum(@Param('id') id: string) {
        return this.favsService.remove(id, 'albums');
    }

    @Header('Content-Type', 'application/json')
    @ApiOperation({
        summary: 'Delete artist from favorites',
        description: 'Delete artist from favorites',
    })
    @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiNoContentResponse({
        description: 'Deleted artist successfully',
    })
    @ApiNotFoundResponse({ description: 'Artist was not found' })
    @ApiBadRequestResponse({
        description: 'Bad Request, artist "id" is invalid (not uuid)',
    })
    @Delete('artist/:id')
    async removeArtist(@Param('id') id: string) {
        return this.favsService.remove(id, 'artists');
    }
}