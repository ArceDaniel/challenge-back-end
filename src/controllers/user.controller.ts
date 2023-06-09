import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../entities/user.entity";
import { DatabaseRepository } from "../declarations";
import dotenv from "dotenv";
import * as jwt from "jsonwebtoken";
import { UserDto } from "../DTO/user.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { TokenPayloadDto } from "../DTO";
dotenv.config();

export class UserController {
  constructor(private userRepository: DatabaseRepository<User>) {}
  async register(req: Request, res: Response) {
    const userDto = plainToClass(UserDto, req.body);

    const errors = await validate(userDto);
    if (errors.length > 0) {
      return res.status(400).json(errors.map((err) => err.constraints));
    }

    const { email, password } = userDto;
    try {
      const existingUser = await this.userRepository.findOf({
        where: { email },
      });
      if (existingUser) return res.status(400).json({ message: "User exists" });

      const hashedPassword = await bcrypt.hash(
        password,
        Number(process.env.SALT_ROUNDS)
      );
      const newUser: User = await this.userRepository.create({
        email,
        password: hashedPassword,
      });
      await this.userRepository.save(newUser);
      const token = await this.generateToken(newUser);

      return res
        .status(201)
        .json({ message: "User created", user: newUser, token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async login(req: Request, res: Response) {
    const userDto = plainToClass(UserDto, req.body);

    const errors = await validate(userDto);
    if (errors.length > 0) {
      return res.status(400).json(errors.map((err) => err.constraints));
    }

    const { email, password } = userDto;
    try {
      const user = await this.userRepository.findOf({
        where: { email },
      });
      if (!user)
        return res.status(400).json({ message: "User does not exist" });
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect)
        return res.status(400).json({ message: "Invalid credentials" });
      const token = await this.generateToken(user);
      return res.status(200).json({ message: "User logged in", user, token });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const users = await this.userRepository.list();
      return res.status(200).json({ message: "Users listed", users });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async remove (req: Request, res: Response) {
    const { id } = req.params;
    try {
      const user = await this.userRepository.findOf({ where: { id } });
      if (!user) return res.status(400).json({ message: "User does not exist" });
      await this.userRepository.remove(id);
      return res.status(200).json({ message: "User removed" });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async listOne(req: Request & {tkn:  TokenPayloadDto}, res: Response) {
    const { id } = req.tkn;
    try {
      const user = await this.userRepository.findOf({ where: { id } });
      if (!user) return res.status(400).json({ message: "User does not exist" });
      return res.status(200).json({ message: "User listed", user });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }


  private async generateToken(user: User) {
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.EXPIRED_TOKEN || "1d" }
    );
    return token;
  }
}
