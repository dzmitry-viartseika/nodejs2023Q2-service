import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { TPathname } from '../model/types/pathname.type';

@Injectable()
export class FavsService {
    constructor(private readonly databaseService: DatabaseService) {}

    async create(id: string, path: TPathname): Promise<string> {
        const favs = await this.databaseService.create(id, path);

        return favs;
    }

    async findAll() {
        const favs = await this.databaseService.findMany();

        return favs;
    }

    async remove(id: string, path: TPathname) {
        return this.databaseService.favorites.delete(id, path);
    }
}