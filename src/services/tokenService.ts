import { injectable } from 'tsyringe';
import { Token } from '../entities/tokens';
import { tokenRepository } from '../respositories/tokenRepository';

@injectable()
export class TokenService {
  
  async createToken(userId: number, accessToken: string, refreshToken: string): Promise<Token> {
    //const encryptToken = encrypt(accessToken);
    return await tokenRepository.save({accessToken: accessToken,userId: userId, refreshToken: refreshToken});
  }

  async getToken(userId: number): Promise<Token | null> {
    const token = await tokenRepository.findOne({where: {userId: userId}});
    if (token) {
      //return decrypt(token.accessToken);
      return token
    }
    return null;
  }

  async deleteToken(userId: number): Promise<void> {
    await tokenRepository.delete({userId: userId});
    }

  async updateToken(userId: number, accessToken: string, refreshToken: string): Promise<Token | null> {
    const token = await tokenRepository.findOneBy({userId: userId})
    if(!token){
      return await this.createToken(userId, accessToken, refreshToken);
    }else{
   //   token.accessToken = encrypt(accessToken);
      return await tokenRepository.save(token)
    }
  }
  
}
