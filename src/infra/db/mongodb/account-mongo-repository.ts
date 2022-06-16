import {
  LoadAccountByEmailRepository,
  UpdateAccessTokenRepository,
} from '../../../data/protocols/db/account';
import { MongoHelper } from '.';

export class AccountMongoRepository
  implements LoadAccountByEmailRepository, UpdateAccessTokenRepository
{
  async loadByEmail(
    email: string
  ): Promise<LoadAccountByEmailRepository.Result> {
    const accountCollection = MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne(
      { email },
      {
        projection: {
          _id: 1,
          name: 1,
          password: 1,
        },
      }
    );
    return account && MongoHelper.map(account);
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          accessToken: token,
        },
      }
    );
  }
}
