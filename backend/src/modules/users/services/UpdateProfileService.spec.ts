import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

import UpdateProfileService from './UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();

    updateProfile = new UpdateProfileService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });

  it('should be able to update the profile', async () => {
    const user = await fakeUsersRepository.create({
      name: 'rodrigo',
      email: 'rodrigo@passos.com',
      password: '12345',
    });

    await updateProfile.execute({
      user_id: user.id,
      name: 'Alterado',
      email: 'alterado@alterado.com',
    });

    expect(user.name).toBe('Alterado');
    expect(user.email).toBe('alterado@alterado.com');
  });

  it('should not be able to update the profile from non existing user', async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Alterado',
        email: 'alterado@alterado.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to change the email to another user email', async () => {
    await fakeUsersRepository.create({
      name: 'rodrigo',
      email: 'alterado@alterado.com',
      password: '12345',
    });

    const user = await fakeUsersRepository.create({
      name: 'rodrigo',
      email: 'rodrigo@passos.com',
      password: '12345',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Alterado',
        email: 'alterado@alterado.com',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to update the password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'rodrigo',
      email: 'rodrigo@passos.com',
      password: '12345',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'Alterado',
      email: 'alterado@alterado.com',
      old_password: '12345',
      password: '54321',
    });

    expect(updatedUser.password).toBe('54321');
  });

  it('should not be able to update the password without old_password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'rodrigo',
      email: 'rodrigo@passos.com',
      password: '12345',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Alterado',
        email: 'alterado@alterado.com',
        password: '54321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update the password with wrong old_password', async () => {
    const user = await fakeUsersRepository.create({
      name: 'rodrigo',
      email: 'rodrigo@passos.com',
      password: '12345',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'Alterado',
        email: 'alterado@alterado.com',
        old_password: 'aaaaaa',
        password: '54321',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
