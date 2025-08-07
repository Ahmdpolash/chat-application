// user model

import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import { IUser } from "./user.interface";

const UserSchema = new Schema<IUser>(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    socketId: {
      type: String,
      default: null,
    },
    avatar: {
      type: String,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// hash the password before saving

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  // Hash the password
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// static method to check if password matches

UserSchema.statics.isPasswordMatch = async function (
  plainPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

export const User = model<IUser>("User", UserSchema);
