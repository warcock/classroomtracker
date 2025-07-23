import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const avataaarsOptions = {
  topType: [
    'NoHair', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairDreads01', 'LongHairStraight', 'LongHairCurly', 'Hat', 'Hijab', 'Turban', 'WinterHat2', 'Eyepatch', 'LongHairBigHair', 'LongHairBun', 'LongHairCurvy', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace', 'LongHairStraight2', 'LongHairStraightStrand', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggy', 'ShortHairShaggyMullet', 'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'
  ],
  accessoriesType: [
    'Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'
  ],
  hairColor: [
    'Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'
  ],
  facialHairType: [
    'Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'
  ],
  facialHairColor: [
    'Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'Platinum', 'Red'
  ],
  clotheType: [
    'BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'
  ],
  clotheColor: [
    'Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'
  ],
  eyeType: [
    'Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'
  ],
  eyebrowType: [
    'Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'
  ],
  mouthType: [
    'Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'
  ],
  skinColor: [
    'Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'
  ]
};

function getRandomAvatarConfig() {
  const config = {};
  for (const key in avataaarsOptions) {
    const opts = avataaarsOptions[key];
    config[key] = opts[Math.floor(Math.random() * opts.length)];
  }
  return config;
}

const userSchema = new mongoose.Schema({
  name: String,
  nickname: String,
  email: String,
  password: String,
  role: String,
  avatar: String,
  createdAt: Date
});
const User = mongoose.model('User', userSchema);

async function backfillAvatars() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/your-db');
  const users = await User.find({});
  let count = 0;
  for (const user of users) {
    let needsUpdate = false;
    try {
      if (!user.avatar) needsUpdate = true;
      else {
        // Try to parse avatar as JSON
        JSON.parse(user.avatar);
      }
    } catch {
      needsUpdate = true;
    }
    if (needsUpdate) {
      user.avatar = JSON.stringify(getRandomAvatarConfig());
      await user.save();
      count++;
    }
  }
  console.log(`Backfilled ${count} users.`);
  mongoose.disconnect();
}

backfillAvatars();
