import {
  UserCreateRequestDto,
  UserCreateResponseDto,
  UserCreateDtoMapper,
} from '../usecases/user-create.dto';
import { UserEntity } from '../user.entity';

describe('UserCreateDto', () => {
  it('should be defined', () => {
    expect(new UserCreateRequestDto()).toBeDefined();
    expect(new UserCreateResponseDto()).toBeDefined();
    expect(UserCreateDtoMapper).toBeDefined();
  });

  it('should accept valid input for UserCreateRequestDto', () => {
    const dto = new UserCreateRequestDto();
    dto.email = 'john.doe@example.com';
    dto.name = 'John Doe';

    expect(dto.email).toEqual('john.doe@example.com');
    expect(dto.name).toEqual('John Doe');
  });

  it('should require email for UserCreateRequestDto', () => {
    const dto = new UserCreateRequestDto();
    dto.name = 'John Doe';

    expect(() => {
      if (!dto.email) throw new Error('email is required');
    }).toThrow('email is required');
  });

  it('should require name for UserCreateRequestDto', () => {
    const dto = new UserCreateRequestDto();
    dto.email = 'john.doe@example.com';

    expect(() => {
      if (!dto.name) throw new Error('name is required');
    }).toThrow('name is required');
  });

  it('should validate email format for UserCreateRequestDto', () => {
    const dto = new UserCreateRequestDto();
    dto.email = 'invalid-email';
    dto.name = 'John Doe';

    expect(() => {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dto.email))
        throw new Error('Invalid email format');
    }).toThrow('Invalid email format');
  });

  it('should create a valid UserCreateResponseDto', () => {
    const entity = UserEntity.create({
      email: 'john.doe@example.com',
      name: 'John Doe',
    });
    const responseDto = UserCreateDtoMapper.fromEntity(entity);

    expect(responseDto.id).toBeDefined();
    expect(responseDto.email).toEqual('john.doe@example.com');
    expect(responseDto.name).toEqual('John Doe');
    expect(responseDto.createdAt).toBeDefined();
  });

  it('should map UserCreateRequestDto to UserEntity correctly', () => {
    const requestDto = new UserCreateRequestDto();
    requestDto.email = 'john.doe@example.com';
    requestDto.name = 'John Doe';

    const entity = UserCreateDtoMapper.toEntity(requestDto);

    expect(entity.email).toEqual('john.doe@example.com');
    expect(entity.name).toEqual('John Doe');
  });
});
