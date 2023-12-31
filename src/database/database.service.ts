import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { Album } from 'src/album/entities/album.entity';
import { Artist } from 'src/artist/entities/artist.entity';
import { Track } from 'src/track/entities/track.entity';
import { User } from 'src/user/entities/user.entity';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { IDatabaseService } from '../core/absctracts/database-service.abstract';
import { UpdateAlbumDto } from 'src/album/dto/update-album.dto';
import { UpdateArtistDto } from 'src/artist/dto/update-artist.dto';
import { UpdateTrackDto } from 'src/track/dto/update-track.dto';
import { FavoritesEntity } from 'src/favs/entities/fav.entity';
import { TEntities } from '../model/types/entities.type';
import { TPathname } from '../model/types/pathname.type';
import {InMemoryGenericRepository} from "./in-memory/in-memory-generic-repository";
import {InMemoryFavoriteRepository} from "./in-memory/in-memory-favorites-repository";

@Injectable()
export class DatabaseService implements IDatabaseService {
    users = new InMemoryGenericRepository<User, UpdateUserDto>([], 'User');
    readonly artists = new InMemoryGenericRepository<Artist, UpdateArtistDto>(
        [],
        'Artist',
    );
    readonly albums = new InMemoryGenericRepository<Album, UpdateAlbumDto>(
        [],
        'Album',
    );
    readonly tracks = new InMemoryGenericRepository<Track, UpdateTrackDto>(
        [],
        'Track',
    );
    readonly favorites = new InMemoryFavoriteRepository();

    async create(id: string, pathname: TPathname) {
        const item = await this.checkId(id, pathname);

        if (!item)
            throw new UnprocessableEntityException(
                `${pathname} with id doesn't exist `,
            );

        const result = await this.favorites.create(id, pathname);

        return result && `Add ${pathname} to the favorites`;
    }

    async findMany() {
        const entitiesObject = await this.favorites.findMany();

        const keys = Object.keys(entitiesObject) as unknown as TPathname[];

        const responseObject = await keys.reduce(async (acc, path) => {
            const reduceEntitiesObject = await acc;
            const entitiesId = entitiesObject[path];
            const entities = await entitiesId.reduce(async (acc, id) => {
                const items = await acc;
                const entity = await this[path].findUnique(id);

                return entity ? [...items, entity] : items;
            }, Promise.resolve([] as TEntities));

            return { ...reduceEntitiesObject, [path]: entities };
        }, Promise.resolve({} as FavoritesEntity));

        return responseObject;
    }

    async remove(id: string, pathname: TPathname) {
        const fields = ['artists', 'albums', 'tracks'] as TPathname[];
        await this[pathname].delete(id);

        await this.favorites.deleteId(id, pathname);

        for (const field of fields) {
            if (field === pathname) continue;

            await this[field].updateField(id);
        }
    }

    async checkId(id: string, pathname: TPathname) {
        return await this[pathname].findUnique(id);
    }
}