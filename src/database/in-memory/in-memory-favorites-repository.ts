import {
    InternalServerErrorException,
    NotFoundException,
    HttpStatus,
} from '@nestjs/common';

import { IFavorites } from '../../model/interface/favorites.interface';
import { TPathname } from '../../model/types/pathname.type';

export class InMemoryFavoriteRepository {
    private _repository: IFavorites;

    constructor() {
        this._repository = {
            artists: [],
            albums: [],
            tracks: [],
        };
    }

    async create(id: string, pathname: TPathname): Promise<boolean> {
        try {
            this._repository[pathname].push(id);

            return true;
        } catch (error) {
            throw new InternalServerErrorException(
                'Something wrong in the server, try again later',
            );
        }
    }

    async findMany() {
        try {
            const items = { ...this._repository };

            return items;
        } catch (error) {
            throw new InternalServerErrorException(
                'Something wrong in the server, try again later',
            );
        }
    }

    async delete(id: string, pathname: TPathname) {
        try {
            const items = this._repository[pathname];

            const indexId = items.findIndex((itemId) => itemId === id);

            if (!~indexId)
                throw new NotFoundException(
                    `${pathname[0].toUpperCase() + pathname.slice(1, -1)} was not found`,
                );

            items.splice(indexId, 1);
        } catch (error) {
            if (error.status === HttpStatus.NOT_FOUND) throw error;
            throw new InternalServerErrorException(
                'Something wrong in the server, try again later',
            );
        }
    }

    async deleteId(id: string, pathname: TPathname) {
        try {
            const items = this._repository[pathname];

            const indexId = items.findIndex((itemId) => itemId === id);

            if (~indexId) items.splice(indexId, 1);
        } catch (error) {
            if (error.status === HttpStatus.NOT_FOUND) throw error;
            throw new InternalServerErrorException(
                'Something wrong in the server, try again later',
            );
        }
    }
}