const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { uploadToCloudinary } = require('../helpers/cloudinaryHelpers');
const cloudinary = require("../config/cloudinary");




const userRegistration = async (req, res) => {
  try {
    const username = req.body.username?.trim();
    const email = req.body.email?.toLowerCase().trim();
    const { password, role } = req.body;

    const checkIsUserExisitAlready = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkIsUserExisitAlready) {
      return res.status(400).json({
        success: false,
        message:
          "A user with this username or email already exists. Please try a different one.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
      profileImage: `https://api.dicebear.com/9.x/adventurer/svg?seed=${username}`,
      isFirstLogin: true,
    });

    await newUser.save();

    return res.status(201).json({
      success: true,
      message: "User registered successfully.",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Some error occurred. Please try again.",
    });
  }
};


const userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials. User does not exist.",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

   

    const accessToken = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      accessToken,
      user:{
        _id: user._id,
        username: user.username,
        isFirstLogin: user.isFirstLogin,
      }
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Some error occurred. Please try again.",
    });
  }
};



// haven't use might be usefull in future already add this change password feature in past projects so  if i feel like this is usefull i will use this(i am lazy hahahah)

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Both current and new passwords are required.",
      });
    }

    const user = await User.findById(req.userInfo.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as the old one.",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedNewPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedNewPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};



const uploadUserProfile = async (req, res) => {
  try {
    const { bio, github, twitter } = req.body;
    const user = await User.findById(req.userInfo.userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    let profileImage = user.profileImage;
    let profileImagePublicId = user.profileImagePublicId;

    // If new image uploaded
    if (req.file) {
      // Delete old image from Cloudinary (if exists)
      if (user.profileImagePublicId) {
        await cloudinary.uploader.destroy(user.profileImagePublicId);
      }

      // Upload new image
      const uploadResult = await uploadToCloudinary(req.file.path);
      profileImage = uploadResult.url;
      profileImagePublicId = uploadResult.publicId;
    }

    const trimmedBio = bio?.trim();
    const trimmedGithub = github?.trim();
    const trimmedTwitter = twitter?.trim();

    const isProfileComplete =
      trimmedBio &&
      trimmedGithub &&
      trimmedTwitter &&
      profileImage;

    const updatedUser = await User.findByIdAndUpdate(
      req.userInfo.userId,
      {
        bio: trimmedBio || "",
        profileImage,
        profileImagePublicId,
        socialLinks: {
          github: trimmedGithub || "",
          twitter: trimmedTwitter || "",
        },
        isProfileComplete: Boolean(isProfileComplete),
        isFirstLogin: false,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};



const skipUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userInfo.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // Generate a random avatar (e.g., via ui-avatars)
    const name = encodeURIComponent(user.username);

    const avatarUrl = `https://api.dicebear.com/9.x/adventurer/svg?seed=${name}`;

    const updatedUser = await User.findByIdAndUpdate(
      req.userInfo.userId,
      {
        profileImage:user.profileImage?user.profileImage: avatarUrl,
        isProfileComplete: false,
        isFirstLogin: false
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Skipped profile setup. Random image assigned.",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


const getUserData = async (req, res) => {
  try {
    const user = await User.findById(req.userInfo.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User data fetched successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user data.",
    });
  }
};
const getOtherUserData = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "User data fetched successfully.",
      user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching user data.",
    });
  }
};


const getTopUsers = async (req,res) => {
  try {
    const topUsers = await User.find({ isBanned: false, points: { $gte: 0 } }) // skip banned users if needed
      .sort({ points: -1 })
      .limit(10)
      .select('username points profileImage');
       // select only what you need

        if (!topUsers || topUsers.length === 0) {
        return res.status(404).json({
        success: false,
        message: " No top users found.",
      });

  
    }
    res.status(200).json({
      success: true,
      message: "Top users fetched successfully.",
      topUsers,
    });
    
  } catch (error) {
    console.error("Error fetching top users:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong while fetching top users.",
    });
  }
};




module.exports = { userRegistration,userLogin,uploadUserProfile,skipUserProfile,changePassword,getUserData,getOtherUserData,getTopUsers};
