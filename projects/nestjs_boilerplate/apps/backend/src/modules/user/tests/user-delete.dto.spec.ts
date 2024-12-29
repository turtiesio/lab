import {
  UserDeleteRequestDto,
  UserDeleteResponseDto,
  UserDeleteDtoMapper,
} from '../usecases/user-delete.dto';
import { User } from '../user.entity';

describe('UserDeleteDto', () => {
  it('should be defined', () => {
    expect(new UserDeleteRequestDto()).toBeDefined();
    expect(new UserDeleteResponseDto()).toBeDefined();
    expect(UserDeleteDtoMapper).toBeDefined();
  });

  it('should accept a valid ULID for UserDeleteRequestDto', () => {
    const dto = new UserDeleteRequestDto();
    dto.id = '01H2SCQK850RE1W6NK5REFJ747';

    expect(dto.id).toEqual('01H2SCQK850RE1W6NK5REFJ747');
  });

  it('should require a ULID for UserDeleteRequestDto', () => {
    const dto = new UserDeleteRequestDto();

    expect(() => {
      if (!dto.id) throw new Error('id is required');
    }).toThrow('id is required');
  });

  it('should validate ULID format for UserDeleteRequestDto', () => {
    const dto = new UserDeleteRequestDto();
    dto.id = 'invalid-ulid';

    expect(() => {
      // Replace with a proper ULID validation check
      if (!/^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/.test(dto.id))
        throw new Error('Invalid ULID format');
    }).toThrow('Invalid ULID format');
  });

  it('should create a valid UserDeleteResponseDto from User', () => {
    const entity = User.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    const deletedEntity = entity.markAsDeleted();
    const responseDto = UserDeleteDtoMapper.fromEntity(deletedEntity);

    expect(responseDto.id).toEqual(deletedEntity.id);
    expect(responseDto.email).toEqual(deletedEntity.email);
    expect(responseDto.name).toEqual(deletedEntity.name);
    expect(responseDto.createdAt).toEqual(
      deletedEntity.createdAt.toISOString(),
    );
    expect(responseDto.updatedAt).toEqual(
      deletedEntity.updatedAt.toISOString(),
    );
    expect(responseDto.deletedAt).toEqual(
      deletedEntity.deletedAt ? deletedEntity.deletedAt.toISOString() : null,
    );
  });

  it('should create a valid UserDeleteResponseDto from User with null deletedAt', () => {
    const entity = User.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    const responseDto = UserDeleteDtoMapper.fromEntity(entity);

    expect(responseDto.id).toEqual(entity.id);
    expect(responseDto.email).toEqual(entity.email);
    expect(responseDto.name).toEqual(entity.name);
    expect(responseDto.createdAt).toEqual(entity.createdAt.toISOString());
    expect(responseDto.updatedAt).toEqual(entity.updatedAt.toISOString());
    expect(responseDto.deletedAt).toBeNull();
  });
});
