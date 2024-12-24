# User Module Documentation

## Overview

The User module is responsible for managing user-related operations within the application. It provides functionalities for creating and deleting user accounts. This module adheres to the principles of Interface-Driven design, Test-Driven Development, and Feature-Driven architecture.

## Structure

The module is structured as follows:

- `create-user.request.dto.ts`: Defines the data transfer object (DTO) for creating a user. It includes validation rules for email and name.
- `user.controller.ts`: Handles incoming HTTP requests related to user management. Currently supports creating users.
- `user.entity.ts`: Defines the user entity structure, representing the user data in the database. It includes properties like `id`, `email`, `name`, `createdAt`, `updatedAt`, and `deletedAt`. It also includes methods for changing the user's name and marking the user as deleted.
- `user.module.ts`: The main module file that declares the components of the user module. It imports the `TypeOrmModule` for the `UserSchema` and declares the `UserController`, `UserCreateUseCase`, `UserRepository`, and `UserRepositoryMapper`.
- `infrastructure/`: Contains the infrastructure layer of the module.
  - `repository/`: Contains the repository implementation for user data access.
    - `user.repo.interface.ts`: Defines the interface for the user repository, including methods for saving a user and finding a user by ID.
    - `user.repo.mapper.ts`: Maps between the user entity (`User`) and the database schema (`UserSchema`).
    - `user.repo.schema.ts`: Defines the database schema for the user entity using TypeORM annotations.
    - `user.repo.ts`: Implements the user repository (`UserRepository`) using TypeORM. It provides methods for saving a user and finding a user by ID.
- `tests/`: Contains unit tests for the user module. (Currently empty)
- `usecases/`: Contains the use cases for the user module.
  - `user-create.dto.ts`: Defines the DTOs for creating a user, including `UserCreateRequestDto` and `UserCreateResponseDto`.
  - `user-create.usecase.ts`: Implements the use case for creating a user. It takes a `UserCreateRequestDto`, converts it to a `User`, saves it using the `UserRepository`, and returns a `UserCreateResponseDto`.
  - `user-delete.dto.ts`: Defines the DTO for deleting a user.
  - `user-delete.usecase.ts`: Implements the use case for deleting a user.

## Key Components

### Controller (`user.controller.ts`)

The `UserController` handles incoming requests and delegates the business logic to the service layer. It exposes endpoints for user creation.

- **POST /users**: Creates a new user.

### Entity (`user.entity.ts`)

The `User` defines the structure of the user data.

- **Properties**:
  - `id`: Unique identifier (ULID).
  - `email`: User's email address.
  - `name`: User's name.
  - `createdAt`: Timestamp of creation.
  - `updatedAt`: Timestamp of last update.
  - `deletedAt`: Timestamp of deletion (nullable).
- **Methods**:
  - `changeName(name: string)`: Updates the user's name and `updatedAt`.
  - `setDeleted()`: Marks the user as deleted by setting `deletedAt` and updating `updatedAt`.
  - `static create(data: Pick<User, 'email' | 'name'>)`: Creates a new `User` instance.

### Repository (`infrastructure/repository`)

The repository layer provides an abstraction for data access.

- **`UserRepository` (Interface)**:
  - `save(user: User): Promise<User>`: Saves a user entity.
  - `findById(id: string): Promise<User | null>`: Finds a user by ID.
- **`UserRepository` (Implementation)**:
  - Uses TypeORM to interact with the database.
  - Implements the `UserRepository` interface.
- **`UserRepositoryMapper`**:
  - `toDomain(schema: UserSchema): User`: Converts a `UserSchema` to a `User`.
  - `toSchema(domain: User): UserSchema`: Converts a `User` to a `UserSchema`.

### Use Cases (`usecases/`)

The `usecases/` directory contains the business logic for the user module.

- **`UserCreateUseCase`**:
  - `execute(dto: UserCreateRequestDto): Promise<UserCreateResponseDto>`: Creates a new user.
- **`UserDeleteUseCase`**:
  - `execute(dto: DeleteUserRequestDto): Promise<DeleteUserResponseDto>`: Deletes a user by ID.

## Implementation Details

- **Interface-Driven:** The module uses interfaces (e.g., `UserRepository`) to decouple components.
- **Test-Driven Development:** Each implementation should have a corresponding unit test (currently missing).
- **Feature-Driven:** The module is organized by feature (user management).
- **SOLID Principles:** The module adheres to SOLID principles.
- **DTOs:** Data transfer objects (`UserCreateRequestDto`, `UserCreateResponseDto`, `DeleteUserRequestDto`, `DeleteUserResponseDto`) are used to define the structure of data passed between layers.

## How to Use

To use the User module, import it into your application module:

```typescript
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [UserModule],
})
export class AppModule {}
```

Then, you can use the provided services and controllers to manage users. For example, to create a user:

```typescript
import { UserCreateRequestDto } from './modules/user/usecases/user-create.dto';
import { UserController } from './modules/user/user.controller';

// ...

const createUserDto: UserCreateRequestDto = {
  email: 'test@example.com',
  name: 'Test User',
};

const user = await userController.createUser(createUserDto);

console.log(user);
```

## Future Improvements

- Add unit tests for all components.
- Implement user update functionality.
- Add more robust validation and error handling.
- Add integration tests for the module.
