const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const factory = require('../controllers/handleFactory');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image .Please upload only images 🙂', 400), false);
  }
};
const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;
  await sharp(req.file.buffer)
    .resize(500, 500, {
      position: 'top'
    })
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/users/${req.file.filename}`);

  next();
});

const filterObj = (reqBody, ...allowedFields) => {
  const newObj = {};
  Object.keys(reqBody).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = reqBody[el];
    }
  });
  return newObj;
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

//! Update logged in users
exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user posts password data
  if (req.body.password || req.body.passwordConfrm) {
    return next(
      new AppError(
        'This route is not for password updates . Please use /updateMyPassword',
        400
      )
    );
  }
  // 2) Filtered out fields that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;
  // 3) update user document
  const updateUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updateUser
    }
  });
});

//! User can retrieve his/her own data

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;

  next();
};
//! Delete user account or set it inactive
exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null
  });
});
