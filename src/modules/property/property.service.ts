import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Property } from 'src/database/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PropertyService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}
}
