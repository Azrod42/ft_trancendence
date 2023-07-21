import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import User from "./user.entity";
import { Repository} from 'typeorm';
import CreateUserDto from './user.create.dto';
import {ChangeDisplayNameDto, messageUser} from './dtos/user.changedisplay.dto';
import { toDataURL } from 'qrcode';
import * as bcrypt from 'bcrypt';
import {response} from "express";
import {inviteToChannelDto, messageReqDto, muteUserDto, newGameDto} from "../channel/dtos/channel.dto";
import Channel from "../channel/channel.entity";

@Injectable()
export class UserService {
	constructor(@InjectRepository(User) private userRepo: Repository<User>) {}

	async findById (id: string){
		const user: User = await this.userRepo.findOneBy({id});
		if (user) {
			user.password = undefined;
			return user;
		}
			throw new HttpException("User with this id does no exist", HttpStatus.NOT_FOUND,);
	}
	async findByUsername (username: string){
		const user = await this.userRepo.findOneBy({username});
		if (user)
			return user;
			throw new HttpException("User with this username does no exist", HttpStatus.NOT_FOUND,);
	}
	async  create(userData: CreateUserDto) {
		const newUser = await this.userRepo.create(userData);
		await this.userRepo.save(newUser);
		return newUser;
	}

	async updateDisplayName(id: string, registerData: ChangeDisplayNameDto) {
		try {
			const user = await this.findById(id);
			(await user).displayname = registerData.displayname;
			await this.userRepo.save(user);
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);

		}
	}

	async updateAvatar(id: string, path: string) {
		try {
			const user = await this.findById(id);
			(await user).avatar = path;
			await this.userRepo.save(user);
			return user;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async getAvatarID(id: string) {
		try {
			const user = await this.findById(id);
			return user.avatar;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async GetAllUserFromDB (){
		const user = await this.userRepo.query(`SELECT displayname, id, elo FROM public."user"`)
		if (user)
			return user;
		throw new HttpException("User with this username does no exist", HttpStatus.NOT_FOUND,);
	}

	async FindUserOnDB (hash: string): Promise<string> {
		const user = await this.userRepo.query(`SELECT id FROM public."user"`)
		if (!user)
			return undefined;
		for (let i = 0; user[i]; i++){
			if (await bcrypt.compare((user[i].id), hash))
				return user[i].id;
		}
		throw new HttpException("User with this username does no exist", HttpStatus.NOT_FOUND,);
	}

	async getPublicUserData (userID: string) {
		const user = await this.userRepo.query(`SELECT displayname, id, elo FROM public."user" WHERE id = userID`)
		if (user)
			return user;
		throw new HttpException("User with this username does no exist", HttpStatus.NOT_FOUND,);
	}

	async setTwoFactorAuthenticationSecret(secret: string, userId: string) {
		try {
			const user = await this.findById(userId);
			(await user).secret2F = secret;
			await this.userRepo.save(user);
			return user;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}
	async turnOnTwoFactorAuthentication(userId: string) {
		try {
			const user = await this.findById(userId);
			(await user).is2FOn = true;
			await this.userRepo.save(user);
			return user;
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async turnOffTwoFactorAuthentication(userId: string) {
		try {
			const user = await this.findById(userId);
			(await user).is2FOn = false;
			await this.userRepo.save(user);
			return user;
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}
	async generateQrCodeDataURL(otpAuthUrl: string) {
		return toDataURL(otpAuthUrl);
	}

	async updateChatList(idTriger: string, data: string) {
		try {
			const user = await this.findById(idTriger);
			(await user).chat = data;
			await this.userRepo.save(user);
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
	}

	async updateFriendList(idTriger: string, data: string) {
		try {
			const user = await this.findById(idTriger);
			(await user).friends = data;
			await this.userRepo.save(user);
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
	}

	async updateBlockedList(idTriger: string, data: string) {
		try {
			const user = await this.findById(idTriger);
			(await user).blocked = data;
			await this.userRepo.save(user);
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
	}

	async checkUserIn(id: string, dataI: string) : Promise<boolean> {
		if (dataI == '')
			return false;
		const data = await JSON.parse(dataI);
		let i = 0;
		while (i < data.length){
			if (data[i]?.id == id)
				return true;
			i++;
		}
		return false;
	}
	async getChatList (id: string){
		try {
			const user = await this.findById(id);
			return (await user).chat;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async getFriendList (id: string){
		try {
			const user = await this.findById(id);
			return (await user).friends;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async getBlockList (id: string){
		try {
			const user = await this.findById(id);
			return (await user).blocked;
		} catch (e) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async newGameLose(user: User) {
		user.gameLose = user.gameLose + 1;
		await this.userRepo.save(user);
	}

	async setNewGameNumber(user: User, num:number) {
		user.gameNumber = num;
		await this.userRepo.save(user);
	}

	async updateWebSocketId(userId: string, socketId: string) {
		const user = await this.findById(userId);
		if (!user) {
			throw new HttpException('Somthing went fucking wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		user.idWebSocket = socketId;
		await this.userRepo.save(user);
	  }
	  
	async findByDisplayname (displayname: string): Promise<string> {
		try {
			const users = await this.userRepo.query(`SELECT displayname, id FROM public."user"`)
			if (!users)
				throw new HttpException('User not found QRY', HttpStatus.INTERNAL_SERVER_ERROR,);
			for (let i = 0; users[i]; i++){
				if (users[i].displayname == displayname)
					return users[i].id;
			}
			throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR,);
		} catch (e) {
			throw new HttpException('User not found', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return '';
	}

	async isUserIn (list: string, id: string) {
		if (!list)
			return false;
		const json = JSON.parse(list);
		for (let i = 0; json[i]; i++) {
			if (json[i].id == id) {
				return true;
			}
		}
		return false;
	}
	async removeFormList (list: string, id: string) {
		if (!list)
			return list;
		const json = JSON.parse(list);
		for (let i = 0; json[i]; i++) {
			if (json[i].id == id) {
				json.splice(i, 1);
				return JSON.stringify(json);
			}
		}
		return list;
	}
	async addList (list: string, id: string, object: {id: string, time: number} = {id: 'unset', time: 0}) {
		let json = []
		if (list)
			json = JSON.parse(list);
		if (object.time !== 0)
			json.push(object);
		else
			json.push({id: id});
		return JSON.stringify(json);
	}

	async addListMsg (list: string, object: messageUser) {
		let json = []
		if (list)
			json = JSON.parse(list);
		json.push(object);
		return JSON.stringify(json);
	}

	async blockUser (userTrig: string, blockData: inviteToChannelDto) {
		const user = await this.userRepo.findOneBy({id: userTrig});
		const userToBlock = await this.findByDisplayname(blockData.id);
		if (await this.isUserIn(user.blocked, userToBlock))
			throw new HttpException("User is already blocked", HttpStatus.CONFLICT,);
		user.blocked = await this.addList(user.blocked, userToBlock)
		await this.userRepo.save(user);
		return true;
	}

	async unblockUser (userTrig: string, blockData: inviteToChannelDto) {
		const user = await this.userRepo.findOneBy({id: userTrig});
		const userToUnblock = await this.findByDisplayname(blockData.id);
		if (await this.isUserIn(user.blocked, userToUnblock) == false)
			throw new HttpException("User is not blocked", HttpStatus.CONFLICT,);
		user.blocked = await this.removeFormList(user.blocked, userToUnblock)
		await this.userRepo.save(user);
		return true;
	}

	async getPlayerSlot(userId: string) {
		try {
			const user = await this.findById(userId);
			return user.gameNumber;
		} catch (e) {
			throw new HttpException('Somthing went wrong', HttpStatus.INTERNAL_SERVER_ERROR,);
		}
		return undefined;
	}

	async newUserMessage (userTrig: string, messageData: messageUser) {
		const userS: User = await this.userRepo.findOneBy({id: messageData.idSender});
		const userT = await this.userRepo.findOneBy({id: messageData.idTarget});
		userS.msgHist = await this.addListMsg(userS.msgHist,  messageData);
		userT.msgHist = await this.addListMsg(userT.msgHist,  messageData);
		await this.userRepo.save(userS);
		await this.userRepo.save(userT);
		return true;
	}

	async getUserMsgHistory (userTrig: string, userTarget: string) {
		const userR: User = await this.userRepo.findOneBy({id: userTrig});
		const history  = [];
		let msgHist = []
		if (userR.msgHist != '')
			msgHist = JSON.parse(userR.msgHist);
		for (let i = 0; msgHist[i]; i++) {
			if ((msgHist[i].idSender == userTrig && msgHist[i].idTarget == userTarget) || (msgHist[i].idSender == userTarget && msgHist[i].idTarget == userTrig)) {
				history.push(msgHist[i]);
			}
		}
		return JSON.stringify(history);
	}
	async addNewGame(gameInfo: newGameDto) {
		const userW = await this.findById(gameInfo.idWinner);
		const userL = await this.findById(gameInfo.idLoser);


		userW.totalGame += 1;
		userL.totalGame += 1;
		userW.gameWin += 1;
		userL.gameLose += 1;
		userW.winStreak += 1;
		userL.winStreak = 0;
		userW.winLoseRate = ((userW.gameWin * 100) / (userW.gameWin + userW.gameLose)).toString();
		userL.winLoseRate = ((userL.gameWin * 100) / (userL.gameWin + userL.gameLose)).toString();
		console.log((25 / (userW.elo / userL.elo)));
		if (gameInfo.ranked) {
			userW.elo = Math.round(userW.elo + (25 / (userW.elo / userL.elo)));
			userL.elo = Math.round(userL.elo - (25 / (userW.elo / userL.elo)));
		}
		userW.xp += 100;
		userL.xp += 50;
		userW.totalPointTake += gameInfo.scoreLoser;
		userW.totalPointGet += gameInfo.scoreWinner;
		userL.totalPointTake += gameInfo.scoreWinner;
		userL.totalPointGet += gameInfo.scoreLoser;
		userW.pointGetTakeRate = (userW.totalPointGet / userW.totalPointTake).toString();
		userL.pointGetTakeRate = (userW.totalPointGet / userL.totalPointTake).toString();

		let userWGHist = [];
		let userLGHist = [];
		if (userW.gameHist != '')
			userWGHist = JSON.parse(userW.gameHist);
		if (userL.gameHist != '')
			userLGHist = JSON.parse(userL.gameHist);
		userWGHist.push({dnW: userW.displayname, dnL: userL.displayname, scoreW: gameInfo.scoreWinner, scoreL: gameInfo.scoreLoser, ranked: gameInfo.ranked});
		userLGHist.push({dnW: userW.displayname, dnL: userL.displayname, scoreW: gameInfo.scoreWinner, scoreL: gameInfo.scoreLoser, ranked: gameInfo.ranked});
		userW.gameHist = JSON.stringify(userWGHist);
		userL.gameHist = JSON.stringify(userLGHist);
		await this.userRepo.save(userW);
		await this.userRepo.save(userL);
	}

	async getMatchHistory(userID: string) {
		const user = await this.findById(userID);
		if (user)
			return user.gameHist;
		return ''
	}
	async getUserStats(userID: string) {
		const user = await this.findById(userID);
		if (user)
			return {gameWin: user.gameWin, gameLose: user.gameLose, winLoseRate: user.winLoseRate, totalPointGet: user.totalPointGet, totalPointTake: user.totalPointTake, pointGetTakeRate: user.pointGetTakeRate, winStreak: user.winStreak, totalGame: user.totalGame, elo: user.elo, xp: user.xp};
		return ''
	}

	async updateGameID(userID: string, socketID: string) {
		const user = await this.findById(userID);
		if (user) {
			user.socketID = socketID;
			this.userRepo.save(user);
			return true;
		}
		return false;
	}

	async updateSlotID(userID: string, id: number) {
		const user = await this.findById(userID);
		if (user) {
			user.slot = id;
			this.userRepo.save(user);
			return true;
		}
		return false;
	}

	async getSlotID(userID: string) {
		const user = await this.findById(userID);
		if (user) {
			return {slot: user.slot};
		}
		return {slot: 0};
	}

	async inGame(userID: string) {
		const user = await this.findById(userID);
		if (user) {
			user.inGame = true
			await this.userRepo.save(user);
			return true;
		}
		return false;
	}

	async notInGame(userID: string) {
		const user = await this.findById(userID);
		if (user) {
			user.inGame = false
			await this.userRepo.save(user);
			return true;
		}
		return false;
	}
}
